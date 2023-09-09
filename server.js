import "dotenv";
import crypto from 'crypto';
import {URL} from 'url';
import qs from 'qs';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('views', 'views');
app.set('view engine', 'ejs');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const port = process.env.PORT;
const redirectUri = process.env.REDIRECT_URI;
const scope = process.env.SCOPE;
const airtableUrl = process.env.AIRTABLE_URL;

const encodedCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
const authorizationHeader = `Basic ${encodedCredentials}`;

let latestTokenRequestState;

setLatestTokenRequestState('NONE');

app.get('/', async function(req, res, next) {
  const latestRequestStateDisplayData = formatLatestTokenRequestStateForDeveloper();
  getdata()
  res.render('index', { latestRequestStateDisplayData });
});


const authorizationCache = {};
app.get('/redirect-testing', (req, res) => {
    // prevents others from impersonating Airtable
    const state = crypto.randomBytes(100).toString('base64url');

    // prevents others from impersonating you
    const codeVerifier = crypto.randomBytes(96).toString('base64url'); // 128 characters
    const codeChallengeMethod = 'S256';
    const codeChallenge = crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    // ideally, entries in this cache expires after ~10-15 minutes
    authorizationCache[state] = {
        // we'll use this in the redirect url route
        codeVerifier,
        // any other data you want to store, like the user's ID
    };

    const authorizationUrl = new URL(`${airtableUrl}/oauth2/v1/authorize`);
    authorizationUrl.searchParams.set('code_challenge', codeChallenge);
    authorizationUrl.searchParams.set('code_challenge_method', codeChallengeMethod);
    authorizationUrl.searchParams.set('state', state);
    authorizationUrl.searchParams.set('client_id', clientId);
    authorizationUrl.searchParams.set('redirect_uri', redirectUri);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('scope', scope);

    res.redirect(authorizationUrl.toString());
});

// route that user is redirected to after successful or failed authorization
// Note that one exemption is that if your client_id is invalid or the provided
// redirect_uri does exactly match what Airtable has stored, the user will not
// be redirected to this route, even with an error.
app.get('/airtable-oauth', (req, res) => {
    const state = req.query.state;
    const cached = authorizationCache[state];
    if (cached === undefined) {
        res.send('This request was not from Airtable!');
        return;
    }
    delete authorizationCache[state];

    if (req.query.error) {
        const error = req.query.error;
        const errorDescription = req.query.error_description;
        res.send(`
            There was an error authorizing this request.
            <br/>Error: "${error}"
            <br/>Error Description: "${errorDescription}"
        `);
        return;
    }

    const code = req.query.code;
    const codeVerifier = cached.codeVerifier;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    if (clientSecret !== '') {
        headers.Authorization = authorizationHeader;
    }

    setLatestTokenRequestState('LOADING');
    fetch(`${airtableUrl}/oauth2/v1/token`, {
        method: 'POST',
        headers,
        body: qs.stringify({
            client_id: clientId,
            code_verifier: codeVerifier,
            redirect_uri: redirectUri,
            code,
            grant_type: 'authorization_code',
        }),
    })
    .then((response) => response.json())
        .then((data) => {
            setLatestTokenRequestState('AUTHORIZATION_SUCCESS', data);
            res.redirect('/');
        })
        .catch((e) => {
            if (e.response && [400, 401].includes(e.response.status)) {
                setLatestTokenRequestState('AUTHORIZATION_ERROR', e.response.data);
            } else if (e.response) {
                console.log('uh oh, something went wrong', e.response.data);
                setLatestTokenRequestState('UNKNOWN_AUTHORIZATION_ERROR');
            } else {
                console.log('uh oh, something went wrong', e);
                setLatestTokenRequestState('UNKNOWN_AUTHORIZATION_ERROR');
            }
            res.redirect('/');
        });
});

// this route exists only for your convenience in testing Airtable OAuth
app.get('/refresh_token_form', (req, res) => {
    const latestRequestStateDisplayData = formatLatestTokenRequestStateForDeveloper();

    // double clicking submit may cause a token revocation
    res.send(`<div>
        ${latestRequestStateDisplayData}
        <p>To Refresh a token, enter it into the input and press "submit"</p>
        <form action="/refresh_token" method="post" >
            <label for="refresh">Refresh token:
            <input type="text" id="refresh" name="refresh_token" autocomplete="off" minLength="64"/>
            <input type="submit">
        </form>
        <a href="/">Back to home</a>
    </div>`);
});

