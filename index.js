var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;

var pg = require('pg');
pg.defaults.ssl = true;

var Pool = pg.Pool;
var pool = new Pool(config);
var config = {
  database: process.env.DATABASE_URL
};
var total = 0;

var http = require('http').Server(app);
var io = require('socket.io')(http);

process.on('unhandledRejection', function(e) {
  console.log(e.message, e.stack)
})

app.use('/', express.static(path.join(__dirname, '/')));

pool.connect(function(err, client, done) {
  if (err) throw err;
  client.query('SELECT * FROM straighten;')
    .on('row', function(row) {
      total = row.total;
    });
    done();
});

io.on('connection', function(socket){
    io.emit('total', total);
    socket.on('inc', function(msg){
      total++;

      pool.connect(function(err, client, done) {
        if (err) throw err;
        client.query('UPDATE straighten SET total=$1;', [total], function(err) {
          if (err) throw(err);
          done();
        });
      });

      io.emit('total', total);
  });
});

http.listen(port, function () {
  console.log('express listening on port ' + port + '!')
});
