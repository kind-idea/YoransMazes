function load(){
	JSONLoader = new THREE.JSONLoader();

	document.getElementById('loading').style.display = 'block';

	var doorNorm = THREE.ImageUtils.loadTexture('mods/door/norm.jpg');
	var doorSpec = THREE.ImageUtils.loadTexture('mods/door/spec.jpg');
	var doorMap = THREE.ImageUtils.loadTexture('mods/door/map.jpg');
	var doorMapR = THREE.ImageUtils.loadTexture('mods/door/mapred.jpg');

	var doorMat = new THREE.MeshPhongMaterial({
		ambient: new THREE.Color(0.64,0.64,0.64),
		specular: new THREE.Color(0,0,0),
		color: new THREE.Color(0.64,0.64,0.64),
		map: doorMap,
		normalMap: doorNorm,
		specularMap: doorSpec,
		shininess: 50
	});
	var doorRed = new THREE.MeshPhongMaterial({
		ambient: new THREE.Color(0.64,0.64,0.64),
		specular: new THREE.Color(0,0,0),
		color: new THREE.Color(0.64,0.64,0.64),
		map: doorMapR,
		normalMap: doorNorm,
		specularMap: doorSpec,
		shininess: 50
	});

	JSONLoader.load("mods/door/doorClose.js", addDoorClose());
	JSONLoader.load("mods/door/doorOpen.js", addDoorOpen());

	function addDoorClose(){
		return function(geometry) {
			geometry.faceVertexUvs[1] = geometry.faceVertexUvs[0]; // If we use a lightmap, we need two arrays of UVs?
			doorClose = new THREE.Mesh(geometry,doorRed);
			doorCloseDec = new THREE.Mesh(geometry,doorMat);
			loadedModels += 1;
			doneCheck();
		};
	}
	function addDoorOpen(){
		return function(geometry) {
			geometry.faceVertexUvs[1] = geometry.faceVertexUvs[0]; // If we use a lightmap, we need two arrays of UVs?
			doorOpen = new THREE.Mesh(geometry,doorMat);
		
			loadedModels += 1;
			doneCheck();
		};
	}

	JSONLoader.load("mods/guy/guy.js", addChar());
	function addChar(){
		return function(geometry) {
			var mat = new THREE.MeshPhongMaterial({
				ambient: new THREE.Color(0.9,0.9,0.9),
				specular: new THREE.Color(0,0,0),
				color: new THREE.Color(0.9,0.9,0.9),
				map: THREE.ImageUtils.loadTexture('mods/guy/tex.png'),
				normalMap: THREE.ImageUtils.loadTexture('mods/guy/norm.png'),
				specularMap: THREE.ImageUtils.loadTexture('mods/guy/spec.png'),
			//	bumpMap: THREE.ImageUtils.loadTexture('mods/guy/disp.jpg'),
				shininess: 50
			});
			geometry.faceVertexUvs[1] = geometry.faceVertexUvs[0]; // If we use a lightmap, we need two arrays of UVs?

			charMesh = new THREE.Mesh(geometry,mat);

			loadedModels += 1;
			doneCheck();
		};
	}
}

