const db = require("../models");
const Pulpit = db.pulpits;

exports.findAll = (req, res) => {
    Pulpit.findAll()
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send({ message: err.message || "Some error occurred while retrieving pulpits." }); });
};

exports.create = (req, res) => {
	if (!req.body.pulpit) {
		res.status(400).send({ message: "Content can not be empty!"});
		return;
	}

	const pulpit = {
		pulpit : req.body.pulpit,
		pulpit_name: req.body.pulpit_name,
        faculty : req.body.faculty
	};

	Pulpit.create(pulpit)
    .then((data) => { res.send(data); })
    .catch((err) => { console.log(err); res.status(500).send({	message: err.message || "Some error occurred while creating the Pulpit."});});
};


exports.update = (req, res) => {
    Pulpit.update(req.body, { where: { pulpit: req.body.pulpit } })
    .then(num => {
        if (num == 1) {res.send(req.body); } 
        else { res.send({ message: `Cannot update Pulpit with id=${req.body.pulpit}. Pulpit was not found or req.body is empty!` }); }
    })
    .catch(err => { res.status(500).send({ message: "Error updating Pulpit with id=" + req.body.pulpit}); });
}


exports.delete = (req, res) => {
  const id = req.params.xyz;

  Pulpit.destroy({ where: { pulpit: id } })
  .then(num => {
    if (num == 1) {  res.send({  message: "Pulpit was deleted successfully!"});  } 
    else { res.send({ message: `Cannot delete Pulpit with id=${id}. Maybe Pulpit was not found!`}); }
  })
  .catch(err => { res.status(500).send({ message: "Could not delete Pulpit with id=" + id});});
};