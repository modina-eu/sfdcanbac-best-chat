import express from 'express';
const router = express.Router()

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');

import axios from "axios";

import { EventEmitter } from "events";
const eventEmitter = new EventEmitter;

import db from "./db.js";

const snapshot = await db.ref('text-log').get();
let log = snapshot.val();
if (log === null) {
  log = [];
}

async function generateText(promptText, { model, temperature }) {
  // return "fakedata " + promptText;
  console.log(promptText, model, temperature);
  try {
    const HF_API_TOKEN = "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";

    const maxLength = 100; //maxLengthSlider.value();

    const data = {
      inputs: promptText || " ",
      parameters: {
        temperature,
        max_length: maxLength,
      },
    };

    const response = await axios.post(`https://api-inference.huggingface.co/models/${model}`, {
      headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
      method: "post",
      ...data,
    });
    console.log(response);

    const result = response.data;
    if (result.length > 0) {
      console.log("result", result);
      const generatedText = result[0]["generated_text"];

      // Remove the promptText from the beginning of the generated text if it exists
      const formattedText = generatedText.startsWith(promptText)
        ? generatedText.substring(promptText.length)
        : generatedText;
      
      return formattedText;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

router.post('/api/prompt', async function(req, res, next) {
  const prompt = req.body.prompt;
  const model = models[req.body.model].api;
  const temperature = req.body.temperature;
  let text;
    // res.send("failed - model still loading");
    // return;
  text = await generateText(prompt, { model, temperature });
  // let count = 0;
  // while (text === undefined && count < 5) {
  //   text = await generateText(prompt, temperature);
  //   sleep(3000);
  //   count++;
  // }
  if (text === undefined) {
    res.send("failed - model still loading");
    return;
  }
  
  const date = new Date;
  log.push({ text: prompt, type: "prompt", temperature, date });
  log.push({ text: text, type: "generated", model: req.body.model, temperature, date });
  const ref = await db.ref('text-log').set(log);

  eventEmitter.emit("update content");
  res.send(text)
});

const models = {
  chat: {
    name: "Chat",
    api: "blasees/gpt2_bestpractices",
  },
  proposal: {
    name: "Proposal",
    api: "micuat/gpt2_bestpractices_proposal",
  },
  nthesis: {
    name: "N. Thesis",
    api: "micuat/gpt2_bestpractices_naoto_thesis",
  },
  murobushi: {
    name: "Murobushi",
    api: "micuat/gpt2_ko_murobushi",
  },
};

router.get('/api/models', async function(req, res, next) {
  res.send(`
  <select class="border-2 border-sky-500 h-full" name="model">
    ${ Object.keys(models).map(key => `
    <option value="${ key }">
      ${ models[key].name }
    </option>`) }
  </select>`)
});

router.get('/api/content', async function(req, res) {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();

  // Tell the client to retry every 10 seconds if connectivity is lost
  res.write('retry: 10000\n\n');
  let count = 0;
  
  req.on('close', () => {
  });

  function writeData() {
    console.log("write data")
    res.write("data: <div>" +
      //log.map(e => `<div>${ e }</div>`)
      log.map(e => {
        if (e.type == "prompt") {
          return `
          <div class="flex justify-end">
            <div class="m-1 p-1 bg-blue-300 rounded max-w-screen-sm">
              ${ e.text }
            </div>
          </div>`
        }
        else {
          return `
          <div class="flex justify-start">
            <div class="m-1 p-1 bg-gray-300 rounded max-w-screen-sm">
              ${ e.text }
              ${ e.model !== undefined ? `<div class="text-xs">model: ${ models[e.model].name }</div>` : "" }
              ${ e.temperature !== undefined ? `<div class="text-xs">temp: ${ e.temperature }</div>` : "" }
              ${ e.date !== undefined ? `<div class="text-xs">${ timeAgo.format(e.date) }</div>` : "" }
            </div>
          </div>`
        }
      })
      .join("").replace(/\n/g, "")
    + `</div>\n\n`);
  }
  writeData();
  eventEmitter.on("update content", writeData);
});

export default router;