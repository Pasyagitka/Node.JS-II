const Sequelize = require("sequelize");
const connection = new Sequelize("Node.js14", "Node.JS", "node", {dialect: "mssql", host: "localhost",  pool: { max: 5, min: 0, idle: 10000 }})
const db = {};

db.Sequelize = Sequelize;
db.sequelize = connection;

db.faculties = connection.define("faculty", {
        faculty: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
        faculty_name: {type: Sequelize.STRING, allowNull:false}
    }, {sequelize: connection, modelName: 'Faculty', tableName: 'Faculty', timestamps: false
});
db.faculties.addHook('beforeCreate', (attr, options) => {
    console.log('Trying to create a faculty...');
    // console.log('attr', attr);
    // console.log('options', options);
});
db.faculties.addHook('afterCreate', (attr, options) => {
    console.log('New faculty created');
});

db.pulpits = connection.define("pulpit", {
    pulpit: {type: Sequelize.STRING, primaryKey: true},
    pulpit_name: {type: Sequelize.STRING, allowNull: false}
}, {
    sequelize: connection, tableName: 'Pulpit', modelName: 'Pulpit', timestamps: false
});

db.faculties.hasMany(db.pulpits, {
    as: 'faculty_pulpits',
    foreignKey: 'faculty'
});
db.pulpits.belongsTo(db.faculties, {
    as: 'pulpits_faculty',
    foreignKey: 'faculty',
    onDelete: 'SET NULL'
});

db.subjects = connection.define("subject", {
    subject: {type: Sequelize.STRING, primaryKey: true},
    subject_name: {type: Sequelize.STRING, allowNull: false}
}, {
    sequelize: connection, tableName: 'Subject', modelName: 'Subject', timestamps: false
});
db.pulpits.hasMany(db.subjects, {
    as: 'pulpit_subjects',
    foreignKey: 'pulpit'
});
db.subjects.belongsTo(db.pulpits, {
    as: 'subjects_pulpit',
    foreignKey: 'pulpit',
    onDelete: 'SET NULL'
});

db.teachers = connection.define("teacher", {
    teacher: {type: Sequelize.STRING, primaryKey: true},
    teacher_name: {type: Sequelize.STRING, allowNull: false},
    gender: {type: Sequelize.STRING, allowNull: false}
}, {
    sequelize: connection, tableName: 'Teacher', modelName: 'Teacher', timestamps: false
});
db.pulpits.hasMany(db.teachers, {
    as: 'pulpit_teachers',
    foreignKey: 'pulpit'
});
db.teachers.belongsTo(db.pulpits, {
    as: 'teachers_pulpit',
    foreignKey: 'pulpit',
    onDelete: 'SET NULL'
});

db.auditoriums = connection.define("auditorium", {
    auditorium: {type: Sequelize.STRING, primaryKey: true},
    auditorium_capacity: {type: Sequelize.STRING, allowNull: false}
}, {
    sequelize: connection, tableName: 'Auditorium', modelName: 'Auditorium', timestamps: false
});
db.auditoriums.addScope('auditoriumsgt60', {
    where: {
        auditorium_capacity: {
            [Sequelize.Op.gt]: 60
        }
    }
});

db.auditoriumtypes = connection.define("auditoriumtype", {
    auditorium_type: {type: Sequelize.STRING, primaryKey: true},
    auditorium_typename: {type: Sequelize.STRING, allowNull: false}
}, {
    sequelize: connection, tableName: 'Auditorium_type', modelName: 'Auditorium_type', timestamps: false
});
db.auditoriumtypes.hasMany(db.auditoriums, {
    as: 'auditorium_types',
    foreignKey: 'auditorium_type'
});
db.auditoriums.belongsTo(db.auditoriumtypes, {
    as: 'aud_type',
    foreignKey: 'auditorium_type',
    onDelete: 'SET NULL'
});


module.exports = db;