import express from 'express';
const router = express.Router()

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

import axios from "axios";

async function generateText(promptText) {
  console.log(promptText);
  try {
    const HF_API_TOKEN = "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";
    const model = "blasees/gpt2_bestpractices";

    const temperature = 0.7; //temperatureSlider.value();
    const maxLength = 100; //maxLengthSlider.value();

    const data = {
      inputs: promptText || " ",
      parameters: {
        temperature: temperature,
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

  // function writeData() {
  //   res.write("data: <div>a</div>\n\n");
  // }
  // writeData();
  const text = await generateText("what is the future of dance");
  res.write(`data: <div>${ text }</div>\n\n`);
  
});

export default router;