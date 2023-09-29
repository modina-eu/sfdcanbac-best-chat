import dotenv from "dotenv";

import express from 'express';
const app = express();

app.use(express.json());

const port = !!process.env.BACKEND_PORT ? process.env.BACKEND_PORT : 40000;

app.get('/api/getrandomhello', async function(req, res, next) {
  res.json({ data: ["hello!", "hola!", "salut", "hallo"][Math.floor(Math.random()*4)] });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
