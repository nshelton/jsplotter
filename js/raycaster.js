
const raycaster = new THREE.Raycaster();
const cameraRaycaster = new THREE.Raycaster();
raycaster.near = 0.01
raycaster.far = 100

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
    numLines = params.numLines
    nodes = []
 
    for(let y = 0; y < numLines; y++) {

        var ypos = map_range(y, 0,numLines, -1, 1)

        for(let d = 0; d < 100; d++) {
            // line technique
            var x = map_range(d, 0, 100, -1, 1)
            
            raycaster.set(new THREE.Vector3(x,ypos,100), new THREE.Vector3(0,0,-1))                

            const intersects = raycaster.intersectObject(model, true );

            if ( intersects.length > 0) {
                var intersection = intersects[0]
                dir.subVectors(intersection.point, camera.position)
                dir.normalize()
                cameraRaycaster.set(camera.position, dir)

                var cIntersects = cameraRaycaster.intersectObject(model, true)

                if ( cIntersects.length > 0 && cIntersects[0].point.distanceTo(intersection.point) < 0.01) {
                    nodes.push(intersection.point.clone())
                } else {
                    if ( nodes.length > 0) {
                        var path = makePathElement(nodes)
                        console.log(path)
                        svg.appendChild(path);
                        nodes = []
                    }
                }
            } else {
                if ( nodes.length > 0) {
                    var path = makePathElement(nodes)
                    console.log(path)
                    svg.appendChild(path);
                    nodes = []
                }
            }
        }

        console.log(y)
    }
}


function makePathElement(nodes) {

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    camera.updateMatrixWorld()
    var aspect = $("canvas").height() / $("canvas").width()
    var pathString = ""
    var pos = nodes[0].clone()
    pos.project(camera)
    pointString = "M " +  pos.x + " " + -pos.y * aspect
    pathString += pointString

    nodes.forEach(n => {
        var pos = n.clone()
        pos.project(camera)
        pointString = " L " + pos.x + " " + -pos.y * aspect
        pathString += pointString

    });

    // pathString += " Z"

    path.setAttribute("d", pathString);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "0.001");

    return path    
}

canvasVisible = true

  var params = {
    displayMesh: false,
    yDirection: true,
    numLines : 100,
    raycast: function () {
      raycast()
    },
    rX : 0,
    rY : 0,
    rZ : 0,

    toggleRender: function () {
        if ( canvasVisible){
            $("canvas").hide()
        } else {
            $("canvas").show()
        }
        canvasVisible = !canvasVisible
    },
};

let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

$( document ).ready(function() {
  var gui = new dat.gui.GUI();

  gui.add(params, 'displayMesh').onChange(function (value) {  model.visible = value });
  gui.add(params, 'raycast');
  gui.add(params, 'toggleRender');
  gui.add(params, 'numLines');
  gui.add(params, 'yDirection');

    gui.add(params, 'rX').onChange( function(val) {
        model.setRotationFromEuler(new THREE.Euler(params.rX,params.rY,params.rZ))
    })
    
    gui.add(params, 'rY').onChange( function(val) {
        model.setRotationFromEuler(new THREE.Euler(params.rX,params.rY,params.rZ))
    })

    gui.add(params, 'rZ').onChange( function(val) {
        model.setRotationFromEuler(new THREE.Euler(params.rX,params.rY,params.rZ))
    })

  camera.position.set(-0.5166833802462546, -2.3316631238881897, 3.085453418565887)


  svg.setAttribute("viewBox", "-1 -1 2 2");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("aria-hidden", "true");
  document.body.appendChild(svg)
  
})