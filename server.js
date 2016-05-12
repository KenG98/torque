var shortid = require('shortid');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;

var user_positions = {};

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
	user_positions[socket.id] = [0, 0];

	socket.on('disconnect', function(){
    	console.log('Someone left the party.');
    	delete user_positions[socket.id];
	});

	socket.on('position change', function(movement){
		user_positions[socket.id][0] = user_positions[socket.id][0] + movement[0];
		user_positions[socket.id][1] = user_positions[socket.id][1] + movement[1];
		io.emit('redraw', user_positions);
	})

	io.emit('redraw', user_positions);
});
