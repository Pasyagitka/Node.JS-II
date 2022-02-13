const db = require("../models");
const Auditorium = db.auditoriums;

exports.findAll = (req, res) => {
    Auditorium.findAll()
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send({message: `${err.message}: ${err.errors[0].message}: ${err.errors[0].value}` || "Some error occurred while retrieving auditoriums." }); });
};

exports.auditoriumsgt60 = (req, res) => {
    Auditorium.scope('auditoriumsgt60').findAll()
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send({message: `${err.message}: ${err.errors[0].message}: ${err.errors[0].value}` || "Some error occurred while retrieving auditoriums (scope)." }); });
}

exports.create = (req, res) => {
	if (!req.body.auditorium) {
		res.status(400).send({ message: "Content can not be empty!"});
		return;
	}

	const auditorium = {
		auditorium : req.body.auditorium,
		auditorium_type: req.body.auditorium_type,
        auditorium_capacity: req.body.capacity
	};
    console.log(auditorium);

	Auditorium.create(auditorium)
    .then((data) => { res.send(data); })
    .catch((err) => { res.status(500).send({message: `${err?.message}: ${err?.errors[0]?.message}: ${err?.errors[0]?.value}` || "Some error occurred while creating the Auditorium."});});
};


exports.update = (req, res) => {
    const auditorium = {
		auditorium : req.body.auditorium,
		auditorium_type: req.body.auditorium_type,
        auditorium_capacity: req.body.capacity
	};
    Auditorium.update(auditorium, { where: { auditorium: req.body.auditorium } })
    .then(num => {
        if (num == 1) {
        res.send(req.body);
        } else {
        res.send({ message: `Cannot update Auditorium with id=${req.body.auditorium}. Auditorium was not found or req.body is empty!` });
        }
    })
    .catch(err => { res.status(500).send({ message: "Error updating Auditorium with id=" + req.body.auditorium}); });
}

exports.delete = async (req, res) => {
  const id = req.params.xyz;

  let [del] = await Auditorium.findAll({where: { auditorium: id }});

  Auditorium.destroy({ where: { auditorium: id } })
  .then(num => {
    if (num == 1) {  res.send({  message: `Auditorium was deleted successfully: ${del.dataValues.auditorium}}`});  } 
    else { res.send({ message: `Cannot delete Auditorium with id=${id}. Maybe Auditorium was not found!`}); }
  })
  .catch(err => { res.status(500).send({ message: "Could not delete Auditorium with id=" + id});});
};

exports.decreaseAudCapacity = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        await Auditorium.update({ auditorium_capacity: 0 }, {  where: {},  transaction: t });
        setTimeout(() => t.rollback(), 10000);
        res.send({  message: "Transaction..."}); 
    } catch (err) {
        await t.rollback();
        res.status(500).send({ message: "Error in transaction"});
    }
};

exports.readDirty = (req, res) => {
    db.sequelize.query(
        `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED; 
        BEGIN TRAN; 
        SELECT * FROM AUDITORIUM; 
        COMMIT TRAN;`
    )
  .then(result => { res.send(result);  })
  .catch(err => { res.status(500).send({ message: "Error in transaction: dirty read"});});
}