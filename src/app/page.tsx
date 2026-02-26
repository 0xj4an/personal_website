'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Studies from '@/components/Studies'
import Biography from '@/components/Biography'
import Modal from '@/components/Modal'
import LoadingScreen from '@/components/LoadingScreen'
import { motion } from 'framer-motion'
import Section from '../components/Section'
import FloatingElement from '../components/FloatingElement'
import Comet from '../components/Comet'
import ConnectionLine from '../components/ConnectionLine'
import Asteroid from '../components/Asteroid'
import Spaceship from '../components/Spaceship'

export interface Section {
  name: string
  position: [number, number, number]
  color: string
  scale: number
  id: string
  Component?: React.ComponentType<object>
  gradient: string
}

// Constellation / network layout - planets spread in a web, not a line
const sections: Section[] = [
  {
    name: '0xj4an',
    id: 'home',
    position: [0, 0, 0], // Center of the constellation
    color: '#7B3FF2',
    scale: 2.8,
    Component: About,
    gradient: 'from-purple-500 to-blue-500'
  },
  {
    name: 'About Me',
    id: 'about',
    position: [-10, 5, -2], // Upper left
    color: '#64ffda',
    scale: 1.8,
    Component: Biography,
    gradient: 'from-teal-500 to-emerald-500'
  },
  {
    name: 'Studies',
    id: 'studies',
    position: [8, 7, -3], // Upper right
    color: '#ffd700',
    scale: 1.5,
    Component: Studies,
    gradient: 'from-yellow-500 to-amber-500'
  },
  {
    name: 'Experience',
    id: 'experience',
    position: [-8, -7, -1], // Lower left
    color: '#4ade80',
    scale: 1.6,
    Component: Experience,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Projects',
    id: 'projects',
    position: [10, -5, -2], // Lower right
    color: '#ff79c6',
    scale: 1.4,
    Component: Projects,
    gradient: 'from-pink-500 to-purple-500'
  }
]

// Network connections - connect all planets to center, plus some cross-links
const connections: [number, number][] = [
  [0, 1], // home -> about
  [0, 2], // home -> studies
  [0, 3], // home -> experience
  [0, 4], // home -> projects
  [1, 2], // about -> studies
  [3, 4], // experience -> projects
]

