import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import SceneInit from './lib/SceneInit';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    const spaceTexture = new THREE.TextureLoader().load('./assets/frame_0433.jpeg');
    spaceTexture.wrapS = THREE.RepeatWrapping;
    spaceTexture.wrapT = THREE.RepeatWrapping;
    spaceTexture.repeat.set(2, 2);
    test.scene.background = spaceTexture;

    // Create video texture
    const video = document.createElement('video');
    video.src = "./assets/video1.mp4";
    video.loop = true;
    video.load();
    video.play();
    const videoTexture = new THREE.VideoTexture(video);

    let loadedModel;
    const glftLoader = new GLTFLoader();
    glftLoader.load('./assets/schmott_3d.gltf', (gltfScene) => {
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
