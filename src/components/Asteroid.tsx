'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AsteroidProps {
  position: [number, number, number];
  size: number;
  speed: number;
  rotationSpeed: [number, number, number];
  color?: string;
}

export default function Asteroid({
  position,
  size,
  speed,
  rotationSpeed,
  color = '#4a4a5a',
}: AsteroidProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create a jagged, rocky geometry by displacing vertices of an icosahedron
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(size, 1);
    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const len = Math.sqrt(x * x + y * y + z * z);
      const displacement = 1 + (Math.random() - 0.5) * 0.5;
      posAttr.setXYZ(i, (x / len) * size * displacement, (y / len) * size * displacement, (z / len) * size * displacement);
    }
    geo.computeVertexNormals();
    return geo;
  }, [size]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Tumbling rotation
      meshRef.current.rotation.x += rotationSpeed[0] * delta;
      meshRef.current.rotation.y += rotationSpeed[1] * delta;
      meshRef.current.rotation.z += rotationSpeed[2] * delta;

      // Slow drift
      meshRef.current.position.x += Math.sin(state.clock.elapsedTime * 0.1 + position[0]) * delta * speed;
      meshRef.current.position.y += Math.cos(state.clock.elapsedTime * 0.15 + position[1]) * delta * speed * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        metalness={0.1}
        emissive={color}
        emissiveIntensity={0.05}
        flatShading
      />
    </mesh>
  );
}
