$(function(){
	
	
	var canvas = $('#canvas')[0];
	var ctx = canvas.getContext('2d'); // creates 2 dimensional drawing context
	
	var mouseX = 1;
	var mouseY = 1;
	
	var hitBoxY = Math.ceil(canvas.height / 4);
	var hitBoxX = Math.ceil(canvas.width / 4);
	
	var hitBoxArray = new Array(hitBoxY);
	var userCoor = [0,0,0,0];
	
//	console.log(canvas.height);
//	console.log(canvas.width);
	
	for (var i = 0; i < hitBoxY; i++) {
		hitBoxArray[i] = new Array(hitBoxX).fill(0);
	}
	
	
	class Bullet {
		speed = 5;
		bulletData;
		x = 0;
		y = 0;
		xDir = 0;
		yDir = 0;
		
		constructor(x,y,xDir,yDir) {
			this.x = Math.round(x);
			this.y = Math.round(y);
			var base = Math.sqrt(Math.pow(xDir,2) + Math.pow(yDir,2));
//			console.log(yDir);
			this.xDir = Math.round((xDir*this.speed)/base);
//			console.log(xDir);
			this.yDir = Math.round((yDir*this.speed)/base);
			
//			this.bulletData = new ListNode2([this.x,this.y,this.xDir,this.yDir]);
			this.bulletData = bulletList.add(this);
		}
		printValue() {
			console.log(this.x,this.y);
		}
		
		moveBullet() {
//			console.log(this.x,this.y);
			this.x = this.x+this.xDir; // movement in x dir for bullet
			this.y = this.y+this.yDir;
//			console.log(this.xDir,this.yDir);
			if (this.x < 0 || this.y < 0 || this.y > canvas.height || this.x > canvas.width) {
				bulletList.remove(this.bulletData); // remove itself since reached end of screen
			} else {
				this.drawBullet();
			}
		}
		
		drawBullet() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();			
		}
		
		
	}
	
	class Ship {
		shootBullet = false;
		prevXDir = 0.5;
		prevYDir = 0.5;
		prevMag = 1;
		x = 0;
		y = 0;
		shipLength = 20;
		shipWidth = 7;
		speed = 2;
		color = "#FFCC00";
		temp;
		
		
		constructor(x,y) {
			this.x = x;
			this.y = x;
		}
		
		/* move ship in vector direction given
		** @param - xdir is x direction and ydir is y direction
		** params are normalized so can be of any magnitude
		** @return - none
		*/
		moveShip(xdir,ydir) {
			/*
			if (Math.abs(xdir) < 20) {
				xdir = this.prevXDir;
			}
			
			if (Math.abs(ydir) < 20) {
				ydir = this.prevYDir;
			}
			*/
			
//			console.log("prev: ",this.prevXDir, this.prevYDir);
//			console.log("prev: ",xdir, ydir);
			var base = Math.sqrt(Math.pow(xdir,2) + Math.pow(ydir,2));
			var base2 = Math.sqrt(Math.pow(this.prevXDir,2) + Math.pow(this.prevYDir,2));
			var maxAngle = ((this.prevXDir*xdir)+(this.prevYDir*ydir))/(base*base2);
			if (maxAngle > 1)
				maxAngle = 1;

			maxAngle = Math.acos(maxAngle);
//			console.log("base :" ,base,base2);
//			console.log(maxAngle);
			if (Math.abs((maxAngle*180)/Math.PI) > 15) {
				console.log((maxAngle*180)/Math.PI);
				console.log(this.prevXDir,this.prevYDir);
				var dir = (maxAngle/Math.abs(maxAngle));
				var temp1 = this.prevXDir*Math.cos(0.05*dir) + this.prevYDir*Math.sin(0.05*dir);
				var temp2 = (-1*this.prevXDir*Math.sin(0.05*dir)) + this.prevYDir*Math.cos(0.05*dir);
				console.log(temp1,temp2);
				console.log();
				xdir = temp1;
				ydir = temp2;
				base = Math.sqrt(Math.pow(xdir,2) + Math.pow(ydir,2));
				
			}
			var angle=0;
			if (this.shootBullet == true) {
				this.temp = new Bullet(this.x,this.y,xdir,ydir);
//				this.temp.printValue();
				this.shootBullet = false;
			}
			userCoor[0] = this.x;
			userCoor[1] = this.y;
			userCoor[2] = (xdir*this.speed)/base;
			userCoor[3] = (ydir*this.speed)/base;
			
			this.x = this.x+userCoor[2]; // movement in x dir of ship
			this.y = this.y+userCoor[3]; // movement in y dir of ship
			
			var angle = (Math.PI/2) - Math.atan(ydir/xdir); // angle of vector given from origin and (1,0) vector
//			console.log(angle);
//			console.log(angle);
			
			if ((ydir < 0 && xdir > 0) || (ydir > 0 && xdir > 0)) { // determines side of screen the ship faces
				this.drawShip(angle,-1);
			} else {
				this.drawShip(angle,1);
			}
//			this.prevMag = base;
			this.prevXDir = xdir;
			this.prevYDir = ydir;
		}
		
		/* draws the ship based on angle
		** @param - angle is angle, shipFront is side of screen
		** -1 for right and 1 for left
		** @return - none
		*/
		drawShip(angle,shipFront) {
			var addY = (Math.sin(angle)*this.shipWidth); // used for ship rear
			var addX = (Math.cos(angle)*this.shipWidth); // used for ship rear
			var xRear = shipFront*Math.sin(angle)*this.shipLength;
			var yRear = shipFront*Math.cos(angle)*this.shipLength;
			
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(Math.round(this.x-addX+xRear),Math.round(this.y+addY+yRear));
			ctx.lineTo(Math.round(this.x+addX+xRear),Math.round(this.y-addY+yRear));			
			ctx.fillStyle = this.color;
			ctx.fill();	
		}
		
		shoot() {
			this.shootBullet = true;
		}
	}

	class UserShip extends Ship {
		moveUserShip() {
			this.moveShip(mouseX - this.x,mouseY - this.y);
		}	
	
	
	}
	
	class EnemyShip extends Ship {
		
		determineMoveDir() {
			var v = 4;
			var R = (userCoor[1] - this.y)/(userCoor[0] - this.x);
			var b = -R;
			var a = 1;
			var c = (userCoor[3] - (R*userCoor[2]))/v;
			var add = Math.atan(a/b);
			var angle1 = (-Math.acos(c/(Math.sqrt(Math.pow(a,2)) + Math.pow(b,2)))) + add;
			var angle2 = Math.acos(c/(Math.sqrt(Math.pow(a,2) + Math.pow(b,2)))) + add;
			var t1 = (userCoor[0] - this.x)/((v*Math.cos(angle1))-userCoor[2]);
			var t2 = (userCoor[0] - this.x)/((v*Math.cos(angle2))-userCoor[2]);
	//		console.log(angle1*(180/Math.PI),angle2*(180/Math.PI));
			this.moveShip(v*Math.sin(-angle1),v*Math.cos(-angle1));
			/*
			if (t1 > 100) {
				this.moveShip(v*Math.sin(-angle2),v*Math.cos(-angle2));
			} else if (t1 > 0 && t1 < 100) {
				this.moveShip(v*Math.sin(-angle1),v*Math.cos(angle1));
			} else if (t2 > 100) {
				this.moveShip(v*Math.sin(angle1),v*Math.cos(-angle1));
			} else {
				this.moveShip(v*Math.sin(-angle2),v*Math.cos(angle2));
			} */
		}
		
		determineShoot() {
			
		}
		
		
	}
	
	class ListNode {
		constructor(data) {
			this.data = data;
			this.next = null;
		}
		
	}
	
	class LinkedList {
		size = 0;
		constructor(head = null) {
			if (head != null)
				this.size+=1;
			this.head = head;
		}
		
		getFirst() {
			return this.head;
		}
		
		remove(before,after) {
			if (size > 0) {
				if (before == null) {
					this.head = after;
				} else {
					before.next = after;
				}
				this.size-=1;
			}
		}
		
		add(data) {
			var temp = this.head;
			this.head = new ListNode(data);
			this.head.next = temp;
			this.size+=1;
		}
		
	}
	
	
	class ListNode2 {
		constructor(data) {
			this.data = data;
			this.next = null;
			this.prev = null;
		}
		
	}
	
	class DoubleLinkedList {
		size = 0;
		constructor(head = null) {
			if (head != null)
				this.size+=1;
			this.head = head;
		}
		
		getFirst() {
			return this.head;
		}
		
		getSize() {
			return this.size;
		}
		
		remove(node) {
			if (this.size > 0) {
				this.size = this.size - 1;
				if (node == this.head) {
					if (this.head.next != null) {
						this.head = this.head.next;
						this.head.prev = null;
					} else {
						this.head = null;
					}
				} else if (node.next != null) {
					node.next.prev = node.prev;
					node.prev.next = node.next;
				} else {
					node.prev.next = null;
				}
			}
		}
		
		add(data) {
			if (this.head != null) {
				var temp = this.head;
				this.head = new ListNode2(data);
				this.head.next = temp;
				temp.prev = this.head;
			} else {
				this.head = new ListNode2(data);
			}
			this.size+=1;
			return this.head;
		}
		
	}	
	
	
	
	var userShip = new UserShip(100,100);
	var enemyShip = new EnemyShip(200,200);
	var bulletList = new DoubleLinkedList();
/*
	var testList = new DoubleLinkedList();
	testList.add(new Bullet(1,2,3,4));
	testList.add(new Bullet(5,6,7,8));
	testList.add(new Bullet(9,10,11,12));
	testList.add(new Bullet(13,14,15,16));
	testList.add(new Bullet(10,2,3,4));
	testList.add(new Bullet(1,22,3,4));

	var n1 = testList.getFirst();
	for (var i = 0; i < 6; i++) {
		n1.data.moveBullet();
		n1.data.printValue();
		n1 = n1.next
	}
	
	var n2 = testList.getFirst();
	for (var i = 0; i < 3; i++) {
		n2 = n2.next
	}
	testList.remove(n2);
	testList.remove(n2);
	
	var n1 = testList.getFirst();
	for (var i = 0; i < testList.getSize(); i++) {
		n1.data.printValue();
		if (n1.next != null)
			n1 = n1.next;
		
	}
	for (var i = 0; i < testList.getSize(); i++) {
		console.log(n1.data);
		n1 = n1.prev
	}
	*/

	setInterval(gameLoop,1000);
	function gameLoop() {
		clearCanvas();
		userShip.moveUserShip();
//		enemyShip.determineMoveDir();

		b = bulletList.getFirst();
		/*
		if (b != null) {
			a = b.data;
			console.log(a);
		}
//			b.data.printValue();
		console.log(bulletList.getSize());*/
		
		for (var i = 0; i < bulletList.getSize(); i++) {
//			b.data.printValue();
			b.data.moveBullet();
			b = b.next;
		}
	//	console.log(bulletList.getSize());
	
	}
	
	document.onmousemove = handleMouseMove;
	function handleMouseMove(event) {
		mouseX = event.clientX - 560;
		mouseY = event.clientY - 100;		
		
	}
	
	
	document.onclick = function(event) {
		userShip.shoot();
	}
	
	
	
	function clearCanvas() {
		
		ctx.clearRect(0,0,canvas.width, canvas.height);
	}
	
	/* ship class
	** creates a ship on screen that can move based on vector direction given
	*/

	


});
