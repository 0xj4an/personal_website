'use client';

import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Procedural planet materials. All noise is sampled in object space on the
// unit sphere, so there are no UV seams or pinched poles, and every planet is
// lit by the central star at the world origin (real day / night terminator).

export type PlanetKind = 'gas' | 'terran' | 'ice' | 'rocky';

export const KIND_INDEX: Record<PlanetKind, number> = {
  gas: 0,
  terran: 1,
  ice: 2,
  rocky: 3,
};

// Warm white with a hint of the violet star, so lit sides feel related to it.
const STAR_LIGHT = 'vec3(1.0, 0.94, 1.0)';

const NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
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
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p);
      p *= 2.03;
      amplitude *= 0.5;
    }
    return value;
  }

  float fbm3(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 3; i++) {
      value += amplitude * snoise(p);
      p *= 2.03;
      amplitude *= 0.5;
    }
    return value;
  }
`;

// Shared vertex shader for spheres: object-space position for noise, world
// position and normal for lighting.
const SPHERE_VERTEX = /* glsl */ `
  varying vec3 vObj;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vObj = position;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// ---------------------------------------------------------------------------
// Planet surface
// ---------------------------------------------------------------------------

const SurfaceMaterial = shaderMaterial(
  {
    uTime: 0,
    uKind: 0,
    uSeed: 0,
    uColorA: new THREE.Color('#222244'),
    uColorB: new THREE.Color('#5555aa'),
    uColorC: new THREE.Color('#ccccff'),
    uRim: new THREE.Color('#8888ff'),
    uHovered: 0,
    uFade: 0,
  },
  SPHERE_VERTEX,
  /* glsl */ `
    uniform float uTime;
    uniform float uKind;
    uniform float uSeed;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform vec3 uRim;
    uniform float uHovered;
    uniform float uFade;

    varying vec3 vObj;
    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;

    ${NOISE_GLSL}

    void main() {
      vec3 p = normalize(vObj);
      vec3 seed = vec3(uSeed * 7.13, uSeed * 3.71, uSeed * 1.37);
      vec3 albedo;
      float specMask = 0.0;
      float cityMask = 0.0;
      float rimStrength = 0.6;

      if (uKind < 0.5) {
        // Gas giant: turbulent latitude bands plus one oval storm.
        float warp = fbm(p * 1.7 + seed + vec3(0.0, 0.0, uTime * 0.015));
        float lat = p.y + warp * 0.09;
        float bands = sin(lat * 15.0) * 0.5 + 0.5;
        float fine = fbm3(vec3(lat * 26.0, p.x * 1.4 + uTime * 0.02, p.z * 1.4) + seed);
        float t = clamp(bands * 0.72 + fine * 0.38 + 0.08, 0.0, 1.0);
        albedo = mix(uColorA, uColorB, smoothstep(0.12, 0.62, t));
        albedo = mix(albedo, uColorC, smoothstep(0.68, 0.95, t) * 0.85);
        vec3 stormCenter = normalize(vec3(0.55, -0.32, 0.77));
        vec3 dv = p - stormCenter;
        dv.y *= 2.3;
        float swirl = fbm3(p * 9.0 + seed) * 0.06;
        float storm = smoothstep(0.30, 0.04, length(dv) + swirl);
        albedo = mix(albedo, uColorC * 1.05 + vec3(0.04), storm * 0.85);
        albedo = mix(albedo, uColorA * 0.8, smoothstep(0.30, 0.22, length(dv) + swirl) * 0.35 * (1.0 - storm));
        rimStrength = 0.7;
      } else if (uKind < 1.5) {
        // Terran: oceans, continents, polar caps, night-side city lights.
        float h = fbm(p * 1.9 + seed) + fbm3(p * 6.0 + seed * 2.0) * 0.18;
        float land = smoothstep(0.03, 0.07, h);
        vec3 deep = uColorA * 0.45;
        vec3 shallow = uColorA * 1.05 + vec3(0.02, 0.05, 0.05);
        vec3 ocean = mix(deep, shallow, smoothstep(-0.35, 0.05, h));
        vec3 ground = mix(uColorB, uColorC, smoothstep(0.12, 0.5, h));
        float ice = smoothstep(0.80, 0.90, abs(p.y) + fbm3(p * 5.0 + seed) * 0.08);
        albedo = mix(ocean, ground, land);
        albedo = mix(albedo, vec3(0.9, 0.95, 1.0), ice);
        specMask = (1.0 - land) * (1.0 - ice);
        cityMask = land * (1.0 - ice);
        rimStrength = 0.9;
      } else if (uKind < 2.5) {
        // Ice world: soft albedo variation crossed by bright ridged cracks.
        float n = fbm(p * 2.4 + seed);
        float cracks = pow(1.0 - abs(snoise(p * 5.5 + seed)), 14.0);
        cracks += pow(1.0 - abs(snoise(p * 11.0 + seed * 1.7)), 18.0) * 0.6;
        albedo = mix(uColorA, uColorB, n * 0.5 + 0.5);
        albedo = mix(albedo, uColorC, clamp(cracks, 0.0, 1.0) * 0.75);
        specMask = 0.35;
        rimStrength = 0.8;
      } else {
        // Rocky: mottled terrain with dark maria and bright crater rims.
        float n = fbm(p * 3.0 + seed);
        albedo = mix(uColorA, uColorB, n * 0.6 + 0.5);
        float maria = smoothstep(0.15, 0.35, fbm3(p * 1.6 + seed * 1.3));
        albedo = mix(albedo, uColorA * 0.6, maria * 0.5);
        for (int i = 0; i < 3; i++) {
          float c = snoise(p * (5.0 + float(i) * 4.0) + seed + float(i) * 11.0);
          float floorMask = smoothstep(0.55, 0.7, c);
          float rimMask = smoothstep(0.42, 0.55, c) * (1.0 - floorMask);
          albedo *= 1.0 - floorMask * 0.22;
          albedo = mix(albedo, uColorC, rimMask * 0.35);
        }
        rimStrength = 0.35;
      }

      vec3 N = normalize(vWorldNormal);
      vec3 L = normalize(-vWorldPos);
      vec3 V = normalize(cameraPosition - vWorldPos);
      float ndl = dot(N, L);
      float day = smoothstep(-0.12, 0.38, ndl);
      float fill = max(dot(N, V), 0.0) * 0.16;
      vec3 light = ${STAR_LIGHT};

      vec3 color = albedo * (0.09 + fill + day * 1.15) * light;

      vec3 H = normalize(L + V);
      color += light * pow(max(dot(N, H), 0.0), 70.0) * specMask * day * 0.55;

      float night = smoothstep(0.05, -0.3, ndl);
      float cities = smoothstep(0.62, 0.8, snoise(p * 42.0 + seed)) * smoothstep(-0.1, 0.35, snoise(p * 5.0 + seed));
      color += vec3(1.0, 0.72, 0.38) * cities * cityMask * night * 1.4;

      float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
      color += uRim * fresnel * rimStrength * (0.2 + day * 0.9);

      color += uRim * uHovered * (0.08 + fresnel * 0.6);

      gl_FragColor = vec4(color, mix(1.0, 0.08, uFade));
    }
  `
);

