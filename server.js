require('dotenv').config()
const express = require("express");
const app = express();
const fs = require('fs');
let server;
if (process.env.HTTP == 1) {
  server = require("http").createServer(app);
}
else {
  const https = require('https');
  const options = {
    key: fs.readFileSync('/opt/certs/privkey.pem'),
    cert: fs.readFileSync('/opt/certs/cert.pem')
  };
  server = https.createServer(options, app)
}
const port = process.env.PORT || 3000;

const geoip = require('geoip-lite');

const io = require("socket.io")(server);

const requestIp = require('request-ip');

// DB https://glitch.com/~hello-sqlite
//const fs = require("fs");

// init sqlite db
const dbFile = "./.data/sqliteImg.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Logs (id INTEGER PRIMARY KEY AUTOINCREMENT, json TEXT)"
    );
  }
});

server.listen(port, () => {
  console.log("listening!");
});

app.use(requestIp.mw())

app.use("/ip", function(req, res) {
    const ip = req.clientIp;
    res.end(ip);
});

app.set('trust proxy', true);
app.use(express.static("public"));
app.get('/el/*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const AirtableLoader = require("./airtable_loader.js");
const airtableLoader = new AirtableLoader(process.env.AIRTABLE_API_KEY, process.env.AIRTABLE_BASENAME);

let lastData;
app.get('/data', function (req, res) {
  let dataSent = false;
  if (lastData !== undefined) {
    res.send(lastData);
    dataSent = true;
  }

  const out = [];
  airtableLoader.load(
    // every
    (r) => {
      for (const el of r) {
        if (el.image !== "") {
          out.push(el);
        }
      }
    },
    // done
    () => {
      if (dataSent === false) {
        res.send(out);
      }
      lastData = out;
    }
  );
})

app.get('/api/logs', function (req, res) {
  const out = { data: []};
  db.all("SELECT * from Logs", (err, rows) => {
    for (let i = 0; i < rows.length; i++) {
      const data = JSON.parse(decodeURIComponent(rows[i].json));
      out.data.push(data);
    }
    res.send(out);
  });
})

io.on("connection", socket => {
  const session = [];
  let location = {};
  socket.on("log", function({tag, data}) {
    session.push({tag, data});
    if (tag === "ip" && data.ip !== undefined) {
      location = geoip.lookup(data.ip);
      session.push({tag: "geoip", data: location});
    }
  });
  socket.on('disconnect', function() {
    console.log("disconnect")
    if (session.length > 0 && session.find(e => e.tag === "loaded") !== undefined) {
      db.run(`INSERT INTO Logs (json) VALUES (?)`, encodeURIComponent(JSON.stringify(session)), error => {
        console.log('upload ' + (error == undefined ? 'success' : error))
      });
    }
    else {
      console.log("skipping upload: session length 0")
    }
  });
});
