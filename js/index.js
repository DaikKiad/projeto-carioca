var express = require('express');
var app = express();

const port = 3000;

// respond with "hello world" when a GET request is made to the homepage
app.get('/hello', (req, res) => {
  res.send('hello world');
});

app.listen(port, function(){
    console.info(`App rodando em http://localhost:${port}`);
});