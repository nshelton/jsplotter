
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

    // for(let y = 0; y < 10; y++) {
        // var ypos = map_range(y, 0,10, -1,1)
        var ypos = 0
        for(let d = 0; d < 100; d++) {
            // radial technique
            // var theta = map_range(d, 0,100, 0, Math.PI*2)
            // raycaster.set(new THREE.Vector3(0,0,ypos), new THREE.Vector3(Math.cos(theta),Math.sin(theta),0))
            // line technique
            var x = map_range(d, 0,100, -1, 1)
            raycaster.set(new THREE.Vector3(x,0,100), new THREE.Vector3(0,0,-1))

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
    // }
}


let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");


function createSVG() {
    document.body.removeChild(svg)

    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.setAttribute("viewBox", "0 0 12 15");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", screen.width);
    svg.setAttribute("height", screen.height);
    svg.setAttribute("aria-hidden", "true");

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // path.setAttribute("fill-rule", "evenodd");
    camera.updateMatrixWorld()

    var pathString = ""
    var pos = nodes[0].position.clone()
    pos.project(camera)
    pathString += "m" + pos.x + " " + pos.y

    nodes.forEach(n => {
        var pos = n.position.clone()
        pos.project(camera)
        pathString += "l" + pos.x/pos.z + " " + pos.y/pos.z

    });
    path.setAttribute("d", pathString);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke", "black");

    svg.appendChild(path);
    document.body.appendChild(svg)
    console.log(svg)
}

canvasVisible = true

  var params = {
    displayMesh: false,

    createSVG: function () {
        createSVG()
      },

    raycast: function () {
      raycast()
    },

    toggleRender: function () {
        if ( canvasVisible){
            $("canvas").hide()
        } else {
            $("canvas").show()
        }
        canvasVisible = !canvasVisible
    },

    clear: function () {
      for(let i = 0; i < nodes.length; i++) {
          scene.remove(nodes[i])
      }
      nodes=[]
    },
};


$( document ).ready(function() {
  document.body.appendChild(svg)
  var gui = new dat.gui.GUI();

  gui.add(params, 'displayMesh').onChange(function (value) {  model.visible = value });
  gui.add(params, 'raycast');
  gui.add(params, 'toggleRender');
  gui.add(params, 'createSVG');
  gui.add(params, 'clear');
})