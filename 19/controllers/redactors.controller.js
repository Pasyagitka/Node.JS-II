const db = require("../models");
const Redactors = db.redactors;

exports.findAll = (req, res) => {
	Redactors.findAll({raw : true,  nest : true})
    .then(data => {res.render("redactor", {data}); })
};