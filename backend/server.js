import dotenv from "dotenv";
// require("dotenv").config({ path: '../.env' })

import crypto from 'crypto';
import {URL} from 'url';
import qs from 'qs';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import fetch from "node-fetch";
import proxy from "express-http-proxy";

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(session({
  secret: "kitty cat",
  resave: false,
  saveUninitialized: false,
}))
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const port = process.env.PORT;
const redirectUri = process.env.REDIRECT_URI;
const scope = process.env.SCOPE;
const airtableUrl = process.env.AIRTABLE_URL;

const encodedCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
const authorizationHeader = `Basic ${encodedCredentials}`;

app.post('/api/getdata', async function(req, res, next) {
  let cardData = ""
  if (req.session.connected) {
    cardData = await getTableData({ key: req.session.data.access_token });
  }
  res.json({ cardData });
});


const authorizationCache = {};
app.get('/api/redirect-testing', (req, res) => {
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
app.get('/api/airtable-oauth', (req, res) => {
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
      // setLatestTokenRequestState('AUTHORIZATION_SUCCESS', data);
      req.session.data = data;
      req.session.connected = true;
      res.redirect('/');
    })
    .catch((e) => {
      if (e.response && [400, 401].includes(e.response.status)) {
          // setLatestTokenRequestState('AUTHORIZATION_ERROR', e.response.data);
      } else if (e.response) {
          console.log('uh oh, something went wrong', e.response.data);
          // setLatestTokenRequestState('UNKNOWN_AUTHORIZATION_ERROR');
      } else {
          console.log('uh oh, something went wrong', e);
          // setLatestTokenRequestState('UNKNOWN_AUTHORIZATION_ERROR');
      }
      res.redirect('/');
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function getTableData({ key }) {
  const headers = [
    ['Authorization', `Bearer ${ key }`],
  ];
  let response, data, tableData;
  response = await fetch(`https://api.airtable.com/v0/meta/bases`, { headers, method:"GET" });
  data = await response.json();
  if (data?.bases?.length > 0) {
    const baseId = data.bases[0].id;
    const baseName = data.bases[0].name;
    // console.log(`Base name: ${ baseName }`)
    response = await fetch(`https://api.airtable.com/v0/meta/bases/${ baseId }/tables`, { headers });
    data = await response.json();
    const tableId = data.tables[0].id;
    const tableName = data.tables[0].name;
    // console.log(`Table name: ${ tableName }`)
    if (data.tables.length > 0) {
      response = await fetch(`https://api.airtable.com/v0/${ baseId }/${ tableId }`, { headers });
      data = await response.json();
      tableData = data;
    }
  }
  return tableData;
}