// Importando módulos
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const conexao = require('./Database/database');
const perguntaModel = require('./Model/Perguntas'); 
const usuarioModel = require('./Model/Usuarios'); 
const bcrypt = require('bcrypt');


// Número de "salts" (quanto maior, mais seguro, mas também mais lento)
const saltRounds = 10;
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
app.get('/login', (req, res) => {
    console.log("Acessando a rota do cadastro");
    res.render('login');
});


// Pegando os dados
app.post('/process_forms', (req, res) => {
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;
    console.log(titulo);
    console.log(descricao);
    perguntaModel.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        console.log('Pergunta criada com sucesso!');
        res.redirect('/perguntas');
    })
   
});

// Rota para criar usuário e criptografar a senha
app.post('/criando_usuario', async (req, res) => {
    let nome = req.body.nome;
    let sobrenome = req.body.sobrenome;
    let email = req.body.email;
    let senha = req.body.senha;
    let confirma_senha = req.body.confirma_senha;

    if (senha !== confirma_senha) {
        console.log('Senhas não conferem');
        res.redirect('/cadastro');
        return;
    } else {
        // Criptografando a senha
        try {
            const hashedPassword = await bcrypt.hash(senha, saltRounds);

            // Salvando no banco com a senha criptografada
            usuarioModel.create({
                nome: nome,
                sobrenome: sobrenome,
                email:email,
                senha: hashedPassword
            }).then(() => {
                console.log('Usuário criado com sucesso!');
                res.redirect('/');
            });

        } catch (error) {
            console.log('Erro ao criptografar a senha', error);
            res.redirect('/cadastro');
        }
    }
});
// Rota para fazer login e verificar a senha
app.post('/process_login', async (req, res) => {
    let email = req.body.email;
    let senha = req.body.senha;

    // Buscar o usuário no banco de dados
    usuarioModel.findOne({ where: { email: email } }).then(async (usuario) => {
        if (!usuario) {
            console.log('Usuário não encontrado');
            res.redirect('/login');
            return;
        }

        // Comparando a senha informada com a senha criptografada no banco
        try {
            const match = await bcrypt.compare(senha, usuario.senha);

            if (match) {
                console.log('Login bem-sucedido');
                res.redirect('/');
            } else {
                console.log('Senha incorreta');
                res.redirect('/login');
            }
        } catch (error) {
            console.log('Erro ao verificar a senha', error);
            res.redirect('/login');
        }
    }).catch((error) => {
        console.log('Erro ao buscar usuário', error);
        res.redirect('/login');
    });
});
app.listen(8080, () => {
    console.log('App rodando');
});
