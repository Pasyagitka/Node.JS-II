const fs = require('fs');
const {createClient} = require('webdav');
const mime = require('mime');
require('dotenv').config();

const client = createClient(process.env.WEBDAV_URL, {
    username: process.env.WEBDAV_USERNAME, 
    password: process.env.WEBDAV_PASSWORD
});

async function makeDir(req, res) {
    let {ttttt} = req.params;
    if (await client.exists(ttttt) === false) {
        await client.createDirectory(ttttt);
        res.json('Success');
    }
    else res.status(408).json('Already exists');
}

async function remove(req, res)  {
    let {ttttt} = req.params;
    if (await client.exists(ttttt) === true) {
        await client.deleteFile(ttttt);
        res.json('Success');
    }
    else res.status(404).json('Not exists');
}

async function uploadFile(req, res)   {
    let {ttttt} = req.params;
    let {filename} = req.file;
   console.log(filename)
    let rs = fs.createReadStream('./folder/' + filename);
    rs.on('open', function () {
        rs.pipe(client.createWriteStream(ttttt));
        return res.json('Success');    
    });
    rs.on('error', function(err) {
        res.status(408).end('Cannot perform /up');
    });
}

async function downloadFile(req, res) {
    let {ttttt} = req.params;
    if (await client.exists(ttttt) === true) {
        let mimeType = (await client.getDirectoryContents(ttttt))[0].mime;
        let extension = mime.getExtension(mimeType);
        client.createReadStream(ttttt).pipe(fs.createWriteStream(`./folder/${ttttt}.${extension}`));
        res.end('Success');
    }
    else res.status(404).json('Not exists');
}

async function copyFile(req, res) {
    let {ttttt, ppppp} = req.params;
    if (await client.exists(ttttt) === true) {
        client.copyFile(ttttt, ppppp);
        res.json('Success');
    }
    else res.status(404).json('Not exists');
}

async function moveFile(req, res) {
    let {ttttt, ppppp} = req.params;
    if (await client.exists(ttttt) === true) {
        client.moveFile(ttttt, ppppp);
        res.json('Success');
    }
    else res.status(404).json('Not exists');
}

module.exports = {
    makeDir,
    remove,
    uploadFile,
    downloadFile,
    copyFile,
    moveFile,
}
