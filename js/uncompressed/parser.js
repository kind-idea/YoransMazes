function textParse(){
	var textArea = document.getElementById("addtext");
	var text = textArea.value.split("\n"); // each line is pushed to the array
	
	var header = []; // File header
	var levels = []; // Levels
	var data = []; // Metadata
	var gamedat = [];

	var name;
	var author;
	var condensedN;

	var levelNum = -1; // The level number we're adding

	var levelStart; // Which line in the text to start at when we add new level
	var notesStart; // Which line in text to start searching for notes

	// Maze parsing
	function getMetaData(){
		var theresName = 0;
		var theresAuth = 0;
		for (var i=0; i<text.length; i++){
			if (/^\s*;/.test(text[i])){
				continue;
			} else if (/^\s*Title:\s*/.test(text[i])){
				name = text[i].replace(/^\s*Title:\s*/,'');
				condensedN = name.replace(/[^\w\s0-9]/gi, '');
				theresName = 1;
			} else if (/^\s*Author:\s*/.test(text[i])){
				author = text[i].replace(/^\s*Author:\s*/,'');
				theresAuth = 1;
			}
			if (theresName === 1 && theresAuth === 1){
				levelStart = i+1;
				getLevels();
			}
		}
	}
	function getLevels(){
		var levelsHaveStarted = 1;
		for (var i=levelStart; i<text.length; i++){
			if (/^\s*;/.test(text[i])){
				continue;
			}
			if (text[i] === '' && levelsHaveStarted === 1){
				levelNum += 1;
				gamedat[levelNum] = 0;
				levels[levelNum] = [];
				levelsHaveStarted = 0;
			} else if(/^[\@\+\$\*\. \#\!\^\`\~\%\:\-\?ABCDHIJKXYZUVW1-7]+$/.test(text[i])){
				levels[levelNum].push(text[i]);
				levelsHaveStarted = 1;
			}
		}
	}
	// Soko parsing
	function getFileHeader(){
		for (var i=0; i<text.length; i++){
			if (/^\s*;/.test(text[i])){
				continue;
			} if (text[i].indexOf("#") !== -1 && /^[\@\+\$\*\. \#]+$/.test(text[i])){ // If line is a board line, start adding levels.
				levelStart = i;
				addNewLevel();
				break;
			} else { // Or else we add the line to the header
				header.push(text[i]);
			}
		}
	}
	function addNewLevel() {
		levelNum += 1;
		gamedat[levelNum] = 0;
		levels[levelNum] = [];
		for (var i=levelStart; i<text.length; i++){
			if (/^\s*;/.test(text[i])){
				continue;
			} if (text[i].indexOf("#") !== -1 && /^[\@\+\$\*\. \#]+$/.test(text[i])){ // If line is a board line, start adding levels.
				var begin = text[i].indexOf("#");
				for (var j=0;j<begin;j++){
					text[i] = text[i].setCharAt(j,'#');
				}
				begin = text[i].lastIndexOf("#");
				for (var j=begin;j<text[i].length;j++){
					text[i] = text[i].setCharAt(j,'#');
				}
				levels[levelNum].push(text[i]);
			} else {
				notesStart = i;
				addLevelNotes();
				break;
			}
		}
	}
	function addLevelNotes(){
		data[levelNum] = [];
		for (var i=notesStart; i<text.length; i++){
			if (/^\s*;/.test(text[i])){
				continue;
			} else if (text[i].indexOf("#") !== -1 && /^[\@\+\$\*\. \#]+$/.test(text[i])){ // If line is a board line, start adding levels.
				levelStart = i;
				addNewLevel();
				break;
			} else {
				data[levelNum].push(text[i]);
			}
		}
	}
	if (parseMaze === 1){
		getMetaData();
		
	} else{
		name = document.getElementById('addname').value;
		condensedN = name.replace(/[\s]/gi, '');
		author = document.getElementById('addauth').value;

		getFileHeader();
	}

	function doesExist(){
		var thepacks = Object.keys(packs);
		for (var i=0;i<thepacks.length;i++){
			var name = 'custom' + condensedN;
			if (name === thepacks[i]){
				condensedN = condensedN + 'c';
			}
		}
	}

	doesExist();
	var newpack = {
		displayName : name,
		varName : condensedN,
		type : 'custom',
		author : author,
		level : levels
	};

	custom.push(newpack);
	
	gameData['custom' + condensedN] = { 
		isComplete : false,
		levsDone : gamedat,
		Mmoves : [],
		Mpushes : [],
		Mrestarts : [],
		Pmoves : [],
		Ppushes : [],
		Prestarts : []
	};

	console.log(JSON.stringify(newpack.level));

	localStorage.gameData = JSON.stringify(gameData);
	localStorage.custom = JSON.stringify(custom);
	
	packs['custom' + condensedN] = custom[custom.length - 1];
	
	makePacksTable();
	
	document.getElementById('addtext').value = '; You just added levels! But I guess you can add more.';
	document.getElementById('addname').value = '';
	document.getElementById('addauth').value = '';
	
	nav('add','hide');
}