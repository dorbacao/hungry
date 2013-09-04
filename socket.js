var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')

var id = 0;
var express = require('express');

app.listen(8082);

var listaVersao = [];

var addVersao = function(itemVersao){
  id = id + 1;
  itemVersao.id = id;
  listaVersao.push(itemVersao);  
}

function handler (req, res) {
	console.log(req.url);

  fs.readFile(__dirname + req.url,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}


io.sockets.on('connection', function (socket) {

  socket.on('newPosition', function (data) {

    socket.broadcast.emit('atualizarPosicao', data);
    console.log(data);
    
  });


});