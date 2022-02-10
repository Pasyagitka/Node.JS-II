const db = require("../models");
const Teacher = db.teachers;

exports.findAll = (req, res) => {
    Teacher.findAll()
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send({ message: err.message || "Some error occurred while retrieving teachers." }); });
};


exports.create = (req, res) => {
	if (!req.body.teacher) {
		res.status(400).send({ message: "Content can not be empty!"});
		return;
	}

	const teacher = {
		teacher : req.body.subject,
		teacher_name: req.body.subject_name,
        gender: req.body.gender,
        pulpit : req.body.pulpit
	};

	Teacher.create(teacher)
    .then((data) => { res.send(data); })
    .catch((err) => { res.status(500).send({message: err.message || "Some error occurred while creating the Teacher."});});
};


exports.update = (req, res) => {
    Teacher.update(req.body, { where: { teacher: req.body.teacher } })
    .then(num => {
        if (num == 1) {
        res.send(req.body);
        } else {
        res.send({ message: `Cannot update Teacher with id=${req.body.teacher}. Teacher was not found or req.body is empty!` });
        }
    })
    .catch(err => { res.status(500).send({ message: "Error updating Teacher with id=" + req.body.teacher}); });
}

exports.delete = (req, res) => {
  const id = req.params.xyz;

  Teacher.destroy({ where: { teacher: id } })
  .then(num => {
    if (num == 1) {  res.send({  message: "Teacher was deleted successfully!"});  } 
    else { res.send({ message: `Cannot delete Teacher with id=${id}. Maybe Teacher was not found!`}); }
  })
  .catch(err => { res.status(500).send({ message: "Could not delete Teacher with id=" + id});});
};
