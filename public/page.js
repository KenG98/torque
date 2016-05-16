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
	canv.stroke();
	canv.moveTo(0, 0);
}

function drawBlock(pivotX, pivotY, pivotPoint, position, angle) {
	var distanceFromPiv = position - pivotPoint;
	var x = pivotX + Math.cos(angle) * distanceFromPiv;
	var y = pivotY + Math.sin(angle) * distanceFromPiv;
	drawCircle(x, y, 10);
}

var redraw = function(){
	canv.clearRect(0, 0, width, height);
	drawCircle(pivX, pivY, 4);
	drawRod(pivX, pivY, gameData.bar.pivotPoint, gameData.bar.length, gameData.bar.angle);
	for(block in gameData.players){
		if(block == uid){
			canv.strokeStyle = "#ff1a1a";
		} else {
			canv.strokeStyle = "#0000FF";
		}
		drawBlock(pivX, pivY, gameData.bar.pivotPoint, gameData.players[block].position, gameData.bar.angle);
	}
	canv.strokeStyle="#000000";

	canv.font = "30px Arial";
	canv.fillStyle = "white";
	canv.textAlign = "center";
	canv.fillText("Hello Physics Nerds!", midwidth, 100);
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
