import dotenv from "dotenv";
// require("dotenv").config({ path: '../.env' })

import express from 'express';
const app = express();

app.use(express.json());

const port = process.env.BACKEND_PORT;

app.get('/api/getdata', async function(req, res, next) {
  res.json({ data: "hello" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
