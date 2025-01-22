// Importando módulos
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const conexao = require('./Database/database');

// Conectando no banco 
conexao.authenticate().then(() => {
    console.log('Conexão bem-sucedida');
}).catch((msgError) => {
    console.log(msgError);
});

// Pegando os dados usando o BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// Setando o Express para usar o EJS
app.set('view engine', 'ejs');

// Setando arquivos estáticos como CSS
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/perguntas', (req, res) => {
    console.log("Acessando a rota das perguntas");
    res.render('perguntas');
});

app.get('/cadastro', (req, res) => {
    console.log("Acessando a rota do cadastro");
    res.render('cadastro');
});

// Pegando os dados
app.post('/process_forms', (req, res) => {
    let titulo = req.body.titulo;
    let pergunta = req.body.pergunta;
    console.log(titulo);
    console.log(pergunta);
    res.send('Recebemos os dados');
});

app.listen(8080, () => {
    console.log('App rodando');
});
