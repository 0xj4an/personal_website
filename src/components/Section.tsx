'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { SubSection } from '../app/page';
import { KIND_INDEX, type PlanetLook } from './planetMaterials';

// drei Html defaults to a z-index near 16.7M, which puts labels above the
// loading screen, title, section nav and modal. Keep them below all overlays.
const LABEL_Z_RANGE: [number, number] = [5, 0];

// Visual-only meshes never take pointer events; each body has one hit sphere.
const NO_RAYCAST = () => null;

// Left-drag pans the map; a press that moved further than this is a drag,
// not a click, so it must not open the planet under the pointer.
const DRAG_CLICK_TOLERANCE_PX = 6;

// Moon orbit radii (body radii) and Kepler-like speed constant (rad/s at r = 1).
const MOON_ORBIT_MIN = 1.9;
const MOON_ORBIT_MAX = 4.0;
const MOON_SPEED_K = 0.9;

interface MoonOrbit {
  radius: number;
  speed: number;
  phase: number;
  inclination: number;
  node: number;
  size: number;
}

// Corona quad edge length in star radii.
const CORONA_SIZE = 3.6;

// Bodies currently under the pointer. While > 0 the galaxy stops rotating so
// planets and moons hold still while being aimed at (read by RotatingGalaxy).
export const galaxyHover = { count: 0 };

function setPointerCursor(active: boolean) {
  document.body.style.cursor = active ? 'pointer' : '';
}

// Tracks one body's hover in galaxyHover without double counting.
function useGalaxyHover(active: boolean) {
  useEffect(() => {
    if (!active) return;
    galaxyHover.count += 1;
    return () => {
      galaxyHover.count = Math.max(0, galaxyHover.count - 1);
    };
  }, [active]);
}

type RegisterMaterial = (slot: number) => (material: THREE.ShaderMaterial | null) => void;

// Drives uTime / uHovered / uFade on every registered shader material, with
// smoothed hover and modal-fade values.
function useAnimatedMaterials(hovered: boolean, isModalOpen: boolean): RegisterMaterial {
  const materials = useRef<(THREE.ShaderMaterial | null)[]>([]);
  const state = useRef({ hover: 0, fade: 0 });

  useFrame(({ clock }) => {
    const s = state.current;
    s.hover = THREE.MathUtils.lerp(s.hover, hovered ? 1 : 0, 0.1);
    s.fade = THREE.MathUtils.lerp(s.fade, isModalOpen ? 1 : 0, 0.1);
    const t = clock.elapsedTime;
    for (const material of materials.current) {
      if (!material) continue;
      const u = material.uniforms;
      if (u.uTime) u.uTime.value = t;
      if (u.uHovered) u.uHovered.value = s.hover;
      if (u.uFade) u.uFade.value = s.fade;
    }
  });

  return (slot: number) => (material: THREE.ShaderMaterial | null) => {
    materials.current[slot] = material;
  };
}

// Dark / mid / light rocky tones derived from a single accent color.
function rockyPalette(color: string): [THREE.Color, THREE.Color, THREE.Color] {
  const base = new THREE.Color(color);
  const gray = new THREE.Color('#6b6670');
  return [
    gray.clone().lerp(base, 0.25).multiplyScalar(0.45),
    gray.clone().lerp(base, 0.45),
    gray.clone().lerp(base, 0.35).lerp(new THREE.Color('#ffffff'), 0.45),
  ];
}

interface SectionProps {
  name: string;
  // Short descriptor shown above the name, and the section's order number.
  kicker: string;
  index: number;
  position: [number, number, number];
  color: string;
  scale: number;
  id: string;
  look: PlanetLook;
  subSections?: SubSection[];
  // Opens a section; subIndex selects a sub-section tab (moons).
  onSectionClick: (id: string, subIndex?: number) => void;
  isModalOpen: boolean;
}

