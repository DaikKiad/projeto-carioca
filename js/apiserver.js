const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Conectar ao banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projeto_carioca',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados');
});

// Rota para receber os dados do formulário
app.post('/enviar-dados', upload.array('fileFieldName'), (req, res) => {
    const { Nome, Sobrenome, Idade, CPF, Email, Endereco, Usuario, Senha } = req.body;

    console.log(req.body);
    console.log(req.files);

    // Insira os dados no banco de dados
    const sql = 'INSERT INTO usuario (Nome, Sobrenome, Idade, CPF, Email, Endereco, Usuario, Senha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [Nome, Sobrenome, Idade, CPF, Email, Endereco, Usuario, Senha], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao inserir usuário' });
        }
        console.log('Dados inseridos com sucesso.');
        return res.json({ success: true, message: 'Usuário inserido com sucesso' });
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express ouvindo na porta ${PORT}`);
});
