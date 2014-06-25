function setDisp(id,display){ document.getElementById(id).style.display = display; }
function setVis(id,vis){ document.getElementById(id).style.visibility = vis; }
function overlay(z){
	if (z === 7){ setDisp('overlay7','block'); }
	else if(z === 3){ setDisp('overlay3','block'); }
	else if(z === 1){ setDisp('overlay1','block'); }
}
function unover(z){
	if (z === 7){ setDisp('overlay7','none'); }
	else if(z === 3){ setDisp('overlay3','none'); }
	else if(z === 1){ setDisp('overlay1','none'); }
}
function actions(bool){
	if (bool === true){
		actionsEnabled = 1;
		if (curRender !== 'Image'){
			controls.enabled = true;
		}
	} else{
		actionsEnabled = 0;
		if (curRender !== 'Image'){
			controls.enabled = false;
		}
	}
}

var theresError = false;
var canCloseError = true;
function error(message,canClose,noHead,premessage){
	theresError = true;
	setVis('error','visible');
	overlay(7);

	if(canClose === 0){
		setDisp('errclose','none');
		canCloseError = false;
	}else {
		setDisp('errclose','block');
	}
	if(noHead === 1){
		canCloseError = true;
		setDisp('errhead','none');
	} else{
		setDisp('errhead','block');
	}
	
	var addtxt;
	if (premessage === 'viz'){
		message = 'Are you sure you want to reset your visual settings?<br/>(You may need to refresh the page afterwards)';
		addtxt = '<button onclick="resetVis()">Reset Visual Settings</button>';
		document.getElementById('erraddtxt').innerHTML = addtxt;
		setDisp('erraddtxt','block');
	} else if(premessage === 'con'){
		message = 'Are you sure you want to reset your controls?';
		addtxt = '<button onclick="resetCon()">Reset Controls</button>';
		document.getElementById('erraddtxt').innerHTML = addtxt;
		setDisp('erraddtxt','block');
	} else if(premessage === 'del'){
		message = 'This will delete all your gamedata AND any custom stages you have added.  Are you absolutely sure?';
		addtxt = '<button onclick="deleteDat()">Delete Gamedata and Custom Levels</button>';
		document.getElementById('erraddtxt').innerHTML = addtxt;
		setDisp('erraddtxt','block');
	}
	
	document.getElementById('errtxt').innerHTML = message;
	
	vertCenter();
}
function errHide(){
	theresError = false;
	setDisp('erraddtxt','none');
	document.getElementById('errtxt').innerHTML = '';
	setVis('error','hidden');
	unover(7);
}

function mainMenu(){
	if (curRender !== 'Image'){
		clearAll();
		render();
	} else{
		clearAll2d();
	}
	isPaused = false;
	setDisp('loadingPage','none');
	setDisp('page','block');
	makePacksTable();
	actions(false);
	setDisp('hud','none');
	setVis('pause','hidden');
	setVis('main','visible');
	overlay(1);
	vertCenter();
}

var lastNavd = 'unnav';
var gameOnNav = false;
function nav(id,playing){
	if (playing === 'yes'){
		setDisp('page','block');
		gameOnNav = true;
		vertCenter();
	}
	setVis(id,'visible');
	overlay(3);
	lastNavd = id;
}
function unNav(){
	if (gameOnNav === true){
		setDisp('page','none');
		gameOnNav = false;
	}
	unover(3);
	setVis(lastNavd,'hidden');
	lastNavd = 'unnav';
}
var isPaused;
function pause(){
	isPaused = true;
	actions(false);
	setVis('pause','visible');
	overlay(1);
	setDisp('page','block');
	vertCenter();
}
function unpause(){
	isPaused = false;
	actions(true);
	setVis('pause','hidden');
	unover(1);
	setDisp('page','none');
}

var curPack;
function play(level,pack){
	unover(1);
	unover(3);
	
	curPack = pack;
	
	setVis('main','hidden');
	setVis('pause','hidden');
	setVis('next','hidden');
	setVis('select','hidden');
	setDisp('page','none');
	setDisp('hud','block');
	
	setupBoard(level);
}

