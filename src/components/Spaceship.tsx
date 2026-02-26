'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpaceshipProps {
  startPosition: [number, number, number];
  velocity: [number, number, number];
  color: string;
  size?: number;
  type?: 'satellite' | 'shuttle' | 'probe';
}

// Build a simple geometric spaceship/satellite from basic shapes
function createShipGeometry(type: string) {
  const group = new THREE.Group();

  if (type === 'satellite') {
    // Central body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.6),
      new THREE.MeshStandardMaterial({ color: '#8899aa', metalness: 0.8, roughness: 0.2 })
    );
    group.add(body);

    // Solar panels
    const panelGeo = new THREE.BoxGeometry(1.2, 0.02, 0.4);
    const panelMat = new THREE.MeshStandardMaterial({ color: '#2244aa', metalness: 0.3, roughness: 0.4, emissive: '#1133aa', emissiveIntensity: 0.3 });
    const leftPanel = new THREE.Mesh(panelGeo, panelMat);
    leftPanel.position.x = -0.7;
    const rightPanel = new THREE.Mesh(panelGeo, panelMat);
    rightPanel.position.x = 0.7;
    group.add(leftPanel, rightPanel);

    // Antenna dish
    const dish = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.3, 8),
      new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 0.5 })
    );
    dish.position.y = 0.3;
    group.add(dish);
  } else if (type === 'shuttle') {
    // Fuselage
    const fuselage = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.8, 6),
      new THREE.MeshStandardMaterial({ color: '#ccccdd', metalness: 0.6, roughness: 0.3 })
    );
    fuselage.rotation.z = Math.PI / 2;
    group.add(fuselage);

    // Wings
    const wingGeo = new THREE.BoxGeometry(0.1, 0.5, 0.3);
    const wingMat = new THREE.MeshStandardMaterial({ color: '#8899bb', metalness: 0.5 });
    const wing = new THREE.Mesh(wingGeo, wingMat);
    wing.position.x = -0.1;
    group.add(wing);

    // Engine glow
    const engine = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshBasicMaterial({ color: '#ff6600', transparent: true, opacity: 0.8 })
    );
    engine.position.x = -0.45;
    group.add(engine);
  } else {
    // Probe - small satellite-like thing
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.2, 0),
      new THREE.MeshStandardMaterial({ color: '#aabbcc', metalness: 0.7, roughness: 0.2 })
    );
    group.add(core);

    // Arms
    for (let i = 0; i < 3; i++) {
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.6),
        new THREE.MeshStandardMaterial({ color: '#888888' })
      );
      arm.rotation.z = (i * Math.PI * 2) / 3;
      arm.position.y = 0.3;
      group.add(arm);
    }

    // Blinking light
    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      new THREE.MeshBasicMaterial({ color: '#ff0044', transparent: true, opacity: 0.9 })
    );
    light.position.y = 0.25;
    group.add(light);
  }

  return group;
}

export default function Spaceship({
  startPosition,
  velocity,
  color,
  size = 1,
  type = 'satellite',
}: SpaceshipProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ship = useMemo(() => createShipGeometry(type), [type]);

  // Blinking light ref
  const blinkRef = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Move in direction
      groupRef.current.position.x += velocity[0] * delta * 3;
      groupRef.current.position.y += velocity[1] * delta * 3;
      groupRef.current.position.z += velocity[2] * delta * 3;

      // Slight wobble
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // Wrap around boundaries
      const bounds = 60;
      if (groupRef.current.position.x > bounds) groupRef.current.position.x = -bounds;
      if (groupRef.current.position.x < -bounds) groupRef.current.position.x = bounds;
      if (groupRef.current.position.y > bounds) groupRef.current.position.y = -bounds;
      if (groupRef.current.position.y < -bounds) groupRef.current.position.y = bounds;
      if (groupRef.current.position.z > bounds) groupRef.current.position.z = -bounds;
      if (groupRef.current.position.z < -bounds) groupRef.current.position.z = bounds;

      // Blinking effect for probe lights
      blinkRef.current += delta;
      if (type === 'probe' && ship.children.length > 3) {
        const lightMesh = ship.children[3] as THREE.Mesh;
        if (lightMesh.material instanceof THREE.MeshBasicMaterial) {
          lightMesh.material.opacity = Math.sin(blinkRef.current * 4) > 0 ? 0.9 : 0.1;
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={startPosition} scale={size}>
      <primitive object={ship} />
      {/* Tiny point light for engine glow */}
      <pointLight
        position={velocity.map(v => -v * 0.5) as [number, number, number]}
        intensity={0.1}
        color={color}
        distance={3}
      />
    </group>
  );
}
