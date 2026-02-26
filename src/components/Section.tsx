'use client';

import { useRef, useState, forwardRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Html, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Section as SectionType, SubSection } from '../app/page';
import React from 'react';

// Shared noise GLSL code (reused by both shaders)
const NOISE_GLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
`;

const SHARED_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Planet shader - animated FBM noise + fresnel rim
const PlanetShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#7B3FF2'),
    uHovered: 0,
    uModalOpen: 0,
  },
  SHARED_VERTEX,
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uHovered;
    uniform float uModalOpen;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    ${NOISE_GLSL}

    void main() {
      vec3 noiseCoord = vec3(vUv * 4.0, uTime * 0.004);
      float noise = fbm(noiseCoord);
      vec3 surfaceColor = uColor * (0.6 + noise * 0.5);

      float bands = sin(vUv.y * 20.0 + noise * 3.0 + uTime * 0.003) * 0.1;
      surfaceColor += bands;

      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
      surfaceColor += uColor * 2.0 * fresnel * (0.5 + uHovered * 0.5);
      surfaceColor += uColor * uHovered * 0.3;

      float alpha = mix(1.0, 0.1, uModalOpen);
      gl_FragColor = vec4(surfaceColor, alpha);
    }
  `
);

extend({ PlanetShaderMaterial });

// Star shader - hot plasma core, swirling energy, bright corona
const StarShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#7B3FF2'),
    uHovered: 0,
    uModalOpen: 0,
  },
  SHARED_VERTEX,
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uHovered;
    uniform float uModalOpen;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    ${NOISE_GLSL}

    void main() {
      // Nearly static plasma — barely perceptible drift
      float plasma1 = fbm(vec3(vUv * 3.0, uTime * 0.005));
      float plasma2 = fbm(vec3(vUv * 5.0 + vec2(uTime * 0.004, -uTime * 0.003), uTime * 0.004));
      float plasma = plasma1 * 0.6 + plasma2 * 0.4;

      // Hot white core fading to color at edges
      float distFromCenter = length(vUv - 0.5) * 2.0;
      vec3 hotCore = vec3(1.0, 0.95, 0.88); // white-hot
      vec3 midColor = uColor * 1.5;
      vec3 edgeColor = uColor * 0.8;
      vec3 surfaceColor = mix(hotCore, midColor, smoothstep(0.0, 0.6, distFromCenter));
      surfaceColor = mix(surfaceColor, edgeColor, smoothstep(0.5, 1.0, distFromCenter));

      // Plasma variation on surface
      surfaceColor += plasma * 0.3 * uColor;
      surfaceColor += plasma2 * 0.15;

      // Ultra-slow solar flares
      float flare = sin(vUv.x * 12.0 + uTime * 0.008) * sin(vUv.y * 8.0 - uTime * 0.006);
      surfaceColor += flare * 0.03 * uColor;

      // Intense fresnel corona
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);
      surfaceColor += uColor * fresnel * 2.0;
      surfaceColor += vec3(1.0, 0.9, 0.8) * fresnel * 0.5;

      // Hover energy surge
      surfaceColor += uColor * uHovered * 0.4;
      surfaceColor *= 1.3 + uHovered * 0.3;

      float alpha = mix(1.0, 0.1, uModalOpen);
      gl_FragColor = vec4(surfaceColor, alpha);
    }
  `
);

extend({ StarShaderMaterial });

// Atmosphere glow shader - pure fresnel
const AtmosphereShaderMaterial = shaderMaterial(
  { uColor: new THREE.Color('#7B3FF2'), uIntensity: 1.0 },
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform vec3 uColor;
    uniform float uIntensity;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 4.0);
      gl_FragColor = vec4(uColor * 1.5, fresnel * uIntensity);
    }
  `
);

extend({ AtmosphereShaderMaterial });

// Type declarations for JSX
declare module '@react-three/fiber' {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    planetShaderMaterial: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    starShaderMaterial: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    atmosphereShaderMaterial: any;
  }
}

interface SectionProps {
  name: string;
  position: [number, number, number];
  color: string;
  scale: number;
  id: string;
  Component?: React.ComponentType<object>;
  gradient: string;
  subSections?: SubSection[];
  onSectionClick: (section: SectionType) => void;
  isModalOpen: boolean;
}

