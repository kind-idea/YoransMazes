var charXO, charYO, charX, charY, charRot;

String.prototype.setCharAt = function(index, char) {
	return this.substr(0, index) + char + this.substr(index + 1);
};

function findChar(){
	// Get the position of char
	for (var j=0; j<board.length; j++){
		charY = j;
		charX = board[j].indexOf('@');
		if (charX !== -1){
			charXO = charX;
			charYO = charY;
			break;
		}
		charX = board[j].indexOf('^');
		if (charX !== -1){
			charXO = charX;
			charYO = charY;
			break;
		}
		charX = board[j].indexOf('+');
		if (charX !== -1){
			charXO = charX;
			charYO = charY;
			break;
		}
	}
}
var optimX, optimY, curRot, rotDiff, isRoted;

function move(dir){
	if (charMesh.rotation.z === 2 * Math.PI){
		charMesh.rotation.z = 0;
	} else if (charMesh.rotation.z === -0.5 * Math.PI) {
		charMesh.rotation.z = 1.5 * Math.PI;
	} else if (charMesh.rotation.z === -1 * Math.PI){
		charMesh.rotation.z = Math.PI;
	} else if (charMesh.rotation.z === -1.5 * Math.PI){
		charMesh.rotation.z = 0.5 * Math.PI;
	}
	
	isRoted = 0;
	
	// future (f) and future future (t) spots. current spots are x and y
	var x = charX;
	var y = charY;
	var fy, ty, fx, tx;
	if (dir === "up"){
		charRot = 0.5;
		fy = y - 1;
		ty = y - 2;
		fx = x;
		tx = x;
	} else if (dir === 'down'){
		charRot = 1.5;
		fy = y + 1;
		ty = y + 2;
		fx = x;
		tx = x;
	} else if (dir === 'left'){
		charRot = 1;
		fy = y;
		ty = y;
		fx = x - 1;
		tx = x - 2;
	} else if (dir === 'right'){
		charRot = 0;
		fy = y;
		ty = y;
		fx = x + 1;
		tx = x + 2;
	} else {
		error('That\'s not a direction!',1);
		return;
	}
	
	curRot = Math.round(1000 * (charMesh.rotation.z / Math.PI)) / 1000;  // 0, 0.5, 1, 1.5

	rotDiff = Math.round(1000 * (charRot - curRot)) / 1000;

	if (rotDiff > 1) {
		rotDiff = rotDiff - 2;
	} else if (rotDiff < -1){
		rotDiff = rotDiff + 2;
	}
	
	var next = null;
	var far = null;
	var cur = board[y].charAt(x);
	if (typeof board[fy] !== 'undefined' && typeof board[fy][fx] !== 'undefined'){
		next = board[fy].charAt(fx);
	} else {
		return;
	}
	
	if (typeof board[ty] !== 'undefined' && typeof board[ty][tx] !== 'undefined'){
		far = board[ty].charAt(tx);
	}

	var farX = tx * 10 + offsetX;
	var farY = ty * -10 + offsetY;
	
	function setCurrent(){
		if (cur === '^'){
			cur = '`';
		} else if (cur === '@'){
			cur = ' ';
		} else if (cur === '+'){
			cur = '.';
		}
	}
	function setFuture(){
		if (next === '$' || next === ' '){
			next = '@';
			charX = fx;
			charY = fy;
		} else if (next === '`' || next === '!'){
			next = '^';
			charX = fx;
			charY = fy;
		} else if (next === '.' || next === '*'){
			next = '+';
			charX = fx;
			charY = fy;
		}
		moves += 1;
	}
	function setFFutureBlock(){
		// Figure out which block is the one the character is moving
		var coor = fx + ',' + fy + ',1';
		var newc = tx + ',' + ty;
		var block = scene.getObjectByName(coor);

		block.position.x = farX;
		block.position.y = farY;

		if (far === '`'){
			far = '!';
			block.name = newc + ',1';
		} else if (far === ' '){
			far = '$';
			block.name = newc + ',1';
		} else if (far === '.'){
			far = '*';
			block.name = newc + ',1';
		} else if (far === '~'){
			far = '`';
			block.position.z += -10;
			block.name = newc + ',0';
		}
		
		pushes += 1;
	}
	if (typeof next !== 'undefined'){
		if ((next === 'H' || next === 'I' || next === 'J' || next === 'K') && allPressed() === true){
			onWin();
		} else if (next === '`' || next === ' ' || next === '.'){ // Values for empty
			setFuture();
			setCurrent();
		} else if (next === '$' || next === '!' || next === '*'){ // Values for has a block
			if (typeof far !== 'undefined') {
				if (far === '`' || far === ' ' || far === '~' || far === '.'){ // Values for empty
					setFFutureBlock();
					setFuture();
					setCurrent();
				} else {
					return;
				}
			} else {
				return;
			}
		} else {
			return;
		}
	} else {
		return;
	}
	
	board[y] = board[y].setCharAt(x,cur);
	if (typeof board[fy] !== 'undefined' && typeof board[fy][fx] !== 'undefined'){
		board[fy] = board[fy].setCharAt(fx,next);
	} else {
		return;
	}
	if (typeof board[ty] !== 'undefined' && typeof board[ty][tx] !== 'undefined'){
		board[ty] = board[ty].setCharAt(tx,far);
	}

	if (allPressed() === true && board[charY].charAt(charX) !== '+'){
		if (soko === true){
			onWin();
		} else if (soko === false){
			doorOpen.visible = true;
			doorClose.visible = false;
		}
	} else {
		if (soko === false){
			doorOpen.visible = false;
			doorClose.visible = true;
		}
	}
	optimX = Math.round(charX * 10 + offsetX);
	optimY = Math.round(charY * -10 + offsetY);
	
	if (toggles.anim === true && useWebGL === true){
		//	actionsEnabled = 0;
		animate();
	} else {
		charMesh.position.y = optimY;
		charMesh.position.x = optimX;
		charMesh.rotation.z = charRot * Math.PI;
		render();
	}
}

