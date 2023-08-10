import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import SceneInit from './lib/SceneInit';

function App() {
  const modelRef = useRef();
  const mixerRef = useRef(); // To handle FBX animations
  const [hasStarted, setHasStarted] = useState(false);

  const startScene = () => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();

    const spaceTexture = new THREE.TextureLoader().load('./assets/transparent.jpeg');
    spaceTexture.wrapS = THREE.RepeatWrapping;
    spaceTexture.wrapT = THREE.RepeatWrapping;
    spaceTexture.repeat.set(2, 2);
    test.scene.background = spaceTexture;

    // Create video texture
    const video = document.createElement('video');
    video.src = "./assets/transperant.webm";
    video.loop = true;
    video.muted = true; // Ensure muted for autoplay
    video.play();

    const videoTexture = new THREE.VideoTexture(video);

    const fbxLoader = new FBXLoader();
    fbxLoader.load('./assets/schmott_animated.py.fbx', (fbxModel) => {
      fbxModel.traverse((node) => {
        if (node.isMesh) {
          node.material.map = videoTexture;
        }
      });

      // Handle FBX animations
      mixerRef.current = new THREE.AnimationMixer(fbxModel);
      if (fbxModel.animations.length > 0) {
        const action = mixerRef.current.clipAction(fbxModel.animations[0]);
        action.play();
      }

      test.scene.add(fbxModel);
      modelRef.current = fbxModel;
    });

    const animate = () => {
      requestAnimationFrame(animate);
      if (mixerRef.current) {
        mixerRef.current.update(0.01);  // Update the FBX animation
      }
      test.renderer.render(test.scene, test.camera);
    }
    animate();
  }

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
      {!hasStarted && <button onClick={() => { setHasStarted(true); startScene(); }}>Play</button>}
    </div>
  );
}

export default App;
