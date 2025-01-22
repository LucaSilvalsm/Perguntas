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
    
  res.render('perguntas');
})

app.listen(8080,()=>{console.log('App rodando')})