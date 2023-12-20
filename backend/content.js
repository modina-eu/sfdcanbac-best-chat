import express from 'express';
const router = express.Router()

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

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

    const headers = { Authorization: `Bearer ${HF_API_TOKEN}` }; // auth header with bearer token
    const response = await axios.post(`https://api-inference.huggingface.co/models/${model}`, {
      headers,
      body: JSON.stringify(data),
    })

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    if (result.length > 0) {
      console.log(result);
      const generatedText = result[0]["generated_text"];

      // Remove the promptText from the beginning of the generated text if it exists
      const formattedText = generatedText.startsWith(promptText)
        ? generatedText.substring(promptText.length)
        : generatedText;


      // Store the formatted generated text and its scroll position separately for each line
      // let lines = formattedText.split("\n");
      // for (let i = 0; i < lines.length; i++) {
      //   textLines.push({ text: lines[i], textY: 0, isInput: false });
      // }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

generateText("what is the future of dance")

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
    res.write("data: <div>a</div>\n\n");
  }
  writeData();
});

export default router;