const SectionComponent = forwardRef<THREE.Mesh, SectionProps>(
  ({
    name,
    position,
    color,
    scale,
    id,
    Component,
    subSections,
    onSectionClick,
    isModalOpen,
    gradient,
  }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const shaderRef = useRef<THREE.ShaderMaterial & { uTime: number; uHovered: number; uModalOpen: number }>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const isCenter = id === 'home';
    const hasRing = id === 'studies';
    const hasSubMoons = subSections && subSections.length > 0;
    const fontSize = isCenter ? 'text-xl' : 'text-md';

    const threeColor = useMemo(() => new THREE.Color(color), [color]);

    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.y += isCenter ? 0.003 : 0.002;
        if (hovered) meshRef.current.rotation.y += 0.005;
      }
      if (shaderRef.current) {
        shaderRef.current.uTime = state.clock.elapsedTime;
        shaderRef.current.uHovered = THREE.MathUtils.lerp(
          shaderRef.current.uHovered, hovered ? 1 : 0, 0.1
        );
        shaderRef.current.uModalOpen = THREE.MathUtils.lerp(
          shaderRef.current.uModalOpen, isModalOpen ? 1 : 0, 0.1
        );
      }
      if (ringRef.current) {
        ringRef.current.rotation.z += 0.001;
      }
    });

    return (
      <group position={position}>
        {/* Main sphere */}
        <mesh
          ref={(node) => {
            meshRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<THREE.Mesh | null>).current = node;
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onSectionClick({ name, position, color, scale, id, Component, gradient })}
          scale={hovered ? scale * 1.12 : scale}
        >
          <sphereGeometry args={[1, 64, 64]} />
          {isCenter ? (
            <starShaderMaterial
              ref={shaderRef}
              uTime={0}
              uColor={threeColor}
              uHovered={0}
              uModalOpen={0}
              transparent
            />
          ) : (
            <planetShaderMaterial
              ref={shaderRef}
              uTime={0}
              uColor={threeColor}
              uHovered={0}
              uModalOpen={0}
              transparent
            />
          )}
        </mesh>

        {/* Ring */}
        {hasRing && (
          <mesh ref={ringRef} scale={scale} rotation={[0, 0, 0]}>
            <ringGeometry args={[1.4, 2.2, 80]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isModalOpen ? 0.02 : 0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Decorative orbiting moons for home planet */}
        {isCenter && !isModalOpen && (
          <>
            <OrbitingMoon color="#a78bfa" parentScale={scale} speed={0.5} distance={3.5} size={0.2} />
            <OrbitingMoon color="#64ffda" parentScale={scale} speed={0.3} distance={4.5} size={0.12} />
            <OrbitingMoon color="#ff79c6" parentScale={scale} speed={0.2} distance={5.5} size={0.08} />
          </>
        )}

        {/* Clickable sub-section moons */}
        {hasSubMoons && !isModalOpen && subSections.map((sub, i) => {
          const moonCount = subSections.length;
          const baseDistance = moonCount > 4 ? 1.4 : 1.6;
          const spacing = moonCount > 4 ? 0.4 : 0.6;
          const moonSize = moonCount > 4 ? 0.3 : 0.4;
          return (
          <ClickableMoon
            key={sub.name}
            name={sub.name}
            color={sub.color}
            parentScale={scale}
            speed={0.04}
            distance={baseDistance + i * spacing}
            size={moonSize}
            offset={i * ((Math.PI * 2) / moonCount)}
            onClick={() => onSectionClick({
              name: sub.name,
              position,
              color: sub.color,
              scale,
              id: `${id}-${sub.name.toLowerCase()}`,
              Component: sub.Component,
              gradient: sub.gradient,
            })}
          />
          );
        })}

        {!isModalOpen && (
          <Html center distanceFactor={15}>
            <div
              className={`cursor-pointer font-bold ${fontSize} text-center select-none whitespace-nowrap`}
              style={{
                color: '#ffffff',
                textShadow: `0 0 20px ${color}, 0 0 40px ${color}80, 0 0 60px ${color}40, 0 0 6px rgba(255,255,255,0.8)`,
                transform: `scale(${hovered ? 1.2 : 1})`,
                transition: 'all 0.3s ease-out',
                letterSpacing: '0.15em',
                fontWeight: 800,
              }}
              onClick={() => {
                if (!hasSubMoons) {
                  onSectionClick({ name, position, color, scale, id, Component, gradient });
                }
              }}
            >
              {name}
            </div>
          </Html>
        )}
      </group>
    );
  }
);

function OrbitingMoon({ color, parentScale, speed, distance, size }: {
  color: string; parentScale: number; speed: number; distance: number; size: number;
}) {
  const moonRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (moonRef.current) {
      const t = state.clock.elapsedTime * speed;
      moonRef.current.position.x = Math.cos(t) * distance * parentScale;
      moonRef.current.position.y = Math.sin(t) * distance * parentScale;
      moonRef.current.position.z = Math.sin(t * 0.5) * 0.3;
    }
  });

  return (
    <group ref={moonRef}>
      <mesh scale={size}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#aaaaaa"
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.7}
        />
      </mesh>
      <mesh scale={size * 1.5}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function ClickableMoon({ name, color, parentScale, speed, distance, size, offset, onClick }: {
  name: string; color: string; parentScale: number; speed: number;
  distance: number; size: number; offset: number; onClick: () => void;
}) {
  const moonRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (moonRef.current) {
      const t = state.clock.elapsedTime * speed + offset;
      moonRef.current.position.x = Math.cos(t) * distance * parentScale;
      moonRef.current.position.y = Math.sin(t) * distance * parentScale;
      moonRef.current.position.z = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group ref={moonRef}>
      <mesh
        scale={hovered ? size * 1.3 : size}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh scale={size * 1.8}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.25 : 0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <Html center distanceFactor={10}>
        <div
          className="cursor-pointer text-xs font-bold text-center select-none whitespace-nowrap"
          style={{
            color: '#ffffff',
            textShadow: `0 0 10px ${color}, 0 0 20px ${color}80`,
            transform: `scale(${hovered ? 1.2 : 1})`,
            transition: 'all 0.3s ease-out',
            letterSpacing: '0.1em',
            opacity: hovered ? 1 : 0.7,
          }}
          onClick={onClick}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}

SectionComponent.displayName = 'Section';

export default SectionComponent;
