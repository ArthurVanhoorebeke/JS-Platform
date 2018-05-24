var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

document.addEventListener('resize',function(){
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});


var keys = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e){
    keys[e.which] = true;
}

function keyUpHandler(e){
    keys[e.which] = false;
}    

window.addEventListener('resize',function(){
    canvas.width = window.innerWidth;
});

animate();
world1.initScripts();