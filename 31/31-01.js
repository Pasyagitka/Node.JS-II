const express = require("express");
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const swaggerUI = require('swagger-ui-express');
const swDocument = require( './swagger');

const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swDocument));

require("./routes")(app);


app.use((req, res) => res.status(404).json("error 404"));

app.listen(PORT); 

module.exports = app;