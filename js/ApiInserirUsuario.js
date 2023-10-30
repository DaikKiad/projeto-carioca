const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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
app.post('/enviar-dados', (req, res) => {
    const { Nome, Sobrenome, Idade, CPF, Email, Endereço, Usuário, Senha } = req.body;
    
    // Insira os dados no banco de dados
    const sql = 'INSERT INTO usuario (Nome, Sobrenome, Idade, CPF, Email, Endereço, Usuário, Senha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [Nome, Sobrenome, Idade, CPF, Email, Endereço, Usuário, Senha], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados: ' + err);
            return res.status(500).send('Erro ao processar a solicitação.');
        }
        console.log('Dados inseridos com sucesso.');
        return res.status(200).send('Dados inseridos com sucesso.');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express ouvindo na porta ${PORT}`);
});
