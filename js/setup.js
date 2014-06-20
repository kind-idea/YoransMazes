var charMesh, crate;
var nTexs = {};

var barCloners = [];
var tabCloners = [];

var floorGeo, poleGeo, wallGeo, conMat;
var waterGeo, waterMat;
var butGeo,butMatA,butMatB,detGeo,detMatA,detMatB;
var doorClose,doorOpen, doorCloseDec;

var center = new THREE.Vector3(0,0,0);

var renderer, camera, scene, controls;

var supportsWebGL = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();

var supportsCanvas = !! window.CanvasRenderingContext2D;

console.log(supportsWebGL,supportsCanvas);

var JSONLoader = new THREE.JSONLoader();

var loadedDecor = 0;
var loadedModels = 0;

var waitingFor;

function resized(){
	var contWIDTH = window.innerWidth - 10,
		contHEIGHT = window.innerHeight - 10;

	camera.aspect = contWIDTH / contHEIGHT;
	renderer.setSize(contWIDTH, contHEIGHT);
	camera.updateProjectionMatrix();
	render();

	vertCenter();
}
function load(){
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

function init() {
	loadData();

	if (useWebGL === true) {
		if (toggles.alias === true){
			renderer = new THREE.WebGLRenderer({ antialias: true }); // renderer with antialiasing
		} else {
			renderer = new THREE.WebGLRenderer(); // renderer without antialiasing
		}
	} else if (supportsCanvas === true){
		error('It seems your browser (or computer), <a href="http://get.webgl.org/" title="Get WebGL">doesn&apos;t support WebGL or WebGL is disabled</a>.<br/>Not to worry, however.  The game will still work.  The levels just wont be as stunningly beautiful.  And the main character certainly wont be as incredibly handsome.',1);
		renderer = new THREE.CanvasRenderer();
	} else {
		error('Looks like your browser might be a little outdated.  If you wouldn&apos;t mind using one that supports canvas, or better, WebGL, that would be great!',0);
		return;
	}

	var container = document.getElementById('view'),
		contWIDTH = window.innerWidth - 10,
		contHEIGHT = window.innerHeight - 10;

	// renderer.context.getProgramInfoLog = function () { return '' }; // Removes old silly GL error
	camera = new THREE.PerspectiveCamera(
			45,
			contWIDTH / contHEIGHT,
			0.1,
			1000);
	scene = new THREE.Scene();
	scene.add(camera);
	controls = new THREE.OrbitControls( camera, container );
		controls.target = center;
		controls.addEventListener('change',render);
		controls.noPan = true;
		controls.enabled = false;

	camera.position.set(0,-60,100);
	camera.lookAt(center);
	renderer.setSize(contWIDTH, contHEIGHT);
	container.appendChild(renderer.domElement);

	// Lighting
	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );
		
	var lights = [];
	function addLight(x,y,z,i){
		lights.push(new THREE.DirectionalLight( 0xffffff, i ));
		lights[lights.length-1].position.set(x,y,z);
		scene.add(lights[lights.length-1]);
	}
	addLight(0,0,50,0.9);	
	addLight(-45,-45,50,0.5);	
	addLight(45,45,-50,0.2);
	
	var textures;
	if (useWebGL === true){
	textures = [
			["tex/c3.jpg",'groundTex'],
			["tex/side.jpg",'boxTex'],
			["tex/metA.jpg",'metATex'],
			["tex/metB.jpg",'metBTex']
	];
	} else{
	textures = [
			["tex/c3small.jpg",'groundTex'],
			["tex/sidesmall.jpg",'boxTex'],
			["tex/metA.jpg",'metATex'],
			["tex/metB.jpg",'metBTex']
	];
	}

	for (var i=0; i<textures.length; i++){
		var texName = textures[i][1];
		nTexs[texName] = THREE.ImageUtils.loadTexture(textures[i][0]);
	}
	
	if (useWebGL === true) {
			load();
		if (toggles.decor === true){
			loadDecor();
			waitingFor = 'both';
		} else {
			waitingFor = 'main';
		}
	}else if (supportsCanvas === true) {
		document.getElementById('loading').style.display = 'none';
		allReady();
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

var assignUVs = function( geometry ){

    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (var i = 0; i < geometry.faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
      ]);

    }

    geometry.uvsNeedUpdate = true;

};

function allReady(){
	// Prepare for cloning.
	floorGeo = new THREE.BoxGeometry(10,10,10);
	poleGeo = new THREE.CylinderGeometry(2.5,2.5,20);
	poleGeo.applyMatrix( new THREE.Matrix4().makeRotationX(0.5*Math.PI) );
	// poleGeo.rotation.set(0.5*Math.PI,0,0); //rev66
	wallGeo = new THREE.BoxGeometry(4,10,20);
	conMat = new THREE.MeshLambertMaterial({ map: nTexs.groundTex });

	waterGeo =new THREE.PlaneGeometry(10, 10);
	waterMat = new THREE.MeshLambertMaterial({color:0x005500,transparent:true,opacity:0.5});

	butGeo = new THREE.BoxGeometry(10,10,0.1);
	butMatA = new THREE.MeshLambertMaterial({map: nTexs.metATex});
	butMatB = new THREE.MeshLambertMaterial({map: nTexs.metBTex});
	
	detGeo = new THREE.BoxGeometry(9.2,9.2,9.2);
	detMatA = new THREE.MeshLambertMaterial({color:0x881633,transparent:true,opacity:0.4});
	detMatB = new THREE.MeshLambertMaterial({color:0x003399,transparent:true,opacity:0.4});

	crate = new THREE.Mesh(new THREE.BoxGeometry(9,9,9),new THREE.MeshLambertMaterial({ map: nTexs.boxTex }));

	if (useWebGL === false){
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
	
	charMesh.visible = false;
	doorClose.visible = false;
	doorOpen.visible = false;

	mainMenu();
}
// A shortcut function to render
function render(){renderer.render(scene,camera);}