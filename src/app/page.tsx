'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'
import { useState, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Governance from '@/components/Governance'
import Speaker from '@/components/Speaker'
import UpcomingEvents from '@/components/UpcomingEvents'
import ShootingStars from '@/components/ShootingStars'
import Projects from '@/components/Projects'
import Studies from '@/components/Studies'
import Biography from '@/components/Biography'
import Contact from '@/components/Contact'
import Modal from '@/components/Modal'
import SectionTabs from '@/components/SectionTabs'
import Recommendations from '@/components/Recommendations'
import LoadingScreen from '@/components/LoadingScreen'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Section, { galaxyHover } from '../components/Section'
import FloatingElement from '../components/FloatingElement'
import Comet from '../components/Comet'
import Asteroid from '../components/Asteroid'
import Spaceship from '../components/Spaceship'
import GalacticDust from '../components/GalacticDust'
import {
  Constellations,
  DistantGalaxies,
  RocketFleet,
  OrbitingSatellite,
  randomAsteroids,
  randomComets,
  randomSpaceships,
} from '../components/AmbientSpace'
import type { PlanetLook } from '../components/planetMaterials'

export interface SubSection {
  name: string
  color: string
  Component: React.ComponentType<object>
  gradient: string
}

export interface Section {
  name: string
  // Short descriptor on the planet's label.
  kicker: string
  position: [number, number, number]
  color: string
  scale: number
  id: string
  Component?: React.ComponentType<object>
  gradient: string
  look: PlanetLook
  subSections?: SubSection[]
}

// Spiral formula matching GalacticDust: r = 2.5 + t*7, theta = armOffset + t*1.3
// 6 arms at 60° apart. All planets placed at spiral tips (t=2.0, r=16.5)
const sections: Section[] = [
  {
    name: '0xj4an',
    kicker: 'About',
    id: 'home',
    position: [0, 0, 0], // Galactic core
    color: '#7B3FF2',
    scale: 3.5,
    Component: About,
    gradient: 'from-purple-500 to-blue-500',
    look: { kind: 'star', palette: ['#3b1c8c', '#7B3FF2', '#e9dcff'], rim: '#a78bfa', seed: 0, tilt: [0, 0] },
  },
  // Arm 0 (teal) — offset 0°
  {
    name: 'My Journey',
    kicker: 'Story',
    id: 'about',
    position: [-14.1, 8.5, 0.3],
    color: '#64ffda',
    scale: 2.4,
    Component: Biography,
    gradient: 'from-teal-500 to-emerald-500',
    // Ocean world with teal seas, mint continents, clouds and city lights.
    look: { kind: 'terran', palette: ['#0f6f7a', '#3fbf9a', '#d4f7e6'], rim: '#64ffda', seed: 1.3, tilt: [-0.35, 0.25], clouds: true, atmosphere: 1.1 },
  },
  // Arm 1 (cyan) — offset 60°
  {
    name: 'Contact',
    kicker: 'Say hi',
    id: 'contact',
    position: [-14.4, -8.0, -0.3],
    color: '#4dd0e1',
    scale: 2.0,
    Component: Contact,
    gradient: 'from-cyan-500 to-teal-500',
    // Frozen moon-like world crossed by bright fractures.
    look: { kind: 'ice', palette: ['#2b6c85', '#86d6e8', '#f0fdff'], rim: '#4dd0e1', seed: 4.2, tilt: [-0.25, -0.2], atmosphere: 0.7 },
  },
  // Arm 2 (gold) — offset 120°
  {
    name: 'Studies',
    kicker: 'Education',
    id: 'studies',
    position: [-0.3, -16.5, 0.3],
    color: '#ffd700',
    scale: 2.2,
    Component: Studies,
    gradient: 'from-yellow-500 to-amber-500',
    // Ringed gas giant, pole tipped toward the camera so the rings read as an ellipse.
    look: {
      kind: 'gas', palette: ['#7a4a12', '#d9a43a', '#fff0c2'], rim: '#ffd700', seed: 2.7, tilt: [-1.12, 0.38], atmosphere: 0.5,
      rings: { inner: 1.35, outer: 2.35, colorA: '#6b5226', colorB: '#f6e2a8' },
    },
  },
  // Arm 3 (green) — offset 180°
  {
    name: 'Experience',
    kicker: 'Events, talks',
    id: 'experience',
    position: [14.1, -8.5, -0.3],
    color: '#4ade80',
    scale: 1.15,
    gradient: 'from-green-500 to-emerald-500',
    // Forested world with clouds.
    look: { kind: 'terran', palette: ['#0f4a52', '#3fae5a', '#c6ecaa'], rim: '#4ade80', seed: 6.1, tilt: [-0.3, 0.15], clouds: true, atmosphere: 1.0 },
    subSections: [
      { name: 'Events', color: '#4ade80', Component: Experience, gradient: 'from-green-500 to-emerald-500' },
      { name: 'Upcoming', color: '#4ade80', Component: UpcomingEvents, gradient: 'from-green-500 to-emerald-500' },
      { name: 'Speaker', color: '#4ade80', Component: Speaker, gradient: 'from-green-500 to-emerald-500' },
      { name: 'Governance', color: '#4ade80', Component: Governance, gradient: 'from-green-500 to-emerald-500' },
    ],
  },
  // Arm 4 (lime) — offset 240°
  {
    name: 'Recommendations',
    kicker: 'Kind words',
    id: 'recommendations',
    position: [14.4, 8.0, 0.3],
    color: '#a9e34b',
    scale: 1.05,
    gradient: 'from-lime-500 to-green-500',
    // One testimonial page; each moon (a person) opens it focused on them.
    Component: Recommendations,
    // Airless cratered world.
    look: { kind: 'rocky', palette: ['#3d4a1a', '#8fae3c', '#e2f5a8'], rim: '#a9e34b', seed: 8.4, tilt: [-0.2, 0.1] },
    subSections: [
      { name: 'Anna', color: '#a9e34b', Component: Recommendations, gradient: 'from-lime-500 to-green-500' },
      { name: 'z0z', color: '#a9e34b', Component: Recommendations, gradient: 'from-lime-500 to-green-500' },
      { name: 'Marek', color: '#a9e34b', Component: Recommendations, gradient: 'from-lime-500 to-green-500' },
      { name: 'Rene', color: '#a9e34b', Component: Recommendations, gradient: 'from-lime-500 to-green-500' },
      { name: '0xgoldo', color: '#a9e34b', Component: Recommendations, gradient: 'from-lime-500 to-green-500' },
      { name: 'Anna Kaic', color: '#a9e34b', Component: Recommendations, gradient: 'from-lime-500 to-green-500' },
      { name: 'Luuk', color: '#a9e34b', Component: Recommendations, gradient: 'from-lime-500 to-green-500' },
      { name: 'Tereza', color: '#a9e34b', Component: Recommendations, gradient: 'from-lime-500 to-green-500' },
    ],
  },
  // Arm 5 (pink) — offset 300°
  {
    name: 'Projects',
    kicker: 'Builds',
    id: 'projects',
    position: [0.3, 16.5, -0.3],
    color: '#ff79c6',
    scale: 2.0,
    Component: Projects,
    gradient: 'from-pink-500 to-purple-500',
    // Banded gas giant with a pale storm.
    look: { kind: 'gas', palette: ['#6b1d4a', '#e0579e', '#ffd1ea'], rim: '#ff79c6', seed: 3.3, tilt: [-0.4, -0.3], atmosphere: 0.6 },
  }
]

// Slowly rotates content around Z-axis (galactic plane)
function RotatingGalaxy({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const speed = useRef(1);
  useFrame((_, delta) => {
    // Ease to a stop while a planet or moon is hovered, so it holds still.
    speed.current = THREE.MathUtils.lerp(speed.current, galaxyHover.count > 0 ? 0 : 1, 0.08);
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.02 * speed.current;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

// Outermost planet center (16.5) + widest moon system (4.0 x 1.15) + margin.
const GALAXY_FIT_RADIUS = 21.5
const DEFAULT_CAMERA_DISTANCE = 45
// Screen pixels kept clear at the top (title) and bottom (section nav).
const UI_CHROME_PX = 115
// Planet centers sit on the spiral tips at this radius.
const PLANET_ORBIT_RADIUS = 16.5
// Half width of the longest planet label ("Recommendations") on small screens.
const LABEL_HALF_WIDTH_PX = 52

// Places the camera so the whole galaxy fits the viewport (narrow phones need
// much more distance than desktop), and lets OrbitControls zoom out that far.
// Map-style navigation limits.
// Pan target stays within the galaxy so it can never be lost off screen.
const MAX_PAN_RADIUS = 18

function CameraRig({ resetToken, onMovedChange }: { resetToken: number; onMovedChange: (moved: boolean) => void }) {
  const { camera, size, scene } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const movedRef = useRef(false)
  const fov = (camera as THREE.PerspectiveCamera).fov
  const distance = useMemo(() => {
    const tanV = Math.tan(THREE.MathUtils.degToRad(fov / 2))
    const tanH = tanV * (size.width / size.height)
    const usableV = tanV * Math.max(0.5, 1 - (2 * UI_CHROME_PX) / size.height)
    const fitPlanets = GALAXY_FIT_RADIUS / Math.min(usableV, tanH)
    // Keep side planets' labels on screen too, not just the spheres.
    const labelRoomH = tanH * Math.max(0.3, 1 - (2 * LABEL_HALF_WIDTH_PX) / size.width)
    const fitLabels = PLANET_ORBIT_RADIUS / labelRoomH
    return Math.max(DEFAULT_CAMERA_DISTANCE, fitPlanets, fitLabels)
  }, [fov, size.width, size.height])

  // Default framing on load, on resize and when "Recenter" is pressed.
  useEffect(() => {
    camera.position.set(0, 0, distance)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    const controls = controlsRef.current
    if (controls) {
      // With damping on, leftover pan / rotate inertia keeps moving the camera
      // after a reset. One update without damping clears it.
      controls.enableDamping = false
      controls.update()
      camera.position.set(0, 0, distance)
      controls.target.set(0, 0, 0)
      controls.update()
      controls.enableDamping = true
    }
    // Fog was tuned for distance 45 (50 to 100); keep the same falloff behind
    // the galaxy plane at any camera distance or it swallows the whole scene.
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = distance + 5
      scene.fog.far = distance + 55
    }
  }, [camera, scene, distance, resetToken])

  useFrame(() => {
    const controls = controlsRef.current
    if (!controls) return
    const target = controls.target
    // Zoom-to-cursor and screen-space panning can lift the target off the
    // galaxy plane; slide camera and target together back onto it.
    if (Math.abs(target.z) > 1e-3) {
      camera.position.z -= target.z
      target.z = 0
    }
    const panRadius = Math.hypot(target.x, target.y)
    if (panRadius > MAX_PAN_RADIUS) {
      const k = MAX_PAN_RADIUS / panRadius
      const dx = target.x * k - target.x
      const dy = target.y * k - target.y
      target.x += dx
      target.y += dy
      camera.position.x += dx
      camera.position.y += dy
    }
    const moved =
      panRadius > 0.5 ||
      Math.abs(camera.position.distanceTo(target) - distance) > 1.5 ||
      Math.abs(controls.getAzimuthalAngle()) > 0.05 ||
      Math.abs(controls.getPolarAngle() - Math.PI / 2) > 0.05
    if (moved !== movedRef.current) {
      movedRef.current = moved
      onMovedChange(moved)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom
      enablePan
      enableRotate
      zoomToCursor
      screenSpacePanning
      // Drag moves the map; right-drag or two fingers rotate; wheel or pinch zoom.
      mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }}
      touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }}
      minDistance={12}
      maxDistance={distance * 1.4}
      // Free 360 rotation and any viewing plane; "Recenter" restores the default.
      // Polar stops just short of the poles to avoid the gimbal flip.
      minPolarAngle={0.01}
      maxPolarAngle={Math.PI - 0.01}
      enableDamping
      dampingFactor={0.08}
      onStart={() => { document.body.style.cursor = 'grabbing' }}
      onEnd={() => { document.body.style.cursor = '' }}
    />
  )
}

function Scene({ onSectionClick, isModalOpen }: { onSectionClick: (id: string, subIndex?: number) => void, isModalOpen: boolean }) {
  // Distant nebula clouds - far from planets, very subtle
  const nebulaClouds = [
    { position: [25, 18, -30] as [number, number, number], rotation: [0.4, -0.2, 0.3] as [number, number, number], scale: 5, color: '#1a1a3e' },
    { position: [-22, -18, -32] as [number, number, number], rotation: [-0.1, 0.4, -0.2] as [number, number, number], scale: 5, color: '#1a1a3e' },
    { position: [-18, 22, -28] as [number, number, number], rotation: [0.2, 0.1, 0.3] as [number, number, number], scale: 4, color: '#2a1a4e' },
    { position: [18, -22, -30] as [number, number, number], rotation: [-0.3, -0.1, 0.1] as [number, number, number], scale: 4, color: '#2a1a4e' },
  ]

  // Random every page load: asteroid field, comets, spaceships, and which
  // planets get an orbiting satellite. Generated client side inside the Canvas.
  const ambient = useMemo(() => {
    const planetPositions = sections.map((sec) => sec.position)
    const satelliteHosts = sections
      .filter((sec) => sec.id !== 'home' && !sec.subSections?.length)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2 + Math.floor(Math.random() * 2))
      .map((sec) => ({
        center: sec.position,
        radius: sec.scale * (1.7 + Math.random() * 0.4),
        speed: (0.25 + Math.random() * 0.25) * (Math.random() < 0.5 ? 1 : -1),
        tilt: [(Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.2] as [number, number],
        phase: Math.random() * Math.PI * 2,
      }))
    return {
      asteroids: randomAsteroids(16, planetPositions),
      comets: randomComets(3 + Math.floor(Math.random() * 2)),
      spaceships: randomSpaceships(3 + Math.floor(Math.random() * 2)),
      satellites: satelliteHosts,
    }
  }, [])

  return (
    <>
      {/* Scene-level elements (must be outside rotating group) */}
      <ambientLight intensity={0.02} />
      <pointLight position={[0, 0, 15]} intensity={0.15} color="#7B3FF2" distance={30} />
      <pointLight position={[15, 12, 10]} intensity={0.06} color="#64ffda" />
      <pointLight position={[-15, -10, 10]} intensity={0.06} color="#4ade80" />
      <pointLight position={[0, -15, 10]} intensity={0.06} color="#ffd700" />
      {/* Soft sky / ground light so rockets, ships and asteroids read as 3D */}
      <hemisphereLight args={['#b9a8ff', '#0b0820', 0.9]} />
      <fog attach="fog" args={['#020010', 50, 100]} />

      {/* Sky sphere: random constellations and distant galaxies, all around
          the scene so they stay visible while rotating 360 */}
      <Constellations />
      <DistantGalaxies />

      {/* Rockets fly in world space on random curved paths */}
      <RocketFleet count={3} />

      <RotatingGalaxy>
        {/* Deep star field */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.3} fade speed={0.05} />
        <Stars radius={250} depth={150} count={2500} factor={7} saturation={0} fade speed={0.02} />

        {/* Galactic dust spiral */}
        <GalacticDust />

        {/* Nebula clouds */}
        {nebulaClouds.map((cloud, index) => (
          <FloatingElement key={`nebula-${index}`} {...cloud} />
        ))}

        {/* Asteroids */}
        {ambient.asteroids.map((asteroid, index) => (
          <Asteroid key={`asteroid-${index}`} {...asteroid} />
        ))}

        {/* Spaceships */}
        {ambient.spaceships.map((ship, index) => (
          <Spaceship key={`ship-${index}`} {...ship} />
        ))}

        {/* Comets */}
        {ambient.comets.map((comet, index) => (
          <Comet key={`comet-${index}`} {...comet} />
        ))}

        {/* Shooting stars */}
        <ShootingStars />

        {/* Satellites around a random few planets */}
        {ambient.satellites.map((sat, index) => (
          <OrbitingSatellite key={`sat-${index}`} {...sat} />
        ))}

        {/* Planet sections */}
        {sections.map((section, index) => (
          <Section
            key={section.id}
            name={section.name}
            kicker={section.kicker}
            index={index}
            id={section.id}
            position={section.position}
            color={section.color}
            scale={section.scale}
            subSections={section.subSections}
            look={section.look}
            onSectionClick={onSectionClick}
            isModalOpen={isModalOpen}
          />
        ))}
      </RotatingGalaxy>

      {/* HDR pipeline: the composer renders without tone mapping, so bloom picks
          up the star and bright rims (> 1.0) and ACES maps the result at the end. */}
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur intensity={0.55} luminanceThreshold={1.0} luminanceSmoothing={0.3} />
        <Vignette eskil={false} offset={0.1} darkness={0.85} />
        <ToneMapping />
      </EffectComposer>
    </>
  )
}

// Animated title with holographic shimmer
function HolographicTitle({ isHidden }: { isHidden: boolean }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: isHidden ? 0.1 : 1, y: 0, scale: 1 }}
        transition={{ delay: 2.8, duration: 1.2, ease: 'easeOut' }}
        className="relative"
      >
        {/* Main title */}
        <h1
          className="text-5xl md:text-6xl font-black tracking-[0.2em] relative"
          style={{
            fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
          }}
        >
          <span
            className="relative inline-block"
            style={{
              background: 'linear-gradient(90deg, #a78bfa, #64ffda, #ff79c6, #ffd700, #a78bfa)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: mounted ? 'shimmer 4s linear infinite' : 'none',
              filter: 'drop-shadow(0 0 30px rgba(123, 63, 242, 0.5))',
            }}
          >
            0xj4an
          </span>
        </h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 3.2, duration: 0.8, ease: 'easeOut' }}
          className="mx-auto mt-3 h-px w-48 origin-center"
          style={{
            background: 'linear-gradient(90deg, transparent, #a78bfa, #64ffda, #a78bfa, transparent)',
          }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHidden ? 0.05 : 0.5 }}
          transition={{ delay: 3.5, duration: 0.8 }}
          className="text-[10px] tracking-[0.6em] text-white/50 mt-3 uppercase"
          style={{
            fontFamily: "'SF Mono', 'Fira Code', monospace",
          }}
        >
          {'// navigating the digital cosmos'}
        </motion.p>
      </motion.div>

    </div>
  )
}

