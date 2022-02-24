const express = require("express");
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
//var cors = require('cors')

const app = express();
//app.use(cors());

app.use(express.json());


app.engine("hbs", expressHbs.engine({layoutsDir: "views/layouts", defaultLayout: "layout", extname: "hbs"}))
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials");


const db = require("./models");
db.sequelize.sync().then(result=>{//{force: true}
    console.log('Sync');
})
.catch(err=> console.log(err));

app.get("/", (req, res) => {
    res.render("home")
});

  
require("./routes/orders.routes")(app);
require("./routes/products.routes")(app);
require("./routes/clients.routes")(app);
require("./routes/redactors.routes")(app);
require("./routes/producttypes.routes")(app);

app.listen(3000, () => { console.log(`App listening`)}) 

module.exports = app;