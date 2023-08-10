import { useEffect } from 'react';
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import SceneInit from './lib/SceneInit';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    const spaceTexture = new THREE.TextureLoader().load('./assets/transparent.jpeg');
    spaceTexture.wrapS = THREE.RepeatWrapping;
    spaceTexture.wrapT = THREE.RepeatWrapping;
    spaceTexture.repeat.set(2, 2);
    test.scene.background = spaceTexture;

    // Create video texture
    const video = document.createElement('video');
    video.src = "./assets/transperant.webm";
    video.loop = true; // Keep this line even though we manually loop the video
    video.addEventListener('canplaythrough', event => {
      // The video can be played till the end without interruption
      video.play();
    }, false);
    video.addEventListener('ended', function() {
      // When the video ends, restart it from the beginning
      this.currentTime = 0;
      this.play();
    }, false);
    video.load();
    const videoTexture = new THREE.VideoTexture(video);

    let loadedModel;
    // const glftLoader = new GLTFLoader();
    const loader = new FBXLoader();

    glftLoader.load('./assets/schmott_animated.py.fbx', (gltfScene) => {
      loadedModel = gltfScene;

      // Apply video texture to all materials in the model
      loadedModel.scene.traverse((node) => {
        if (node.isMesh) {
          node.material.map = videoTexture;
        }
      });

      gltfScene.scene.rotation.x = 90;
      gltfScene.scene.rotation.z = 0.2;
      gltfScene.scene.position.y = -15;
      gltfScene.scene.position.x = -15;
      gltfScene.scene.scale.set(500, 500, 500);
      test.scene.add(gltfScene.scene);
    });
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
