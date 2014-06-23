var crateBlocks = [];
var buttonBlocks = [];

var addedCon;

var addedWat;

var addedBut;

var addedDet;

// decor
var barrels = [];
var tables = [];

function resetBoard(){
	document.getElementById('ref').className = '';
	var wait = setTimeout(function(){
		document.getElementById('ref').className = 'anim';
	},15);
	// Clear the boxes
	for (var i=0; i<crateBlocks.length; i++){
		scene.remove(crateBlocks[i]);
	}
	crateBlocks = [];

	function drawBoxesAgain(){
		function newMoveBlock(i,j,z){
			crateBlocks.push(crate.clone());
			crateBlocks[crateBlocks.length-1].position.set(i*10 + offsetX,j*-10 + offsetY,z*10 - 0.5);
			crateBlocks[crateBlocks.length-1].name = i + ',' + j + ',' + z;
			scene.add(crateBlocks[crateBlocks.length-1]);
		}
		for (var j=0; j<board.length; j++){
			for (var i=0; i<board[j].length; i++){
			var val = board[j][i];
				if (val === '!' || val === '^' || val === '`'){
					newMoveBlock(i,j,0);
				}
				if (val === '$' || val === '*' || val === '!'){
					newMoveBlock(i,j,1);
				}
			}
		}
	}

	board = clone(lastBoard);
	
	drawBoxesAgain();
	if (soko === false){
		if (allPressed() === true){
			doorOpen.visible = true;
			doorClose.visible = false;
		} else {
			doorOpen.visible = false;
			doorClose.visible = true;
		}
	}
	
	charX = charXO;
	charY = charYO;

	charMesh.position.set(charX*10 + offsetX,charY*-10 + offsetY,10);
	optimY = charY*-10 + offsetY;
	optimX = charX*10 + offsetX;
	if (charX === 0){
		charMesh.rotation.set(0,0,0); // Face Right
	} else if (charY === board.length - 1){
		charMesh.rotation.set(0,0,0.5 * Math.PI); // Face Up
	} else if (charX === board[0].length - 1) {
		charMesh.rotation.set(0,0,Math.PI); // Face Left
	} else {
		charMesh.rotation.set(0,0,-0.5 * Math.PI); // Face Down
	}
	rotDiff = 0;
	isRoted = 0;
	
	moves = 0;
	pushes = 0;
	restarts += 1;
	
	render();
}
function clearAll(){
	charMesh.visible = false;
	doorClose.visible = false;
	doorOpen.visible = false;

	if (doorCloseDec){
		scene.remove(doorCloseDec);
	}

	for (var i=0; i<crateBlocks.length; i++){
		scene.remove(crateBlocks[i]);
	}
	for (var i=0; i<buttonBlocks.length; i++){
		scene.remove(buttonBlocks[i]);
	}
	for (var i=0; i<barrels.length; i++){
		scene.remove(barrels[i]);
	}
	for (var i=0; i<tables.length; i++){
		scene.remove(tables[i]);
	}
	
	scene.remove(addedCon);
	scene.remove(addedWat);
	scene.remove(addedBut);
	scene.remove(addedDet);

	crateBlocks = [];
	buttonBlocks = [];
	barrels = [];
	tables = [];
}

