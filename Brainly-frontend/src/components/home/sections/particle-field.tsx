

// import { useRef, useMemo } from "react"

// function Particles({ count = 200 }: { count?: number }) {
//   const mesh = useRef<THREE.Points>(null)

//   const positions = useMemo(() => {
//     const pos = new Float32Array(count * 3)
//     for (let i = 0; i < count; i++) {
//       pos[i * 3] = (Math.random() - 0.5) * 20
//       pos[i * 3 + 1] = (Math.random() - 0.5) * 20
//       pos[i * 3 + 2] = (Math.random() - 0.5) * 10
//     }
//     return pos
//   }, [count])

//   const sizes = useMemo(() => {
//     const s = new Float32Array(count)
//     for (let i = 0; i < count; i++) {
//       s[i] = Math.random() * 3 + 0.5
//     }
//     return s
//   }, [count])

//   useFrame((state) => {
//     if (!mesh.current) return
//     mesh.current.rotation.y = state.clock.elapsedTime * 0.02
//     mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
//   })

//   return (
//     <points ref={mesh}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={count}
//           array={positions}
//           itemSize={3}
//         />
//         <bufferAttribute
//           attach="attributes-size"
//           count={count}
//           array={sizes}
//           itemSize={1}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         size={0.04}
//         color="#7C3AED"
//         transparent
//         opacity={0.6}
//         sizeAttenuation
//         blending={THREE.AdditiveBlending}
//       />
//     </points>
//   )
// }

// function FloatingShapes() {
//   const group = useRef<THREE.Group>(null)

//   useFrame((state) => {
//     if (!group.current) return
//     group.current.rotation.y = state.clock.elapsedTime * 0.05
//     group.current.children.forEach((child, i) => {
//       child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i * 2) * 0.3
//       child.rotation.x = state.clock.elapsedTime * 0.1 * (i % 2 === 0 ? 1 : -1)
//       child.rotation.z = state.clock.elapsedTime * 0.08 * (i % 3 === 0 ? 1 : -1)
//     })
//   })

//   return (
//     <group ref={group}>
//       {[
//         [-3, 1, -2],
//         [3.5, -1, -3],
//         [-2, -2, -1],
//         [2, 2, -4],
//         [0, -3, -2],
//         [-4, 0, -3],
//       ].map((pos, i) => (
//         <mesh key={i} position={pos as [number, number, number]}>
//           {i % 3 === 0 ? (
//             <octahedronGeometry args={[0.15]} />
//           ) : i % 3 === 1 ? (
//             <dodecahedronGeometry args={[0.12]} />
//           ) : (
//             <icosahedronGeometry args={[0.1]} />
//           )}
//           <meshBasicMaterial
//             color={i % 2 === 0 ? "#7C3AED" : "#A855F7"}
//             transparent
//             opacity={0.3}
//             wireframe
//           />
//         </mesh>
//       ))}
//     </group>
//   )
// }

// export function ParticleField() {
//   return (
//     <div className="absolute inset-0 -z-10">
//       <Canvas
//         camera={{ position: [0, 0, 5], fov: 75 }}
//         dpr={[1, 1.5]}
//         style={{ background: "transparent" }}
//       >
//         <Particles count={150} />
//         <FloatingShapes />
//         <ambientLight intensity={0.5} />
//       </Canvas>
//     </div>
//   )
// }
