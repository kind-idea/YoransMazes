var curPack;

function overlay(z){
	if (z === 7){
		document.getElementById('overlay7').style.display = 'block';
	} else if(z === 3){
		document.getElementById('overlay3').style.display = 'block';
	}else if(z === 1){
		document.getElementById('overlay1').style.display = 'block';
	}
}
function unover(z){
	if (z === 7){
		document.getElementById('overlay7').style.display = 'none';
	} else if(z === 3){
		document.getElementById('overlay3').style.display = 'none';
	}else if(z === 1){
		document.getElementById('overlay1').style.display = 'none';
	}
}

var theresError = false;
var canCloseError = true;
function error(message,canClose,noHead,premessage){
	theresError = true;
	document.getElementById('error').style.visibility = 'visible';
	overlay(7);

	if(canClose === 0){
		document.getElementById("errclose").style.display = 'none';
		canCloseError = false;
	}
	if(noHead === 1){
		canCloseError = true;
		document.getElementById("errhead").style.display = 'none';
	}
	
	var addtxt;
	if (premessage === 'viz'){
		message = 'Are you sure you want to reset your visual settings?<br/>(You may need to refresh the page afterwards)';
		addtxt = '<button onclick="resetVis()">Reset Visual Settings</button>';
		document.getElementById('erraddtxt').innerHTML = addtxt;
		document.getElementById("erraddtxt").style.display = 'block';
	} else if(premessage === 'con'){
		message = 'Are you sure you want to reset your controls?';
		addtxt = '<button onclick="resetCon()">Reset Controls</button>';
		document.getElementById('erraddtxt').innerHTML = addtxt;
		document.getElementById("erraddtxt").style.display = 'block';
	} else if(premessage === 'del'){
		message = 'This will delete all your gamedata AND any custom stages you have added.  Are you absolutely sure?';
		addtxt = '<button onclick="deleteDat()">Delete Gamedata and Custom Levels</button>';
		document.getElementById('erraddtxt').innerHTML = addtxt;
		document.getElementById("erraddtxt").style.display = 'block';
	}
	
	document.getElementById('errtxt').innerHTML = message;
	
	vertCenter();
}

function fixButtons(){
	if (gameData[curPack].levsDone[lastBoard + 1] === 0 || gameData[curPack].levsDone[lastBoard + 1] === 1){
		document.getElementById("right").style.visibility = 'visible';
	} else {
		document.getElementById("right").style.visibility = 'hidden';
	}
	
	if (gameData[curPack].levsDone[lastBoard - 1] === 0 || gameData[curPack].levsDone[lastBoard - 1] === 1){
		document.getElementById("left").style.visibility = 'visible';
	} else {
		document.getElementById("left").style.visibility = 'hidden';
	}
}

function errHide(){
	theresError = false;
	document.getElementById("errhead").style.display = 'block';
	document.getElementById("errclose").style.display = 'block';
	document.getElementById("erraddtxt").style.display = 'none';
	document.getElementById('errtxt').innerHTML = '';
	document.getElementById('error').style.visibility = 'hidden';
	unover(7);
}
var lastNavd = document.getElementById('unnav');
var gameOnNav = false;
function nav(id,playing){
	if (playing === 'yes'){
		document.getElementById('page').style.display = 'block';
		gameOnNav = true;
		vertCenter();
	}
	document.getElementById(id).style.visibility = 'visible';
	overlay(3);
	lastNavd = document.getElementById(id);
}
function unNav(){
	if (gameOnNav === true){
		document.getElementById('page').style.display = 'none';
		gameOnNav = false;
	}
	unover(3);
	lastNavd.style.visibility = 'hidden';
	lastNavd = document.getElementById('unnav');
}
function mainMenu(){
	isPaused = false;
	document.getElementById('page').style.display = 'block';
	vertCenter();
	clearAll();
	scene.remove(charMesh);
	scene.remove(doorClose);
	scene.remove(doorOpen);
	makePacksTable();
	render();
	actionsEnabled = 0;
	controls.enabled = false;
	document.getElementById('hud').style.display = 'none';
	document.getElementById('pause').style.visibility = 'hidden';
	document.getElementById('main').style.visibility = 'visible';
	overlay(1);
}
var isPaused;
function pause(){
	isPaused = true;
	actionsEnabled = 0;
	controls.enabled = false;
	document.getElementById('pause').style.visibility = 'visible';
	overlay(1);
	document.getElementById('page').style.display = 'block';
	vertCenter();
}
function unpause(){
	isPaused = false;
	actionsEnabled = 1;
	controls.enabled = true;
	document.getElementById('pause').style.visibility = 'hidden';
	unover(1);
	document.getElementById('page').style.display = 'none';
}

