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

db.users = connection.define('users', {
    id:	{type: Sequelize.INTEGER, autoIncrement: true, primaryKey:true},
    username: {type: Sequelize.STRING, allowNull:false},
    email: {type: Sequelize.STRING, allowNull:false},
    password: {type: Sequelize.STRING, allowNull:false},
    role: {type: Sequelize.STRING, allowNull:false},
}, {sequelize: connection, modelName: 'users', tableName: 'users', timestamps: false
});

db.repos = connection.define('repos', {
    id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    name: {type: Sequelize.STRING},
    authorId: {type: Sequelize.INTEGER},
}, {sequelize: connection, modelName: 'repos', tableName: 'repos', timestamps: false
});

db.commits = connection.define('commits', {
    id:	{type: Sequelize.INTEGER, autoIncrement: true, primaryKey:true},
    message: {type: Sequelize.STRING, allowNull:false},
    repoId:	{type: Sequelize.INTEGER, allowNull: false},
}, {sequelize: connection, modelName: 'commits', tableName: 'commits', timestamps: false
});

db.users.hasMany(db.repos, {foreignKey: 'authorId'});
db.repos.belongsTo(db.users, {foreignKey: 'authorId'});

db.repos.hasMany(db.commits, {foreignKey: 'repoId'});
db.commits.belongsTo(db.repos, {foreignKey: 'repoId'});

module.exports = db;