// Keyboard and touch path to every section: the 3D planets move, can be off
// screen, and are not focusable.
function SectionNav({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <motion.nav
      aria-label="Sections"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.4, duration: 0.8 }}
      className="absolute inset-x-0 bottom-4 z-10 flex justify-center px-4"
    >
      <ul
        className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/10 bg-black/50 px-2 py-1.5 backdrop-blur-sm [scrollbar-width:none]"
        style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}
      >
        {sections.map((section) => (
          <li key={section.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onSelect(section.id)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:bg-white/10 focus-visible:text-white focus-visible:ring-1 focus-visible:ring-white/60"
            >
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: section.color, boxShadow: `0 0 6px ${section.color}` }}
              />
              {section.name}
            </button>
          </li>
        ))}
      </ul>
    </motion.nav>
  )
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  // subIndex is set only when a moon (sub-section) was chosen explicitly.
  const [active, setActive] = useState<{ id: string; subIndex?: number } | null>(null)
  const [viewMoved, setViewMoved] = useState(false)
  const [resetToken, setResetToken] = useState(0)
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])
  const activeSection = active ? sections.find((s) => s.id === active.id) ?? null : null
  const isModalOpen = activeSection !== null

  const openSection = (id: string, subIndex?: number) => {
    const section = sections.find((s) => s.id === id)
    if (!section || (!section.Component && !section.subSections?.length)) return
    setActive({ id, subIndex })
  }

  return (
    <>
      <LoadingScreen isLoaded={isLoaded} />
      <div className="relative h-screen w-full bg-black overflow-hidden">
        <HolographicTitle isHidden={isModalOpen} />
        {!isModalOpen && (
          <Link
            href="/events"
            className="absolute top-36 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:top-6 sm:right-6 z-10 whitespace-nowrap rounded-full border border-green-400/40 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-green-200 backdrop-blur transition-colors hover:bg-green-400/20"
            style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}
          >
            Upcoming events
          </Link>
        )}

        <Canvas
          camera={{ position: [0, 0, 45], fov: 50 }}
          // 1.5 caps fill cost of the procedural shaders + bloom on retina screens.
          dpr={[1, 1.5]}
          className="absolute inset-0"
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        >
          <CameraRig resetToken={resetToken} onMovedChange={setViewMoved} />
          <Scene onSectionClick={openSection} isModalOpen={isModalOpen} />
        </Canvas>

        <AnimatePresence>
          {/* Hidden once the user has moved: it shares the row with "Recenter". */}
          {!isModalOpen && !viewMoved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 3.8, duration: 0.8 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-white/40 text-[10px] pointer-events-none tracking-[0.15em] sm:tracking-[0.3em] uppercase"
              style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}
            >
              <p>{isTouch ? 'drag to move  |  pinch to zoom' : 'drag to move  |  right-drag to rotate 360  |  scroll to zoom'}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {viewMoved && !isModalOpen && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              onClick={() => setResetToken((n) => n + 1)}
              className="absolute bottom-20 right-4 z-10 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
              style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}
            >
              Recenter
            </motion.button>
          )}
        </AnimatePresence>

        <SectionNav onSelect={(id) => openSection(id)} />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setActive(null)}
          color={activeSection?.color ?? '#ffffff'}
          label={activeSection?.name ?? ''}
        >
          {activeSection?.Component ? (
            activeSection.id === 'recommendations' ? (
              <Recommendations
                focusName={active?.subIndex !== undefined ? activeSection.subSections?.[active.subIndex]?.name : undefined}
              />
            ) : (
              <activeSection.Component />
            )
          ) : activeSection?.subSections?.length ? (
            <SectionTabs
              label={activeSection.name}
              color={activeSection.color}
              subSections={activeSection.subSections}
              index={active?.subIndex ?? 0}
              onChange={(subIndex) => setActive({ id: activeSection.id, subIndex })}
            />
          ) : null}
        </Modal>
      </div>
    </>
  )
}
