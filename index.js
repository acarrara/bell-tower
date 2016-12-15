var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;

app.post('/inc', function(req, res) {
    console.log('inc!');
    res.sendStatus(200);
});

app.use('/', express.static(path.join(__dirname, '/')));

app.listen(port, function () {
  console.log('express listening on port ' + port + '!')
})