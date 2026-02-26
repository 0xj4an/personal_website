'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Vignette } from '@react-three/postprocessing'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Governance from '@/components/Governance'
import Speaker from '@/components/Speaker'
import ShootingStars from '@/components/ShootingStars'
import Projects from '@/components/Projects'
import Studies from '@/components/Studies'
import Biography from '@/components/Biography'
import Contact from '@/components/Contact'
import Modal from '@/components/Modal'
import LoadingScreen from '@/components/LoadingScreen'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../components/Section'
import FloatingElement from '../components/FloatingElement'
import Comet from '../components/Comet'
import Asteroid from '../components/Asteroid'
import Spaceship from '../components/Spaceship'
import GalacticDust from '../components/GalacticDust'

export interface SubSection {
  name: string
  color: string
  Component: React.ComponentType<object>
  gradient: string
}

export interface Section {
  name: string
  position: [number, number, number]
  color: string
  scale: number
  id: string
  Component?: React.ComponentType<object>
  gradient: string
  subSections?: SubSection[]
}

// Individual recommendation components
function createRecComponent(personName: string) {
  const Comp = () => (
    <section className="min-h-screen bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{personName}</h2>
        <p className="mt-6 text-gray-300 italic text-lg">Recommendation coming soon...</p>
      </div>
    </section>
  );
  Comp.displayName = `Rec_${personName}`;
  return Comp;
}

const RecAnna = createRecComponent('Anna');
const RecZ0z = createRecComponent('z0z');
const RecMarek = createRecComponent('Marek');
const RecRene = createRecComponent('Rene');
const Rec0xgoldo = createRecComponent('0xgoldo');
const RecAnnaKaic = createRecComponent('Anna Kaic');
const RecLuuk = createRecComponent('Luuk');

// Spiral formula matching GalacticDust: r = 2.5 + t*7, theta = armOffset + t*1.3
// Planets placed at spiral tips (t≈2.0, r≈16.5) or mid-arm (t≈1.5, r≈13)
const sections: Section[] = [
  {
    name: 'Who I Am',
    id: 'home',
    position: [0, 0, 0], // Galactic core
    color: '#7B3FF2',
    scale: 2.8,
    Component: About,
    gradient: 'from-purple-500 to-blue-500'
  },
  // Arm 0 (teal) — offset 0
  {
    name: 'About Me',
    id: 'about',
    position: [-14.1, 8.5, 0.3], // tip t≈2.0
    color: '#64ffda',
    scale: 1.8,
    Component: Biography,
    gradient: 'from-teal-500 to-emerald-500'
  },
  {
    name: 'Contact',
    id: 'contact',
    position: [-4.7, 12.1, -0.5], // mid t≈1.5
    color: '#4dd0e1',
    scale: 1.2,
    Component: Contact,
    gradient: 'from-cyan-500 to-teal-500'
  },
  // Arm 1 (gold) — offset π/2
  {
    name: 'Studies',
    id: 'studies',
    position: [-7.8, -14.5, -0.3], // tip t≈2.0
    color: '#ffd700',
    scale: 1.5,
    Component: Studies,
    gradient: 'from-yellow-500 to-amber-500'
  },
  // Arm 2 (green) — offset π
  {
    name: 'Experience',
    id: 'experience',
    position: [14.1, -8.5, 0.3], // tip t≈2.0
    color: '#4ade80',
    scale: 1.6,
    gradient: 'from-green-500 to-emerald-500',
    subSections: [
      { name: 'Events', color: '#4ade80', Component: Experience, gradient: 'from-green-500 to-emerald-500' },
      { name: 'Speaker', color: '#4ade80', Component: Speaker, gradient: 'from-green-500 to-emerald-500' },
      { name: 'Governance', color: '#4ade80', Component: Governance, gradient: 'from-green-500 to-emerald-500' },
    ],
  },
  {
    name: 'Recommendations',
    id: 'recommendations',
    position: [4.7, -12.1, -0.5], // mid t≈1.5
    color: '#a9e34b',
    scale: 1.1,
    gradient: 'from-lime-500 to-green-500',
    subSections: [
      { name: 'Anna', color: '#a9e34b', Component: RecAnna, gradient: 'from-lime-500 to-green-500' },
      { name: 'z0z', color: '#a9e34b', Component: RecZ0z, gradient: 'from-lime-500 to-green-500' },
      { name: 'Marek', color: '#a9e34b', Component: RecMarek, gradient: 'from-lime-500 to-green-500' },
      { name: 'Rene', color: '#a9e34b', Component: RecRene, gradient: 'from-lime-500 to-green-500' },
      { name: '0xgoldo', color: '#a9e34b', Component: Rec0xgoldo, gradient: 'from-lime-500 to-green-500' },
      { name: 'Anna Kaic', color: '#a9e34b', Component: RecAnnaKaic, gradient: 'from-lime-500 to-green-500' },
      { name: 'Luuk', color: '#a9e34b', Component: RecLuuk, gradient: 'from-lime-500 to-green-500' },
    ],
  },
  // Arm 3 (pink) — offset 3π/2
  {
    name: 'Projects',
    id: 'projects',
    position: [8.5, 14.2, -0.3], // tip t≈2.0
    color: '#ff79c6',
    scale: 1.4,
    Component: Projects,
    gradient: 'from-pink-500 to-purple-500'
  }
]

