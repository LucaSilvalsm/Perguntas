const express = require('express');
const app = express();

// Setando o Express para usar o EJS
app.set('view engine', 'ejs');

// rota principal

app.get('/', (req, res) => {
    let nome = "Lucas Moreira"
    let skills = "Desenvolvedor Backend com Python, Node e PHP"
  res.render('index', {nome: nome, skills: skills});
});
app.get('/teste', (req,res) => {
    res.render('teste');
});

app.listen(8080,()=>{console.log('App rodando')})