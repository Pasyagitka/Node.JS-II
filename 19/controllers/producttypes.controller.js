const db = require("../models");
const ProductTypes = db.producttypes;

exports.findAll = (req, res) => {
    ProductTypes.findAll({raw : true,  nest : true})
    .then(data => {res.render("producttypes", {data}); }
)};
