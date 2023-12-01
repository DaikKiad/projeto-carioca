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

app.post('/cadastrar-veiculo', (req, res) => {
    const { tipoVeiculo, modeloVeiculo, placaVeiculo } = req.body;

    const sql = `INSERT INTO VEICULO_CLIENTE (TIPO_VEICULO, MODELO_VEICULO, PLACA_VEICULO) 
                 VALUES (?, ?, ?)`;

    db.query(sql, [tipoVeiculo, modeloVeiculo, placaVeiculo], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados de veículo: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao inserir veículo' });
        }
        console.log('Dados de veículo inseridos com sucesso.');
        return res.json({ success: true, message: 'Veículo inserido com sucesso' });
    });
});

// Listar todos os Veículos
app.get('/veiculos', (req, res) => {
    db.query('SELECT * FROM VEICULO_CLIENTE', (err, results) => {
        if (err) {
            console.error('Erro ao buscar veículos: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar veículos' });
        }
        res.json({ success: true, veiculos: results });
    });
});

// Obter Veículo por ID
app.get('/veiculos/:id', (req, res) => {
    const veiculoId = req.params.id;
    db.query('SELECT * FROM VEICULO_CLIENTE WHERE ID_VEICULO_CADASTRADO = ?', veiculoId, (err, results) => {
        if (err) {
            console.error('Erro ao buscar veículo: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar veículo' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Veículo não encontrado' });
        }
        res.json({ success: true, veiculo: results[0] });
    });
});

// Atualizar Veículo por ID
app.put('/veiculos/:id', (req, res) => {
    const veiculoId = req.params.id;
    const { tipoVeiculo, modeloVeiculo, placaVeiculo } = req.body;

    db.query('UPDATE VEICULO_CLIENTE SET TIPO_VEICULO = ?, MODELO_VEICULO = ?, PLACA_VEICULO = ? WHERE ID_VEICULO_CADASTRADO = ?',
        [tipoVeiculo, modeloVeiculo, placaVeiculo, veiculoId], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar veículo: ' + err);
                return res.status(500).json({ success: false, message: 'Erro ao atualizar veículo' });
            }
            res.json({ success: true, message: 'Veículo atualizado com sucesso' });
        });
});

// Excluir Veículo por ID
app.delete('/veiculos/:id', (req, res) => {
    const veiculoId = req.params.id;

    db.query('DELETE FROM VEICULO_CLIENTE WHERE ID_VEICULO_CADASTRADO = ?', veiculoId, (err, result) => {
        if (err) {
            console.error('Erro ao excluir veículo: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir veículo' });
        }
        res.json({ success: true, message: 'Veículo excluído com sucesso' });
    });
});
