// import choo
import choo from "choo";
import html from "choo/html";

// initialize choo
const app = choo({ hash: true });

app.route("/*", notFound);

function notFound() {
  return html`
    <div>
      <a href="/"> 404 with love ❤ back to top! </a>
    </div>
  `;
}



import crypto from 'crypto';
import {URL} from 'url';
import axios from 'axios';
import qs from 'qs';
import express from 'express';
import bodyParser from 'body-parser';

// set up environment variables
// if you have not created a .env file by following the README instructions this will not work
import config from '../config.js';

const clientId = config.clientId.trim();
const clientSecret = config.clientSecret.trim();
// if you edit the port you will need to edit the redirectUri
const port = config.port;
// if you edit the path of this URL will you will need to edit the /airtable-oauth route to match your changes
const redirectUri = config.redirectUri.trim();
const scope = config.scope.trim();
const airtableUrl = config.airtableUrl.trim();

const encodedCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
const authorizationHeader = `Basic ${encodedCredentials}`;

let latestTokenRequestState;

// book keeping to make using this easier, not needed in a real implementation
setLatestTokenRequestState('NONE');

app.route("/", (state, emit) => {
  const latestRequestStateDisplayData = formatLatestTokenRequestStateForDeveloper();
  getdata()
  return html`
  <div>
    <h3> New Token</h3>
    <a href="redirect-testing">Click to authorize and create a new access token</a>
    <br/>
    <h3>Refresh a token</h3>
    ${latestRequestStateDisplayData}
    <p>
        To test refreshing a token, enter it into the input and press "submit"
        <br/>
        In your own code, refreshing should occur as a background process.
    </p>
    <form action="/refresh_token" method="post" >
        <label for="refresh">Refresh token:
        <input type="text" id="refresh" name="refresh_token" autocomplete="off" minLength="64"/>
        <input type="submit">
    </form>
  `;
});

const authorizationCache = {};
app.route("/redirect-testing", (state, emit) => {
    // prevents others from impersonating Airtable
    const state = crypto.randomBytes(100).toString('base64url');

    // prevents others from impersonating you
    const codeVerifier = crypto.randomBytes(96).toString('base64url'); // 128 characters
    const codeChallengeMethod = 'S256';
    const codeChallenge = crypto
        .createHash('sha256')
        .update(codeVerifier) // hash the code verifier with the sha256 algorithm
        .digest('base64') // base64 encode, needs to be transformed to base64url
        .replace(/=/g, '') // remove =
        .replace(/\+/g, '-') // replace + with -
        .replace(/\//g, '_'); // replace / with _ now base64url encoded

    // ideally, entries in this cache expires after ~10-15 minutes
    authorizationCache[state] = {
        // we'll use this in the redirect url route
        codeVerifier,
        // any other data you want to store, like the user's ID
    };

    // build the authorization URL
    const authorizationUrl = new URL(`${airtableUrl}/oauth2/v1/authorize`);
    authorizationUrl.searchParams.set('code_challenge', codeChallenge);
    authorizationUrl.searchParams.set('code_challenge_method', codeChallengeMethod);
    authorizationUrl.searchParams.set('state', state);
    authorizationUrl.searchParams.set('client_id', clientId);
    authorizationUrl.searchParams.set('redirect_uri', redirectUri);
    authorizationUrl.searchParams.set('response_type', 'code');
    // your OAuth integration register with these scopes in the management page
    authorizationUrl.searchParams.set('scope', scope);

    // redirect the user and request authorization
    res.redirect(authorizationUrl.toString());
});

// route that user is redirected to after successful or failed authorization
// Note that one exemption is that if your client_id is invalid or the provided
// redirect_uri does exactly match what Airtable has stored, the user will not
// be redirected to this route, even with an error.

app.route("/airtable-oauth", (state, emit) => {
    const state = req.query.state;
    const cached = authorizationCache[state];
    // validate request, you can include other custom checks here as well
    if (cached === undefined) {
        res.send('This request was not from Airtable!');
        return;
    }
    // clear the cache
    delete authorizationCache[state];

    // Check if the redirect includes an error code.
    // Note that if your client_id and redirect_uri do not match the user will never be re-directed
    // Note also that if you did not include "state" in the request, then this redirect would also not include "state"
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

    // since the authorization didn't error, we know there's a grant code in the query
    // we also retrieve the stashed code_verifier for this request
    const code = req.query.code;
    const codeVerifier = cached.codeVerifier;

    const headers = {
        // Content-Type is always required
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    if (clientSecret !== '') {
        // Authorization is required if your integration has a client secret
        // omit it otherwise
        headers.Authorization = authorizationHeader;
    }

    // more book-keeping, you don't need this
    setLatestTokenRequestState('LOADING');
    // make the POST request
    axios({
        method: 'POST',
        url: `${airtableUrl}/oauth2/v1/token`,
        headers,
        // stringify the request body like a URL query string
        data: qs.stringify({
            // client_id is optional if authorization header provided
            // required otherwise.
            client_id: clientId,
            code_verifier: codeVerifier,
            redirect_uri: redirectUri,
            code,
            grant_type: 'authorization_code',
        }),
    })
        .then((response) => {
            // book-keeping so we can show you the response
            setLatestTokenRequestState('AUTHORIZATION_SUCCESS', response.data);
            // redirect to the form where we show you the response
            // you don't need this in your own implementation
            res.redirect('/');
        })
        .catch((e) => {
            // 400 and 401 errors mean some problem in our configuration, the user waited too
            // long to authorize, or there were multiple requests using this auth code.
            // We expect these but not other error codes during normal operations
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
app.route("/refresh_token_form", (state, emit) => {
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



// app.route("/", mainView);

// start app
app.mount("#choomount");
