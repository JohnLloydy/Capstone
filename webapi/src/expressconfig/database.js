const Sequelize = require('sequelize');


module.exports = new Sequelize(global.gConfig.database, global.gConfig.username, global.gConfig.password, {
    host: global.gConfig.host,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});