const Sequelize = require('sequelize');
const banco = require('../Database/database');
const Usuarios = require('./Usuarios');  // Importando o modelo de Usuários

const Resposta = banco.define('resposta', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    perguntaId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Pergunta',
            key: 'id'
        },
        allowNull: false
    },
    usuarioId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Usuarios',
            key: 'id'
        },
        allowNull: false
    },
    resposta: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// Relacionamento de Resposta com Usuario
Resposta.belongsTo(Usuarios, { foreignKey: 'usuarioId' });

Resposta.sync({ force: false }).then(() => {
    console.log('Tabela Resposta criada com sucesso!');
});

module.exports = Resposta;
