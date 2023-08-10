import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class SceneInit {
  constructor(canvasId) {

    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;

    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 48;

    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,

      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
   
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.stats = Stats();
    document.body.appendChild(this.stats.dom);

    // this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);

    // this.directionalLight.position.set(0, 10, 15);
    // this.scene.add(this.directionalLight);

    // Reduce the intensity of the directional light
this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

// Add an ambient light with low intensity
this.ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
this.scene.add(this.ambientLight);



    window.addEventListener('resize', () => this.onWindowResize(), false);


    this.loader = new THREE.TextureLoader();
    this.scene.background = this.loader.load('./assets/frame_0433.jpeg');

  }

  animate() {

    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.stats.update();
    this.controls.update();
  }

  render() {

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
