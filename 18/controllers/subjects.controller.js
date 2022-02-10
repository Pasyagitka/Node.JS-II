const db = require("../models");
const Subject = db.subjects;

exports.findAll = (req, res) => {
    Subject.findAll()
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send({ message: err.message || "Some error occurred while retrieving subjects." }); });
};


exports.create = (req, res) => {
	if (!req.body.subject) {
		res.status(400).send({ message: "Content can not be empty!"});
		return;
	}

	const subject = {
		subject : req.body.subject,
		subject_name: req.body.subject_name,
        pulpit : req.body.pulpit
	};

	Subject.create(subject)
    .then((data) => { res.send(data); })
    .catch((err) => { console.log(err); res.status(500).send({message: err.message || "Some error occurred while creating the Subject."});});
};


exports.update = (req, res) => {
    Subject.update(req.body, { where: { subject: req.body.subject } })
    .then(num => {
        if (num == 1) {
        res.send(req.body);
        } else {
        res.send({ message: `Cannot update Subject with id=${req.body.subject}. Subject was not found or req.body is empty!` });
        }
    })
    .catch(err => { console.log(err); res.status(500).send({ message: "Error updating Subject with id=" + req.body.subject}); });
}

exports.delete = (req, res) => {
  const id = req.params.xyz;

  Subject.destroy({ where: { subject: id } })
  .then(num => {
    if (num == 1) {  res.send({  message: "Subject was deleted successfully!"});  } 
    else { res.send({ message: `Cannot delete Subject with id=${id}. Maybe Subject was not found!`}); }
  })
  .catch(err => { res.status(500).send({ message: "Could not delete Subject with id=" + id});});
};