// Slowly rotates content around Z-axis (galactic plane)
function RotatingGalaxy({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.02;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

function Scene({ onSectionClick, isModalOpen }: { onSectionClick: (section: Section) => void, isModalOpen: boolean }) {
  // Distant nebula clouds - far from planets, very subtle
  const nebulaClouds = [
    { position: [25, 18, -30] as [number, number, number], rotation: [0.4, -0.2, 0.3] as [number, number, number], scale: 5, color: '#1a1a3e' },
    { position: [-22, -18, -32] as [number, number, number], rotation: [-0.1, 0.4, -0.2] as [number, number, number], scale: 5, color: '#1a1a3e' },
    { position: [-18, 22, -28] as [number, number, number], rotation: [0.2, 0.1, 0.3] as [number, number, number], scale: 4, color: '#2a1a4e' },
    { position: [18, -22, -30] as [number, number, number], rotation: [-0.3, -0.1, 0.1] as [number, number, number], scale: 4, color: '#2a1a4e' },
  ]

  // Asteroids scattered along the galactic disc
  const asteroids = [
    { position: [5, 8, -1] as [number, number, number], size: 0.2, speed: 0.3, rotationSpeed: [0.5, 0.3, 0.2] as [number, number, number], color: '#5a5a6a' },
    { position: [-10, 3, -0.5] as [number, number, number], size: 0.35, speed: 0.2, rotationSpeed: [0.3, 0.5, 0.1] as [number, number, number], color: '#6a6a7a' },
    { position: [3, -8, -1] as [number, number, number], size: 0.15, speed: 0.4, rotationSpeed: [0.4, 0.2, 0.6] as [number, number, number], color: '#4a4a5a' },
    { position: [-5, -10, -0.5] as [number, number, number], size: 0.3, speed: 0.15, rotationSpeed: [0.2, 0.4, 0.3] as [number, number, number], color: '#7a6a5a' },
    { position: [12, -3, -1.5] as [number, number, number], size: 0.12, speed: 0.5, rotationSpeed: [0.6, 0.3, 0.4] as [number, number, number], color: '#5a6a6a' },
    { position: [-3, 13, -1] as [number, number, number], size: 0.25, speed: 0.25, rotationSpeed: [0.3, 0.6, 0.2] as [number, number, number], color: '#6a5a5a' },
    { position: [9, 10, -2] as [number, number, number], size: 0.18, speed: 0.35, rotationSpeed: [0.5, 0.2, 0.5] as [number, number, number], color: '#8a7a6a' },
    { position: [-12, -6, -1] as [number, number, number], size: 0.28, speed: 0.1, rotationSpeed: [0.1, 0.3, 0.4] as [number, number, number], color: '#5a5a5a' },
    { position: [6, -13, -1.5] as [number, number, number], size: 0.15, speed: 0.45, rotationSpeed: [0.4, 0.4, 0.3] as [number, number, number], color: '#7a7a8a' },
    { position: [-9, 7, -0.5] as [number, number, number], size: 0.2, speed: 0.28, rotationSpeed: [0.3, 0.2, 0.5] as [number, number, number], color: '#6a6a6a' },
    { position: [15, 5, -2] as [number, number, number], size: 0.1, speed: 0.38, rotationSpeed: [0.2, 0.5, 0.3] as [number, number, number], color: '#5a5a7a' },
    { position: [-6, -14, -1] as [number, number, number], size: 0.22, speed: 0.18, rotationSpeed: [0.4, 0.3, 0.2] as [number, number, number], color: '#6a5a6a' },
  ]

  // Spaceships traversing the galaxy
  const spaceships = [
    { startPosition: [-30, 5, -3] as [number, number, number], velocity: [0.5, 0.15, 0.05] as [number, number, number], color: '#4dd0e1', size: 0.7, type: 'satellite' as const },
    { startPosition: [20, -15, -2] as [number, number, number], velocity: [-0.3, 0.35, -0.08] as [number, number, number], color: '#ff6600', size: 0.5, type: 'shuttle' as const },
    { startPosition: [-10, 20, -4] as [number, number, number], velocity: [0.2, -0.25, 0.1] as [number, number, number], color: '#ff0044', size: 0.4, type: 'probe' as const },
    { startPosition: [15, 18, -1] as [number, number, number], velocity: [-0.35, -0.12, 0.05] as [number, number, number], color: '#44aaff', size: 0.6, type: 'satellite' as const },
  ]

  // Comets streaking across
  const comets = [
    { position: [-25, -15, -3] as [number, number, number], velocity: [0.4, 0.25, 0.08] as [number, number, number], size: 0.12, color: '#ffe066' },
    { position: [18, 8, -5] as [number, number, number], velocity: [-0.35, -0.18, -0.2] as [number, number, number], size: 0.08, color: '#a9e34b' },
    { position: [-8, 22, 2] as [number, number, number], velocity: [0.15, -0.4, 0.15] as [number, number, number], size: 0.15, color: '#4dd0e1' },
  ]

  const zeroXj4anRef = useRef<THREE.Mesh>(null)

  useFrame((_state, delta) => {
    if (zeroXj4anRef.current) {
      zeroXj4anRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <>
      {/* Scene-level elements (must be outside rotating group) */}
      <ambientLight intensity={0.02} />
      <pointLight position={[0, 0, 15]} intensity={0.15} color="#7B3FF2" distance={30} />
      <pointLight position={[15, 12, 10]} intensity={0.08} color="#64ffda" />
      <pointLight position={[-15, -10, 10]} intensity={0.08} color="#4ade80" />
      <fog attach="fog" args={['#020010', 50, 100]} />

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
        {asteroids.map((asteroid, index) => (
          <Asteroid key={`asteroid-${index}`} {...asteroid} />
        ))}

        {/* Spaceships */}
        {spaceships.map((ship, index) => (
          <Spaceship key={`ship-${index}`} {...ship} />
        ))}

        {/* Comets */}
        {comets.map((comet, index) => (
          <Comet key={`comet-${index}`} {...comet} />
        ))}

        {/* Shooting stars */}
        <ShootingStars />

        {/* Planet sections */}
        {sections.map((section) => (
          <Section
            key={section.name}
            {...section}
            onSectionClick={onSectionClick}
            isModalOpen={isModalOpen}
            gradient={section.gradient}
            ref={section.id === 'home' ? zeroXj4anRef : undefined}
          />
        ))}
      </RotatingGalaxy>

      {/* Post-processing — only static effects, no flicker */}
      <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={0.85} />
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

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const [activeSection, setActiveSection] = useState<{ isOpen: boolean; section: Section | null }>({
    isOpen: false,
    section: null,
  })

  const handleSectionClick = (section: Section) => {
    if (!section.Component) return
    setActiveSection({ isOpen: true, section })
  }

  return (
    <>
      <LoadingScreen isLoaded={isLoaded} />
      <div className="relative h-screen w-full bg-black overflow-hidden">
        <HolographicTitle isHidden={activeSection.isOpen} />

        <Canvas
          camera={{ position: [0, 0, 45], fov: 50 }}
          className="absolute inset-0"
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        >
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={12}
            maxDistance={55}
            enableDamping
            dampingFactor={0.05}
            target={[0, 0, 0]}
          />
          <Scene onSectionClick={handleSectionClick} isModalOpen={activeSection.isOpen} />
        </Canvas>

        <AnimatePresence>
          {!activeSection.isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 3.8, duration: 0.8 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white/40 text-[10px] pointer-events-none tracking-[0.3em] uppercase"
              style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}
            >
              <p>orbit &middot; zoom &middot; explore</p>
            </motion.div>
          )}
        </AnimatePresence>

        {activeSection.section?.Component && (
          <Modal
            isOpen={activeSection.isOpen}
            onClose={() => setActiveSection({ isOpen: false, section: null })}
            color={activeSection.section.color}
            gradient={activeSection.section.gradient}
          >
            <activeSection.section.Component />
          </Modal>
        )}
      </div>
    </>
  )
}
