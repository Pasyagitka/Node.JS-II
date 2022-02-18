const db = require("../models");
const Products = db.products;

exports.findAll = (req, res) => {
    Products.findAll({raw : true,  nest : true})
    .then(data => {res.render("product", {data}); })
};


exports.create = (req, res) => {
	if (!req.body.name || !req.body.year) {
		res.status(400).send({ message: "Content can not be empty!"});
		return;
	}

	const product = {
		name : req.body.name,
		year: req.body.year,
    productTypeId: req.body.productTypeId
	};

	Products.create(product)
    .then((data) => { res.send(data); })
    .catch((err) => { console.log(err.message); res.status(500).send({message: `${err.message}` || "Some error occurred while creating the Product."});});
};


exports.update = (req, res) => {
    if (!req.body.id || !req.body.name || !req.body.year) {
		res.status(400).send({ message: "Content can not be empty!"});
		return;
	}

    Products.update(req.body, { where: { id: req.body.id } })
    .then(num => {
        if (num == 1) {res.send(req.body); } 
        else { res.send({ message: `Cannot update Product with id=${req.body.id}. Product was not found or req.body is empty!` }); }
    })
    .catch(err => { res.status(500).send({ message: "Error updating Product with id=" + req.body.id}); });
}


exports.delete = async (req, res) => {
  const id = req.params.xyz;

  let [del] = await Products.findAll({where: { id: id }});

  Products.destroy({ where: { id: id } })
  .then(num => {
    if (num == 1) {  res.send({  message: `Product was deleted successfully: ${del.dataValues.id}`});  } 
    else { res.send({ message: `Cannot delete Product with id=${id}. Maybe Product was not found!`}); }
  })
  .catch(err => { res.status(500).send({ message: "Could not delete Product with id=" + id});});
};