function createTables(){
	var thepacks = Object.keys(packs);
		var customData = 0;
		var Mhtml = '<tr><th>Pack</th><th>Author</th><th></th></tr>';
		var Shtml = '<tr><th>Pack</th><th>Author</th><th></th></tr>';
		var Chtml = '<tr><th>Pack</th><th>Author</th><th></th></tr>';
		
		for (var i=0; i<thepacks.length; i++){
			var numDone = numOfComplete(gameData[thepacks[i]].levsDone);

			var html = '<tr onclick="viewPack(\'' + thepacks[i] + '\')"';
			if (gameData[thepacks[i]].isComplete === true){
				html += ' class="completed"';
			}
			html += '>';
	
			html += '<td><a href="#">' + packs[thepacks[i]].displayName + '</a></td>';
			html += '<td>' + packs[thepacks[i]].author + '</td>';
			html += '<td class="endot';
			html += '">' + numDone + '/' + packs[thepacks[i]].level.length + '</td>';
		
			html += '</tr>';
		
			if (packs[thepacks[i]].type === 'soko') {
				Shtml += html;
			} else if (packs[thepacks[i]].type === 'maze') {
				Mhtml += html;
			} else if (packs[thepacks[i]].type === 'custom') {
				customData = 1;
				Chtml += html;
			}
		}
		
		document.getElementById('mazes').innerHTML = Mhtml;
		document.getElementById('soko').innerHTML = Shtml;
		if (customData === 1){
			document.getElementById('custom').style.display = 'block';
			document.getElementById('customtable').innerHTML = Chtml;
		}
		else {
			document.getElementById('custom').style.display = 'none';
		}
	}
	function createLists(){
		var thepacks = Object.keys(packs);
		var html = '';
		for (var i=0; i<thepacks.length; i++){
			html += '<div id="' + thepacks[i] + '-levsel" style="display:none">';
			html += '<h3>' + packs[thepacks[i]].displayName + '</h3>';
			var list = '<div class="list">';
			var nav = '';
			var page = 0;
			for (var j=0; j<packs[thepacks[i]].level.length; j++){
				var name = j+1;
			
				if (j === 0){
					page += 1;
					list += '<div id="' + thepacks[i] + '-p'+ page +'" style="display:block"><ol>';
				}
				else if (j % 30 === 0){
					page += 1;
					list += '</div><div id="' + thepacks[i] + '-p'+ page +'" style="display:none">';
				}
				
				if(j % 6 === 0 && j !== 0){
					list += '</ol><ol>';
				}
				
				list += '<li>';
				if (typeof gameData[thepacks[i]].levsDone[j] !== 'undefined' && (gameData[thepacks[i]].levsDone[j] === 1 || gameData[thepacks[i]].levsDone[j] === 0)){
					list += '<a href="#" onclick="play(' + j + ',\''+ thepacks[i] +'\')"';
					if (gameData[thepacks[i]].levsDone[j] === 1){
						list += 'class="comp"';
					}
					list += '>' + name + '</a>';
				} else {
					list += '<span>' + name + '</span>';
				}
				list += '</li>';
			}
			list += '</ol></div></div>';
			html += list;
			
			if (page > 1){
				nav += '<div class="listnav"><div><a href="#" class="left" onclick="viewPage(\'left\',\'' + thepacks[i] + '\')"></a><ul>';
				
				for (var j=0; j<page; j++){
					if (j===0){
						nav += '<li><a href="#" class="selected" onclick="viewPage(' + (j+1) + ',\'' + thepacks[i] + '\')" id="'+ thepacks[i] +'-p' + (j+1) +'-nav"></a></li>';
					} else {
						nav += '<li><a href="#" onclick="viewPage(' + (j+1) + ',\'' + thepacks[i] + '\')" id="'+ thepacks[i] +'-p' + (j+1) +'-nav"></a></li>';
					}
				}
				
				nav += '</ul><a href="#" class="right" onclick="viewPage(\'right\',\'' + thepacks[i] + '\')"></a></div></div>';
			}
			html += nav;
			
			html += '</div>';
		}
		
		document.getElementById('alllevels').innerHTML = html;
	}

function makePacksTable(){
	createTables();
	createLists();
	document.getElementById('levhelp').style.display = 'block';
	vertCenter();
}

