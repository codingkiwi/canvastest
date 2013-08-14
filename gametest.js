// wait for HTML to load before executing script
$(document).ready(function(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
	var width = 450;
	var fps = 10;
	
	// starts the game and calls the paint function every x milliseconds
	function init()	{
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(mainLoop, fps);
		
		//defines a player object
		player = {
			posX:10,
			posY:200,
			len:70,
			direction:null,
			speed:2
		};
        
        enemy = {
            posX:430,
            posY:200,
            len:70,
            direction:null,
            speed:2
        };
		
		//defines a ball
		ball = {
			posX:225,
			posY:225,
			vX:-1,
			vY:1.5,
			radius:7
		};
        
        var snd_beep = new Audio("beep.wav");
	}
	init();
	
	// controls the main game loop
	function mainLoop(){
		checkinput();
		update();
		paint();
	}
	
	// controls user input
	function checkinput(){
		$(document).keydown(function(e){
		var key = e.which;
		if(key == "38") player.direction = "up";
		else if(key == "40") player.direction = "down";
		})
	}
	
	// game logic
	function update(){
		//move player
		if (player.direction === "up" && player.posY > 0){
            player.posY = player.posY - player.speed;
		}
		else if (player.direction === "down" && player.posY < width - player.len){
    	    player.posY = player.posY + player.speed;
		}
        
        //move enemy
        if (ball.posY > enemy.posY + 35){
            enemy.posY = enemy.posY + enemy.speed;
        }
        else if (ball.posY < enemy.posY - 35){
            enemy.posY = enemy.posY - enemy.speed;
        }
        
		//move ball
		ball.posX = ball.posX + ball.vX;
		ball.posY = ball.posY + ball.vY;

		//check ball collision with boundary
		if (ball.posX - 7 <= 0){
			//game restart
			init();
		}
		else if (ball.posX + 7 >= width){
			//game restart
			init();
		}
		else if (ball.posY - 7 <= 0){
			//bounce
			ball.vY = ball.vY * -1;
		}
		else if (ball.posY + 7 >= width){
			//bounce
			ball.vY = ball.vY * -1;
		}
		
		//check ball collision with player
		if (player.posX >= (ball.posX - 7) && (player.posY <= ball.posY && player.posY + player.len >= ball.posY)){
			// reverse ball's horizontal movement
            ball.vX = ball.vX * -1;
            // play hit sound
            snd_beep.play();
		}
        
        //check ball collision with enemy
        if (enemy.posX <= (ball.posX + 7) && (enemy.posY <= ball.posY && enemy.posY + enemy.len >= ball.posY)){
			// reverse ball's horizontal movement
            ball.vX = ball.vX * -1;
            // play hit sound
            snd_beep.play();
		}
	}
	
	// draws the game objects
	function paint(){
	
		// draws the canvas
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, width, width);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, width, width);
		
		// draws the player
		ctx.fillStyle = "white";
		ctx.fillRect(player.posX, player.posY, 10, player.len);
        
        //draws the enemy
        ctx.fillStyle = "white";
		ctx.fillRect(enemy.posX, enemy.posY, 10, enemy.len);
		
		// draws the ball
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(ball.posX, ball.posY, ball.radius, 0, 2 * Math.PI, true);
		ctx.fill();
	}
})
