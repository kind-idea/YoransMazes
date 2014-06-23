function clearAll2d(){
	var cont = document.getElementById('twocont');
	cont.innerHTML = '';
}
var imgsize;

function resetBoard2d(){
	document.getElementById('ref').className = '';
	var wait = setTimeout(function(){
		document.getElementById('ref').className = 'anim';
	},15);
	
	var classMatcher = /(?:^|\s)box(?:\s|$)/;
	var els = document.getElementById("twocont").getElementsByTagName("img");
	for (var i=els.length;i--;){
		if (classMatcher.test(els[i].className)){
			els[i].parentNode.removeChild(els[i]);
		}
	}
	
	var cont = document.getElementById('twocont');
	var html = '';
	function addImage(img,i,j,z,id){
		var x = Math.round(i * imgsize);
		var y = Math.round(j * imgsize);
		var src = '2d/'+ img +'.png';
		html += '<img src="'+ src +'" class="'+img+'" width="'+imgsize+'" height="'+imgsize+'" alt="'+img+'" style="top:'+y+'px;left:'+x+'px;z-index:'+z+';"';
		if (id){
			html += ' id="'+id+'"';
		}
		html += '/>';
	}
	function drawBoxesAgain(){
		for (var j=0; j<board.length; j++){
			for (var i=0; i<board[j].length; i++){
			var val = board[j][i];
				if (val === '!' || val === '^' || val === '`'){
					addImage('box',i,j,1,i+'-'+j+'-'+'0');
				}
				if (val === '$' || val === '*' || val === '!'){
					addImage('box',i,j,3,i+'-'+j+'-'+'1');
				}
			}
		}
		cont.innerHTML += html;
	}
	
	board = clone(lastBoard);
	
	drawBoxesAgain();
	
	if (soko === false){
		if (allPressed() === true){
			setVis('2dopened','visible');
			setVis('2dclosed','hidden');
		} else {
			setVis('2dopened','hidden');
			setVis('2dclosed','visible');
		}
	}
	
	charX = charXO;
	charY = charYO;

	document.getElementById('2dchar').style.left = charXO * imgsize + 'px';
	document.getElementById('2dchar').style.top = charYO * imgsize + 'px';
	
	moves = 0;
	pushes = 0;
	restarts += 1;
}
function draw2d(){
	var bcont = document.getElementById('playtwo');
	var cont = document.getElementById('twocont');
	var html = '';

	if (bcont.offsetWidth/width < bcont.offsetHeight/height){
		imgsize = Math.round(bcont.offsetWidth/width);
	} else {
		imgsize = Math.round(bcont.offsetHeight/height);
	}
	if (imgsize > 128){
		imgsize = 128;
	}

	var htmlHeight = Math.round(height * imgsize);
	var htmlWidth = Math.round(width * imgsize);
	cont.style.marginLeft = Math.round(-htmlWidth/2) + 'px';
	cont.style.marginTop = Math.round(-htmlHeight/2) + 'px';

	function addImage(img,i,j,z,id){
		var x = i * imgsize;
		var y = j * imgsize;
		var src;
		if (img === 'char' || img === 'box'){
			src = '2d/'+ img +'.png';
		} else {
			src = '2d/'+ img +'.jpg';
		}
		if (id === '2dclosed'){
			src = '2d/goalR.jpg';
		} else if (id === '2dopened'){
			src = '2d/goalG.jpg';
		}
		if (ie === true){
			if (id === '2dclosed'){
				src = '2d/ieGR.png';
			} else if (id === '2dopened'){
				src = '2d/ieGG.png';
			}
		}
		
		html += '<img src="'+ src +'" class="'+img+'" width="'+imgsize+'" height="'+imgsize+'" alt="'+img+'" style="top:'+y+'px;left:'+x+'px;z-index:'+z+';"';
		if (id){
			html += ' id="'+id+'"';
		}
		html += '/>';
	}
	
	function addColor(color,i,j,z){
		var x = i * imgsize;
		var y = j * imgsize;

		html += '<span style="background:'+color+';top:'+y+'px;left:'+x+'px;width:'+imgsize+'px;height:'+imgsize+'px;z-index:'+z+';"></span>';
	}

	for (var j=0; j<board.length; j++){
		for (var i=0; i<board[j].length; i++){
			var val = board[j].charAt(i);
			if (val === ' ' || val === '_' || val === '$' || val === '@'){
				addImage('cm',i,j,0);
			}
			if (val === '!' || val === '^' || val === '`' || val === '~'){
				addColor('#23ff07',i,j,2);
				if (val === '!' || val === '^' || val === '`'){
					addImage('box',i,j,1,i+'-'+j+'-'+'0');
				}
			}
			if (val === '.' || val === '+' || val === '*'){
				if (soko === false){
					addImage('metA',i,j,0);
					addColor('#e32606',i,j,5);
				} else{
					addImage('metB',i,j,0);
					addColor('#0f61ff',i,j,5);
				}
			}
			if (val === '@' || val === '^' || val === '+'){
				addImage('char',i,j,4,'2dchar');
			}
			if (val === '$' || val === '*' || val === '!'){
				addImage('box',i,j,3,i+'-'+j+'-'+'1');
			}
			if (val === 'H' || val === 'I' || val === 'J' || val === 'K'){
				addImage('goalR' + val,i,j,0,'2dclosed');
				addImage('goalG' + val,i,j,0,'2dopened');
			}
		}
	}
	cont.innerHTML = html;
	if (soko === false){
		if (allPressed() === true){
			setVis('2dopened','visible');
			setVis('2dclosed','hidden');
		} else {
			setVis('2dopened','hidden');
			setVis('2dclosed','visible');
		}
	}
}