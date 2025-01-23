// Importando módulos
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const conexao = require('./Database/database');
const perguntaModel = require('./Model/Perguntas'); 
const usuarioModel = require('./Model/Usuarios'); 
const Resposta = require('./Model/Resposta');
const Usuarios = require('./Model/Usuarios');

const bcrypt = require('bcrypt');

// adicionando a session 
const session = require('express-session');
const crypto = require('crypto');

// Gerar uma chave secreta de 24 bytes
const secretKey = crypto.randomBytes(24).toString('hex');

app.use(session({
    secret: secretKey, // Chave secreta gerada dinamicamente
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000 // 1 hora
    }
}));
app.get('/session', (req, res) => {
    res.json({ usuarioId: req.session.usuarioId });
});



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
    perguntaModel.findAll({raw: true,order:[
        ['id', 'DESC']  // Ordena por id em ordem decrescente
    ]}).then(perguntas =>{
        res.render('index',{            
            perguntas: perguntas
        });        
    })
});
app.get('/perguntas/:id', (req, res) => {
    const id = req.params.id;

    // Buscar a pergunta pelo ID
    perguntaModel.findByPk(id).then((pergunta) => {
        if (pergunta) {
            // Buscar todas as respostas relacionadas à pergunta, incluindo o usuário associado a cada resposta
            Resposta.findAll({
                where: {
                    perguntaId: pergunta.id
                },
                include: [{
                    model: Usuarios,  // Relaciona as respostas aos usuários
                    attributes: ['nome', 'sobrenome']  // Retorna apenas o nome e sobrenome do usuário
                }]
            }).then((respostas) => {
                res.render('perguntas_id', {
                    pergunta: pergunta,
                    respostas: respostas  // Passa as respostas com os dados do usuário
                });
            }).catch((err) => {
                console.log('Erro ao buscar respostas:', err);
                res.redirect('/');
            });
        } else {
            console.log('Pergunta não encontrada');
            res.redirect('/');
        }
    }).catch((error) => {
        console.log('Erro ao buscar pergunta:', error);
        res.redirect('/');
    });
});



app.post('/resposta', (req, res) => {
    console.log('Sessão ativa no POST /resposta:', req.session);
    
    const perguntaId = req.body.pergunta_id;
    const resposta = req.body.resposta;
    const usuario_id = req.session.usuarioId;
    console.log("Pergunta id" + perguntaId);
    console.log("Resposta " + resposta);
    console.log("Usuario_id " + usuario_id);

    Resposta.create({
        perguntaId: perguntaId,
        resposta: resposta,
        usuarioId: usuario_id
    }).then(() => {
        console.log('Resposta salva com sucesso!');
        res.redirect(`/perguntas/${perguntaId}`);
    }).catch((err) => {
        console.log('Erro ao salvar resposta:', err);
        res.redirect(`/perguntas/${perguntaId}`);
    });
    
    

    
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
                
                // Salvar o ID do usuário na sessão
                req.session.usuarioId = usuario.id;

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
