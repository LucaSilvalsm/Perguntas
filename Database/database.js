const Sequelize = require('sequelize');

const conectar = new Sequelize('Perguntas','postgres','102030',{
    host: 'localhost',
    dialect:'postgresql',
    port: 5432
});

module.exports = conectar;