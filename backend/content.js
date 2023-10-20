import express from 'express';
const router = express.Router()

import AirtableLoader from "./libs/airtable-loader.js";

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

const airtableLoader = new AirtableLoader(
  process.env.AIRTABLE_KEY,
  process.env.AIRTABLE_ID,
  "Table 1",
  "Grid view"
);

router.post('/api/content', async function(req, res, next) {
  await airtableLoader.load();
  console.log();
  res.send(airtableLoader.elements.reverse().map(e => `
    <div>
      <div>
        <span class="text-gray-600">${ timeAgo.format(new Date(e.created)) }</span> <span>${ e.notes }</span>
      </div>
      ${ e.image ? `<img class="w-full max-w-screen-sm" src=${ e.image } />` : "" }
    </div>
  `).join(""));
});

export default router;