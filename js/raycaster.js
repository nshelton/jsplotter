
const raycaster = new THREE.Raycaster();
const cameraRaycaster = new THREE.Raycaster();
raycaster.near = 0.01
raycaster.far = 100

nodes = []


function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function createCube() {
    var geometry = new THREE.BoxBufferGeometry( 0.05, 0.05, 0.05 );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    return new THREE.Mesh( geometry, material );
  }

var dir = new THREE.Vector3()
var dist = new THREE.Vector3()

function raycast() {

    for(let y = 0; y < 10; y++) {
        var ypos = map_range(y, 0,10, -1,1)

        for(let d = 0; d < 100; d++) {
            var theta = map_range(d, 0,100, 0, Math.PI*2)
            raycaster.set(new THREE.Vector3(0,0,ypos), new THREE.Vector3(Math.cos(theta),Math.sin(theta),0))

            const intersects = raycaster.intersectObject(model, true );
            console.log(intersects)
        
            for ( let i = 0; i < intersects.length; i ++ ) {
                //check if visible from camera
                dir.subVectors(intersects[i].point, camera.position)
                dir.normalize()
                cameraRaycaster.set(camera.position, dir)

                var cIntersects = cameraRaycaster.intersectObject(model, true)

                if ( cIntersects.length > 0) {
                    if (cIntersects[0].point.distanceTo(intersects[i].point) < 0.0001) {

                        var c = createCube()
                        c.position.copy(intersects[i].point)
                        scene.add(c)
                        nodes.push(c)
                    }
                }
            }
        }
    }
}

  var params = {
    displayMesh: false,



    raycast: function () {
      raycast()
    },

    clear: function () {
      for(let i = 0; i < nodes.length; i++) {
          scene.remove(nodes[i])
      }
      nodes=[]
    },
};


$( document ).ready(function() {

  var gui = new dat.gui.GUI();

  gui.add(params, 'displayMesh').onChange(function (value) {  model.visible = value });
  gui.add(params, 'raycast');
  gui.add(params, 'clear');
})