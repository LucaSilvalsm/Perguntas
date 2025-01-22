const Sequelize = require('sequelize');
const banco = require('../Database/database');

const Usuarios = banco.define('Usuarios',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sobrenome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false
    }
});
Usuarios.sync({force:false}).then(()=>{
    console.log('Tabela Usuario criada com sucesso!');
})
module.exports = Usuarios