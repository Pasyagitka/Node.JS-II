const fs = require('fs');
const path = require('path');

exports.findAll = (req, res) => {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')));
    res.json({data});
};

exports.create = (req, res) => {
    console.log(req.body.record)
	if (req.body.record.length === 0) {
        res.json("error");
        return;
	}
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')));

    let [name, number] = req.body.record.split(',');

	let newRecord = {
		name : name,
		number: number.trim(),
	};

    data.push(newRecord);
    let jsonData = JSON.stringify(data)
    fs.writeFileSync(path.join(__dirname, '../data.json'), jsonData)

    res.json('ok');
};

exports.update = (req, res) => {
	if (req.body.record.length === 0) {
        res.json("error");
        return;
	}
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')));


    let [name, number] = req.body.record.split(',');

	let newRecord = {
		name : name,
		number: number.trim(),
	};

    data.map((x) => {
        if (x.name === req.body.oldName) {
            x.name = newRecord.name;
            x.number = newRecord.number;
        }
    })
    let jsonData = JSON.stringify(data)
    fs.writeFileSync(path.join(__dirname, '../data.json'), jsonData)

    res.json('ok');
};


exports.delete = (req, res) => {

    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')));

    data = data.filter((x) => x.name !== req.query.name);

    let jsonData = JSON.stringify(data);
    fs.writeFileSync(path.join(__dirname, '../data.json'), jsonData);

    res.json('ok');
};