function allPressed(){
	var slice = -1;
	for (var j=0; j<board.length; j++){
		slice = board[j].indexOf('.');
		if (slice !== -1){ // If we find a button unpressed
			return false;
		} else if (slice === -1 && j === board.length - 1){ // If there are not buttons unpressed
			return true;
		}
	}
}

document.onkeydown = checkKey;
function checkKey(e) {
	if (actionsEnabled === 1) {
		e = e || window.event;
		if (e.keyCode === keycode.up) {
			move('up');
			updateScores();
		}
		else if (e.keyCode === keycode.down) {
			move('down');
			updateScores();
		}
		else if (e.keyCode === keycode.left) {
			move('left');
			updateScores();
		}
		else if (e.keyCode === keycode.right) {
			move('right');
			updateScores();
		}
		else if (e.keyCode === keycode.restart) {
			resetBoard();
			updateScores();
		}
		else if (e.keyCode === keycode.pause){
			pause();
		}
	} else if(setKeyAction === 1){
		if (e.keyCode === 27){
			return;
		}
		saveKeycode(e.keyCode);
	} else if (e.keyCode === 27){
		if (theresError === true){
			if (canCloseError === true){
				errHide();
			}	
		} else{
			unNav();
		}
	} else if (e.keyCode === keycode.pause && isPaused === true){
		unpause();
	}
}

var lastTime = 0;
var requestAnimationFrame;
function animate(){
		// update
		var time = (new Date()).getTime();

		var xPos = Math.round(charMesh.position.x);
		var yPos = Math.round(charMesh.position.y);

		if (xPos !== optimX){
			if (xPos < optimX){ 
				charMesh.position.x += 1;
			} else if (xPos > optimX){
				charMesh.position.x += -1;
			}
		}
		if (yPos !== optimY){
			if (yPos < optimY){ 
				charMesh.position.y += 1;
			} else if (yPos > optimY){
				charMesh.position.y += -1;
			}
		}
		
		if (rotDiff !== isRoted){
			if (rotDiff > 0 && Math.abs(rotDiff) !== 1){ 
				charMesh.rotation.z += 0.1 * Math.PI;
				isRoted = Math.round(100 * (isRoted + 0.1)) / 100;
			} else if (rotDiff < 0 && rotDiff !== 1){
				charMesh.rotation.z += -0.1 * Math.PI;
				isRoted = Math.round(100 * (isRoted - 0.1)) / 100;
			} else if (Math.abs(rotDiff) === 1){
				charMesh.rotation.z += 0.125 * Math.PI;
				isRoted = Math.round(1000 * (isRoted + 0.125)) / 1000;
			}
		}
		
		if (yPos === optimY && xPos === optimX && rotDiff === isRoted){
	//		actionsEnabled = 1;
			return;
		} 

		lastTime = time;

		// render
		renderer.render(scene, camera);

		// request new frame
		requestAnimationFrame(function(){
			animate();
		});
	}