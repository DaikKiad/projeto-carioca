const mysql = require('mysql');

// Configuração da conexão
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
    port: 3306
});

// Conectar ao banco de dados
connection.connect(error => {
    if (error) {
        console.error('Erro ao conectar:', error.stack);
        return;
    }
    console.log('Conectado com o ID ' + connection.threadId);
});

// Dados do usuário
const user = {
    name: 'Renato',
    age: 20,
    email: 'renato@uscs.com'
};

// Inserir o usuário
const query = 'INSERT INTO users SET ?';
connection.query(query, user, (error, results, fields) => {
    if (error) {
        console.error('Erro ao inserir usuário:', error);
        return;
    }
    console.log('Usuário inserido com sucesso! ID:', results.insertId);
});

// Encerrar a conexão
connection.end();
