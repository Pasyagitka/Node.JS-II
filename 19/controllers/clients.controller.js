const db = require("../models");
const Clients = db.clients;

exports.findAll = (req, res) => {
	Clients.findAll({raw : true,  nest : true})
    .then(data => {res.render("client", {data}); })
};


exports.create = (req, res) => {
	if (!req.body.surname || !req.body.firstName || !req.body.company || !req.body.email) {
		res.status(400).send({ message: "Content can not be empty!"});
		return;
	}

	const client = {
		surname : req.body.surname,
		firstName: req.body.firstName,
        company: req.body.company,
        email : req.body.email
	};

	Clients.create(client)
    .then((data) => { res.send(data); })
    .catch((err) => { res.status(500).send({message: `${err.message}` || "Some error occurred while creating the Client."});});
};


exports.update = (req, res) => {
	if (!req.body.id || !req.body.surname || !req.body.firstName || !req.body.company || !req.body.email) {
		res.status(400).send({ message: "Content can not be empty!"});
		return;
	}


    Clients.update(req.body, { where: { id: req.body.id } })
    .then(num => {
        if (num == 1) {
            res.send(req.body);
        } else {
            res.send({ message: `Cannot update Client with id=${req.body.id}. Client was not found or req.body is empty!` });
        }
    })
    .catch(err => { res.status(500).send({ message: "Error updating Client with id=" + req.body.id}); });
}

exports.delete = async (req, res) => {
  const id = req.params.xyz;

  let [del] = await Clients.findAll({where: { id: id }});

  Clients.destroy({ where: { id: id } })
  .then(num => {
    if (num == 1) {  res.send({  message: `Client was deleted successfully: ${del.dataValues.id}`});  } 
    else { res.send({ message: `Cannot delete Client with id=${id}. Maybe Client was not found!`}); }
  })
  .catch(err => { res.status(500).send({ message: "Could not delete Client with id=" + id});});
};
