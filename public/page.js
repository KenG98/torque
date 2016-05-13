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
