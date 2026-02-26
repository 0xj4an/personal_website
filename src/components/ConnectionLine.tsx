'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ConnectionLineProps {
  start: [number, number, number]
  end: [number, number, number]
  color: string
  isModalOpen: boolean
}

export default function ConnectionLine({ start, end, color, isModalOpen }: ConnectionLineProps) {
  const materialRef = useRef<THREE.LineBasicMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.03 + 0.08
      materialRef.current.opacity = isModalOpen ? 0.02 : pulse
    }
  })

  const points = new Float32Array([...start, ...end])

  return (
    <line>
      <bufferGeometry
        attach="geometry"
        attributes={{
          position: new THREE.BufferAttribute(points, 3),
        }}
      />
      <lineBasicMaterial
        ref={materialRef}
        attach="material"
        color={color}
        opacity={0.08}
        transparent
        linewidth={1}
      />
    </line>
  )
}
