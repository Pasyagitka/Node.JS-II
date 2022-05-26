const app = require('express')();
const https = require('https');
const fs = require('fs');

const PORT = 3443;

let options = {
    key: fs.readFileSync('./zei.key'),
    cert: fs.readFileSync('./CA-LAB25-PAI.crt'),
};

https.createServer(options, app).listen(PORT);

app.get('/', (req, res) => {
    console.log('hello from https');
    res.send('hello from https');
})
