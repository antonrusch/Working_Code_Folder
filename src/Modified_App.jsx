import { useEffect } from 'react';
import * as THREE from 'three';
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

    loader.load('./assets/schmott_animated.py.fbx', (loadedObject) => {
      loadedModel = loadedObject;

      // Apply video texture to all materials in the model
      loadedModel.scene.traverse((node) => {
        if (node.isMesh) {
          node.material.map = videoTexture;
        }
      });

      loadedObject.rotation.x = 90;
      loadedObject.rotation.z = 0.2;
      loadedObject.position.y = -15;
      loadedObject.position.x = -15;
      loadedObject.scale.set(500, 500, 500);
      test.scene.add(loadedObject.scene);

const mixer = new THREE.AnimationMixer(loadedObject);
const action = mixer.clipAction(loadedObject.animations[0]);
action.play();

    });
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
