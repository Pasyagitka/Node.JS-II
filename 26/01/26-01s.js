const express = require("express");
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

const { ServerDH, cipherFile } = require('./26-01m');

const data = './01/data.txt';
const encryptedByServer = './01/encrypted.txt';

const serverDH = new ServerDH(1024, 3);
let serverSecret;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

//Server: p g A
app.get('/', (req, res, next) => {
    const serverContext = serverDH.getContext();
    res.end(JSON.stringify(serverContext));
});

//shared secret, cipher file with key
//get B, create K
app.post('/cipher', (req, res, next) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        const clientContext = JSON.parse(body);
        if(!clientContext.key_hex) return res.status(409).end('нарушение схемы обмена данными');
        serverSecret = serverDH.getSecret(clientContext);
        const key = new Buffer.alloc(32);
        serverSecret.copy(key, 0, 0, 32);
        cipherFile(fs.createReadStream(data), fs.createWriteStream(encryptedByServer), key);
        return res.end('success');
    });
});

//высылает зашифрованный txt-файл
app.get('/resource', (req, res, next) => {
    if (!serverSecret) return res.status(409).end('нарушение схемы обмена данными');
    let rs2 = fs.createReadStream(encryptedByServer);
    rs2.pipe(res);
    rs2.on('close', () =>  { console.log(rs2.bytesRead); res.end(); });
});

app.listen(8000);