$(function(){
	var canvas = $('#canvas')[0];
	var ctx = canvas.getContext('2d'); // creates 2 dimensional drawing context
	
	var shipLength = 20;
	var shipWidth = 7;
	var shipX = 100;
	var shipY = 100;
	
	var mouseX = 1
	var mouseY = 1;
	
	setInterval(gameLoop,10);
	function gameLoop() {
		clearCanvas();
		drawShip(shipX,shipY);
	}
	document.onmousemove = handleMouseMove;
	function handleMouseMove(event) {
		mouseX = event.clientX - 560;
		mouseY = event.clientY - 100;		
		
	}
	
	
	function drawShip(x,y) {
		var opp = mouseX - x
		var adj = mouseY - y
		x = x+(opp*2)/Math.sqrt(Math.pow(opp,2) + Math.pow(adj,2))
		y =	y+(adj*2)/Math.sqrt(Math.pow(opp,2) + Math.pow(adj,2))
		var angle = Math.atan(adj/opp);
		var addY = (Math.cos(angle)*shipWidth);
		var addX = (Math.sin(angle)*shipWidth);
		angle = (Math.PI/2) - angle
		console.log(angle*(180/Math.PI));
			
		ctx.beginPath();
		if ((adj < 0 && opp > 0) || (adj > 0 && opp > 0)) {
			ctx.moveTo(x,y);
			ctx.lineTo(Math.round(x-addX-(Math.sin(angle)*shipLength)),Math.round(y+addY-(Math.cos(angle)*shipLength)))
			ctx.lineTo(Math.round(x+addX-(Math.sin(angle)*shipLength)),Math.round(y-addY-(Math.cos(angle)*shipLength)))
		} else {
			ctx.moveTo(x,y);
			ctx.lineTo(Math.round(x-addX+(Math.sin(angle)*shipLength)),Math.round(y+addY+(Math.cos(angle)*shipLength)))
			ctx.lineTo(Math.round(x+addX+(Math.sin(angle)*shipLength)),Math.round(y-addY+(Math.cos(angle)*shipLength)))				
				
		}
//			ctx.closePath();
		ctx.fillStyle = "#FFCC00";
		ctx.fill();
		shipX = x
		shipY = y
	}
	
	function clearCanvas() {
		
		ctx.clearRect(0,0,canvas.width, canvas.height);
	}

});


		/*
		ctx.beginPath();
		ctx.moveTo(20,20);

		ctx.lineTo(20,40)
		ctx.lineTo(40,20.5)
		ctx.fill();
		*/
//		ctx.closePath();
//		ctx.fillStyle= 'red';