const express = require("express");
const expressHbs = require("express-handlebars");
var bodyParser = require('body-parser');
const hbs = require('handlebars');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: true })); //!!!!

app.engine("hbs", expressHbs.engine({
    layoutsDir: "views/layouts", 
    defaultLayout: "layout", 
    extname: "hbs",
    partialsDir: "views/partials/",
    helpers: {
        cancelbutton: function(url) {
            url = hbs.escapeExpression(url);
            return new hbs.SafeString("<a class='btn cancel-button' href='" + url + "'>Отмена</a>");
        }
    }
}))
app.set('view engine', 'hbs');

require("./routes/routes")(app);

app.use((req, res) => res.status(404).render("error"));

app.listen(PORT); 

module.exports = app;