function Scene({ onSectionClick, isModalOpen }: { onSectionClick: (section: Section) => void, isModalOpen: boolean }) {
  // Nebula clouds - larger, more colorful, deeper in background
  const nebulaClouds = [
    { position: [40, 25, -20] as [number, number, number], rotation: [0.5, 0.5, 0] as [number, number, number], scale: 6, color: '#7B3FF2' },
    { position: [-40, -25, -18] as [number, number, number], rotation: [-0.3, 0.4, 0.2] as [number, number, number], scale: 7, color: '#ff79c6' },
    { position: [35, -35, -25] as [number, number, number], rotation: [0.2, -0.3, 0.1] as [number, number, number], scale: 5, color: '#64ffda' },
    { position: [-35, 35, -28] as [number, number, number], rotation: [-0.4, 0.2, -0.3] as [number, number, number], scale: 6, color: '#ffd700' },
    { position: [0, -45, -30] as [number, number, number], rotation: [0.1, 0.3, -0.2] as [number, number, number], scale: 8, color: '#4361ee' },
    { position: [25, 40, -26] as [number, number, number], rotation: [-0.2, -0.1, 0.4] as [number, number, number], scale: 4, color: '#f72585' },
    { position: [-20, 0, -35] as [number, number, number], rotation: [0.3, -0.2, 0.1] as [number, number, number], scale: 9, color: '#3a0ca3' },
    { position: [15, -20, -22] as [number, number, number], rotation: [-0.1, 0.5, -0.3] as [number, number, number], scale: 5, color: '#ff6b6b' },
  ]

  // Asteroids scattered around
  const asteroids = [
    { position: [18, 12, -4] as [number, number, number], size: 0.3, speed: 0.3, rotationSpeed: [0.5, 0.3, 0.2] as [number, number, number], color: '#5a5a6a' },
    { position: [-16, 10, -3] as [number, number, number], size: 0.5, speed: 0.2, rotationSpeed: [0.3, 0.5, 0.1] as [number, number, number], color: '#6a6a7a' },
    { position: [14, -12, -4] as [number, number, number], size: 0.2, speed: 0.4, rotationSpeed: [0.4, 0.2, 0.6] as [number, number, number], color: '#4a4a5a' },
    { position: [-22, -8, -6] as [number, number, number], size: 0.4, speed: 0.15, rotationSpeed: [0.2, 0.4, 0.3] as [number, number, number], color: '#7a6a5a' },
    { position: [13, -22, -2] as [number, number, number], size: 0.15, speed: 0.5, rotationSpeed: [0.6, 0.3, 0.4] as [number, number, number], color: '#5a6a6a' },
    { position: [-8, 18, -7] as [number, number, number], size: 0.35, speed: 0.25, rotationSpeed: [0.3, 0.6, 0.2] as [number, number, number], color: '#6a5a5a' },
    { position: [22, 6, -3] as [number, number, number], size: 0.25, speed: 0.35, rotationSpeed: [0.5, 0.2, 0.5] as [number, number, number], color: '#8a7a6a' },
    { position: [-3, -28, -5] as [number, number, number], size: 0.45, speed: 0.1, rotationSpeed: [0.1, 0.3, 0.4] as [number, number, number], color: '#5a5a5a' },
    { position: [5, 20, -6] as [number, number, number], size: 0.18, speed: 0.45, rotationSpeed: [0.4, 0.4, 0.3] as [number, number, number], color: '#7a7a8a' },
    { position: [-15, -18, -4] as [number, number, number], size: 0.22, speed: 0.28, rotationSpeed: [0.3, 0.2, 0.5] as [number, number, number], color: '#6a6a6a' },
  ]

  // Spaceships and satellites
  const spaceships = [
    { startPosition: [-40, 10, -8] as [number, number, number], velocity: [0.6, 0.1, 0.05] as [number, number, number], color: '#4dd0e1', size: 0.8, type: 'satellite' as const },
    { startPosition: [30, -20, -5] as [number, number, number], velocity: [-0.3, 0.4, -0.1] as [number, number, number], color: '#ff6600', size: 0.6, type: 'shuttle' as const },
    { startPosition: [-15, 30, -10] as [number, number, number], velocity: [0.2, -0.3, 0.15] as [number, number, number], color: '#ff0044', size: 0.5, type: 'probe' as const },
    { startPosition: [25, 25, -3] as [number, number, number], velocity: [-0.4, -0.15, 0.1] as [number, number, number], color: '#44aaff', size: 0.7, type: 'satellite' as const },
  ]

  // Comets
  const comets = [
    { position: [-30, -20, -5] as [number, number, number], velocity: [0.5, 0.3, 0.1] as [number, number, number], size: 0.15, color: '#ffe066' },
    { position: [20, 10, -8] as [number, number, number], velocity: [-0.4, -0.2, -0.3] as [number, number, number], size: 0.1, color: '#a9e34b' },
    { position: [-10, 30, 5] as [number, number, number], velocity: [0.2, -0.5, 0.2] as [number, number, number], size: 0.2, color: '#4dd0e1' },
  ]

  const zeroXj4anRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (zeroXj4anRef.current) {
      zeroXj4anRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <>
      {/* Deep star field - two layers for parallax depth */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.3} fade speed={0.4} />
      <Stars radius={250} depth={150} count={2500} factor={7} saturation={0} fade speed={0.2} />

      {/* Dramatic colored lighting */}
      <ambientLight intensity={0.05} />
      <pointLight position={[15, 15, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-15, -10, -10]} intensity={0.5} color="#7B3FF2" />
      <pointLight position={[0, 20, 5]} intensity={0.35} color="#64ffda" />
      <pointLight position={[-20, 5, 15]} intensity={0.2} color="#ff79c6" />
      <pointLight position={[10, -15, 8]} intensity={0.15} color="#ffd700" />
      <fog attach="fog" args={['#020010', 30, 70]} />

      {/* Nebula clouds */}
      {nebulaClouds.map((cloud, index) => (
        <FloatingElement key={`nebula-${index}`} {...cloud} />
      ))}

      {/* Asteroid field */}
      {asteroids.map((asteroid, index) => (
        <Asteroid key={`asteroid-${index}`} {...asteroid} />
      ))}

      {/* Spaceships and satellites */}
      {spaceships.map((ship, index) => (
        <Spaceship key={`ship-${index}`} {...ship} />
      ))}

      {/* Comets */}
      {comets.map((comet, index) => (
        <Comet key={`comet-${index}`} {...comet} />
      ))}

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

      {/* Network connection lines - constellation pattern */}
      {connections.map(([fromIdx, toIdx]) => {
        const from = sections[fromIdx]
        const to = sections[toIdx]
        return (
          <ConnectionLine
            key={`${from.id}-${to.id}`}
            start={from.position}
            end={to.position}
            color={from.id === 'home' ? to.color : from.color}
            isModalOpen={isModalOpen}
          />
        )
      })}

      {/* Post-processing effects - cinematic pipeline */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0008, 0.0008)}
          radialModulation={true}
          modulationOffset={0.5}
        />
        <Noise
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={0.15}
        />
        <Vignette eskil={false} offset={0.15} darkness={0.9} />
      </EffectComposer>
    </>
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
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.8 }}
            className={`text-5xl font-bold tracking-[0.3em] transition-opacity duration-500 ${activeSection.isOpen ? 'opacity-20' : 'opacity-100'}`}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 40%, #64ffda 70%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(123, 63, 242, 0.4))',
            }}
          >
            0xj4an
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 3.2, duration: 0.8 }}
            className="text-xs tracking-[0.5em] text-white/40 mt-2 uppercase"
          >
            Explorer of Worlds
          </motion.p>
        </div>

        <Canvas
          camera={{ position: [0, 0, 30], fov: 50 }}
          className="absolute inset-0"
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.5 }}
        >
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={12}
            maxDistance={55}
            autoRotate={true}
            autoRotateSpeed={0.3}
            enableDamping
            dampingFactor={0.05}
            target={[0, 0, 0]}
          />
          <Scene onSectionClick={handleSectionClick} isModalOpen={activeSection.isOpen} />
        </Canvas>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: activeSection.isOpen ? 0 : 0.5 }}
          transition={{ delay: 3.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/50 text-xs pointer-events-none tracking-widest uppercase"
        >
          <p>Drag to orbit &middot; Scroll to zoom &middot; Click a planet to explore</p>
        </motion.div>

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
