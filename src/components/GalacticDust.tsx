'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GalacticDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Points>(null);

  const armData = useMemo(() => {
    const numArms = 6;
    const particlesPerArm = 700;
    const count = numArms * particlesPerArm;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Each arm gets a color gradient
    const armColorPairs: [THREE.Color, THREE.Color][] = [
      [new THREE.Color('#64ffda'), new THREE.Color('#4dd0e1')], // Arm 0: teal (My Journey)
      [new THREE.Color('#4dd0e1'), new THREE.Color('#38bdf8')], // Arm 1: cyan (Contact)
      [new THREE.Color('#ffd700'), new THREE.Color('#ff9500')], // Arm 2: gold (Studies)
      [new THREE.Color('#4ade80'), new THREE.Color('#a9e34b')], // Arm 3: green (Experience)
      [new THREE.Color('#a9e34b'), new THREE.Color('#84cc16')], // Arm 4: lime (Recommendations)
      [new THREE.Color('#ff79c6'), new THREE.Color('#ff6b6b')], // Arm 5: pink (Projects)
    ];
    const purple = new THREE.Color('#7B3FF2');

    let idx = 0;

    for (let arm = 0; arm < numArms; arm++) {
      const armOffset = arm * (Math.PI / 3); // 6 arms, 60° apart
      for (let i = 0; i < particlesPerArm; i++) {
        const t = (i / particlesPerArm) * 2.0;
        const r = 2.5 + t * 7;
        const theta = armOffset + t * 1.3;
        const scatter = 1.0 + t * 0.5;

        positions[idx * 3] = r * Math.cos(theta) + (Math.random() - 0.5) * scatter;
        positions[idx * 3 + 1] = r * Math.sin(theta) + (Math.random() - 0.5) * scatter;
        // Z spread increases with distance - gives 3D depth
        positions[idx * 3 + 2] = (Math.random() - 0.5) * (0.5 + t * 1.5);

        const colorT = t / 2.0;
        const baseColor = armColorPairs[arm][0].clone().lerp(armColorPairs[arm][1], colorT);
        baseColor.lerp(purple, 0.15 + (1 - colorT) * 0.15);

        colors[idx * 3] = baseColor.r;
        colors[idx * 3 + 1] = baseColor.g;
        colors[idx * 3 + 2] = baseColor.b;
        idx++;
      }
    }

    return { positions, colors };
  }, []);

  const coreData = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const coreColor = new THREE.Color('#7B3FF2');
    const white = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.5) * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.4; // slight 3D spread
      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * 0.5;

      const c = coreColor.clone().lerp(white, Math.random() * 0.4);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    // Arms: no independent rotation — RotatingGalaxy keeps them aligned with planets
    if (coreRef.current) {
      coreRef.current.rotation.z = state.clock.elapsedTime * 0.006;
    }
  });

  return (
    <>
      {/* 6 spiral arm particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[armData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[armData.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.45}
          sizeAttenuation
          size={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Dense core cluster */}
      <points ref={coreRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[coreData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[coreData.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          size={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
