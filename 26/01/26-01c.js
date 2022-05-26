const http = require('http');
const fs = require('fs');
const { ClientDH, decipherFile } = require('./26-01m');

let options = {
    host: 'localhost',
    path: '/',
    port: 8000,
    method: 'GET',
}

let decryptedByClient = './01/decrypted.txt';

http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk.toString('utf-8'); });
    res.on('end', () =>  {
        let serverContext = JSON.parse(data);       //Server: p g A
        const clientDH  = new ClientDH(serverContext);
        let clientContext = clientDH.getContext();  //Client: p g K=A^b mod p

        //B
        http.request({...options, path: '/cipher', method: 'POST' }, (res) => {
            if (res.statusCode == 200) {
                http.request({...options, path: '/resource' }, (res) => {
                    if (res.statusCode == 200) {
                        const key = new Buffer.alloc(32);
                        //get shared secret
                        let clientSecret = clientDH.getSecret(serverContext);
                        clientSecret.copy(key, 0, 0, 32);
                        //decipher
                        decipherFile(res, fs.createWriteStream(decryptedByClient), key);
                    }
                }).end();
            }
        }).end(JSON.stringify(clientContext));
    });
}).end();