function draw() {
	var mergedWat = new THREE.Geometry();
	var mergedCon = new THREE.Geometry();
	var mergedBut = new THREE.Geometry();
	var mergedDet = new THREE.Geometry();

	function newBegin(i,j){
		if (charY === 0) {
			charMesh.rotation.set(0,0,-0.5 * Math.PI); // Face Down
		} else if (charX === 0){
			charMesh.rotation.set(0,0,0); // Face Right
		} else if (charY === board.length - 1){
			charMesh.rotation.set(0,0,0.5 * Math.PI); // Face Up
		} else if (charX === board[0].length - 1) {
			charMesh.rotation.set(0,0,Math.PI); // Face Left
		}
		charMesh.position.set(i*10 + offsetX,j*-10 + offsetY,10);
		optimY = j*-10 + offsetY;
		optimX = i*10 + offsetX;
		rotDiff = 0;
		isRoted = 0;
		charMesh.visible = true;
	}
	function newEClose(i,j,a){
		doorClose.position.set(i*10 + offsetX,j*-10 + offsetY + 10,5);
		if (a === 0) {
			doorClose.rotation.z = Math.PI; // Top
			doorClose.position.x += 5;
			doorClose.position.y += -15;
		} else if (a === 3){
			doorClose.rotation.z = -0.5*Math.PI; // Left
			doorClose.position.x += 5;
			doorClose.position.y += -5;
		} else if (a === 2){
			doorClose.rotation.z = 0; // Bottom
			doorClose.position.x += -5;
			doorClose.position.y += -5;
		} else if (a === 1) {
			doorClose.rotation.z = 0.5*Math.PI; // Right
			doorClose.position.x += -5;
			doorClose.position.y += -15;
		}
		doorClose.visible = false;
	}
	function newEnd(i,j,a){
		doorOpen.position.set(i*10 + offsetX,j*-10 + offsetY + 10,5);
		if (a === 0) {
			doorOpen.rotation.z = Math.PI; // Top
			doorOpen.position.x += 5;
			doorOpen.position.y += -15;
		} else if (a === 3){
			doorOpen.rotation.z = -0.5*Math.PI; // Left
			doorOpen.position.x += 5;
			doorOpen.position.y += -5;
		} else if (a === 2){
			doorOpen.rotation.z = 0; // Bottom
			doorOpen.position.x += -5;
			doorOpen.position.y += -5;
		} else if (a === 1) {
			doorOpen.rotation.z = 0.5*Math.PI; // Right
			doorOpen.position.x += -5;
			doorOpen.position.y += -15;
		}
		doorOpen.visible = false;
	}
	function newDecClose(i,j,a){
		doorCloseDec.position.set(i*10 + offsetX,j*-10 + offsetY + 10,5);
		if (a === 0) {
			doorCloseDec.rotation.z = Math.PI; // Top
			doorCloseDec.position.x += 5;
			doorCloseDec.position.y += -15;
		} else if (a === 3){
			doorCloseDec.rotation.z = -0.5*Math.PI; // Left
			doorCloseDec.position.x += 5;
			doorCloseDec.position.y += -5;
		} else if (a === 2){
			doorCloseDec.rotation.z = 0; // Bottom
			doorCloseDec.position.x += -5;
			doorCloseDec.position.y += -5;
		} else if (a === 1) {
			doorCloseDec.rotation.z = 0.5*Math.PI; // Right
			doorCloseDec.position.x += -5;
			doorCloseDec.position.y += -15;
		}
		scene.add(doorCloseDec);
	}
	function newButtonBlock(i,j){
		var newbut = butGeo.clone();
		//newbut.position.set(i*10 + offsetX,j*-10 + offsetY,5.05);
		newbut.applyMatrix( new THREE.Matrix4().makeTranslation(i*10 + offsetX,j*-10 + offsetY,5.05) );
		// THREE.GeometryUtils.merge(mergedBut,newbut); // Rev 66
		mergedBut.merge(newbut);
		
		var newdet = detGeo.clone();
		//newdet.position.set(i*10 + offsetX,j*-10 + offsetY,9.6);
		newdet.applyMatrix( new THREE.Matrix4().makeTranslation(i*10 + offsetX,j*-10 + offsetY,9.6) );
		//THREE.GeometryUtils.merge(mergedDet,newdet); //rev 66
		mergedDet.merge(newdet);
	}
	function newGroundBlock(i,j,z){
		var newground = floorGeo.clone();
		//newground.position.set(i*10 + offsetX,j*-10 + offsetY,z*10);
		newground.applyMatrix( new THREE.Matrix4().makeTranslation(i*10 + offsetX,j*-10 + offsetY,z*10) );
		//scene.add(groundBlocks[groundBlocks.length-1]);
		// THREE.GeometryUtils.merge(mergedCon,newground); //Rev 66
		mergedCon.merge(newground);
	}
	function newWaterBlock(i,j){
		var newwat = waterGeo.clone();
		//newwat.position.set(i*10 + offsetX,j*-10 + offsetY,3);
		newwat.applyMatrix( new THREE.Matrix4().makeTranslation(i*10 + offsetX,j*-10 + offsetY,3) );
		// THREE.GeometryUtils.merge(mergedWat,newwat); // Rev 66
		mergedWat.merge(newwat);
		newGroundBlock(i,j,-1);
	}
	function newMoveBlock(i,j,z){
		crateBlocks.push(crate.clone());
		crateBlocks[crateBlocks.length-1].position.set(i*10 + offsetX,j*-10 + offsetY,z*10 - 0.5);
		crateBlocks[crateBlocks.length-1].name = i + ',' + j + ',' + z;
		scene.add(crateBlocks[crateBlocks.length-1]);
	}
	function newBarrel(i,j,num){ // num is the barrel to clone
		barrels.push(barCloners[num].clone());
		barrels[barrels.length-1].position.set(i*10 + offsetX,j*-10 + offsetY,5);
		scene.add(barrels[barrels.length-1]);
	}
	function newTable(i,j,num,or){ // num is table to clon, or is for orientation, horizontal or vert
		tables.push(tabCloners[num].clone());
		if (or === 'horiz'){
			tables[tables.length-1].rotation.set(0,0,0.5*Math.PI);
			tables[tables.length-1].position.set(i*10 + offsetX + 5,j*-10 + offsetY,5);
		} else if (or === 'vert'){
			tables[tables.length-1].position.set(i*10 + offsetX,j*-10 + offsetY - 5,5);
		}
		scene.add(tables[tables.length-1]);
	}
	function newCon(i,j,kind){
			var con;
		if (kind === 0){ // pole
			con = poleGeo.clone();
		} else if(kind === 1){ // wall horizontal
			con = wallGeo.clone();
			con.applyMatrix( new THREE.Matrix4().makeRotationZ(0.5*Math.PI) );
			// con.rotation.set(0,0,0.5*Math.PI); //rev66
		} else if(kind === 2){ // wall Vertical
			con = wallGeo.clone();
		}
		// con.position.set(i*10 + offsetX,j*-10 + offsetY,15); // rev66
		con.applyMatrix( new THREE.Matrix4().makeTranslation(i*10 + offsetX,j*-10 + offsetY,15) );
		//scene.add(concretes[concretes.length-1]);
		// THREE.GeometryUtils.merge(mergedCon,con); //rev 66
		mergedCon.merge(con);
	}
	var an;
	for (var j=0; j<board.length; j++){
		for (var i=0; i<board[j].length; i++){

		var val = board[j].charAt(i);
			if (val === ' ' || val === '_' || val === '$' || val === '@'){
				newGroundBlock(i,j,0);
			}
			if (val === '!' || val === '^' || val === '`' || val === '~'){
				newWaterBlock(i,j);
				if (val === '!' || val === '^' || val === '`'){
					newMoveBlock(i,j,0);
				}
			}
			if (val === '.' || val === '+' || val === '*'){
				newGroundBlock(i,j,0);
				newButtonBlock(i,j);
			}
			if (val === '@' || val === '^' || val === '+'){
				newBegin(i,j);
			}
			if (val === '$' || val === '*' || val === '!'){
				newMoveBlock(i,j,1);
			}
			if (val === 'H' || val === 'I' || val === 'J' || val === 'K'){
				if (val === 'H'){an = 0;}
				if (val === 'I'){an = 1;}
				if (val === 'J'){an = 2;}
				if (val === 'K'){an = 3;}
				newEClose(i,j,an);
				newEnd(i,j,an);
			}

			if (toggles.decor === true && useWebGL === true){
				if (val === 'A' || val === 'B' || val === 'C' || val === 'D'){
					if (val === 'A'){an = 0;}
					if (val === 'B'){an = 1;}
					if (val === 'C'){an = 2;}
					if (val === 'D'){an = 3;}
					newDecClose(i,j,an);
				}
			
				if (val === '%'){
					newGroundBlock(i,j,0);
				}
				var type;
				if (val === '1' || val === '2' || val === '3' || val === '4' || val === '5' || val === '6' || val === '7') {
					an = Number(val) - 1;
					newBarrel(i,j,an);
					newGroundBlock(i,j,0);
				} else if (val === 'U' || val === 'V' || val === 'W'){
					if (val === 'U'){type = 0;}
					if (val === 'V'){type = 1;}
					if (val === 'W'){type = 2;}
					newTable(i,j,type,'vert');
					newGroundBlock(i,j,0);
				} else if (val === 'X' || val === 'Y' || val === 'Z'){
					if (val === 'X'){type = 0;}
					if (val === 'Y'){type = 1;}
					if (val === 'Z'){type = 2;}
					newTable(i,j,type,'horiz');
					newGroundBlock(i,j,0);
				} else if (val === ':' || val === '-' || val === '?'){
					if (val === ':'){type = 0;}
					if (val === '-'){type = 1;}
					if (val === '?'){type = 2;}
					newCon(i,j,type);
					newGroundBlock(i,j,0);
				}
			}
		}
	}
	if (soko === false){
		if (allPressed() === true){
			doorOpen.visible = true;
			doorClose.visible = false;
		} else {
			doorOpen.visible = false;
			doorClose.visible = true;
		}
	}
	addedCon = new THREE.Mesh(mergedCon,conMat);
	addedWat = new THREE.Mesh(mergedWat,waterMat);
	if (soko === false){
		addedBut = new THREE.Mesh(mergedBut,butMatA);
		addedDet = new THREE.Mesh(mergedDet,detMatA);
	} else{
		addedBut = new THREE.Mesh(mergedBut,butMatB);
		addedDet = new THREE.Mesh(mergedDet,detMatB);
	}
	scene.add(addedCon);
	scene.add(addedWat);
	scene.add(addedBut);
	scene.add(addedDet);
	render();
}