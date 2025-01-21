'use client'

import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ARButton, XR, Interactive, useXR } from '@react-three/xr'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'

interface ARVisualizationProps {
  expression: string
  isDarkMode: boolean
}

function Graph({ expression, isDarkMode }: { expression: string; isDarkMode: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { scene } = useThree()

  useEffect(() => {
    if (meshRef.current) {
      const geometry = new THREE.ParametricBufferGeometry((u, v, target) => {
        const x = u * 2 - 1
        const z = v * 2 - 1
        const y = evaluateExpression(expression, x, z)
        target.set(x, y, z)
      }, 50, 50)

      const material = new THREE.MeshStandardMaterial({
        color: isDarkMode ? 0x8B5CF6 : 0xEC4899,
        side: THREE.DoubleSide,
        wireframe: false,
      })

      meshRef.current.geometry = geometry
      meshRef.current.material = material
    }
  }, [expression, isDarkMode])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001
      meshRef.current.rotation.y += 0.001
    }
  })

  return <mesh ref={meshRef} />
}

function ARScene({ expression, isDarkMode }: ARVisualizationProps) {
  const { isPresenting } = useXR()

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Graph expression={expression} isDarkMode={isDarkMode} />
      {!isPresenting && <OrbitControls />}
    </>
  )
}

function evaluateExpression(expression: string, x: number, z: number): number {
  try {
    const safeExpression = expression.replace(/[^-()\d/*+.]/g, '')
    return Function('x', 'z', `return ${safeExpression}`)(x, z)
  } catch (error) {
    console.error('Error evaluating expression:', error)
    return 0
  }
}

export function ARVisualization({ expression, isDarkMode }: ARVisualizationProps) {
  const [isARSupported, setIsARSupported] = useState(false)

  useEffect(() => {
    if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setIsARSupported(supported)
      })
    }
  }, [])

  if (!isARSupported) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">AR is not supported on this device or browser.</p>
        <Canvas>
          <ARScene expression={expression} isDarkMode={isDarkMode} />
        </Canvas>
      </div>
    )
  }

  return (
    <div className="relative h-[400px]">
      <Canvas>
        <XR>
          <ARScene expression={expression} isDarkMode={isDarkMode} />
        </XR>
      </Canvas>
      <div className="absolute top-0 left-0 z-10">
        <ARButton className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
          Enter AR
        </ARButton>
      </div>
    </div>
  )
}

