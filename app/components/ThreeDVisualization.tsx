'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface ThreeDVisualizationProps {
  expression: string
  isDarkMode: boolean
}

function Graph({ expression, isDarkMode }: ThreeDVisualizationProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { scene } = useThree()

  useEffect(() => {
    if (meshRef.current) {
      const geometry = new THREE.ParametricBufferGeometry((u, v, target) => {
        const x = (u - 0.5) * 4
        const z = (v - 0.5) * 4
        const y = evaluateExpression(expression, x, z)
        target.set(x, y, z)
      }, 50, 50)

      const material = new THREE.MeshStandardMaterial({
        color: isDarkMode ? 0x8B5CF6 : 0xEC4899,
        side: THREE.DoubleSide,
        wireframe: false,
      })

      meshRef.current.geometry.dispose()
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

function evaluateExpression(expression: string, x: number, z: number): number {
  try {
    const safeExpression = expression.replace(/[^-()\d/*+.xz]/g, '')
    return Function('x', 'z', `return ${safeExpression}`)(x, z)
  } catch (error) {
    console.error('Error evaluating expression:', error)
    return 0
  }
}

export function ThreeDVisualization({ expression, isDarkMode }: ThreeDVisualizationProps) {
  return (
    <div className="w-full h-[400px]">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Graph expression={expression} isDarkMode={isDarkMode} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

