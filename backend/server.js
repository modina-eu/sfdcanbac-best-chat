import dotenv from "dotenv";

import express from 'express';
const app = express();

import { AceBase } from "acebase";
const options = { logLevel: 'warn', storage: { path: '.' } }; // optional settings
const db = await new AceBase('mydb', options);  // Creates or opens a database with name "mydb"

app.use(express.json());

const port = !!process.env.BACKEND_PORT ? process.env.BACKEND_PORT : 40000;

import content from "./content.js";
app.use(content);

app.get('/api/getrandomhello', async function(req, res, next) {
  res.json({ data: ["hello!", "hola!", "salut", "hallo"][Math.floor(Math.random()*4)] });
});

app.post('/api/clicked', async function(req, res, next) {
  res.send(`<h1>hi</h1>`);
});

app.post('/api/counter', async function(req, res, next) {
  const snapshot = await db.ref('counter').get();
  let data = snapshot.val();
  let i = data?.count !== undefined ? data.count : 0;
  res.send(`<span class="font-bold">${ i }</span>`);
  const ref = await db.ref('counter').set({
    count: i + 1,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
