var express = require('express');
var app = express();

const port = 3000;

app.get('/hello', (req, res) => {
  res.send('hello world');
});

/*
Crud Usuarios
get /usuarios - retorna os usuarios
get /usuario/id - retorna um usuario por id
post /usuarios - coloca um usuario novo
put /usuarios/id - atualiza um usuario pelo id
delete /usuarios/id - remover um usuario pelo id
*/

const usuarios = [
  "Primeiro usuario",
  "Segundo usuario"
];

/* get /usuarios - retorna os usuarios */
app.get('/usuarios', (req, res) => {
  res.send(usuarios);
});

/*get /usuario/id - retorna um usuario por id */
app.get('/usuarios/:id', (req, res) => {
  const id = req.params.id - 1,
  const mensagem = [id];
});

app.listen(port, function(){
    console.info(`App rodando em http://localhost:${port}`);
});