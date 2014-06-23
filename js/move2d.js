function move2d(dir){
	// future (f) and future future (t) spots. current spots are x and y
	var x = charX;
	var y = charY;
	var fy, ty, fx, tx;
	if (dir === "up"){
		fy = y - 1;
		ty = y - 2;
		fx = x;
		tx = x;
	} else if (dir === 'down'){
		fy = y + 1;
		ty = y + 2;
		fx = x;
		tx = x;
	} else if (dir === 'left'){
		fy = y;
		ty = y;
		fx = x - 1;
		tx = x - 2;
	} else if (dir === 'right'){
		fy = y;
		ty = y;
		fx = x + 1;
		tx = x + 2;
	} else {
		error('That\'s not a direction!',1);
		return;
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

	var farX = tx * imgsize;
	var farY = ty * imgsize;
	
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
		var coor = fx + '-' + fy + '-1';
		var newc = tx + '-' + ty;
		var block = document.getElementById(coor);

		block.style.left = farX + 'px';
		block.style.top = farY + 'px';

		if (far === '`'){
			far = '!';
			block.id = newc + '-1';
		} else if (far === ' '){
			far = '$';
			block.id = newc + '-1';
		} else if (far === '.'){
			far = '*';
			block.id = newc + '-1';
		} else if (far === '~'){
			far = '`';
			block.style.zIndex = 0;
			block.id = newc + '-0';
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
			setVis('2dopened','visible');
			setVis('2dclosed','hidden');
		}
	} else {
		if (soko === false){
			setVis('2dopened','hidden');
			setVis('2dclosed','visible');
		}
	}
	optimX = charX * imgsize;
	optimY = charY * imgsize;

	var char2d = document.getElementById('2dchar');
	char2d.style.top = optimY + 'px';
	char2d.style.left = optimX + 'px';
}