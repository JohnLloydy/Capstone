const Sequelize = require('sequelize');
const db = require('../expressconfig/database');
const bcrypt = require('bcrypt');

const Role = db.define('roles', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    hooks: {
       
    }
});

module.exports = Role;