// ---------------------------------------------------------------------------
// Cloud layer (terran planets)
// ---------------------------------------------------------------------------

const CloudMaterial = shaderMaterial(
  { uTime: 0, uSeed: 0, uFade: 0 },
  SPHERE_VERTEX,
  /* glsl */ `
    uniform float uTime;
    uniform float uSeed;
    uniform float uFade;

    varying vec3 vObj;
    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;

    ${NOISE_GLSL}

    void main() {
      vec3 p = normalize(vObj);
      vec3 seed = vec3(uSeed * 5.1, uSeed * 2.3, uSeed * 9.7);
      float base = fbm(p * 2.3 + seed + vec3(uTime * 0.012, 0.0, 0.0));
      float detail = fbm3(p * 7.0 + seed * 1.7);
      float cover = smoothstep(0.18, 0.55, base + detail * 0.25);

      vec3 N = normalize(vWorldNormal);
      vec3 L = normalize(-vWorldPos);
      float day = smoothstep(-0.1, 0.4, dot(N, L));
      vec3 color = vec3(1.0) * (0.06 + day * 1.05);

      gl_FragColor = vec4(color, cover * 0.6 * (1.0 - uFade * 0.92));
    }
  `
);

// ---------------------------------------------------------------------------
// Atmosphere halo (back faces, additive): brightest at the limb, fading out,
// stronger on the side facing the star.
// ---------------------------------------------------------------------------

