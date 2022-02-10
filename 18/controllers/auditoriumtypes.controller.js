const db = require("../models");
const AuditoriumTypes = db.auditoriumtypes;


exports.findAll = (req, res) => {
    AuditoriumTypes.findAll()
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send({ message: err.message || "Some error occurred while retrieving auditorium types." }); });
};

exports.create = (req, res) => {
	if (!req.body.type) {
		res.status(400).send({ message: "Content can not be empty!"});
		return;
	}

	const auditoriumtype = {
		auditorium_type: req.body.type,
        auditorium_typename: req.body.typename
	};

	AuditoriumTypes.create(auditoriumtype)
    .then((data) => { res.send(data); })
    .catch((err) => { console.log(err); res.status(500).send({message: err.message || "Some error occurred while creating the AuditoriumTypes."});});
};


exports.update = (req, res) => {
    AuditoriumTypes.update({auditorium_type : req.body.type, auditorium_typename: req.body.typename}, { where: { auditorium_type: req.body.type } })
    .then(num => {
        if (num == 1) {
        res.send(req.body);
        } else {
        res.send({ message: `Cannot update AuditoriumTypes with id=${req.body.type}. AuditoriumTypes was not found or req.body is empty!` });
        }
    })
    .catch(err => { console.log(err); res.status(500).send({ message: "Error updating AuditoriumTypes with id=" + req.body.type}); });
}

exports.delete = (req, res) => {
  const id = req.params.xyz;

  AuditoriumTypes.destroy({ where: { auditorium_type: id } })
  .then(num => {
    if (num == 1) {  res.send({  message: "AuditoriumTypes was deleted successfully!"});  } 
    else { res.send({ message: `Cannot delete AuditoriumTypes with id=${id}. Maybe AuditoriumTypes was not found!`}); }
  })
  .catch(err => { console.log(err); res.status(500).send({ message: "Could not delete AuditoriumTypes with id=" + id});});
};
