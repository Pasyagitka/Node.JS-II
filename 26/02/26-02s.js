const fs = require('fs');
const app = require('express')();

const { ServerSign } = require('./26-02m');

const serverData = './02/data.txt';
const clientData = './02/clientData.txt';

//signature, public key
app.get('/sign', (req, res, next) => {
    const ss = new ServerSign();
    ss.getSignContext(fs.createReadStream(serverData), (signcontext) => {
        res.end(JSON.stringify({signcontext}));
    });
});

app.get('/file', (req, res, next) => {
    const rs = fs.createReadStream(clientData);
    rs.pipe(res);
    rs.on('close', () => res.end());
});

app.listen(8000);