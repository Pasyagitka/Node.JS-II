const bodyParser = require("body-parser");
const express = require("express");
//var cors = require('cors')


const app = express();
//app.use(cors());

app.use(express.json());

const db = require("./models");
db.sequelize.sync().then(result=>{//{force: true}
    console.log('Sync');
})
.catch(err=> console.log(err));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/faculty.html")
});

  
require("./routes/faculties.routes")(app);
require("./routes/pulpits.routes")(app);
require("./routes/teachers.routes")(app);
require("./routes/subjects.routes")(app);
require("./routes/auditoriums.routes")(app);
require("./routes/auditoriumtypes.routes")(app);

app.listen(3000, () => { console.log(`App listening`)}) 

module.exports = app;