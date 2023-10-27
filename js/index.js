var express = require('express');
var app = express();

const port = 3000;

app.set('/hello', (req, res) => {
  res.send('hello world');
});

app.listen(port, function(){
    console.info(`App rodando em http://localhost:${port}`);
});