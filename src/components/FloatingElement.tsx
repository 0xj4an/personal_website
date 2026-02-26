'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingElementProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color?: string;
}

// Nebula cloud - a cluster of transparent overlapping spheres with additive blending
export default function FloatingElement({ position, rotation, scale, color = '#7B3FF2' }: FloatingElementProps) {
  const groupRef = useRef<THREE.Group>(null);

  const cloudParts = useMemo(() => {
    const parts: { pos: [number, number, number]; size: number; opacity: number }[] = [];
    const count = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      parts.push({
        pos: [
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
        ] as [number, number, number],
        size: 0.4 + Math.random() * 0.8,
        opacity: 0.02 + Math.random() * 0.04,
      });
    }
    return parts;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02 + rotation[1];
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {cloudParts.map((part, i) => (
        <mesh key={i} position={part.pos}>
          <sphereGeometry args={[part.size, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={part.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
