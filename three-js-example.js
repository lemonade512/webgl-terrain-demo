/*
 * Maps value from range [low1, high1] to range [low2, high2]
 */
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

// Configuration variables
var PLANE_ROWS = 200;
var PLANE_COLS = 200;
var PLANE_X_SIZE = 200;
var PLANE_Y_SIZE = 200;
var PLANE_ROTATION_DEGREES = -60;
var FPS = 30;
var PERLIN_NOISE_OFFSET = 0.15;
var PERLIN_NOISE_SCALE = 4;
var MILLIS_PER_SECOND = 1000;

var TerrainSimulation = {
    init: function() {
        // Create Scene
        this.scene = new THREE.Scene();

        // Create camera
        this.aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, this.aspect, 0.1, 1000);
        this.camera.position.z = 50;

        // Add some user controls for the camera
        this.controls = new THREE.FlyControls(this.camera);
        this.controls.movementSpeed = 1;
        this.controls.rollSpeed = 0.05;

        // Create a renderer and add it to the DOM
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Create the plane geometry and give it some terrain
        this.geometry = new THREE.PlaneGeometry(
            PLANE_X_SIZE, PLANE_Y_SIZE, PLANE_COLS-1, PLANE_ROWS-1
        );
        this.updateGeometry();

        // Use a mesh material displayed as a wireframe
        this.material = new THREE.MeshBasicMaterial({
            color: 0x2195ce,
            wireframe: true,
        });

        // Create the plane and add it to the scene
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.plane.rotation.x = THREE.Math.degToRad(PLANE_ROTATION_DEGREES);
        this.scene.add(this.plane);
    },

    updateGeometry: function() {
        var yoff = 0;
        for (var y = 0; y < PLANE_ROWS; y++) {
            var xoff = 0;
            for (var x = 0; x < PLANE_COLS; x++) {
                this.geometry.vertices[x + (y * PLANE_COLS)].z = map_range(
                    PerlinNoise.noise(xoff, yoff, 0), 0, 1,
                    -PERLIN_NOISE_SCALE, PERLIN_NOISE_SCALE
                );
                xoff += PERLIN_NOISE_OFFSET;
            }
            yoff += PERLIN_NOISE_OFFSET;
        }
        this.geometry.verticesNeedUpdate = true;
    },

    animate: function() {
        var context = this;
        setTimeout( function() {
            requestAnimationFrame( context.animate.bind(context) );
        }, MILLIS_PER_SECOND / FPS );

        this.render();
    },

    render: function() {
        this.controls.update(0.1);
        this.renderer.render(this.scene, this.camera);
    }
};

TerrainSimulation.init();
TerrainSimulation.animate();
//TerrainSimulation.render();

