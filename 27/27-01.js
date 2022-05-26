const webdav = require('webdav-server').v2;
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

const controller = require('./controllers');

const server = new webdav.WebDAVServer();


const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{ cb(null, "folder");  },
    filename: (req, file, cb) =>{ cb(null, file.originalname);}
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({storage:storageConfig}).single("file"));
app.use(webdav.extensions.express('/folder', server));

app.post('/md/:ttttt', controller.makeDir);
app.post('/rd/:ttttt', controller.remove);
app.post('/up/:ttttt', controller.uploadFile);
app.post('/down/:ttttt', controller.downloadFile);
app.post('/del/:ttttt', controller.remove);
app.post('/copy/:ttttt/:ppppp', controller.copyFile);
app.post('/move/:ttttt/:ppppp', controller.moveFile);

app.listen(5000);

//curl -X POST "http://localhost:5000/md/liza1619"