// followed a tutorial @ 
// https://www.robinwieruch.de/node-js-express-tutorial
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import uuidv4 from 'uuid/v4';
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//write json for debugging purposes
function makeJson(jsonString){
  fs.writeFile('./myPayload.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})
}

//@license Lighthouse Copyright 2017 Google Inc.
//Code from Documentation
//https://github.com/GoogleChrome/lighthouse.git


console.log("test started")

function launchChromeAndRunLighthouse(url, flags = {}, config = null) {
  return chromeLauncher.launch(flags).then(chrome => {
    flags.port = chrome.port;
    return lighthouse(url, flags, config).then(results =>
      chrome.kill().then(() => results
      ));
  });
}

const log = require('lighthouse-logger');

const flags = {
    logLevel: 'info',
    chromeFlags: ['--headless'],
    // Available categories: accessibility, best-practices, performance, pwa, seo.
    // onlyCategories: ['performance'],
};

log.setLevel(flags.logLevel);
//logging ends

//REST API
// cors to bypass Cross-orgin request error
app.use(cors())

let messages = {
    1: {
      id: '1',
      text: 'Hello World',
      userId: '1',
    },
};


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/messages', (req, res) => {
    const id = uuidv4();
    const message = {
        id,
        text: req.body.text,
    };
    messages[id] = message;
    
    console.log("message received " + message.text)
    launchChromeAndRunLighthouse(message.text, flags).then(results => {
    //makeJson(results.report)
      return res.send(results.report)
    })
});

/*
app.listen(3000, () => 
    console.log('app listening to port 3000')
);
*/

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
/*
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
*/