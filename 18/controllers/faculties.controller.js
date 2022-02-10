const db = require("../models");
const Faculty = db.faculties;

exports.getAll = (req, res) => {
	Faculty.findAll()
		.then((data) => { res.send(data); })
		.catch((err) => { res.status(500).send({ message: err.message || "Some error occurred while retrieving faculties."});});
};

exports.getPulpits = (req, res) => {
	const id = req.params.xyz;
	Faculty.findAll({
		where: { faculty: id },
		include: {
			model: db.pulpits,
			required: false,
			as: "faculty_pulpits",
		},
	})
		.then((data) => {
			if (data) {res.send(data);} 
			else {res.status(404).send({	message: `Cannot find Faculty with xyz=${id}.`});}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({message: "Error retrieving Faculty with xyz=" + id});
		});
};

exports.getTeachers = (req, res) => {
	const id = req.params.xyz;
	Faculty.findAll({
		where: { faculty: id },
		include: {
			model: db.pulpits,
			required: true,
			as: "faculty_pulpits",
			include: {
				model: db.teachers,
				required: true,
				as: "pulpit_teachers",
			},
		},
	})
		.then((data) => {
			if (data) {res.send(data);} 
			else {res.status(404).send({message: `Cannot find Faculty with xyz=${id}.`});}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({message: "Error retrieving Faculty with xyz=" + id});
		});
};

exports.create = (req, res) => {
	if (!req.body.faculty) {
		res.status(400).send({message: "Content can not be empty!"});
		return;
	}

	const faculty = {
		faculty : req.body.faculty,
		faculty_name: req.body.faculty_name
	};

	Faculty.create(faculty)
		.then((data) => {	res.send(data); })
		.catch((err) => {res.status(500).send({	message: err.message || "Some error occurred while creating the Faculty."});
	});
};


exports.update = (req, res) => {
  Faculty.update(req.body, {  where: { faculty: req.body.faculty } })
    .then(num => {
      if (num == 1) {	res.send(req.body);} 
	  else {res.send({ message: `Cannot update Faculty with id=${req.body.faculty}. Faculty was not found or req.body is empty!` });}
    })
    .catch(err => { res.status(500).send({ message: "Error updating Faculty with id=" + req.body.faculty}); });
}


exports.delete = (req, res) => {
  const id = req.params.xyz;
  
  Faculty.destroy({ where: { faculty: id } })
  .then(num => {
    if (num == 1) { res.send({  message: "Faculty was deleted successfully!"});} 
	else {res.send({ message: `Cannot delete Faculty with id=${id}. Maybe Faculty was not found!`});}
  })
  .catch(err => { console.log(err); res.status(500).send({ message: "Could not delete Faculty with id=" + id});});
};
