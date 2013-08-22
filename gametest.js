//wait for HTML to load before executing script
$(document).ready(function(){
    
    //declare basic cavas variables
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
	var width = 450;
	var fps = 10;
    
    //declare gamestate variable
    var gamestate = "start";
	
	//starts the game and calls the paint function every x milliseconds
	function init()	{
		if (typeof game_loop != "undefined") clearInterval(game_loop);
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
        
        //declare a variable for audio element
        var soundEfx;
	}
	init();
	
    //controls the main game loop
    function mainLoop(){
		if (gamestate === "start")
            checkinput();
            paintstart();
        if (gamestate === "run"){
            checkinput();
    	    update();
		    paint();    
        }
        if (gamestate === "stop"){
            checkinput();
            paint();
        }
	}
	
	//controls user input
	function checkinput(){
		$(document).keydown(function(e){
    		var key = e.which;
    		if (key == "38") player.direction = "up";
    		else if (key == "40"){
        	    player.direction = "down";
    		}
            else if (key == "32"){
                gamestate = "run";
            }
            else if (key == "82"){
                init();
                gamestate = "run";
            }
		})
	}
	
	//game logic
	function update(){
		//move player based on current direction
		if (player.direction === "up" && player.posY > 0){
            player.posY = player.posY - player.speed;
		}
		else if (player.direction === "down" && player.posY < width - player.len){
    	    player.posY = player.posY + player.speed;
		}
        
        //move enemy up or down based on ball position
        if (ball.posY > enemy.posY + 35 && enemy.posY + 70 < width){
            enemy.posY = enemy.posY + enemy.speed;
        }
        else if (ball.posY < enemy.posY + 35 && enemy.posY > 0){
            enemy.posY = enemy.posY - enemy.speed;
        }
        
		//move ball
		ball.posX = ball.posX + ball.vX;
		ball.posY = ball.posY + ball.vY;

		//check ball collision with left or right boundary
		if (ball.posX - 7 <= 0){
			//game stop
			gamestate = "stop"; 
		}
		else if (ball.posX + 7 >= width){
			//game stop
			gamestate = "stop";
		}
        //check ball collision with top or bottom boundary
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
			//reverse ball's horizontal movement
            ball.vX = ball.vX * -1;
            //play hit sound
            soundEfx.play();
		}
        
        //check ball collision with enemy
        if (enemy.posX <= (ball.posX + 7) && (enemy.posY <= ball.posY && enemy.posY + enemy.len >= ball.posY)){
			//reverse ball's horizontal movement
            ball.vX = ball.vX * -1;
            //play hit sound
            soundEfx.play();
		}
	}
    
    //draw initial game splash screen
    function paintstart(){
        //draws the canvas
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, width, width);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, width, width);
        
        //draw title
        ctx.fillStyle = "white";
        ctx.font="bold 80px Courier";
        ctx.fillText("PONG",120,150);
        
        //draw start instructions
        ctx.fillStyle = "white";
        ctx.font="bold 30px Courier";
        ctx.fillText("Press Spacebar To Start",20,250);
    }
	
	//draws the game objects
	function paint(){
	    
        //assign Audio element to variable
        soundEfx = document.getElementById("soundEfx");
        
		//draws the canvas
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, width, width);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, width, width);
		
		//draws the player
		ctx.fillStyle = "white";
		ctx.fillRect(player.posX, player.posY, 10, player.len);
        
        //draws the enemy
        ctx.fillStyle = "white";
		ctx.fillRect(enemy.posX, enemy.posY, 10, enemy.len);
		
		//draws the ball
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(ball.posX, ball.posY, ball.radius, 0, 2 * Math.PI, true);
		ctx.fill();
        
        //paint restart instructions
        if (gamestate === "stop"){
            ctx.fillStyle = "white";
            ctx.font="bold 30px Courier";
            ctx.fillText("Press 'R' To Restart",45,50);    
        }
	}
})
