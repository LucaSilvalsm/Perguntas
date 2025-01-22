const express = require('express');
const app = express();

// Setando o Express para usar o EJS
app.set('view engine', 'ejs');
// Setando arquivos estaticos como CSS

app.use(express.static('public'));

// rota principal

app.get('/', (req, res) => {

    res.render('index');
});
app.get('/perguntas', (req, res) => {
    console.log("Acessando a rota das perguntas")
    res.render('perguntas');
})

app.get('/cadastro', (req, res) => {
    console.log("Acessando a rota do cadastro")
    res.render('cadastro');
})
app.listen(8080, () => { console.log('App rodando') })