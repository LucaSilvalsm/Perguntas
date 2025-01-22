const Sequelize = require('sequelize');
const banco = require('../Database/database');

const Perguntas = banco.define('Pergunta',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});
Perguntas.sync({force:false}).then(()=>{
    console.log('Tabela Pergunta criada com sucesso!');
})

module.exports = Perguntas;