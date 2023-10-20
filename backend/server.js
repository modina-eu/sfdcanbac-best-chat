import dotenv from "dotenv";

import express from 'express';
const app = express();

import { AceBase } from "acebase";
const options = { logLevel: 'warn', storage: { path: '.' } }; // optional settings
const db = await new AceBase('mydb', options);  // Creates or opens a database with name "mydb"

import AirtableLoader from "./libs/airtable-loader.js";

app.use(express.json());

const port = !!process.env.BACKEND_PORT ? process.env.BACKEND_PORT : 40000;

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

app.post('/api/content', async function(req, res, next) {
  let airtableData = {};
  const airtableLoader = new AirtableLoader(
    process.env.AIRTABLE_KEY,
    process.env.AIRTABLE_ID,
    "Table 1",
    "Grid view"
  );
  await airtableLoader.load(
    // every
    (r) => {
      for (const el of r) {
        if (el.enabled) {
          airtableData[el.id] = el;
        }
      }
    },
    // done
    () => {
      console.log(airtableData);
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// app.post('/api/upload', upload.single('imgfile'), async function(req, res, next) {
//   try {
//     superagent
//       .post("https://api.imgbb.com/1/upload")
//       .field('key', process.env.IMGBB_KEY)
//       .attach("image", req.file.path)
//       .field("name", req.file.originalname)
//       .end(async (err, res_) => {
//         if (err) {
//           console.log(err);
//           res.send("error");
//         } else {
//           unlinkAsync(req.file.path);
//           console.log('Media uploaded!');
//           db.ref('images')
//             .push({
//               image: res_.body.data.image,
//               thumb: res_.body.data.thumb,
//               medium: res_.body.data.medium,
//               date: +new Date,
//             })
//             .then(userRef => {
//             });
//           res.send("ok");
//         }
//     })
//   } catch (error) {
//     console.error("Error:", error);
//     res.send("error");
//   }
// })

// app.get('/api/geturls', async function(req, res, next) {
//   const snapshot = await db.ref('images').get();
//   let data = snapshot.val();
//   const keys = Object.keys(data);
//   data = keys.map(key => {return {...data[key], key}}).sort((a, b) => b.date - a.date);

//   res.json(data.slice(0, 10));
// })