// this route demonstrates how to make refresh a token, though normally
// this should not occur inside a route handler (we do so here to make this
// tool easier to use).
app.post('/refresh_token', (req, res) => {
    let refreshToken = req.body ? req.body.refresh_token : undefined;
    if (!refreshToken) {
        console.log(req.body);
        res.send('no refresh token in data');
        return;
    }

    if (typeof refreshToken !== 'string') {
        console.log(req.body);
        res.send('refresh token was not a string');
        return;
    }

    refreshToken = refreshToken.trim();

    const headers = {
        // Content-Type is always required
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    if (clientSecret !== '') {
        // Authorization is required if your integration has a client secret
        // omit it otherwise
        headers.Authorization = authorizationHeader;
    }
    fetch(`${airtableUrl}/oauth2/v1/token`, {
        method: 'POST',
        headers,
        // stringify the request body like a URL query string
        body: qs.stringify({
            // client_id is optional if authorization header provided
            // required otherwise.
            client_id: clientId,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    })
        .then((response) => {
            console.log(response);
            setLatestTokenRequestState('REFRESH_SUCCESS', response.data);
            res.redirect('/');
        })
        .catch((e) => {
            // 400 and 401 errors mean some problem in our configuration, the refresh token has
            // already been used, or the refresh token has expired.
            // We expect these but not other error codes during normal operations
            if (e.response && [400, 401].includes(e.response.status)) {
                setLatestTokenRequestState('REFRESH_ERROR', e.response.data);
            } else if (e.response) {
                console.log('uh oh, something went wrong', e.response.data);
                setLatestTokenRequestState('UNKNOWN_REFRESH_ERROR');
            } else {
                console.log('uh oh, something went wrong', e);
                setLatestTokenRequestState('UNKNOWN_REFRESH_ERROR');
            }
            res.redirect('/');
        });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

function setLatestTokenRequestState(state, dataToFormatIfExists) {
    latestTokenRequestState = {
        state,
    };

    if (dataToFormatIfExists) {
        const json = JSON.stringify(dataToFormatIfExists, null, 2);
        // access and refresh tokens are difficult to copy paste in normal JSON formatting,
        // to make it easier we put them on a newline without the quotes
        const formattedData = json
            .split('\n')
            .map((line) =>
                line.replace(/^(\s+"(access_token|refresh_token)":)\s+"(.*)",$/g, '$1\n$3'),
            )
            .join('\n');
        latestTokenRequestState.formattedData = formattedData;
        console.log(state, latestTokenRequestState);
    }
}

function formatLatestTokenRequestStateForDeveloper() {
    let formatRequestState = '';

    switch (latestTokenRequestState.state) {
        case 'NONE':
            break;
        case 'LOADING':
            formatRequestState =
                'The request for the access token from your latest authorization is still outstanding, check the terminal or refresh';
            break;
        case 'AUTHORIZATION_ERROR':
            formatRequestState = 'Your latest authorization request failed, the error was:';
            break;
        case 'UNKNOWN_AUTHORIZATION_ERROR':
            formatRequestState =
                'The request for the access token from your latest authorization failed, check the terminal for details';
            break;
        case 'REFRESH_ERROR':
            formatRequestState = 'Your latest refresh request failed, the error was:';
            break;
        case 'UNKNOWN_REFRESH_ERROR':
            formatRequestState =
                'Your latest request to refresh your access token failed, see the terminal for details';
            break;
        case 'AUTHORIZATION_SUCCESS':
            formatRequestState = 'Your authorization succeeded, the response was:';
            break;
        case 'REFRESH_SUCCESS':
            formatRequestState = 'Your refresh request succeeded, the response was:';
            break;
        default:
            throw Error(
                `unexpected latestTokenRequestState loading state: ${latestTokenRequestState.state}`,
            );
    }

    if (latestTokenRequestState.formattedData) {
        formatRequestState += `<br/>
    <code>
        <pre>${latestTokenRequestState.formattedData}</pre>
    </code>`;
    }

    if (formatRequestState) {
        formatRequestState = `<p>${formatRequestState}</p>`;
    }

    return formatRequestState;
}

function getdata() {
  let key = "oaaqdQaICWPMpNHZH.v1.eyJ1c2VySWQiOiJ1c3JzeUVUZkFzWUc0STcyWCIsImV4cGlyZXNBdCI6IjIwMjMtMDktMDhUMDk6MTI6NDYuMDAwWiIsIm9hdXRoQXBwbGljYXRpb25JZCI6Im9hcHJKRkJBU2VUZm1HU0wyIiwic2VjcmV0IjoiZWFjZTE1ZDFlYmM4NmJmYzY4MDMwODRhNWEyMzg5ZWYyYTg3ZmYxN2YxYzZlNWVlMzkxODI0NWIwOTQ3YzBhZCJ9.37e91d1446c32d9da20ff5d43a5c144f7ccb94cfb8358e4f95f2d533ad15b8df";
  const headers = [
      ['Authorization', `Bearer ${ key }`],
    ];
  fetch(`https://api.airtable.com/v0/meta/bases`, { headers, method:"GET" })
    .then((response) => response.json())
    .then((data) => {
    if (data?.bases?.length > 0) {
      const baseId = data.bases[0].id;
      const baseName = data.bases[0].name;
      console.log(`Base name: ${ baseName }`)
      fetch(`https://api.airtable.com/v0/meta/bases/${ baseId }/tables`, { headers })
        .then((response) => response.json())
        .then((data) => {
        // console.log(data)
        const tableId = data.tables[0].id;
        const tableName = data.tables[0].name;
        console.log(`Table name: ${ tableName }`)
        if (data.tables.length > 0) {
          fetch(`https://api.airtable.com/v0/${ baseId }/${ tableId }`, { headers })
            .then((response) => response.json())
            .then((data) => {
            console.log(data)

          });
        }

      });
    }

  });

}