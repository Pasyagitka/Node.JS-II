const axios = require('axios');
const fs = require('fs');
const { ClientVerify } = require('./26-02m');

const clientData = './02/clientData.txt';

(async() => {
    let data = (await axios.get('http://localhost:8000/file')).data;
    fs.writeFileSync(clientData, data);

    let signcontext = (await axios.get('http://localhost:8000/sign')).data.signcontext;
    const x = new ClientVerify(signcontext);
    x.verify(fs.createReadStream(clientData), (result)=> {  console.log(result); });
})()
