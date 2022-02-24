const db = require("../models");
const Orders = db.orders;

exports.getAll = (req, res) => {
	Orders.findAll({raw : true,  nest : true})
    .then(data => {res.render("order", {data}); }
)};


exports.create = (req, res) => {
	if (!req.body.orderDate || !req.body.publishingDate || !req.body.copies) {
		res.status(400).send({message: "Content can not be empty!"});
		return;
	}

	const order = {
		orderDate : req.body.orderDate,
		publishingDate : req.body.publishingDate,
		copies: req.body.copies,
		clientId : req.body.clientId,
		productId: req.body.productId,
		redactorId: req.body.redactorId
	};

	Orders.create(order)
		.then((data) => {	res.send(data); })
		.catch((err) => { res.status(500).send({message: `${err.message}` || "Some error occurred while creating the Orders."});
	});
};


exports.update = (req, res) => {
	if (!req.body.id || !req.body.orderDate || !req.body.publishingDate || !req.body.copies) {
		res.status(400).send({message: "Content can not be empty!"});
		return;
	}

  Orders.update(req.body, {  where: { id: req.body.id } })
    .then(num => {
      if (num == 1) { res.send(req.body);} 
	  else {res.send({ message: `Cannot update Orders with id=${req.body.id}. Orders was not found or req.body is empty!` });}
    })
    .catch(err => { res.status(500).send({ message: "Error updating Orders with id=" + req.body.id}); });
}


exports.delete = async (req, res) => {
  const id = req.params.xyz;

  let [delFac] = await Orders.findAll({where: { id: id }});
  
  Orders.destroy({ where: { id: id } })
  .then(num => {
    if (num == 1) { res.send({  message: `Orders was deleted successfully: ${delFac.dataValues.id}`});} 
	else {res.send({ message: `Cannot delete Orders with id=${id}. Maybe Orders was not found!`});}
  })
  .catch(err => { console.log(err); res.status(500).send({ message: "Could not delete Orders with id=" + id});});
};