export default function Section({
  name,
  kicker,
  index,
  position,
  color,
  scale,
  id,
  look,
  subSections,
  onSectionClick,
  isModalOpen,
}: SectionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const leaderRef = useRef<HTMLSpanElement>(null);
  const camera = useThree((st) => st.camera);
  const viewportHeight = useThree((st) => st.size.height);
  const labelTmp = useMemo(
    () => ({ center: new THREE.Vector3(), edge: new THREE.Vector3(), up: new THREE.Vector3() }),
    []
  );
  const [hovered, setHovered] = useState(false);
  // Index of the moon under the pointer (one at a time), or null.
  const [hoveredMoon, setHoveredMoon] = useState<number | null>(null);
  const register = useAnimatedMaterials(hovered, isModalOpen);
  useGalaxyHover(hovered || hoveredMoon !== null);

  const isStar = look.kind === 'star';
  const hasSubMoons = !!subSections && subSections.length > 0;
  // Moon orbits in body radii: spread between MOON_ORBIT_MIN and MAX, each
  // with its own inclination, node and starting angle.
  const moonOrbits = useMemo<MoonOrbit[]>(() => {
    const count = subSections?.length ?? 0;
    return Array.from({ length: count }, (_, i) => {
      const radius = count > 1
        ? MOON_ORBIT_MIN + ((MOON_ORBIT_MAX - MOON_ORBIT_MIN) * i) / (count - 1)
        : (MOON_ORBIT_MIN + MOON_ORBIT_MAX) / 2;
      return {
        radius,
        speed: MOON_SPEED_K / Math.pow(radius, 1.5),
        phase: (i * Math.PI * 2 * 0.618) % (Math.PI * 2),
        // Nearly coplanar: the orbits read as clean concentric ellipses.
        inclination: 0.5 + Math.sin(i * 2.3 + 0.7) * 0.06,
        node: 0.35,
        size: count > 6 ? 0.19 : 0.28,
      };
    });
  }, [subSections?.length]);

  // How far below the body center the label sits, in body radii: clear of
  // tilted rings and orbiting moons.
  const labelClearance = hasSubMoons ? MOON_ORBIT_MAX + 0.55 : look.rings ? 1.45 : isStar ? 1.08 : 1.18;

  const accent = useMemo(() => new THREE.Color(color), [color]);
  const rim = useMemo(() => new THREE.Color(look.rim), [look.rim]);
  const palette = useMemo(
    () => look.palette.map((c) => new THREE.Color(c)) as [THREE.Color, THREE.Color, THREE.Color],
    [look.palette]
  );
  const ringColors = useMemo(
    () => (look.rings ? [new THREE.Color(look.rings.colorA), new THREE.Color(look.rings.colorB)] : null),
    [look.rings]
  );

  useEffect(() => () => setPointerCursor(false), []);

  // Opening a section unmounts the moons without a pointerout; clear hover so
  // the system and the galaxy do not stay paused after the modal closes.
  useEffect(() => {
    if (!isModalOpen) return;
    setHovered(false);
    setHoveredMoon(null);
    setPointerCursor(false);
  }, [isModalOpen]);

  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * (isStar ? 0.04 : 0.1) * (hovered ? 2.5 : 1);
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.035;
    }
    // Keep the label just below the body on screen, whatever the zoom,
    // rotation or tilt: project the body radius along the camera's up axis.
    const group = groupRef.current;
    const label = labelRef.current;
    if (group && label) {
      group.getWorldPosition(labelTmp.center);
      labelTmp.up.set(0, 1, 0).applyQuaternion(camera.quaternion);
      // Pixels per world unit at the body, along the camera's up axis.
      labelTmp.edge.copy(labelTmp.center).addScaledVector(labelTmp.up, 1);
      labelTmp.center.project(camera);
      labelTmp.edge.project(camera);
      const pxPerUnit = Math.abs(labelTmp.edge.y - labelTmp.center.y) * 0.5 * viewportHeight;
      const grow = hovered ? 1.06 : 1;
      const bodyPx = pxPerUnit * scale * grow;
      const clearPx = pxPerUnit * scale * labelClearance * grow;
      // The tag starts at the body edge; its leader line reaches down to the
      // card, which sits below rings and moon orbits.
      label.style.transform = `translate3d(0, ${(bodyPx + 3).toFixed(1)}px, 0)`;
      if (leaderRef.current) {
        leaderRef.current.style.height = `${Math.max(10, clearPx - bodyPx).toFixed(1)}px`;
      }
    }
  });

  const open = () => onSectionClick(id);

  return (
    <group ref={groupRef} position={position}>
      <group scale={hovered ? scale * 1.06 : scale}>
        <group rotation={[look.tilt[0], 0, look.tilt[1]]}>
          <group ref={spinRef}>
            <mesh raycast={NO_RAYCAST}>
              <sphereGeometry args={[1, 96, 96]} />
              {isStar ? (
                <starSurfaceMaterial ref={register(0)} uColor={accent} transparent />
              ) : (
                <planetSurfaceMaterial
                  ref={register(0)}
                  uKind={KIND_INDEX[look.kind as keyof typeof KIND_INDEX]}
                  uSeed={look.seed}
                  uColorA={palette[0]}
                  uColorB={palette[1]}
                  uColorC={palette[2]}
                  uRim={rim}
                  transparent
                />
              )}
            </mesh>
          </group>

          {look.clouds && (
            <mesh ref={cloudRef} scale={1.018} raycast={NO_RAYCAST} renderOrder={1}>
              <sphereGeometry args={[1, 64, 64]} />
              <planetCloudMaterial ref={register(1)} uSeed={look.seed} transparent depthWrite={false} />
            </mesh>
          )}

          {look.rings && ringColors && (
            // Equatorial plane of the tilted planet.
            <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={NO_RAYCAST} renderOrder={2}>
              <ringGeometry args={[look.rings.inner, look.rings.outer, 192, 1]} />
              <planetRingMaterial
                ref={register(2)}
                uColorA={ringColors[0]}
                uColorB={ringColors[1]}
                uInner={look.rings.inner}
                uOuter={look.rings.outer}
                uSeed={look.seed}
                transparent
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>

        {look.atmosphere !== undefined && (
          <mesh scale={1.14} raycast={NO_RAYCAST} renderOrder={3}>
            <sphereGeometry args={[1, 64, 64]} />
            <planetAtmosphereMaterial
              ref={register(3)}
              uColor={rim}
              uIntensity={look.atmosphere}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {isStar && (
          <Billboard>
            <mesh raycast={NO_RAYCAST} renderOrder={3}>
              <planeGeometry args={[CORONA_SIZE, CORONA_SIZE]} />
              <starCoronaMaterial
                ref={register(4)}
                uColor={accent}
                uStarFraction={2 / CORONA_SIZE}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </Billboard>
        )}

        {/* Invisible hit sphere: a bit larger than the body so small planets
            are easy to hover and tap. */}
        <mesh
          scale={isStar ? 1.02 : 1.3}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHovered(true);
            setPointerCursor(true);
          }}
          onPointerOut={() => {
            setHovered(false);
            setPointerCursor(false);
          }}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            if (e.delta > DRAG_CLICK_TOLERANCE_PX) return;
            open();
          }}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
      </group>

      {/* Decorative moons around the central star */}
      {isStar && !isModalOpen && (
        <>
          <OrbitingMoon color="#a78bfa" parentScale={scale} speed={0.5} distance={3.5} size={0.2} />
          <OrbitingMoon color="#64ffda" parentScale={scale} speed={0.3} distance={4.5} size={0.12} />
          <OrbitingMoon color="#ff79c6" parentScale={scale} speed={0.2} distance={5.5} size={0.08} />
        </>
      )}

      {/* Clickable sub-section moons, each on its own inclined orbit around
          this planet; inner moons orbit faster (Kepler-like). */}
      {hasSubMoons && !isModalOpen && moonOrbits.map((orbit, i) => (
        <ClickableMoon
          key={subSections[i].name}
          name={subSections[i].name}
          color={subSections[i].color}
          parentScale={scale}
          orbit={orbit}
          seed={i * 1.7 + 0.5}
          isModalOpen={isModalOpen}
          index={i}
          hovered={hoveredMoon === i}
          systemActive={hovered || hoveredMoon !== null}
          onHoverIndex={(next) => setHoveredMoon((cur) => (next === null && cur !== i ? cur : next))}
          onClick={() => onSectionClick(id, i)}
        />
      ))}

      {!isModalOpen && (
        // HUD tag under the body. Fixed pixel size (distance scaling made the
        // old labels 7-8px tall); its offset is set in screen pixels each frame.
        // aria-hidden: keyboard and screen readers use the SectionNav instead.
        // pointer-events none on the wrapper: its box spans the leader line
        // over the moons and would swallow the canvas hover / click there.
        <Html center aria-hidden="true" zIndexRange={LABEL_Z_RANGE} style={{ pointerEvents: 'none' }}>
          <div ref={labelRef} className="will-change-transform">
            {/* Only the card takes the pointer: the leader line area must not
                block clicks on moons behind it. */}
            <div className="pointer-events-none flex translate-y-1/2 select-none flex-col items-center">
              <span
                ref={leaderRef}
                className="pointer-events-none block w-px"
                style={{ height: 12, background: `linear-gradient(to bottom, ${color}10, ${color})` }}
              />
              <span
                role="presentation"
                onClick={open}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                className="pointer-events-auto flex cursor-pointer flex-col items-center whitespace-nowrap rounded-md border px-2 py-0.5 backdrop-blur-[3px] transition-colors duration-300 sm:px-2.5 sm:py-1"
                style={{
                  borderColor: hovered ? `${color}cc` : `${color}40`,
                  background: hovered ? 'rgba(8, 6, 20, 0.72)' : 'rgba(8, 6, 20, 0.5)',
                  boxShadow: hovered ? `0 0 18px ${color}55` : `0 0 10px ${color}1f`,
                }}
              >
                <span
                  className="hidden font-mono text-[9px] uppercase tracking-[0.28em] sm:block"
                  style={{ color }}
                >
                  {String(index).padStart(2, '0')} / {kicker}
                </span>
                <span
                  className={`font-semibold leading-tight text-white ${isStar ? 'text-[13px] sm:text-lg tracking-[0.12em]' : 'text-[11px] sm:text-[15px] tracking-[0.04em]'}`}
                >
                  {name}
                </span>
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function RockyMoonMaterial({ color, seed, slot, register }: {
  color: string;
  seed: number;
  slot: number;
  register: RegisterMaterial;
}) {
  const palette = useMemo(() => rockyPalette(color), [color]);
  const rim = useMemo(() => new THREE.Color(color), [color]);
  return (
    <planetSurfaceMaterial
      ref={register(slot)}
      uKind={KIND_INDEX.rocky}
      uSeed={seed}
      uColorA={palette[0]}
      uColorB={palette[1]}
      uColorC={palette[2]}
      uRim={rim}
      transparent
    />
  );
}

function OrbitingMoon({ color, parentScale, speed, distance, size }: {
  color: string; parentScale: number; speed: number; distance: number; size: number;
}) {
  const moonRef = useRef<THREE.Group>(null);
  const register = useAnimatedMaterials(false, false);

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
      <mesh scale={size} raycast={NO_RAYCAST}>
        <sphereGeometry args={[1, 32, 32]} />
        <RockyMoonMaterial color={color} seed={distance} slot={0} register={register} />
      </mesh>
    </group>
  );
}

// Hit spheres of neighbouring moons can overlap; three.js would pick the one
// nearest in depth. Resolve to the moon whose center is closest to the
// pointer ray instead, so the moon under the cursor is the one that opens.
function closestMoonHit(e: ThreeEvent<MouseEvent | PointerEvent>) {
  const center = new THREE.Vector3();
  let best: THREE.Object3D | null = null;
  let bestDistance = Infinity;
  for (const hit of e.intersections) {
    if (!hit.object.userData.moonPick) continue;
    hit.object.getWorldPosition(center);
    const d = e.ray.distanceSqToPoint(center);
    if (d < bestDistance) {
      bestDistance = d;
      best = hit.object;
    }
  }
  return best;
}

// Minimum on-screen radius of a moon's hit area, in CSS pixels.
const MOON_MIN_HIT_PX = 18;

function ClickableMoon({ name, color, parentScale, orbit, seed, isModalOpen, index, hovered, systemActive, onHoverIndex, onClick }: {
  name: string; color: string; parentScale: number; orbit: MoonOrbit; seed: number;
  isModalOpen: boolean;
  index: number;
  hovered: boolean;
  // True while the pointer is on this planet or any of its moons.
  systemActive: boolean;
  // Reports which moon is under the pointer; null when leaving this one.
  onHoverIndex: (index: number | null) => void;
  onClick: () => void;
}) {
  const moonRef = useRef<THREE.Group>(null);
  const hitRef = useRef<THREE.Mesh>(null);
  const register = useAnimatedMaterials(hovered, isModalOpen);
  const camera = useThree((st) => st.camera);
  const viewportHeight = useThree((st) => st.size.height);
  const size = orbit.size;
  const r = orbit.radius * parentScale;
  const angle = useRef(orbit.phase);
  const tmp = useMemo(() => new THREE.Vector3(), []);


  useFrame((_, delta) => {
    // The whole system nearly stops while the pointer is on it, so moons are
    // easy to aim at.
    angle.current += delta * orbit.speed * (systemActive ? 0.08 : 1);
    if (moonRef.current) {
      moonRef.current.position.set(Math.cos(angle.current) * r, Math.sin(angle.current) * r, 0);
    }
    // Keep the hit area at least MOON_MIN_HIT_PX on screen at any zoom.
    if (hitRef.current && moonRef.current) {
      moonRef.current.getWorldPosition(tmp);
      const dist = camera.position.distanceTo(tmp);
      const fov = (camera as THREE.PerspectiveCamera).fov ?? 50;
      const worldPerPx = (2 * dist * Math.tan(THREE.MathUtils.degToRad(fov / 2))) / viewportHeight;
      hitRef.current.scale.setScalar(Math.max(size * 1.8, MOON_MIN_HIT_PX * worldPerPx));
    }
  });

  return (
    <group rotation={[orbit.inclination, 0, orbit.node]}>
      {/* Faint orbit path */}
      <mesh raycast={NO_RAYCAST}>
        <ringGeometry args={[r - 0.015, r + 0.015, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.4 : systemActive ? 0.18 : 0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={moonRef}>
        <mesh scale={hovered ? size * 1.3 : size} raycast={NO_RAYCAST}>
          <sphereGeometry args={[1, 32, 32]} />
          <RockyMoonMaterial color={color} seed={seed} slot={0} register={register} />
        </mesh>
        {/* Soft halo keeps tiny moons visible against the dark sky */}
        <mesh scale={size * 1.9} raycast={NO_RAYCAST}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.3 : 0.08}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh
          ref={hitRef}
          userData={{ moonPick: true, open: onClick, index }}
          onPointerMove={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            const target = closestMoonHit(e);
            onHoverIndex(target ? (target.userData.index as number) : index);
            setPointerCursor(true);
          }}
          onPointerOut={() => {
            onHoverIndex(null);
            setPointerCursor(false);
          }}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            if (e.delta > DRAG_CLICK_TOLERANCE_PX) return;
            const target = closestMoonHit(e);
            (target?.userData.open ?? onClick)();
          }}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
        {/* Names show for the whole system while it is being aimed at, so it
            is clear which moon is which before clicking. */}
        {(systemActive || hovered) && (
          <Html center aria-hidden="true" zIndexRange={LABEL_Z_RANGE} style={{ pointerEvents: 'none' }}>
            <div
              className="-translate-y-5 select-none whitespace-nowrap rounded px-1.5 py-0.5 text-center text-[11px] font-semibold"
              style={{
                color: '#ffffff',
                background: hovered ? `${color}40` : 'rgba(8, 6, 20, 0.55)',
                border: `1px solid ${hovered ? color : `${color}40`}`,
                textShadow: '0 0 4px rgba(0,0,0,0.9)',
              }}
            >
              {name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