function fixButtons(){
	if (gameData[curPack].levsDone[lastBoard + 1] === 0 || gameData[curPack].levsDone[lastBoard + 1] === 1){
		setVis('right','visible');
	} else {
		setVis('right','hidden');
	}
	
	if (gameData[curPack].levsDone[lastBoard - 1] === 0 || gameData[curPack].levsDone[lastBoard - 1] === 1){
		setVis('left','visible');
	} else {
		setVis('left','hidden');
	}
}

function makePacksTable(){
	createSelect();
	setDisp('levhelp','block');
	vertCenter();
}

function viewPack(pack){
	var divs = document.querySelectorAll('#alllevels>div');
	setDisp('levhelp','none');
	for (var i=0; i<divs.length; i++){
		divs[i].style.display = 'none';
	}
	setDisp(pack + '-levsel','block');

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
	setDisp(pack + '-p' + page,'block');
	document.getElementById(pack + '-p' + page + '-nav').className = "selected";
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
	setDisp('how' + num,'block');
	lastHT = num;
}

function updateScores(){
	document.getElementById('moves').innerHTML = moves;
	document.getElementById('pushes').innerHTML = pushes;

	var mMoves = document.getElementById('Mmoves');
	var mPushes = document.getElementById('Mpushes');
	var pMoves = document.getElementById('Pmoves');
	var pPushes = document.getElementById('Ppushes');
	if (typeof gameData[curPack].Mmoves[lastBoard] === 'undefined') {
		mMoves.innerHTML = '-';
		mPushes.innerHTML = '-';
	} else {
		mMoves.innerHTML = gameData[curPack].Mmoves[lastBoard];
		mPushes.innerHTML = gameData[curPack].Mpushes[lastBoard];
	}
	if (typeof gameData[curPack].Ppushes[lastBoard] === 'undefined') {
		pMoves.innerHTML = '-';
		pPushes.innerHTML = '-';
	} else {
		pMoves.innerHTML = gameData[curPack].Pmoves[lastBoard];
		pPushes.innerHTML = gameData[curPack].Ppushes[lastBoard];
	}
}

function onWin(){
	actions(false);
	gameData[curPack].levsDone[lastBoard] = 1;
	
	document.getElementById('endMoves').innerHTML = moves;
	document.getElementById('endPushes').innerHTML = pushes;

	saveBestPushes();

	setVis('next','visible');

	if (packs[curPack].level[lastBoard + 1]){
			if (gameData[curPack].levsDone[lastBoard + 1] !== 1){
				gameData[curPack].levsDone[lastBoard + 1] = 0;
			}
		setDisp('nl','block');
		setDisp('eg','none');
		document.getElementById("nl").focus();
	} else {
		setDisp('eg','block');
		setDisp('nl','none');
	}
	if (isItCompleted() === true){
		gameData[curPack].isComplete = true;
	}
	createSelect();
	viewPack(curPack);
	
	localStorage.gameData = JSON.stringify(gameData);
}

function saveBestPushes(){
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
	actions(true);

	document.getElementById('next').style.visibility = 'hidden';
	
	if (curRender !== 'Image'){
		resetBoard();
	} else {
		resetBoard2d();
	}
}
function nextlev(){
	document.getElementById('next').style.visibility = 'hidden';
	
	setupBoard(lastBoard + 1);
}
function prevlev(){
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

function createSelect(){
	var thepacks = Object.keys(packs);
	var customData = 0;
	var Mhtml = '<table><tr><th>Pack</th><th>Author</th><th></th></tr>';
	var Shtml = '<table><tr><th>Pack</th><th>Author</th><th></th></tr>';
	var Chtml = '<table><tr><th>Pack</th><th>Author</th><th></th></tr>';
	var html = '';
	var numDone;

	for (var i=0; i<thepacks.length; i++){
		numDone = numOfComplete(gameData[thepacks[i]].levsDone);

		html = '<tr onclick="viewPack(\'' + thepacks[i] + '\')"';
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
	
	Mhtml += '</table>';
	Shtml += '</table>';
	Chtml += '</table>';
	document.getElementById('mazes').innerHTML = Mhtml;
	document.getElementById('soko').innerHTML = Shtml;
	if (customData === 1){
		setDisp('custom','block');
		document.getElementById('customtable').innerHTML = Chtml;
	}
	else {
		setDisp('custom','none');
	}

	html = '';
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