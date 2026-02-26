'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Studies from '@/components/Studies'
import Biography from '@/components/Biography'
import Modal from '@/components/Modal'
import LoadingScreen from '@/components/LoadingScreen'
import Section from '../components/Section'
import FloatingElement from '../components/FloatingElement'
import Comet from '../components/Comet'

export interface Section {
  name: string
  position: [number, number, number]
  color: string
  scale: number
  id: string
  Component?: React.ComponentType<object>
  gradient: string
}

const sections: Section[] = [
  // Elements along a diagonal path from bottom-left to top-right, more centered
  {
    name: '0xj4an',
    id: 'home',
    position: [-15, -8, 0], // Moved further out
    color: '#7B3FF2',
    scale: 2.5, // Much larger
    Component: About,
    gradient: 'from-purple-500 to-blue-500'
  },
  {
    name: 'About Me',
    id: 'about',
    position: [-8, -4, 0], // Increased distance from 0xj4an
    color: '#64ffda',
    scale: 2.0, // Reduced from previous
    Component: Biography,
    gradient: 'from-teal-500 to-emerald-500'
  },
  {
    name: 'Studies',
    id: 'studies',
    position: [-2, -1, 0], // Moved slightly left of center
    color: '#ffd700',
    scale: 1.5, // Reduced from previous
    Component: Studies,
    gradient: 'from-yellow-500 to-amber-500'
  },
  {
    name: 'Experience',
    id: 'experience',
    position: [4, 2, 0], // Adjusted spacing
    color: '#4ade80',
    scale: 1.2, // Reduced from previous
    Component: Experience,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Projects',
    id: 'projects',
    position: [9, 4, 0], // Adjusted spacing
    color: '#ff79c6',
    scale: 0.9, // Smaller than before
    Component: Projects,
    gradient: 'from-pink-500 to-purple-500'
  }
]

function Scene({ onSectionClick, isModalOpen }: { onSectionClick: (section: Section) => void, isModalOpen: boolean }) {
  const floatingElements = [
    { position: [35, 20, -2] as [number, number, number], rotation: [0.5, 0.5, 0] as [number, number, number], scale: 1.5 },
    { position: [-35, -20, -2] as [number, number, number], rotation: [-0.3, 0.4, 0.2] as [number, number, number], scale: 2 },
    { position: [30, -30, -1] as [number, number, number], rotation: [0.2, -0.3, 0.1] as [number, number, number], scale: 1.2 },
    { position: [-30, 30, -1] as [number, number, number], rotation: [-0.4, 0.2, -0.3] as [number, number, number], scale: 1.8 },
    { position: [25, 35, -3] as [number, number, number], rotation: [0.3, -0.5, 0.4] as [number, number, number], scale: 1.3 },
    { position: [-25, -35, -3] as [number, number, number], rotation: [-0.2, 0.3, -0.1] as [number, number, number], scale: 1.6 },
    { position: [40, 0, -4] as [number, number, number], rotation: [0.1, 0.2, 0.3] as [number, number, number], scale: 2.2 },
    { position: [-40, 0, -4] as [number, number, number], rotation: [-0.1, -0.2, -0.3] as [number, number, number], scale: 2.4 },
    { position: [0, 40, -4] as [number, number, number], rotation: [0.4, -0.1, 0.2] as [number, number, number], scale: 1.9 },
    { position: [0, -40, -4] as [number, number, number], rotation: [-0.4, 0.1, -0.2] as [number, number, number], scale: 1.7 },
  ]

  // Define comet properties
  const comets = [
    { position: [-30, -20, -5] as [number, number, number], velocity: [0.5, 0.3, 0.1] as [number, number, number], size: 0.15, color: '#ffe066' },
    { position: [20, 10, -8] as [number, number, number], velocity: [-0.4, -0.2, -0.3] as [number, number, number], size: 0.1, color: '#a9e34b' },
    { position: [-10, 30, 5] as [number, number, number], velocity: [0.2, -0.5, 0.2] as [number, number, number], size: 0.2, color: '#4dd0e1' },
    { position: [15, -25, 10] as [number, number, number], velocity: [-0.3, 0.4, -0.1] as [number, number, number], size: 0.12, color: '#f06292' },
    { position: [-5, 5, -15] as [number, number, number], velocity: [0.4, 0.1, 0.5] as [number, number, number], size: 0.18, color: '#bdbdbd' },
  ];

  const zeroXj4anRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (zeroXj4anRef.current) {
      zeroXj4anRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <>
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.4} />
      <pointLight position={[-10, -10, -10]} intensity={0.2} />
      <fog attach="fog" args={['#000', 20, 40]} />
      
      {floatingElements.map((element, index) => (
        <FloatingElement key={index} {...element} />
      ))}

      {comets.map((comet, index) => (
        <Comet key={index} {...comet} />
      ))}

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
      
      {sections.slice(0, -1).map((section, i) => {
        const target = sections[i + 1]
        if (!target) return null

        return (
          <line key={`${section.id}-${target.id}`}>
            <bufferGeometry
              attach="geometry"
              attributes={{
                position: new THREE.BufferAttribute(
                  new Float32Array([
                    ...section.position,
                    ...target.position,
                  ]),
                  3
                ),
              }}
            />
            <lineBasicMaterial 
              attach="material" 
              color={'#ffffff'} 
              opacity={isModalOpen ? 0.03 : 0.08} 
              transparent 
              linewidth={1}
            />
          </line>
        )
      })}
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
      <div className="relative h-screen w-full bg-black">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10">
          <h1 className={`text-4xl font-bold text-white tracking-wider ${activeSection.isOpen ? 'opacity-50' : ''}`}>
            0xj4an
          </h1>
        </div>

        <Canvas
          camera={{ position: [0, 0, 35], fov: 45 }} // Moved camera back for better view
          className="absolute inset-0"
        >
          <OrbitControls 
            enableZoom={true} 
            enablePan={true} 
            enableRotate={true}
            minDistance={20} // Increased minimum zoom
            maxDistance={50} // Increased maximum zoom
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
            target={[0, 0, 0]} // Center point
          />
          <Scene onSectionClick={handleSectionClick} isModalOpen={activeSection.isOpen} />
        </Canvas>

        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white transition-opacity duration-300 ${activeSection.isOpen ? 'opacity-0' : 'opacity-100'}`}>
          <p className="mb-2 text-lg">🖱️ Click and drag to explore the path</p>
          <p className="text-lg">🚀 Click on any element to view details</p>
        </div>

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
