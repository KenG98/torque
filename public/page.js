var socket = io();

var canvas = $('#c')[0];
canvas.width = $('body').width();
canvas.height = $('body').height();

var width = $('body').width();
var height = $('body').height();
var midwidth = width / 2;
var midheight = height / 2;

var uid;

var canv = canvas.getContext("2d");

var gameData = {};
var pivX, pivY;

socket.on('updateData', function(data){
	gameData = data;
});

socket.on('uid', function(id){
	uid = id;
})

function drawCircle(x, y, radius) {
	canv.beginPath();
	canv.arc(x, y, radius, 0, 6.28);
	canv.lineWidth = 3;
	canv.stroke();
}

function drawRod(pivotX, pivotY, pivotPoint, length, angle) {
	var leftLen = pivotPoint;
	var rightLen = length - pivotPoint;
	var leftX = pivotX - Math.cos(angle) * leftLen;
	var leftY = pivotY - Math.sin(angle) * leftLen;
	var rightX = pivotX + Math.cos(angle) * rightLen;
	var rightY = pivotY + Math.sin(angle) * rightLen;
	canv.moveTo(leftX, leftY);
	canv.lineTo(rightX, rightY);
	canv.lineWidth= 4;
	canv.stroke();
	canv.moveTo(0, 0);
}

function drawBlock(pivotX, pivotY, pivotPoint, position, angle, radius) {
	var distanceFromPiv = position - pivotPoint;
	var x = pivotX + Math.cos(angle) * distanceFromPiv;
	var y = pivotY + Math.sin(angle) * distanceFromPiv;
	drawCircle(x, y, radius);
}

function round(num){
	return Math.round(num * 1000) / 1000;
}

var redraw = function(){
	canv.clearRect(0, 0, width, height);
	drawCircle(pivX, pivY, 4);
	drawRod(pivX, pivY, gameData.bar.pivotPoint, gameData.bar.length, gameData.bar.angle);
	for(block in gameData.players){
		if(block == uid){
			canv.strokeStyle = "#FB2B2B";
		} else {
			canv.strokeStyle = "#0000FF";
		}
		var radius = gameData.players[block].mass / 600;
		// radius = Math.cbrt(radius);
		drawBlock(pivX, pivY, gameData.bar.pivotPoint, gameData.players[block].position, gameData.bar.angle, radius);
	}
	canv.strokeStyle="#000000";

	canv.font = "40px Arial";
	canv.fillStyle = "white";
	canv.fillText("Welcome to Torque!", 30, 50);
	canv.font = "20px Arial";
	canv.fillText("Balance the bar.", 30, 80);
	canv.fillText("You're red. Others are blue.", 30, 110);
	canv.fillText("Players: " + Object.keys(gameData.players).length, width - 200, 50);
	canv.fillText("Angle: " + round(gameData.bar.angle), width - 200, 80);
	canv.fillText("Velocity: " + round(gameData.bar.angularVelocity), width - 200, 110);
	canv.fillText("Acceleration: " + round(gameData.bar.angularAcceleration), width - 200, 140);
	canv.fillText("Torque: " + Math.round(gameData.bar.torque), width - 200, 170);
}

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        socket.emit('move', -1);
        break;

        case 39: // right
        socket.emit('move', 1);
        break;

        default: 
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$(document).keyup(function(e) {
    switch(e.which) {
        case 37: // left
        socket.emit('stop move');
        break;

        case 39: // right
        socket.emit('stop move');
        break;

        default: 
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

gameData = $.ajax({
        url: '/gd',
        success: function (result) {
            gameData = result;
            pivX = (gameData.bar.pivotPoint - gameData.bar.length / 2) + midwidth;
			pivY = midheight;
            window.setInterval(redraw, 34);
        },
        async: true
    });
