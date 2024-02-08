import dotenv from "dotenv";

import express from 'express';
const app = express();

import db from "./db.js";

import bodyParser from "body-parser";
import cors from "cors";

app.use(
  cors({
    credentials: true,
    origin: 'https://best-chat.glitch.me',
  }),
);
app.use(express.json());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const port = !!process.env.CHAT_PORT ? process.env.CHAT_PORT : 40003;

import content from "./content.js";
app.use(content);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
