var socket = io();

var canvas = $('#c')[0];

var canv = canvas.getContext("2d");

var gameData = {}

socket.on('updateData', function(data){
	gameData = data;
});

function redraw(){
	
}

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        // socket.emit('position change', [-10, 0]);
        break;
		
		case 38: // up
		// socket.emit('position change', [0, -10]);
        break;

        case 40: // down
        // socket.emit('position change', [0, 10]);
        break;

        case 39: // right
        // socket.emit('position change', [10, 0]);
        break;

        default: 
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});