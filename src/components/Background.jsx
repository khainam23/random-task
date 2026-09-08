import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Orb colours khớp với --c-orb-* trong CSS
const ORB_COLORS = [0x1d4ed8, 0x3b82f6, 0x0ea5e9, 0x6366f1, 0x1e40af];

export default function Background() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = window.innerWidth, H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 5;

    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    const orbData = [
      { r: 1.15, i: 0, x: -2.2, y:  1.2, z: -2   },
      { r: 0.85, i: 1, x:  2.8, y: -1.2, z: -2.5  },
      { r: 0.60, i: 2, x:  0.2, y: -2.2, z: -1.5  },
      { r: 0.42, i: 3, x:  3.2, y:  2.2, z: -3    },
      { r: 0.38, i: 4, x: -3.0, y: -1.8, z: -2.5  },
    ];

    const orbs = orbData.map(({ r, i, x, y, z }) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(r, 32, 32),
        new THREE.MeshStandardMaterial({
          color: ORB_COLORS[i],
          roughness: 0.1,
          metalness: 0.3,
          transparent: true,
          opacity: 0.45,
        })
      );
      mesh.position.set(x, y, z);
      orbGroup.add(mesh);
      return mesh;
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pl1 = new THREE.PointLight(0x3b82f6, 4,   14); pl1.position.set( 2,  3, 3); scene.add(pl1);
    const pl2 = new THREE.PointLight(0x1d4ed8, 2.5, 10); pl2.position.set(-3, -2, 2); scene.add(pl2);

    const count = 200;
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 22;
    const pGeo  = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.05, transparent: true, opacity: 0.4 })));

    let mx = 0, my = 0;
    const onMouse  = e => { mx = (e.clientX / window.innerWidth  - 0.5) * 2; my = -(e.clientY / window.innerHeight - 0.5) * 2; };
    const onResize = () => { const W2 = window.innerWidth, H2 = window.innerHeight; camera.aspect = W2/H2; camera.updateProjectionMatrix(); renderer.setSize(W2,H2); };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize',    onResize);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      orbs.forEach((orb, i) => {
        orb.position.y += Math.sin(t * 0.35 + i * 1.3) * 0.002;
        orb.position.x += Math.cos(t * 0.28 + i * 0.9) * 0.001;
        orb.rotation.y   = t * 0.12 * (i % 2 === 0 ? 1 : -1);
      });
      orbGroup.rotation.y = mx * 0.05;
      orbGroup.rotation.x = my * 0.035;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize',    onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
