const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.post('/autenticar-usuario', (req, res) => {
    const { Usuario, Senha } = req.body;

    const sql = 'SELECT * FROM usuario WHERE Usuario = ?';
    db.query(sql, [Usuario], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados: ' + err);
            return res.status(500).json({ success: false, message: 'Erro na autenticação' });
        }

        if (results.length === 1) {
            const user = results[0];

            bcrypt.compare(senhaLogin, senhaHash, (bcryptErr, bcryptRes) => {
                if (bcryptErr) {
                    console.error('Erro ao comparar senhas: ' + bcryptErr);
                    return res.status(500).json({ success: false, message: 'Erro na autenticação' });
                }

                if (bcryptRes) {
                    return res.json({ success: true, message: 'Usuário autenticado com sucesso' });
                } else {
                    return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
                }
            });
        } else {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor de autenticação ouvindo na porta ${PORT}`);
});
