var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;

var Pool = require('pg-pool');
const url = require('url');

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};
 
var pool = new Pool(config);

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