function viewPack(pack){
	var divs = document.querySelectorAll('#alllevels>div');
	document.getElementById('levhelp').style.display = 'none';
	for (var i=0; i<divs.length; i++){
		divs[i].style.display = 'none';
	}
	document.getElementById(pack + '-levsel').style.display = 'block';

	vertCenter();
}
var lastPage;
function viewPage(page,pack){
	var divs = document.querySelectorAll('#' + pack + '-levsel div.list>div');
	for (var i=0; i<divs.length; i++){
		if (divs[i].style.display == 'block'){
			divs[i].style.display = 'none';
			lastPage = i+1;
		}
	}
	var lis = document.querySelectorAll('#' + pack + '-levsel div.listnav ul li a');
	for (var i=0; i<lis.length; i++){
		lis[i].className = "";
	}
	if (page === 'left'){
		page = lastPage - 1;
		if (page === 0){
			page = divs.length;
		}
	} else if(page === 'right'){
		page = lastPage + 1;
		if (page === divs.length + 1){
			page = 1;
		}
	}
	document.getElementById(pack + '-p' + page + '-nav').className = "selected";
	document.getElementById(pack + '-p' + page).style.display = 'block';
}
var lastHT = 1;
function viewHT(num){
	if (num === 'right'){
		num = lastHT + 1;
		if (num === 5){
			num = 1;
		}
	} else if(num === 'left'){
		num = lastHT - 1;
		if (num === 0){
			num = 4;
		}
	}
	var divs = document.querySelectorAll('#howdivs>div');
	for (var i=0; i<divs.length; i++){
		divs[i].style.display = 'none';
	}
	var lis = document.querySelectorAll('#how div.listnav ul li a');
	for (var i=0; i<lis.length; i++){
		lis[i].className = "";
	}
	document.getElementById('how' + num + '-nav').className = "selected";
	document.getElementById('how' + num).style.display = 'block';
	document.getElementById('how' + num).style.display = 'block';
	lastHT = num;
}
function play(level,pack){
	unover(1);
	unover(3);
	scene.add(charMesh);
	scene.add(doorClose);
	scene.add(doorOpen);
	
	curPack = pack;
	
	document.getElementById('main').style.visibility = 'hidden';
	document.getElementById('pause').style.visibility = 'hidden';
	document.getElementById('next').style.visibility = 'hidden';
	document.getElementById('select').style.visibility = 'hidden';
	document.getElementById('page').style.display = 'none';
	document.getElementById('hud').style.display = "block";
	
	setupBoard(level);
}

function updateScores(){
	document.getElementById('moves').innerHTML = moves;
	document.getElementById('pushes').innerHTML = pushes;
//	document.getElementById('restartsnum').innerHTML = restarts;

	if (typeof gameData[curPack].Mmoves[lastBoard] === 'undefined') {
		document.getElementById('Mmoves').innerHTML = '-';
		document.getElementById('Mpushes').innerHTML = '-';
//		document.getElementById('Mrestartsnum').innerHTML = '-';
	} else {
		document.getElementById('Mmoves').innerHTML = gameData[curPack].Mmoves[lastBoard];
		document.getElementById('Mpushes').innerHTML = gameData[curPack].Mpushes[lastBoard];
//		document.getElementById('Mrestartsnum').innerHTML = gameData[curPack].Mrestarts[lastBoard];
	}
	if (typeof gameData[curPack].Ppushes[lastBoard] === 'undefined') {
		document.getElementById('Pmoves').innerHTML = '-';
		document.getElementById('Ppushes').innerHTML = '-';
//		document.getElementById('Prestartsnum').innerHTML = '-';
	} else {
		document.getElementById('Pmoves').innerHTML = gameData[curPack].Pmoves[lastBoard];
		document.getElementById('Ppushes').innerHTML = gameData[curPack].Ppushes[lastBoard];
//		document.getElementById('Prestartsnum').innerHTML = gameData[curPack].Prestarts[lastBoard];
	}
}

