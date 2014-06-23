var charMesh, crate;
var nTexs = {};

var barCloners = [];
var tabCloners = [];

var floorGeo, poleGeo, wallGeo, conMat;
var waterGeo, waterMat;
var butGeo,butMatA,butMatB,detGeo,detMatA,detMatB;
var doorClose,doorOpen, doorCloseDec;

var center;

var renderer, camera, scene, controls;

var curRender;

var JSONLoader;

var loadedDecor = 0;
var loadedModels = 0;

var waitingFor;

function resized(){
	if (curRender !== 'Image'){
		var contWIDTH = window.innerWidth - 10,
			contHEIGHT = window.innerHeight - 10;

		camera.aspect = contWIDTH / contHEIGHT;
		renderer.setSize(contWIDTH, contHEIGHT);
		camera.updateProjectionMatrix();
		render();
	}

	vertCenter();
}

function init() {
	loadData();
	function useWebGL(){
		try {
			if (toggles.alias === true){
				renderer = new THREE.WebGLRenderer({ antialias: true });
			} else {
				renderer = new THREE.WebGLRenderer();
			}
		} catch(e){
			error('Your browser doesn\'t seem to support WebGL.  Switched to canvas renderer.<br/>(If you don\'t want to see this again, change your preferred renderer in settings.)',1);
			useCanvas();
			return;
		}
		startRender();
		load();
		if (toggles.decor === true){
			loadDecor();
			waitingFor = 'both';
		} else {
			waitingFor = 'main';
		}
		curRender = 'WebGL';
	}
	function useCanvas(){
		try {
			renderer = new THREE.CanvasRenderer();
		} catch(e){
			if (prefRender === 'WebGL'){
				error('Your browser doesn\'t seem to support the WebGL or canvas renderers. Switched to Image.<br/>(If you don\'t want to see this again, change your preferred renderer in settings.)',1);
				useImage();
			} else if (prefRender === 'Canvas'){
				error('Your browser doesn\'t seem to support the Canvas renderer. Switched to Image.<br/>(If you don\'t want to see this again, change your preferred renderer in settings.)',1);
				useImage();
			}
			return;
		}
		startRender();
		canvasLoad();
		allReady();
		curRender = 'Canvas';
	}
	function useImage(){
		curRender = 'Image';
		setDisp('playtwo','block');
		document.getElementById("preImageLoad").innerHTML = '<img src="2d/box.png" alt="box pre-load"/><img src="2d/char.png" alt="char pre-load"/><img src="2d/cm.jpg" alt="cement pre-load"/><img src="2d/goalG.jpg" alt="goal open pre-load"/><img src="2d/goalR.jpg" alt="goal closed pre-load"/><img src="2d/metA.jpg" alt="sensor A pre-load"/><img src="2d/metB.jpg" alt="sensor B pre-load"/>';
		mainMenu();
	}


	if (prefRender === 'WebGL') {
		useWebGL();
	} else if (prefRender === 'Canvas'){
		useCanvas();
	} else{
		useImage();
	}
}
function startRender(){
	center = new THREE.Vector3(0,0,0);

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
}
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
	
	scene.add(charMesh);
	scene.add(doorClose);
	scene.add(doorOpen);
	
	mainMenu();
}
// A shortcut function to render
function render(){renderer.render(scene,camera);}