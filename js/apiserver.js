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

function initMap() {
            const mapOptions = {
                center: { lat: -34.397, lng: 150.644 }, // Coordenadas iniciais do mapa
                zoom: 15, // Nível de zoom inicial
            };
            const map = new google.maps.Map(document.getElementById("map"), mapOptions);

            // Adicione código aqui para configurar a funcionalidade de seleção de lugares próximos.
            // Você pode adicionar marcadores, círculos, etc., para representar lugares próximos e interagir com eles.

            // Exemplo de adição de um marcador:
            const marker = new google.maps.Marker({
                position: { lat: -34.397, lng: 150.644 }, // Coordenadas do marcador
                map: map, // Mapa onde o marcador deve ser exibido
                title: "Lugar de interesse", // Título do marcador
            });

            // Exemplo de pesquisa de lugares próximos:
            const service = new google.maps.places.PlacesService(map);
            service.nearbySearch(
                {
                    location: mapOptions.center,
                    radius: 1000, // Raio de busca em metros
                    type: ["restaurant", "store"], // Tipos de lugares a serem pesquisados
                },
                (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        // Processar os resultados da pesquisa aqui
                    }
                }
            );
        }

        // Chamar a função initMap depois de ter carregado o código da API
        window.addEventListener('load', function () {
            initMap();
        });

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
