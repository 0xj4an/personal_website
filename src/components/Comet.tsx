'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CometProps {
  position: [number, number, number];
  velocity: [number, number, number];
  color?: string;
  size?: number;
}

const TRAIL_LENGTH = 20;

export default function Comet({ position, velocity, color = '#ffffff', size = 0.1 }: CometProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  // Trail particles - each one slightly behind the head
  const trailRefs = useRef<(THREE.Mesh | null)[]>([]);
  const positionHistory = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3(...position))
  );

  const trailSizes = useMemo(
    () => Array.from({ length: TRAIL_LENGTH }, (_, i) => size * (1 - i / TRAIL_LENGTH) * 0.8),
    [size]
  );

  useFrame((_, delta) => {
    if (!headRef.current) return;

    // Move the head
    headRef.current.position.x += velocity[0] * delta * 8;
    headRef.current.position.y += velocity[1] * delta * 8;
    headRef.current.position.z += velocity[2] * delta * 8;

    // Wrap boundaries
    const bounds = 50;
    const p = headRef.current.position;
    if (p.x > bounds) p.x = -bounds;
    if (p.x < -bounds) p.x = bounds;
    if (p.y > bounds) p.y = -bounds;
    if (p.y < -bounds) p.y = bounds;
    if (p.z > bounds) p.z = -bounds;
    if (p.z < -bounds) p.z = bounds;

    // Update position history - shift everything back
    for (let i = positionHistory.current.length - 1; i > 0; i--) {
      positionHistory.current[i].copy(positionHistory.current[i - 1]);
    }
    positionHistory.current[0].copy(headRef.current.position);

    // Update trail particle positions
    trailRefs.current.forEach((trail, i) => {
      if (trail) {
        trail.position.copy(positionHistory.current[i]);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Comet head - bright glowing sphere */}
      <mesh ref={headRef} position={position}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Head glow */}
      <mesh position={position}>
        <sphereGeometry args={[size * 2.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Trail particles - getting smaller and more transparent */}
      {trailSizes.map((trailSize, i) => (
        <mesh
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          position={position}
        >
          <sphereGeometry args={[trailSize, 8, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6 * (1 - i / TRAIL_LENGTH)}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
