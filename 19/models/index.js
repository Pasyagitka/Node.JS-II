const Sequelize = require("sequelize");
const connection = new Sequelize("PublishingCompany", "Node.JS", "node", {
	dialect: "mssql",
	host: "localhost",
	pool: { max: 5, min: 0, idle: 10000 },
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = connection;

db.orders = connection.define("orders", {
        id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        orderDate: {type: Sequelize.DATE, allowNull:false},
        publishingDate: {type: Sequelize.DATE, allowNull:false},
        copies: {type: Sequelize.INTEGER, allowNull:false}
    }, {sequelize: connection, modelName: 'Orders', tableName: 'Orders', timestamps: false
});

db.redactors = connection.define("redactors", {
    id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    surname: {type: Sequelize.STRING, allowNull: false},
    firstName: {type: Sequelize.STRING, allowNull: true}
}, {
    sequelize: connection, tableName: 'Redactors', modelName: 'Redactors', timestamps: false
});
db.redactors.hasMany(db.orders, {
    as: 'redactors_orders',
    foreignKey: 'redactorId'
});
db.orders.belongsTo(db.redactors, {
    as: 'orders_redactor',
    foreignKey: 'redactorId',
    onDelete: 'SET NULL'
});


db.clients = connection.define("clients", {
    id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    surname: {type: Sequelize.STRING, allowNull: true},
    firstName: {type: Sequelize.STRING, allowNull: true},
    company: {type: Sequelize.STRING, allowNull: true},
    email: {type: Sequelize.STRING, allowNull: true}
}, {
    sequelize: connection, tableName: 'Clients', modelName: 'Clients', timestamps: false, hasTrigger: true
});
db.clients.hasMany(db.orders, {
    as: 'client_orders',
    foreignKey: 'clientId'
});
db.orders.belongsTo(db.clients, {
    as: 'orders_client',
    foreignKey: 'clientId',
    onDelete: 'SET NULL'
});

db.products = connection.define("products", {
    id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    name: {type: Sequelize.STRING, primaryKey: false},
    year: {type: Sequelize.DATE, allowNull: false},
}, {
    sequelize: connection, tableName: 'Products', modelName: 'Products', timestamps: false
});
db.products.hasMany(db.orders, {
    as: 'product_orders',
    foreignKey: 'productId'
});
db.orders.belongsTo(db.products, {
    as: 'orders_product',
    foreignKey: 'productId',
    onDelete: 'SET NULL'
});


db.producttypes = connection.define("producttypes", {
    id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true,  autoIncrement: true},
    type: {type: Sequelize.STRING, allowNull: false},
    pricePerPiece: {type: Sequelize.INTEGER, allowNull: false}
}, {
    sequelize: connection, tableName: 'ProductTypes', modelName: 'ProductTypes', timestamps: false
});
db.producttypes.hasMany(db.products, {
    as: 'producttypes',
    foreignKey: 'productTypeId'
});
db.products.belongsTo(db.producttypes, {
    as: 'product_type',
    foreignKey: 'productTypeId',
    onDelete: 'SET NULL'
});


module.exports = db;