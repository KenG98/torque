var socket = io();

var canvas = $('#c')[0];

var canv = canvas.getContext("2d");

socket.on('redraw', function(usr_poss){
	canv.clearRect(0, 0, 200, 100);
	for(usr in usr_poss) {
		canv.fillRect(usr_poss[usr][0], usr_poss[usr][1], 10, 10);
	}
});

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        socket.emit('position change', [-10, 0]);
        break;
		
		case 38: // up
		socket.emit('position change', [0, -10]);
        break;

        case 40: // down
        socket.emit('position change', [0, 10]);
        break;

        case 39: // right
        socket.emit('position change', [10, 0]);
        break;

        default: 
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});