function loadDecor(){
	document.getElementById('loading').style.display = 'block';

	var barrelTextures = [
			"mods/barrel/rust.jpg",
			"mods/barrel/yellow.jpg",
			"mods/barrel/black.jpg",
			"mods/barrel/blue.jpg",
			"mods/barrel/green.jpg",
			"mods/barrel/grey.jpg",
			"mods/barrel/red.jpg"
	];
	var bNorm = THREE.ImageUtils.loadTexture('mods/barrel/norm.jpg');
	var bLight = THREE.ImageUtils.loadTexture('mods/barrel/spec.jpg');

	var bTexs = [];

	for (var i=0; i<barrelTextures.length; i++){
		bTexs.push(THREE.ImageUtils.loadTexture(barrelTextures[i]));
	}

	JSONLoader.load('mods/barrel/bGeo.js', addBarrels());

	function addBarrels() {
		return function(geometry) {
			geometry.faceVertexUvs[1] = geometry.faceVertexUvs[0]; // If we use a lightmap, we need two arrays of UVs?
			for (var i=0; i<bTexs.length; i++){
				var mat = new THREE.MeshPhongMaterial({
					ambient: new THREE.Color(0.8,0.8,0.8),
					specular: new THREE.Color(0,0,0),
					color: new THREE.Color(0.7,0.7,0.7),
					map: bTexs[i],
					normalMap: bNorm,
					lightMap: bLight
				});
				var mesh = new THREE.Mesh( geometry, mat );
				
				barCloners.push(mesh);
			}
			loadedDecor += 1;
			doneCheck();
		};
	}
	
	var tableTextures = [
		"mods/table/dirty.jpg",
		"mods/table/rough.jpg",
		"mods/table/weathered.jpg"
	];
	var tNorm = THREE.ImageUtils.loadTexture('mods/table/norm.jpg');
	var tSpec = THREE.ImageUtils.loadTexture('mods/table/spec.jpg');
	var tLight = THREE.ImageUtils.loadTexture('mods/table/ao.jpg');
	
	var tTexs = [];
	for (var i=0; i<tableTextures.length; i++){
		tTexs.push(THREE.ImageUtils.loadTexture(tableTextures[i]));
	}
	
	JSONLoader.load('mods/table/tGeo.js', addTables());
	
	function addTables() {
		return function(geometry) {
			geometry.faceVertexUvs[1] = geometry.faceVertexUvs[0]; // If we use a lightmap, we need two arrays of UVs?
			for (var i=0; i<tTexs.length; i++){
				var mat = new THREE.MeshPhongMaterial({
					ambient: new THREE.Color(0.64,0.64,0.64),
					specular: new THREE.Color(1.0,1.0,1.0),
					color: new THREE.Color(0.64,0.64,0.64),
					map: tTexs[i],
					normalMap: tNorm,
					lightMap: tLight,
					specularMap: tSpec,
					shininess: 50
				});
				var mesh = new THREE.Mesh( geometry, mat );
				tabCloners.push(mesh);
			}
			
			loadedDecor += 1;
			doneCheck();
		};
	}
}
function doneCheck(){
	if (waitingFor === 'both'){
		if (loadedModels === 3 && loadedDecor === 2){
			allReady();
			document.getElementById('loading').style.display = 'none';
		}
	} else if (waitingFor === 'main'){
		if (loadedModels === 3){
			allReady();
			document.getElementById('loading').style.display = 'none';
		}
	} else if (waitingFor === 'decor'){
		if (loadedDecor === 2){
			document.getElementById('loading').style.display = 'none';
		}
	}
}

function canvasLoad(){
	var doorbarone = new THREE.Mesh(new THREE.CylinderGeometry(1,1,12));
	var doorbartwo = new THREE.Mesh(new THREE.CylinderGeometry(1,1,12));
	doorbarone.position.set(1,1,6);
	doorbarone.rotation.set(0.5*Math.PI,0,0);
	doorbartwo.position.set(9,1,6);
	doorbartwo.rotation.set(0.5*Math.PI,0,0);
	var doorbartop = new THREE.Mesh(new THREE.CylinderGeometry(1,1,6));
	doorbartop.rotation.set(0,0,0.5*Math.PI);
	doorbartop.position.set(5,1,11);
	var totalDoor = new THREE.Geometry();
	THREE.GeometryUtils.merge(totalDoor,doorbarone);
	THREE.GeometryUtils.merge(totalDoor,doorbartwo);
	THREE.GeometryUtils.merge(totalDoor,doorbartop);

	doorOpen = new THREE.Mesh(totalDoor,new THREE.MeshLambertMaterial({color:0x007700}));

	var totalClose = doorOpen.geometry.clone();
	var closeddoor = new THREE.Mesh(new THREE.BoxGeometry(6,1,10));
	closeddoor.position.set(5,0,5);
	THREE.GeometryUtils.merge(totalClose,closeddoor);
	
	doorClose = new THREE.Mesh(totalClose,new THREE.MeshLambertMaterial({color:0x770000}));
	
	
	var charBody = new THREE.Mesh(new THREE.SphereGeometry(3,5,4));
	var charHOne = new THREE.Mesh(new THREE.SphereGeometry(1,3,2));
	charHOne.position.set(1.5,-4,0);
	var charHTwo = new THREE.Mesh(new THREE.SphereGeometry(1,3,2));
	charHTwo.position.set(1.5,4,0);
	var charFOne = new THREE.Mesh(new THREE.SphereGeometry(1,4,3));
	charFOne.position.set(0,2,-4);
	var charFTwo = new THREE.Mesh(new THREE.SphereGeometry(1,4,3));
	charFTwo.position.set(0,-2,-4);
	var charGeo = new THREE.Geometry();
	THREE.GeometryUtils.merge(charGeo,charBody);
	THREE.GeometryUtils.merge(charGeo,charHOne);
	THREE.GeometryUtils.merge(charGeo,charHTwo);
	THREE.GeometryUtils.merge(charGeo,charFOne);
	THREE.GeometryUtils.merge(charGeo,charFTwo);

	charMesh = new THREE.Mesh(charGeo,new THREE.MeshLambertMaterial({color:0x550055}));
}