const AtmosphereMaterial = shaderMaterial(
  { uColor: new THREE.Color('#88aaff'), uIntensity: 1.0, uFade: 0, uLimb: 0.42 },
  SPHERE_VERTEX,
  /* glsl */ `
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uFade;
    uniform float uLimb;

    varying vec3 vObj;
    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;

    void main() {
      vec3 N = normalize(vWorldNormal);
      vec3 V = normalize(cameraPosition - vWorldPos);
      vec3 L = normalize(-vWorldPos);
      float halo = smoothstep(0.0, uLimb, -dot(N, V));
      halo = pow(halo, 1.6);
      float lit = 0.18 + 0.82 * smoothstep(-0.45, 0.55, dot(N, L));
      vec3 color = uColor * halo * lit * uIntensity * (1.0 - uFade * 0.9);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// ---------------------------------------------------------------------------
// Planetary rings: radial bands, a Cassini-like gap, lit by the star and
// shadowed by the planet itself.
// ---------------------------------------------------------------------------

const RingMaterial = shaderMaterial(
  {
    uColorA: new THREE.Color('#8a6a2a'),
    uColorB: new THREE.Color('#f4dc9a'),
    uInner: 1.35,
    uOuter: 2.3,
    uSeed: 0,
    uFade: 0,
  },
  /* glsl */ `
    varying vec2 vLocal;
    varying vec3 vWorldPos;
    varying vec3 vCenter;
    varying float vRadius;
    varying vec3 vRingNormal;

    void main() {
      vLocal = position.xy;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      vCenter = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
      // The planet sphere has radius 1 in the ring's local space.
      vRadius = length((modelMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
      vRingNormal = normalize(mat3(modelMatrix) * vec3(0.0, 0.0, 1.0));
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  /* glsl */ `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uInner;
    uniform float uOuter;
    uniform float uSeed;
    uniform float uFade;

    varying vec2 vLocal;
    varying vec3 vWorldPos;
    varying vec3 vCenter;
    varying float vRadius;
    varying vec3 vRingNormal;

    ${NOISE_GLSL}

    void main() {
      float r = length(vLocal);
      float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
      float grain = snoise(vec3(t * 85.0, uSeed, 0.0)) * 0.5 + 0.5;
      float bands = 0.5 + 0.22 * sin(t * 61.0) + 0.18 * sin(t * 23.0 + 1.3) + (grain - 0.5) * 0.45;
      float gap = smoothstep(0.57, 0.6, t) * (1.0 - smoothstep(0.64, 0.67, t));
      float edges = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.9, 1.0, t));
      float density = clamp(bands, 0.0, 1.0) * (1.0 - gap * 0.92) * edges;

      vec3 color = mix(uColorA, uColorB, smoothstep(0.1, 0.85, t + (grain - 0.5) * 0.2));

      vec3 L = normalize(-vWorldPos);
      float lit = 0.3 + 0.7 * abs(dot(vRingNormal, L));

      // Planet shadow: does the ray toward the star hit the planet sphere?
      vec3 oc = vWorldPos - vCenter;
      float b = dot(oc, L);
      float h = b * b - (dot(oc, oc) - vRadius * vRadius);
      float shadow = step(b, 0.0) * smoothstep(0.0, 0.25 * vRadius * vRadius, h);
      lit *= 1.0 - shadow * 0.88;

      color *= lit * ${STAR_LIGHT};
      gl_FragColor = vec4(color, density * 0.9 * (1.0 - uFade * 0.92));
    }
  `
);

// ---------------------------------------------------------------------------
// Central star: granulated plasma with limb darkening, HDR output for bloom.
// ---------------------------------------------------------------------------

const StarMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color('#7B3FF2'), uHovered: 0, uFade: 0 },
  SPHERE_VERTEX,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uHovered;
    uniform float uFade;

    varying vec3 vObj;
    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;

    ${NOISE_GLSL}

    void main() {
      vec3 p = normalize(vObj);
      float large = fbm3(p * 2.6 + vec3(0.0, 0.0, uTime * 0.03)) * 0.5 + 0.5;
      float cells = snoise(p * 15.0 + vec3(uTime * 0.06)) * 0.5 + 0.5;
      float plasma = large * 0.7 + cells * 0.45;

      vec3 N = normalize(vWorldNormal);
      vec3 V = normalize(cameraPosition - vWorldPos);
      float mu = max(dot(N, V), 0.0);
      float limb = pow(mu, 0.55);

      // Keep the brand violet: ACES pushes very bright, balanced colors to
      // white, so the plasma stays saturated and only the cell tops get hot.
      vec3 deep = uColor * 0.5;
      vec3 bright = mix(uColor, vec3(1.0, 0.85, 1.0), 0.35);
      vec3 color = mix(deep, bright, smoothstep(0.3, 0.95, plasma));
      color += vec3(1.0, 0.8, 1.0) * smoothstep(0.85, 1.05, plasma) * 0.25;
      color *= 0.5 + 0.8 * limb;
      color += uColor * pow(1.0 - mu, 2.5) * 1.3;
      color *= 1.45 + uHovered * 0.35;

      gl_FragColor = vec4(color, mix(1.0, 0.12, uFade));
    }
  `
);

// ---------------------------------------------------------------------------
// Star corona: camera-facing quad with a soft glow and slowly turning rays.
// ---------------------------------------------------------------------------

const CoronaMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color('#7B3FF2'), uStarFraction: 0.38, uFade: 0, uHovered: 0 },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uStarFraction;
    uniform float uFade;
    uniform float uHovered;

    varying vec2 vUv;

    ${NOISE_GLSL}

    void main() {
      vec2 c = vUv - 0.5;
      float d = length(c) * 2.0;
      float a = atan(c.y, c.x);
      float x = max(d - uStarFraction, 0.0);

      float rays = snoise(vec3(cos(a) * 2.5, sin(a) * 2.5, uTime * 0.07)) * 0.5 + 0.5;
      rays = pow(rays, 3.0) + pow(snoise(vec3(cos(a) * 7.0, sin(a) * 7.0, uTime * 0.11)) * 0.5 + 0.5, 6.0) * 0.6;

      float glow = exp(-x * 14.0) * 0.75 + exp(-x * 5.0) * 0.16;
      float streaks = rays * exp(-x * 6.0) * 0.35;
      float intensity = (glow + streaks) * smoothstep(1.0, 0.7, d) * (1.0 + uHovered * 0.3);

      vec3 color = (uColor * 1.3 + vec3(0.15, 0.1, 0.2)) * intensity * (1.0 - uFade * 0.85);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({
  PlanetSurfaceMaterial: SurfaceMaterial,
  PlanetCloudMaterial: CloudMaterial,
  PlanetAtmosphereMaterial: AtmosphereMaterial,
  PlanetRingMaterial: RingMaterial,
  StarSurfaceMaterial: StarMaterial,
  StarCoronaMaterial: CoronaMaterial,
});

declare module '@react-three/fiber' {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    planetSurfaceMaterial: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    planetCloudMaterial: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    planetAtmosphereMaterial: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    planetRingMaterial: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    starSurfaceMaterial: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    starCoronaMaterial: any;
  }
}

// Visual definition of one body in the galaxy.
export interface PlanetLook {
  kind: PlanetKind | 'star';
  // Dark, mid and light tones the surface shader mixes between.
  palette: [string, string, string];
  // Fresnel rim and atmosphere tint.
  rim: string;
  // Offsets the noise so planets of the same kind never look identical.
  seed: number;
  // Axial tilt as [x, z] radians; x tips the pole toward the camera.
  tilt: [number, number];
  clouds?: boolean;
  // Atmosphere halo intensity; omit for airless bodies.
  atmosphere?: number;
  rings?: { inner: number; outer: number; colorA: string; colorB: string };
}
