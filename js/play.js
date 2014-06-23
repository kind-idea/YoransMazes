var board, height, width, offsetX, offsetY, lastBoard;
var charXO, charYO, charX, charY, charRot;

String.prototype.setCharAt = function(index, char) {
	return this.substr(0, index) + char + this.substr(index + 1);
};
// Should you be able to move the character while the game is paused?  Probably not.
var actionsEnabled = 0;

var moves,
	pushes,
	restarts;

var soko;
function goalExists(){
	var exists;
	for (var j=0; j<board.length; j++){
		exists = board[j].indexOf('H');
		if (exists !== -1){
			return true;
		}
		exists = board[j].indexOf('I');
		if (exists !== -1){
			return true;
		}
		exists = board[j].indexOf('J');
		if (exists !== -1){
			return true;
		}
		exists = board[j].indexOf('K');
		if (exists !== -1){
			return true;
		}
	}
	if (exists === -1){
		return false;
	}
}

function setupBoard(level){
	if (typeof gameData[curPack].levsDone[level] === 'undefined'){
		error('Not unlocked yet!',1);
		return;
	}

	actions(true);
	
	if (curRender !== 'Image'){
		clearAll();
	} else{
		clearAll2d();
	}

	lastBoard = level;

	board = clone(level);

	if (goalExists() === true){
		soko = false;
	} else {
		soko = true;
	}

	findChar();
	height = board.length;
	var longest = board.reduce(function (a, b) { return a.length > b.length ? a : b; });
	width = longest.length;

	offsetX = Math.round((width)/2.0 * -10.0 + 5);
	offsetY = Math.round((height)/2.0 * 10.0 - 5);

	if (curRender !== 'Image'){
		if (height > width) {
			camera.position.z = (height + 4) * 10;
		} else {
			camera.position.z = (width + 4) * 10;
		}
		camera.lookAt(center);
	}

	moves = 0;
	pushes = 0;
	restarts = 0;
	updateScores();
	
	fixButtons();
	
	if (curRender !== 'Image'){
		draw();
	} else{
		draw2d();
	}
}

// Gets the original board, rather than going back to memory.
function clone(theBoard){
	var newBoard = [];
	for (var i=0; i < packs[curPack].level[theBoard].length; i++){
		newBoard.push(packs[curPack].level[theBoard][i].slice(0));
	}
	return newBoard;
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

var e;
document.onkeydown = checkKey;
function checkKey(e) {
	e = e || window.event;
	if (e.keyCode){
		if (actionsEnabled === 1) {
			if (e.keyCode === keycode.up) {
				if (curRender !== 'Image'){
					move('up');
				}else{
					move2d('up');
				}
				updateScores();
			}
			else if (e.keyCode === keycode.down) {
				if (curRender !== 'Image'){
					move('down');
				}else{
					move2d('down');
				}
				updateScores();
			}
			else if (e.keyCode === keycode.left) {
				if (curRender !== 'Image'){
					move('left');
				}else{
					move2d('left');
				}
				updateScores();
			}
			else if (e.keyCode === keycode.right) {
				if (curRender !== 'Image'){
					move('right');
				}else{
					move2d('right');
				}
				updateScores();
			}
			else if (e.keyCode === keycode.restart) {
				if (curRender !== 'Image'){
					resetBoard();
				} else {
					resetBoard2d();
			}
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
}
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
