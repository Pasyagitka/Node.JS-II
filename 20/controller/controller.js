const fs = require('fs');
const path = require('path');

exports.findAll = (req, res) => {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')));
    res.render("main",  {data})
};

exports.add = (req,res) => {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')));
    res.render("add",  {data})
}

exports.upd = (req,res) => {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')));
    let forUpdate = data.filter((x) => x.name === req.params.name)[0];
    res.render("update",  {data, forUpdate})
}

exports.create = (req, res) => {
    console.log(req.body.record)
	if (req.body.record.length === 0) {
        res.render("error");
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

    res.redirect('/');
};

exports.update = (req, res) => {
	if (req.body.record.length === 0) {
        res.render("error");
        return;
	}
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')));


    let [name, number] = req.body.record.split(',');

	let newRecord = {
		name : name,
		number: number.trim(),
	};

    data.map((x) => {
        if (x.name === req.params.name) {
            x.name = newRecord.name;
            x.number = newRecord.number;
        }
    })
    let jsonData = JSON.stringify(data)
    fs.writeFileSync(path.join(__dirname, '../data.json'), jsonData)

    res.redirect('/');
};


exports.delete = (req, res) => {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')));

    data = data.filter((x) => x.name !== req.params.name);

    let jsonData = JSON.stringify(data);
    fs.writeFileSync(path.join(__dirname, '../data.json'), jsonData);

    res.redirect('/');
};
