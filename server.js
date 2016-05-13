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
bar.mass = bar.length * bar.width * bar.width;
bar.com = bar.length / 2;
bar.pivotPoint = 280; 
bar.angle = 0; // goes +/- pi/2 radians
bar.angularVelocity = 0;
bar.angularAcceleration = 0;
bar.torque = 0;
var moment = 1 / 12 * bar.mass * bar.length * bar.length;
moment += bar.mass * bar.length * bar.length;
// moment might be calculated incorrectly... for the purposes of this game.
bar.moment = moment;

var game = {};
game.players = players;
game.bar = bar;
game.gravity = gravity;

var movingPlayers = {};

server.listen(port, function () {
  console.log('Server listening at port ' + port);
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/gd', function(req, res){
	res.send(game);
});

io.on('connection', function (socket) {
	console.log('Someone joined the party!');

	socket.id = shortid.generate();
	game.players[socket.id] = {};
	game.players[socket.id].position = bar.length / 2;
	game.players[socket.id].mass = 50000;
	// game.players[socket.id].velocity = 0;
	// game.players[socket.id].acceleration = 0;

	socket.on('disconnect', function(){
    	console.log('Someone left the party.');
    	delete game.players[socket.id];
	});

	socket.on('move', function(direction) {
		movingPlayers[socket.id] = direction;
	});

	socket.on('stop move', function() {
		delete movingPlayers[socket.id];
	});

	io.emit('updateData', game);

});

var recalculate = function() {
	// calculate torque on the bar
	// angular acceleration of the bar
	// angular velocity of the bar
	// move the damn bar
	// calculate forces on each block (applied force from player, gravity, friction)
	// move each damn block.

	var torque = 0;
	for(block in game.players){
		var displacement = game.players[block].position - bar.pivotPoint; // dist from pivot -> + - <-
		var currentTorque = game.players[block].mass * gravity * Math.cos(bar.angle) * displacement;
		torque += currentTorque;
	}
	var barDisplacement = bar.length / 2 - bar.pivotPoint;
	var barTorque = bar.mass * gravity * Math.cos(bar.angle) * barDisplacement;
	torque += barTorque;
	bar.torque = torque;
	var additionalMoment = 0;
	for(block in game.players){
		var disp = game.players[block].position - game.bar.pivotPoint;
		additionalMoment += disp * disp * game.players[block].mass;
	}
	bar.angularAcceleration = bar.torque / (bar.moment + additionalMoment);
	bar.angularVelocity += bar.angularAcceleration;
	bar.angle += bar.angularVelocity;

	if(bar.angle > 1.5 || bar.angle < -1.5){
		bar.angle = 0;
		bar.angularAcceleration = 0;
		bar.angularVelocity = 0;
	}

	for(block in movingPlayers){
		game.players[block].position += movingPlayers[block] * 10;
	}

	io.emit('updateData', game);
};

setInterval(recalculate, 34);

