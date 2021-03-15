$(function(){
	
	
	var canvas = $('#canvas')[0];
	var ctx = canvas.getContext('2d'); // creates 2 dimensional drawing context
	
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
	
	
	
	
	
	
	function clearCanvas() {
		
		ctx.clearRect(0,0,canvas.width, canvas.height);
	}
	
	/* ship constructor
	**	
	**
	*/
	class Ship {
		x = 0;
		y = 0;
		shipLength = 20;
		shipWidth = 7;
		speed = 2;
		color = "#FFCC00";
		
		
		constructor(x,y) {
			this.x = x;
			this.y = x;
		}
		
		/* move ship in vector direction given
		** @param - xdir is x direction and ydir is y direction
		** params are normalized so can be of any magnitude
		** @return - none
		*/
		function moveShip(xdir,ydir) {
			x = x+(xdir*speed)/Math.sqrt(Math.pow(xdir,2) + Math.pow(ydir,2))
			y =	y+(ydir*speed)/Math.sqrt(Math.pow(xdir,2) + Math.pow(ydir,2))
			
			var angle = (Math.PI/2) - Math.atan(ydir/xdir);
			
			if ((ydir < 0 && xdir > 0) || (ydir > 0 && xdir > 0)) {
				drawShip(angle,-1);
			} else {
				drawShip(angle,1);
			}
		}
		
		/* draws the ship based on angle
		** @param - angle is angle, shipFront is side of screen
		** -1 for right and 1 for left
		** @return - none
		*/
		function drawShip(angle,shipFront) {
			var addY = (Math.sin(angle)*shipWidth);
			var addX = (Math.cos(angle)*shipWidth);
			var xRear = shipFront*Math.sin(angle)*this.shipLength;
			var yRear = shipFront*Math.cos(angle)*this.shipLength);
			
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(Math.round(this.x-addX+xRear),Math.round(this.y+addY+yRear));
			ctx.lineTo(Math.round(this.x+addX+xRear),Math.round(this.y-addY+yRear));			
			ctx.fillStyle = color;
			ctx.fill();	
		}
	}

	class UserShip extends Ship {
		function moveUserShip(x,y) {
			this.moveShip(mouseX - this.x,mouseY - this.y);
		}	
	
	
	
	
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