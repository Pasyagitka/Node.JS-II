const Sequelize = require('sequelize');
require('dotenv').config();


const connection = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    pool: { max: 5, min: 0, idle: 10000 },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = connection;

db.users = connection.define("users", {
    id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    login: {type: Sequelize.STRING},
    password: {type: Sequelize.STRING}
}, {sequelize: connection, modelName: 'users', tableName: 'trusted22', timestamps: false
});

module.exports = db;