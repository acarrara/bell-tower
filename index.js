var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;

var total = 0;

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/', express.static(path.join(__dirname, '/')));

io.on('connection', function(socket){
    io.emit('total', total);
    socket.on('inc', function(msg){
      total++;
      io.emit('total', total);
  });
});

http.listen(port, function () {
  console.log('express listening on port ' + port + '!')
})