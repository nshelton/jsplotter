
var scene;
var camera;
var renderer;
var controls;


function setup() {

  // Empty Scene
  scene = new THREE.Scene();

  // Setup Camera
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000000 );
  camera.position.set(0,0,10);

  // Setup Renderer
  renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	var container = $('body');
  container.append(renderer.domElement);

  //Trackball Controls
  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls.target.set(0,0, 0);
  controls.noZoom = false;
  controls.noPan = false;

}


function createCube() {
  var geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
  var material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
  return new THREE.Mesh( geometry, material );
}

function setupScene() {


  var geometry = new THREE.PlaneGeometry( 20, 20, 20, 20 );
  var material = new THREE.MeshBasicMaterial( { wireframe:true, color: 0xffffff, side: THREE.DoubleSide} );
  var groundPlane = new THREE.Mesh( geometry, material );
  scene.add( groundPlane );

    /*LIGHTS*/
    // directionalLight = new THREE.DirectionalLight(0xffeedd);
    // directionalLight.position.set(0, 0, -1).normalize();
    // scene.add(directionalLight);

    // directionalLight2 = new THREE.DirectionalLight(0xffeedd);
    // directionalLight2.position.set(0, 0, -1).normalize();
    // scene.add(directionalLight2);

    // directionalLight3 = new THREE.DirectionalLight(0xffeedd);
    // directionalLight3.position.set(0, 1, 0).normalize();
    // scene.add(directionalLight3);

    // var ambientLight = new THREE.AmbientLight(0x808080, 0.2); //Grey colour, low intensity
    // scene.add(ambientLight);

}



$( document ).ready(function() {

  setup();
  setupScene();

	function render() {
        controls.update();
        renderer.render( scene, camera );   
        requestAnimationFrame( render );
        
	}


	render();

});