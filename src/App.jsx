import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import SceneInit from './lib/SceneInit';

function App() {
  const modelRef = useRef();
  const [hasStarted, setHasStarted] = useState(false);

  const startScene = () => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();

    const spaceTexture = new THREE.TextureLoader().load('./assets/transparent.jpeg');
    spaceTexture.wrapS = THREE.RepeatWrapping;
    spaceTexture.wrapT = THREE.RepeatWrapping;
    spaceTexture.repeat.set(2, 2);
    test.scene.background = spaceTexture;

    const video = document.createElement('video');
    video.src = './assets/transperant.webm';
    video.loop = true;
    video.muted = true;
    video.play();

    const videoTexture = new THREE.VideoTexture(video);

    // Load SVG and create 3D object
    const svgLoader = new SVGLoader();
    svgLoader.load('./assets/Element.svg', (data) => {
      const paths = data.paths;
      const shapes = [];
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const shape = path.toShapes(true);
        shapes.push(...shape);
      }

      const geometry = new THREE.ExtrudeGeometry(shapes, {
        depth: 22.5,
        bevelEnabled: false,
      });

      const material = new THREE.MeshBasicMaterial({ map: videoTexture });
      const svgMesh = new THREE.Mesh(geometry, material);
      svgMesh.position.set(-25, 0, 0); // Move further left
      svgMesh.rotation.set(Math.PI, 0, 0); // Rotate by 180 degrees around X-axis
      svgMesh.scale.set(0.5, 0.5, 0.5); // Make the object slightly larger

      const group = new THREE.Group();
      group.add(svgMesh);

      // Calculate the centroid of the geometry
      const boundingBox = new THREE.Box3().setFromObject(svgMesh);
      const centroid = new THREE.Vector3();
      boundingBox.getCenter(centroid);

      // Set the pivot point to the centroid
      group.position.copy(centroid.negate());

      test.scene.add(group);
      modelRef.current = group;
    });

    // Adjust camera position and zoom
    test.camera.position.z = 400;

    const animate = () => {
      requestAnimationFrame(animate);
    
      // Add rotation animation around Y-axis in the opposite direction (clockwise)
      if (modelRef.current) {
        modelRef.current.rotation.y -= 0.01; // Negative rotation speed for clockwise rotation
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
