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

app.post('/cadastrar-atendimento', (req, res) => {
    const { descricaoAtendimento, valorAtendimento, idCliente } = req.body;

    const sql = `INSERT INTO ATENDIMENTO (DESCRICAO_ATENDIMENTO, VALOR_ATENDIMENTO, ID_CLIENTE) 
                 VALUES (?, ?, ?)`;

    db.query(sql, [descricaoAtendimento, valorAtendimento, idCliente], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados de atendimento: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao inserir atendimento' });
        }
        console.log('Dados de atendimento inseridos com sucesso.');
        return res.json({ success: true, message: 'Atendimento inserido com sucesso' });
    });
});

// Listar todos os Atendimentos
app.get('/atendimentos', (req, res) => {
    db.query('SELECT * FROM ATENDIMENTO', (err, results) => {
        if (err) {
            console.error('Erro ao buscar atendimentos: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar atendimentos' });
        }
        res.json({ success: true, atendimentos: results });
    });
});

// Obter Atendimento por ID
app.get('/atendimentos/:id', (req, res) => {
    const atendimentoId = req.params.id;
    db.query('SELECT * FROM ATENDIMENTO WHERE ID_ATENDIMENTO = ?', atendimentoId, (err, results) => {
        if (err) {
            console.error('Erro ao buscar atendimento: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar atendimento' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Atendimento não encontrado' });
        }
        res.json({ success: true, atendimento: results[0] });
    });
});

// Atualizar Atendimento por ID
app.put('/atendimentos/:id', (req, res) => {
    const atendimentoId = req.params.id;
    const { descricaoAtendimento, valorAtendimento, idCliente } = req.body;

    db.query('UPDATE ATENDIMENTO SET DESCRICAO_ATENDIMENTO = ?, VALOR_ATENDIMENTO = ?, ID_CLIENTE = ? WHERE ID_ATENDIMENTO = ?',
        [descricaoAtendimento, valorAtendimento, idCliente, atendimentoId], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar atendimento: ' + err);
                return res.status(500).json({ success: false, message: 'Erro ao atualizar atendimento' });
            }
            res.json({ success: true, message: 'Atendimento atualizado com sucesso' });
        });
});

// Excluir Atendimento por ID
app.delete('/atendimentos/:id', (req, res) => {
    const atendimentoId = req.params.id;

    db.query('DELETE FROM ATENDIMENTO WHERE ID_ATENDIMENTO = ?', atendimentoId, (err, result) => {
        if (err) {
            console.error('Erro ao excluir atendimento: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir atendimento' });
        }
        res.json({ success: true, message: 'Atendimento excluído com sucesso' });
    });
});
