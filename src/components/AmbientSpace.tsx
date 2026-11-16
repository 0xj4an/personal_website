'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Randomized ambient life around the galaxy: constellations and distant
// galaxies on the sky sphere, rockets on curved flights, satellites orbiting
// planets, plus random layouts for asteroids, comets and spaceships.
// Everything is generated once per page load (client only, inside the Canvas).

type Vec3 = [number, number, number];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

function randomDirection() {
  const u = Math.random() * 2 - 1;
  const theta = Math.random() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return new THREE.Vector3(s * Math.cos(theta), s * Math.sin(theta), u);
}

const ACCENTS = ['#ff79c6', '#64ffda', '#ffd700', '#a78bfa', '#4dd0e1', '#a9e34b'] as const;

// Sky sphere radius: beyond the farthest camera position (about 155 on narrow
// phones) so sky objects never come between the camera and the galaxy.
const SKY_RADIUS = 230;

// ---------------------------------------------------------------------------
// Constellations
// ---------------------------------------------------------------------------

export function Constellations({ count = 9 }: { count?: number }) {
  const pixelRatio = useThree((s) => s.viewport.dpr);
  const starMaterial = useRef<THREE.ShaderMaterial>(null);
  const lineMaterial = useRef<THREE.ShaderMaterial>(null);

  const { stars, sizes, phases, lines, lineGroups } = useMemo(() => {
    const starList: number[] = [];
    const sizeList: number[] = [];
    const phaseList: number[] = [];
    const lineList: number[] = [];
    const groupList: number[] = [];
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3(1, 0, 0);

    for (let c = 0; c < count; c++) {
      const center = randomDirection();
      const t1 = new THREE.Vector3().crossVectors(center, Math.abs(center.y) < 0.9 ? up : side).normalize();
      const t2 = new THREE.Vector3().crossVectors(center, t1).normalize();
      const n = 5 + Math.floor(Math.random() * 4);
      const spread = rand(0.1, 0.2);
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < n; i++) {
        points.push(
          center.clone()
            .addScaledVector(t1, rand(-1, 1) * spread)
            .addScaledVector(t2, rand(-1, 1) * spread * 0.75)
            .normalize()
            .multiplyScalar(SKY_RADIUS)
        );
      }

      // Minimum spanning tree (Prim) gives the classic stick-figure shape.
      const inTree = [0];
      const edges: [number, number][] = [];
      while (inTree.length < n) {
        let best: [number, number] = [0, 0];
        let bestDist = Infinity;
        for (const a of inTree) {
          for (let b = 0; b < n; b++) {
            if (inTree.includes(b)) continue;
            const d = points[a].distanceToSquared(points[b]);
            if (d < bestDist) {
              bestDist = d;
              best = [a, b];
            }
          }
        }
        edges.push(best);
        inTree.push(best[1]);
      }
      // Sometimes close one loop, like real asterisms do.
      if (n > 5 && Math.random() < 0.5) edges.push([inTree[n - 1], inTree[Math.floor(n / 2)]]);

      for (const p of points) {
        starList.push(p.x, p.y, p.z);
        sizeList.push(rand(4, 8));
        phaseList.push(rand(0, Math.PI * 2));
      }
      for (const [a, b] of edges) {
        lineList.push(points[a].x, points[a].y, points[a].z, points[b].x, points[b].y, points[b].z);
        groupList.push(c, c);
      }
    }

    return {
      stars: new Float32Array(starList),
      sizes: new Float32Array(sizeList),
      phases: new Float32Array(phaseList),
      lines: new Float32Array(lineList),
      lineGroups: new Float32Array(groupList),
    };
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (starMaterial.current) starMaterial.current.uniforms.uTime.value = t;
    if (lineMaterial.current) lineMaterial.current.uniforms.uTime.value = t;
  });

  return (
    <group>
      <lineSegments raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
          <bufferAttribute attach="attributes-aGroup" args={[lineGroups, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={lineMaterial}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color('#b8acff') } }}
          vertexShader={/* glsl */ `
            attribute float aGroup;
            uniform float uTime;
            varying float vAlpha;
            void main() {
              // Each constellation fades in and out on its own slow rhythm.
              vAlpha = 0.14 + 0.46 * smoothstep(-0.2, 1.0, sin(uTime * 0.22 + aGroup * 2.39));
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            uniform vec3 uColor;
            varying float vAlpha;
            void main() {
              gl_FragColor = vec4(uColor * vAlpha, 1.0);
            }
          `}
        />
      </lineSegments>

      <points raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={starMaterial}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uTime: { value: 0 }, uPixelRatio: { value: pixelRatio } }}
          vertexShader={/* glsl */ `
            attribute float aSize;
            attribute float aPhase;
            uniform float uTime;
            uniform float uPixelRatio;
            varying float vTwinkle;
            void main() {
              vTwinkle = 0.65 + 0.35 * sin(uTime * 1.9 + aPhase);
              gl_PointSize = aSize * uPixelRatio * (0.85 + 0.25 * vTwinkle);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            varying float vTwinkle;
            void main() {
              float d = length(gl_PointCoord - 0.5);
              float core = smoothstep(0.22, 0.0, d);
              float halo = smoothstep(0.5, 0.0, d) * 0.35;
              vec3 color = vec3(0.82, 0.86, 1.0) * (core * 1.8 + halo) * vTwinkle;
              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </points>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Distant spiral galaxies on the sky sphere
// ---------------------------------------------------------------------------

function DistantGalaxy({ position, size, tint, squash, wind, seed, roll }: {
  position: THREE.Vector3; size: number; tint: string; squash: number; wind: number; seed: number; roll: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTint: { value: new THREE.Color(tint) },
      uSquash: { value: squash },
      uWind: { value: wind },
      uSeed: { value: seed },
    }),
    [tint, squash, wind, seed]
  );

  // Face the galaxy center so it reads from anywhere the camera orbits.
  const quaternion = useMemo(() => {
    const m = new THREE.Matrix4().lookAt(position, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    const q = new THREE.Quaternion().setFromRotationMatrix(m);
    return q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), roll));
  }, [position, roll]);

  return (
    <mesh ref={ref} position={position} quaternion={quaternion} raycast={() => null}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uTint;
          uniform float uSquash;
          uniform float uWind;
          uniform float uSeed;
          varying vec2 vUv;
          void main() {
            vec2 p = (vUv - 0.5) * 2.0;
            p.y /= uSquash;
            float r = length(p);
            float a = atan(p.y, p.x);
            float arms = pow(0.5 + 0.5 * cos(2.0 * (a - log(r + 0.02) * uWind) + uSeed), 3.0);
            float core = exp(-r * r * 22.0);
            float disc = exp(-r * 3.4) * (0.25 + arms * 0.75);
            float intensity = (core * 1.4 + disc * 0.55) * smoothstep(1.0, 0.55, r);
            vec3 color = mix(uTint, vec3(1.0, 0.95, 0.88), core) * intensity * 0.6;
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export function DistantGalaxies({ count = 4 }: { count?: number }) {
  const galaxies = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        position: randomDirection().multiplyScalar(rand(195, 240)),
        size: rand(18, 34),
        tint: pick(['#8f7bff', '#5fb8ff', '#ff8fd0', '#9fffe0'] as const),
        squash: rand(0.35, 1.0),
        wind: rand(1.4, 2.6),
        seed: rand(0, 6.28),
        roll: rand(0, Math.PI * 2),
      })),
    [count]
  );
  return (
    <>
      {galaxies.map((g, i) => (
        <DistantGalaxy key={i} {...g} />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Rockets on curved flights with a flickering flame and a smoke trail
// ---------------------------------------------------------------------------

const TRAIL_PARTICLES = 140;
const TRAIL_LIFE = 1.6;
const UP = new THREE.Vector3(0, 1, 0);

interface Flight {
  p0: THREE.Vector3;
  c: THREE.Vector3;
  p2: THREE.Vector3;
  duration: number;
  t: number;
}

function newFlight(): Flight {
  const a = rand(0, Math.PI * 2);
  const r0 = rand(38, 52);
  const r2 = rand(38, 52);
  const b = a + Math.PI + rand(-0.9, 0.9);
  const p0 = new THREE.Vector3(Math.cos(a) * r0, Math.sin(a) * r0, rand(-10, 8));
  const p2 = new THREE.Vector3(Math.cos(b) * r2, Math.sin(b) * r2, rand(-10, 8));
  const mid = p0.clone().add(p2).multiplyScalar(0.5);
  const perp = new THREE.Vector3(-(p2.y - p0.y), p2.x - p0.x, 0).normalize();
  const c = mid.addScaledVector(perp, rand(-16, 16)).add(new THREE.Vector3(0, 0, rand(-6, 6)));
  const speed = rand(5, 9);
  return { p0, c, p2, duration: p0.distanceTo(p2) / speed, t: 0 };
}

function bezier(f: Flight, t: number, out: THREE.Vector3) {
  const u = 1 - t;
  return out
    .copy(f.p0).multiplyScalar(u * u)
    .addScaledVector(f.c, 2 * u * t)
    .addScaledVector(f.p2, t * t);
}

function bezierTangent(f: Flight, t: number, out: THREE.Vector3) {
  return out
    .copy(f.c).sub(f.p0).multiplyScalar(2 * (1 - t))
    .addScaledVector(new THREE.Vector3().copy(f.p2).sub(f.c), 2 * t)
    .normalize();
}

function Rocket({ initialDelay }: { initialDelay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Group>(null);
  const accentMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const trailMaterial = useRef<THREE.ShaderMaterial>(null);
  const flight = useRef<Flight | null>(null);
  const wait = useRef(initialDelay);
  const cursor = useRef(0);
  const pixelRatio = useThree((s) => s.viewport.dpr);

  const tmp = useMemo(
    () => ({ pos: new THREE.Vector3(), tan: new THREE.Vector3(), nozzle: new THREE.Vector3() }),
    []
  );
  const trail = useMemo(() => {
    const positions = new Float32Array(TRAIL_PARTICLES * 3).fill(9999);
    const ages = new Float32Array(TRAIL_PARTICLES).fill(TRAIL_LIFE);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aAge', new THREE.BufferAttribute(ages, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
    return { positions, ages, geometry };
  }, []);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const dt = Math.min(delta, 0.05);

    // Age the trail whether or not the rocket is flying.
    for (let i = 0; i < TRAIL_PARTICLES; i++) trail.ages[i] += dt;

    if (!flight.current) {
      wait.current -= dt;
      group.visible = false;
      if (wait.current <= 0) {
        flight.current = newFlight();
        accentMaterial.current?.color.set(pick(ACCENTS));
      }
    } else {
      const f = flight.current;
      f.t += dt / f.duration;
      if (f.t >= 1) {
        flight.current = null;
        wait.current = rand(3, 12);
      } else {
        group.visible = true;
        bezier(f, f.t, tmp.pos);
        bezierTangent(f, f.t, tmp.tan);
        group.position.copy(tmp.pos);
        group.quaternion.setFromUnitVectors(UP, tmp.tan);

        // Emit smoke from the nozzle, slightly jittered.
        tmp.nozzle.set(0, -0.62, 0);
        group.localToWorld(tmp.nozzle);
        for (let k = 0; k < 2; k++) {
          const i = cursor.current;
          trail.positions[i * 3] = tmp.nozzle.x + rand(-0.06, 0.06);
          trail.positions[i * 3 + 1] = tmp.nozzle.y + rand(-0.06, 0.06);
          trail.positions[i * 3 + 2] = tmp.nozzle.z + rand(-0.06, 0.06);
          trail.ages[i] = rand(0, 0.08);
          cursor.current = (i + 1) % TRAIL_PARTICLES;
        }
        trail.geometry.attributes.position.needsUpdate = true;

        if (flameRef.current) {
          const flicker = 0.85 + Math.sin(clock.elapsedTime * 38) * 0.08 + Math.random() * 0.12;
          flameRef.current.scale.set(1, flicker, 1);
        }
      }
    }
    trail.geometry.attributes.aAge.needsUpdate = true;
    if (trailMaterial.current) trailMaterial.current.uniforms.uPixelRatio.value = pixelRatio;
  });

  return (
    <>
      <group ref={groupRef} visible={false} scale={1.45}>
        {/* Body */}
        <mesh raycast={() => null}>
          <cylinderGeometry args={[0.16, 0.2, 0.9, 20]} />
          <meshStandardMaterial color="#e8e6f0" metalness={0.55} roughness={0.3} />
        </mesh>
        {/* Nose cone */}
        <mesh position={[0, 0.65, 0]} raycast={() => null}>
          <coneGeometry args={[0.16, 0.4, 20]} />
          <meshStandardMaterial ref={accentMaterial} color="#ff79c6" metalness={0.3} roughness={0.4} emissive="#220011" />
        </mesh>
        {/* Window */}
        <mesh position={[0, 0.18, 0.17]} raycast={() => null}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshBasicMaterial color="#9ff6ff" />
        </mesh>
        {/* Fins */}
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
            <mesh position={[0, -0.36, 0.22]} rotation={[0.25, 0, 0]} raycast={() => null}>
              <boxGeometry args={[0.03, 0.32, 0.2]} />
              <meshStandardMaterial color="#6d5bd0" metalness={0.4} roughness={0.5} />
            </mesh>
          </group>
        ))}
        {/* Nozzle */}
        <mesh position={[0, -0.52, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.1, 0.14, 0.12, 16]} />
          <meshStandardMaterial color="#3a3550" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Flame: the group origin is the nozzle, so flicker scales from the base */}
        <group ref={flameRef} position={[0, -0.58, 0]}>
          <mesh position={[0, -0.35, 0]} rotation={[Math.PI, 0, 0]} raycast={() => null}>
            <coneGeometry args={[0.12, 0.7, 16, 1, true]} />
            <shaderMaterial
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              vertexShader={/* glsl */ `
                varying float vT;
                void main() {
                  // Cone base (-0.35 before the flip) sits at the nozzle: vT 0 there, 1 at the tip.
                  vT = (position.y + 0.35) / 0.7;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `}
              fragmentShader={/* glsl */ `
                varying float vT;
                void main() {
                  vec3 hot = vec3(1.6, 1.5, 1.3);
                  vec3 orange = vec3(1.4, 0.55, 0.15);
                  vec3 color = mix(hot, orange, smoothstep(0.0, 0.6, vT));
                  float a = 1.0 - smoothstep(0.3, 1.0, vT);
                  gl_FragColor = vec4(color * a, 1.0);
                }
              `}
            />
          </mesh>
        </group>
      </group>

      {/* Smoke trail in world space */}
      <points geometry={trail.geometry} raycast={() => null}>
        <shaderMaterial
          ref={trailMaterial}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uLife: { value: TRAIL_LIFE }, uPixelRatio: { value: pixelRatio } }}
          vertexShader={/* glsl */ `
            attribute float aAge;
            uniform float uLife;
            uniform float uPixelRatio;
            varying float vLife;
            void main() {
              vLife = clamp(aAge / uLife, 0.0, 1.0);
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = (2.0 + vLife * 9.0) * uPixelRatio * (30.0 / -mv.z);
              gl_Position = projectionMatrix * mv;
            }
          `}
          fragmentShader={/* glsl */ `
            varying float vLife;
            void main() {
              float d = length(gl_PointCoord - 0.5);
              float shape = smoothstep(0.5, 0.1, d);
              vec3 fire = vec3(1.3, 0.6, 0.2);
              vec3 smoke = vec3(0.35, 0.3, 0.55);
              vec3 color = mix(fire, smoke, smoothstep(0.0, 0.35, vLife));
              float alpha = (1.0 - vLife) * shape * mix(0.9, 0.35, vLife);
              gl_FragColor = vec4(color * alpha, 1.0);
            }
          `}
        />
      </points>
    </>
  );
}

export function RocketFleet({ count = 3 }: { count?: number }) {
  const delays = useMemo(() => Array.from({ length: count }, (_, i) => rand(1, 4) + i * rand(3, 6)), [count]);
  return (
    <>
      {delays.map((delay, i) => (
        <Rocket key={i} initialDelay={delay} />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Small satellites orbiting a planet, with a blinking beacon
// ---------------------------------------------------------------------------

export function OrbitingSatellite({ center, radius, speed, tilt, phase }: {
  center: Vec3; radius: number; speed: number; tilt: [number, number]; phase: number;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const beacon = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase;
    if (orbitRef.current) {
      orbitRef.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
      orbitRef.current.rotation.y = -t;
    }
    if (beacon.current) beacon.current.opacity = Math.sin(clock.elapsedTime * 5 + phase) > 0.6 ? 1 : 0.15;
  });

  return (
    <group position={center} rotation={[tilt[0], 0, tilt[1]]}>
      <group ref={orbitRef} scale={0.32}>
        <mesh raycast={() => null}>
          <boxGeometry args={[0.35, 0.35, 0.55]} />
          <meshStandardMaterial color="#c9c4d8" metalness={0.8} roughness={0.25} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.75, 0, 0]} raycast={() => null}>
            <boxGeometry args={[1.0, 0.03, 0.38]} />
            <meshStandardMaterial color="#2a3f9e" metalness={0.4} roughness={0.35} emissive="#10206a" emissiveIntensity={0.6} />
          </mesh>
        ))}
        <mesh position={[0, 0.3, 0]} raycast={() => null}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshBasicMaterial ref={beacon} color="#ff3355" transparent />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Random layouts for the existing asteroids, comets and spaceships
// ---------------------------------------------------------------------------

export function randomAsteroids(count: number, avoid: Vec3[]) {
  const result: { position: Vec3; size: number; speed: number; rotationSpeed: Vec3; color: string }[] = [];
  let guard = 0;
  while (result.length < count && guard++ < count * 40) {
    const r = rand(5, 21);
    const a = rand(0, Math.PI * 2);
    const position: Vec3 = [Math.cos(a) * r, Math.sin(a) * r, rand(-2.5, 0.5)];
    // Keep clear of planets and their moons.
    if (avoid.some((p) => Math.hypot(p[0] - position[0], p[1] - position[1]) < 5)) continue;
    const gray = Math.floor(rand(0x48, 0x8a));
    const warm = Math.floor(rand(0, 18));
    result.push({
      position,
      size: rand(0.1, 0.38),
      speed: rand(0.1, 0.5),
      rotationSpeed: [rand(0.1, 0.6), rand(0.1, 0.6), rand(0.1, 0.6)],
      color: `rgb(${gray + warm}, ${gray}, ${gray + Math.floor(rand(0, 16))})`,
    });
  }
  return result;
}

export function randomComets(count: number) {
  return Array.from({ length: count }, () => {
    const a = rand(0, Math.PI * 2);
    const start: Vec3 = [Math.cos(a) * rand(20, 30), Math.sin(a) * rand(20, 30), rand(-5, 2)];
    const heading = a + Math.PI + rand(-0.7, 0.7);
    const speed = rand(0.3, 0.5);
    return {
      position: start,
      velocity: [Math.cos(heading) * speed, Math.sin(heading) * speed, rand(-0.15, 0.15)] as Vec3,
      size: rand(0.07, 0.15),
      color: pick(['#ffe066', '#a9e34b', '#4dd0e1', '#ff9ad5', '#c4b5fd'] as const),
    };
  });
}

export function randomSpaceships(count: number) {
  return Array.from({ length: count }, () => {
    const a = rand(0, Math.PI * 2);
    const heading = a + Math.PI + rand(-0.8, 0.8);
    const speed = rand(0.25, 0.5);
    return {
      startPosition: [Math.cos(a) * rand(28, 40), Math.sin(a) * rand(28, 40), rand(-4, -1)] as Vec3,
      velocity: [Math.cos(heading) * speed, Math.sin(heading) * speed, rand(-0.08, 0.08)] as Vec3,
      color: pick(['#4dd0e1', '#ff6600', '#ff0044', '#44aaff'] as const),
      size: rand(0.4, 0.7),
      type: pick(['satellite', 'shuttle', 'probe'] as const),
    };
  });
}
