"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Torus, Icosahedron, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingGeometry() {
  const torusRef = useRef<THREE.Mesh>(null);
  const icoRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.15;
      torusRef.current.rotation.y = t * 0.1;
    }
    if (icoRef.current) {
      icoRef.current.rotation.x = -t * 0.08;
      icoRef.current.rotation.y = t * 0.12;
      icoRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <>
      {/* Torus exterior */}
      <Torus ref={torusRef} args={[1.8, 0.012, 3, 120]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#AFA9EC" wireframe={false} />
      </Torus>

      {/* Segundo torus inclinado */}
      <Torus args={[1.8, 0.008, 3, 80]} rotation={[Math.PI / 3, 0, 0]}>
        <meshBasicMaterial color="#D3D1C7" />
      </Torus>

      {/* Icosaedro central */}
      <Icosahedron ref={icoRef} args={[0.5, 0]}>
        <meshBasicMaterial color="#7F77DD" wireframe />
      </Icosahedron>
    </>
  );
}

function StarField() {
  const count = 600;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }

  return (
    <Points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <PointMaterial color="#888780" size={0.018} sizeAttenuation />
    </Points>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ background: "transparent" }}
      dpr={[1, 2]}
    >
      <StarField />
      <FloatingGeometry />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </Canvas>
  );
}
