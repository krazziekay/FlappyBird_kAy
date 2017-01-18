var height = document.getElementById('main-wrapper').offsetHeight;
var width = document.getElementById('main-wrapper').offsetWidth;
var birdHeight = document.getElementById('bird').offsetHeight;
var birdWidth = document.getElementById('bird').offsetWidth;
var gameObstacles = [];
var obstaclesNo = 2;
var gameVelocity = 10;
var movementCriteria = 50;
var score = 0;
var flag = 0;//Flag for continuous jumping of the bird


window.onload = function() {
	window.addEventListener('keydown', moveSelection);
}

function obstacles() {
	this.x = 0;
	this.y = 0;
	this.height = 30;
	this.crossedFlag = 0;
	this.element;

	this.init = function() {
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'obstacles');
		this.element.style.top = this.y + 'px';
		this.element.style.left = this.x + 'px';
		this.element.style.height = this.height + 'px';
		document.getElementById('main-wrapper').appendChild(this.element);
	}

	this.redrawObstacles = function() {
		this.element.style.top = this.y + 'px';
		this.element.style.left = this.x + 'px';
	}
}

function createObstacle(position, obstacleheight) {
	var obstacle = new obstacles();
	obstacle.x = width -100;
	obstacle.y = position;
	obstacle.height = obstacleheight;
	obstacle.init();
	return obstacle;
}

function gameStart() {
	// gameObstacles = [];

	var obstacle1height = getRandom(100, 200);
	var obstacle1 = createObstacle(70, obstacle1height);
	obstacle1.element.style.transform = "rotate(180deg)";
	gameObstacles.push(obstacle1);

	var obstacle2height = getRandom(100, 250);
	console.log("Height", height, "Obstaleheight ", obstacle2height);
	var obstacle2 = createObstacle(height - obstacle2height , obstacle2height);
	gameObstacles.push(obstacle2);

	var obstacle3height = getRandom(100, 200);
	var obstacle3 = createObstacle(70, obstacle3height);
	obstacle3.element.style.transform = "rotate(180deg)";
	obstacle3.element.style.left = obstacle1.x - 400 + "px";
	obstacle3.x = obstacle1.x - 400;
	gameObstacles.push(obstacle3);

	var obstacle4height = getRandom(100, 250);
	var obstacle4 = createObstacle(height - obstacle4height , obstacle4height);
	obstacle4.element.style.left = obstacle2.x - 400 + "px";
	obstacle4.x = obstacle2.x - 400;
	gameObstacles.push(obstacle4);

	animationStart = setInterval(moveObstacles, gameVelocity);
}

function clearDivs(){
	obstacle = [];//delete the already created object
	//Clearing the divs
	while ( document.getElementById('main-wrapper').firstChild ) {
		document.getElementById('main-wrapper').removeChild(document.getElementById('main-wrapper').firstChild );
	}
}

function checkCollision() {

	var birdTop = document.getElementById('bird').offsetTop;
	var birdBottom = document.getElementById('bird').offsetTop + birdHeight;
	var birdLeft = document.getElementById('bird').offsetLeft;
	var birdRight = document.getElementById('bird').offsetLeft + birdWidth;
	if(birdTop <= 70) {// For checking collision on top of the div
		return true;
	}
	if(birdTop == height - birdHeight) {// For checking collision on bottom of the div
		return true;
	}

	// For checking collision on the top obstacle	
	for (var i = 0; i< 3; i = i+2) {
		if(birdRight == gameObstacles[i].element.offsetLeft &&  birdTop <= gameObstacles[i].height + 70) {
			return true;
		}
		if(birdRight > gameObstacles[i].element.offsetLeft &&  birdTop <= gameObstacles[i].height + 70) {
			
			if( birdTop <= gameObstacles[i].height + 70 && birdLeft > (gameObstacles[i].element.offsetLeft + gameObstacles[i].element.offsetWidth) ) {
				return false;
			}
			else{
				return true;
			}
		}

		if(birdLeft == (gameObstacles[i].element.offsetLeft + gameObstacles[i].element.offsetWidth ) && birdTop == (gameObstacles[i].height + 70) ) {
			return true;
		}
	}

	// For checking collision on the bottom obstacle
	for (var i = 1; i< 5; i = i+2) {
		if(birdRight == gameObstacles[i].element.offsetLeft && birdBottom >= gameObstacles[i].element.offsetTop) {
			return true;
		}

		if(birdRight > gameObstacles[i].element.offsetLeft  && birdBottom >= gameObstacles[i].element.offsetTop) {
			if( birdLeft > (gameObstacles[i].element.offsetLeft + gameObstacles[i].element.offsetWidth ) ) {
				return false;
			}
			else{
				return true;
			}
		}

		if(birdLeft == (gameObstacles[i].element.offsetLeft + gameObstacles[i].element.offsetWidth ) && birdBottom == gameObstacles[i].element.offsetTop ) {
			return true;
		}

	}
	return false;
}

function moveObstacles() {
	if(flag == 0){
		if(checkCollision() == false){
			document.getElementById('bird').style.top = parseInt(document.getElementById('bird').offsetTop) + 1 + "px";

		}
		else{
			document.getElementById('over').innerHTML = "GAME OVER!";
			window.removeEventListener('keydown', moveSelection);	
			document.getElementById('bird').style.backgroundImage = "url('images/bird.png')";
			clearInterval(animationStart);
		}
	}

	for(var i = 0; i < gameObstacles.length; i++) {
		gameObstacles[i].x--;
		if(gameObstacles[i].x == -100){//checking if the obstacle has crossed the container or not
			gameObstacles[i].height = getRandom(100, 250);
			gameObstacles[i].x = width - 100;
			gameObstacles[i].y = (i%2==0)?70:(height - gameObstacles[i].height) ;
			gameObstacles[i].init();
			gameObstacles[i].element.style.transform = (i%2==0)?"rotate(180deg)":"none";
			score+= 0.5;// crossing two obstacles at once, so halving the score by half
		}
		gameObstacles[i].redrawObstacles();
	}

	document.getElementById('score').innerHTML = score;
	
}

gameStart();


function restart() {
	score = 0;
	gameObstacles = [];
	document.getElementById('over').innerHTML = "";
	clearDivs();
	if(animationStart != undefined) {
		clearInterval(animationStart);
	}
	document.getElementById('bird').style.top = "45%";
	window.addEventListener('keydown', moveSelection);
	gameStart();
}

//Key events
function moveSelection(evt) {
	switch (evt.keyCode) {
		case 32: {
			flag = 1;
			document.getElementById('bird').style.top = parseInt(document.getElementById('bird').offsetTop) - movementCriteria + "px";
			// document.getElementById('bird').style.left = parseInt(document.getElementById('bird').offsetLeft) - movementCriteria + "px";
			flag = 0;
			break;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Helper functions
function getRandom(max, min){
	return Math.random() * (max - min) + min;
}
