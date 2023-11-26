const http = require('http');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'PARKEASY',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados');
});

app.post('/cadastrar-usuario', upload.array('fileFieldName'), (req, res) => {
    const { Nome, Sexo, Senha, CPF, Email, Saldo, InicioCadastro } = req.body;

    console.log(req.body);
    console.log(req.files);

    const sql = `INSERT INTO CONTA_CLIENTE (NOME_CLIENTE, SEXO, SENHA, CPF, EMAIL_CLIENTE, SALDO_CLIENTE, INICIO_CADASTRO)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [Nome, Sexo, Senha, CPF, Email, Saldo, InicioCadastro], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao inserir usuário' });
        }
        console.log('Dados inseridos com sucesso.');
        return res.json({ success: true, message: 'Usuário inserido com sucesso' });
    });
});

app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuario', (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar usuários' });
        }
        res.json({ success: true, usuarios: results });
    });
});

app.get('/usuarios/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM usuario WHERE id = ?', userId, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar usuário' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        res.json({ success: true, usuario: results[0] });
    });
});

app.put('/usuarios/:id', (req, res) => {
    const userId = req.params.id;
    const { Nome, Sobrenome, Idade, CPF, Email, Endereco, Usuario } = req.body;

    db.query('UPDATE usuario SET Nome = ?, Sobrenome = ?, Idade = ?, CPF = ?, Email = ?, Endereco = ?, Usuario = ? WHERE id = ?',
        [Nome, Sobrenome, Idade, CPF, Email, Endereco, Usuario, userId], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar usuário: ' + err);
                return res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
            }
            res.json({ success: true, message: 'Usuário atualizado com sucesso' });
        });
});

app.delete('/usuarios/:id', (req, res) => {
    const userId = req.params.id;

    db.query('DELETE FROM usuario WHERE id = ?', userId, (err, result) => {
        if (err) {
            console.error('Erro ao excluir usuário: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir usuário' });
        }
        res.json({ success: true, message: 'Usuário excluído com sucesso' });
    });
});

app.post('/login-usuario', (req, res) => {
    const { Usuario, Senha } = req.body;

    const data = JSON.stringify({ Usuario, Senha });

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/autenticar-usuario',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
        },
    };

    const request = http.request(options, response => {
        let responseData = '';

        response.on('data', chunk => {
            responseData += chunk;
        });

        response.on('end', () => {
            const data = JSON.parse(responseData);

            if (data.success) {
                res.json({ success: true, message: 'Usuário autenticado com sucesso' });
            } else {
                res.status(401).json({ success: false, message: 'Credenciais inválidas' });
            }
        });
    });

    request.write(data);
    request.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express ouvindo na porta ${PORT}`);
});
