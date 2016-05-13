var shortid = require('shortid');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;

var players = {};

var gravity = 10;

var bar = {};
bar.length = 600;
bar.width = 10;
bar.com = bar.length / 2;
bar.pivotPoint = 280; 
bar.angle = 0; // goes +/- 80 degrees

var game = {};
game.players = players;
game.bar = bar;
game.gravity = gravity;

server.listen(port, function () {
  console.log('Server listening at port ' + port);
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	console.log('Someone joined the party!');

	socket.id = shortid.generate();

	socket.on('disconnect', function(){
    	console.log('Someone left the party.');
	});

	io.emit('updateDate', game);

});
