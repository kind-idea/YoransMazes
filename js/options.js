var gameData = {};
var toggles = {};
var keycode = {};
var useWebGL;
function defaultControls(){
	keycode.up = 38; // Up arrow
	keycode.down = 40; // Down arrow
	keycode.left = 37; // Left arrow
	keycode.right = 39; // Right arrow
	keycode.restart = 32; // Spacebar
	keycode.pause = 80; // P
	localStorage.keycode = JSON.stringify(keycode);
	correctOpts();
	errHide();
}
function defaultToggles(){
	toggles.decor = true;
	toggles.anim = false;
	toggles.alias = true;
	localStorage.toggles = JSON.stringify(toggles);
	correctOpts();
	errHide();
}
function defaultRender(){
	if (supportsWebGL === true){
		useWebGL = true;
	} else {
		useWebGL = false;
	}
	localStorage.useWebGL = JSON.stringify(useWebGL);
}

function GLOpts(what){
	if (what === 'hide'){
		document.getElementById('webglonly').style.display = 'none';
	} else if (what === 'show'){
		document.getElementById('webglonly').style.display = 'block';
	}
	vertCenter();
}

function toggleRender(){
	if (supportsWebGL === false){
		error('Your browser does not <a href="http://get.webgl.org/" title="Get WebGL">support WebGL, or has WebGL disabled</a>.',1);
		useWebGL = false;
	} else if (supportsWebGL === true){
		if (useWebGL === false){
			useWebGL = true;
		} else if (useWebGL === true){
			useWebGL = false;
		}
	}
	localStorage.useWebGL = JSON.stringify(useWebGL);
	correctOpts();
}
function toggle(option){
	if (useWebGL === false){
		error('These only work if the WebGL renderer is enabled.',1);
		return;
	}

	toggles[option] = !toggles[option];
	var id = 'toggle' + option;
	if (toggles[option] === false){
		document.getElementById(id).innerHTML = '<span class="disabled">DISABLED</span>';
	} else{
		document.getElementById(id).innerHTML = '<span class="enabled">ENABLED</span>';
	}
	localStorage.toggles = JSON.stringify(toggles);

	if (toggles.decor === true && loadedDecor !== 2){
		waitingFor = 'decor';
		loadDecor();
	}
}

var changingKey;
var setKeyAction = 0;

function changeKeycode(thekey){
	if (actionsEnabled === 1){
		error('No changing keys while you&apos;re allowed to move too!',1);
		return;
	}
	error('Please press the key you would like to use for ' + thekey + '.',0,1);
	setKeyAction = 1;
	changingKey = thekey;
	document.getElementById("blur-hack").focus();
}
function saveKeycode(code){
	setKeyAction = 0;
	keycode[changingKey] = code;
	localStorage.keycode = JSON.stringify(keycode);
	var id = 'control' + changingKey;
	document.getElementById(id).innerHTML = String.fromCharCode(code);
	errHide();
	changingKey = null;
}


function correctOpts(){
	document.getElementById('renderopt').innerHTML = useWebGL;
	if (useWebGL === false){
		GLOpts('hide');
	} else{
		GLOpts('show');
	}

	var directions = Object.keys(keycode);
	for (var i=0; i<directions.length; i++){
		var ida = 'control' + directions[i];
		var code = keycode[directions[i]];
		document.getElementById(ida).innerHTML = String.fromCharCode(code);
	}
	var bools = Object.keys(toggles);
	for (var i=0; i<bools.length; i++){
		var idb = 'toggle' + bools[i];
		if (toggles[bools[i]] === true){
			document.getElementById(idb).innerHTML = '<span class="enabled">ENABLED</span>';
		}else{
			document.getElementById(idb).innerHTML = '<span class="disabled">DISABLED</span>';
		}
	}
}

// DATA
function loadData(){
	if (supportsWebGL === true){
		if (!localStorage.useWebGL){
			defaultRender();
		} else {
			useWebGL = JSON.parse(localStorage.useWebGL);
		}
	} else{
		useWebGL = false;
	}

	if (!localStorage.gameData){
		clearData();
	} else {
		gameData = JSON.parse(localStorage.gameData);
		var thepacks = Object.keys(packs);
		for (var i=0; i<thepacks.length; i++){
			if (typeof gameData[thepacks[i]] === 'undefined'){
				gameData[thepacks[i]] = { 
					isComplete : false,
					levsDone : [],
					Mmoves : [],
					Mpushes : [],
					Mrestarts : [],
					Pmoves : [],
					Ppushes : [],
					Prestarts : []
				};
				gameData[thepacks[i]].levsDone[0] = 0;
			}
		}
	}
	if (!localStorage.keycode){
		defaultControls();
	} else {
		keycode = JSON.parse(localStorage.keycode);
	}
	if (!localStorage.toggles){
		defaultToggles();
	} else {
		toggles = JSON.parse(localStorage.toggles);
	}

	correctOpts();
}

function clearData(){
	var thepacks = Object.keys(packs);
	gameData = {};
	for (var i=0; i<thepacks.length; i++){
		gameData[thepacks[i]] = { 
			isComplete : false,
			levsDone : [],
			Mmoves : [],
			Mpushes : [],
			Mrestarts : [],
			Pmoves : [],
			Ppushes : [],
			Prestarts : []
		};
		gameData[thepacks[i]].levsDone[0] = 0;
	}
	localStorage.gameData = JSON.stringify(gameData);
	errHide();
}

function resetVis(){
	defaultRender();
	defaultToggles();
}
function resetCon(){
	defaultControls();
}
function deleteDat(){
	var customReset = [];
	localStorage.custom = JSON.stringify(customReset);
	clearData();
	location.reload();
}