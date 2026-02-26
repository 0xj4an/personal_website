'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  trail: THREE.Vector3[];
  timer: number;
  nextSpawn: number;
  active: boolean;
  maxLife: number;
}

const TRAIL_LENGTH = 15;

export default function ShootingStars() {
  const groupRef = useRef<THREE.Group>(null);

  const stars = useMemo<StarState[]>(() => {
    return Array.from({ length: 4 }, () => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      trail: Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3(9999, 9999, 9999)),
      timer: 0,
      nextSpawn: 2 + Math.random() * 10,
      active: false,
      maxLife: 0,
    }));
  }, []);

  const spawn = (star: StarState) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 35 + Math.random() * 15;
    star.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      (Math.random() - 0.5) * 8
    );

    const targetAngle = angle + Math.PI + (Math.random() - 0.5) * 1.2;
    const speed = 20 + Math.random() * 30;
    star.velocity.set(
      Math.cos(targetAngle) * speed,
      Math.sin(targetAngle) * speed,
      (Math.random() - 0.5) * 2
    );

    star.trail.forEach(t => t.copy(star.position));
    star.timer = 0;
    star.maxLife = 1.5 + Math.random() * 2.5;
    star.active = true;
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    stars.forEach((star, starIdx) => {
      if (!star.active) {
        star.nextSpawn -= delta;
        if (star.nextSpawn <= 0) {
          spawn(star);
        }
      }

      if (star.active) {
        star.timer += delta;

        if (star.timer > star.maxLife) {
          star.active = false;
          star.nextSpawn = 5 + Math.random() * 12;
          star.position.set(9999, 9999, 9999);
          star.trail.forEach(t => t.set(9999, 9999, 9999));
        } else {
          // Shift trail
          for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
            star.trail[i].copy(star.trail[i - 1]);
          }
          star.trail[0].copy(star.position);

          // Move head
          star.position.add(star.velocity.clone().multiplyScalar(delta));
        }
      }

      // Update meshes
      const starGroup = groupRef.current!.children[starIdx] as THREE.Group;
      if (!starGroup) return;

      // Head (index 0 and 1 = sphere + glow)
      const headGroup = starGroup.children[0] as THREE.Group;
      if (headGroup) {
        headGroup.position.copy(star.position);
        headGroup.visible = star.active;

        if (star.active) {
          const fade = star.timer < 0.2
            ? star.timer / 0.2
            : star.timer > star.maxLife - 0.3
              ? (star.maxLife - star.timer) / 0.3
              : 1;
          headGroup.scale.setScalar(Math.max(fade, 0));
        }
      }

      // Trail particles (index 1+)
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const trailMesh = starGroup.children[i + 1] as THREE.Mesh;
        if (!trailMesh) continue;

        trailMesh.position.copy(star.trail[i]);
        trailMesh.visible = star.active;

        if (star.active) {
          const t = (i + 1) / TRAIL_LENGTH;
          const trailFade = (1 - t) * 0.6;
          trailMesh.scale.setScalar(1 - t * 0.7);
          const mat = trailMesh.material as THREE.MeshBasicMaterial;
          mat.opacity = trailFade;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {stars.map((_, starIdx) => (
        <group key={starIdx}>
          {/* Head */}
          <group visible={false}>
            <mesh>
              <sphereGeometry args={[0.07, 6, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh scale={2.5}>
              <sphereGeometry args={[0.07, 6, 6]} />
              <meshBasicMaterial
                color="#aaddff"
                transparent
                opacity={0.5}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
          {/* Trail */}
          {Array.from({ length: TRAIL_LENGTH }, (_, i) => (
            <mesh key={i} visible={false}>
              <sphereGeometry args={[0.04, 4, 4]} />
              <meshBasicMaterial
                color="#aaddff"
                transparent
                opacity={0.3}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
