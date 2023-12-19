import express from 'express';
const router = express.Router()

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

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