function onWin(){
	actionsEnabled = 0;
	controls.enabled = false;
	gameData[curPack].levsDone[lastBoard] = 1;
	
	document.getElementById('endMoves').innerHTML = moves;
	document.getElementById('endPushes').innerHTML = pushes;
	
	// Save the best scores (a bit messy)
	if (typeof gameData[curPack].Mmoves[lastBoard] === 'undefined') {
		gameData[curPack].Mmoves[lastBoard] = moves;
	} else if (moves < gameData[curPack].Mmoves[lastBoard]){
		gameData[curPack].Mmoves[lastBoard] = moves;
		gameData[curPack].Mpushes[lastBoard] = pushes;
		gameData[curPack].Mrestarts[lastBoard] = restarts;
	} else if (moves === gameData[curPack].Mmoves[lastBoard] && pushes < gameData[curPack].Mpushes[lastBoard]){
		gameData[curPack].Mmoves[lastBoard] = moves;
		gameData[curPack].Mpushes[lastBoard] = pushes;
		gameData[curPack].Mrestarts[lastBoard] = restarts;
	} else if (moves === gameData[curPack].Mmoves[lastBoard] && pushes === gameData[curPack].Mpushes[lastBoard] && restarts < gameData[curPack].Mrestarts[lastBoard]){
		gameData[curPack].Mmoves[lastBoard] = moves;
		gameData[curPack].Mpushes[lastBoard] = pushes;
		gameData[curPack].Mrestarts[lastBoard] = restarts;
	}
	if (typeof gameData[curPack].Pmoves[lastBoard] === 'undefined') {
		gameData[curPack].Pmoves[lastBoard] = moves;
	}
	if (typeof gameData[curPack].Mpushes[lastBoard] === 'undefined') {
		gameData[curPack].Mpushes[lastBoard] = pushes;
	}
	if (typeof gameData[curPack].Ppushes[lastBoard] === 'undefined') {
		gameData[curPack].Ppushes[lastBoard] = pushes;
	} else if (pushes < gameData[curPack].Ppushes[lastBoard]) {
		gameData[curPack].Pmoves[lastBoard] = moves;
		gameData[curPack].Ppushes[lastBoard] = pushes;
		gameData[curPack].Prestarts[lastBoard] = restarts;
	} else if (pushes === gameData[curPack].Ppushes[lastBoard] && moves < gameData[curPack].Pmoves[lastBoard]) {
		gameData[curPack].Pmoves[lastBoard] = moves;
		gameData[curPack].Ppushes[lastBoard] = pushes;
		gameData[curPack].Prestarts[lastBoard] = restarts;
	} else if (pushes === gameData[curPack].Ppushes[lastBoard] && moves === gameData[curPack].Pmoves[lastBoard] && restarts < gameData[curPack].Prestarts[lastBoard]) {
		gameData[curPack].Pmoves[lastBoard] = moves;
		gameData[curPack].Ppushes[lastBoard] = pushes;
		gameData[curPack].Prestarts[lastBoard] = restarts;
	}
	if (typeof gameData[curPack].Mrestarts[lastBoard] === 'undefined') {
		gameData[curPack].Mrestarts[lastBoard] = restarts;
	}
	if (typeof gameData[curPack].Prestarts[lastBoard] === 'undefined') {
		gameData[curPack].Prestarts[lastBoard] = restarts;
	}
	
	if (isItCompleted() === true){
		gameData[curPack].isComplete = true;
	}

	document.getElementById('next').style.visibility = 'visible';

	if (packs[curPack].level[lastBoard + 1]){
			if (gameData[curPack].levsDone[lastBoard + 1] !== 1){
				gameData[curPack].levsDone[lastBoard + 1] = 0;
			}
		document.getElementById('nl').style.display = 'block';
		document.getElementById('eg').style.display = 'none';
		document.getElementById("nl").focus();
	} else {
		document.getElementById('eg').style.display = 'block';
		document.getElementById('nl').style.display = 'none';
	}
	createLists();
	createTables();
	viewPack(curPack);
	localStorage.gameData = JSON.stringify(gameData);
}

function numOfComplete(array){
	var count = 0;
	for(var i = 0; i < array.length; ++i){
		if(array[i] == 1)
			count++;
	}
	return count;
}

function isItCompleted(){
	if (gameData[curPack].levsDone.length === packs[curPack].level.length){
		for (var i=0; i<gameData[curPack].levsDone.length; i++){
			if (gameData[curPack].levsDone[i] === 0){
				return false;
			} else if (i === (packs[curPack].level.length - 1)) {
				return true;
			}
		}
	} else {
		return false;
	}
}
function restart(){
	actionsEnabled = 1;
	controls.enabled = true;

	document.getElementById('next').style.visibility = 'hidden';
	
	resetBoard();
}
function nextlev(){
	actionsEnabled = 1;
	controls.enabled = true;

	document.getElementById('next').style.visibility = 'hidden';
	
	setupBoard(lastBoard + 1);
}
function prevlev(){
	actionsEnabled = 1;
	controls.enabled = true;

	document.getElementById('next').style.visibility = 'hidden';
	
	setupBoard(lastBoard - 1);
}

var parseMaze = 1;
function sokonly(show){
	if(show===0){
		document.getElementById('SOKonly').style.display = 'none';
		parseMaze = 1;
	}else{
		document.getElementById('SOKonly').style.display = 'block';
		parseMaze = 0;
	}
	
	vertCenter();
}