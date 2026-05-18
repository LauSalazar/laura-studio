'use client';

import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

interface HotspotPosition {
  lon: number;
  lat: number;
}

interface HotspotPointProps {
  position: HotspotPosition;
  label?: string;
  onClick?: () => void;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  sphereRadius?: number;
}

/**
 * HotspotPoint
 *
 * Renders an animated 3D hotspot on the 360° sphere.
 * Handles raycasting to detect clicks and projects the 3D position to 2D screen coords.
 *
 * Props:
 *  - position   : { lon, lat }  — spherical coords in degrees. lon: 0–360, lat: -90–90
 *  - label      : string        — short label shown on the dot
 *  - onClick    : () => void    — called when the hotspot is clicked
 *  - camera     : THREE.Camera
 *  - renderer   : THREE.WebGLRenderer
 *  - scene      : THREE.Scene
 *  - sphereRadius: number       — should match your sphere radius (default 500)
 */
export default function HotspotPoint({
  position,
  label,
  onClick,
  camera,
  renderer,
  scene,
  sphereRadius = 500,
}: HotspotPointProps) {
  const meshRef = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | null>(null);
  const ringRef = useRef<THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial> | null>(null);
  const [screenPos, setScreenPos] = useState<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const world3D = useRef(new THREE.Vector3());

  // Convert lon/lat degrees → 3D point on sphere interior
  useEffect(() => {
    if (!scene) return;

    const phi   = THREE.MathUtils.degToRad(90 - position.lat);
    const theta = THREE.MathUtils.degToRad(position.lon);
    const r = sphereRadius * 0.98; // slightly inside the sphere

    world3D.current.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );

    // Clean previous meshes
    if (meshRef.current)  scene.remove(meshRef.current);
    if (ringRef.current)  scene.remove(ringRef.current);

    // Core sphere marker
    const geo  = new THREE.SphereGeometry(4, 16, 16);
    const mat  = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(world3D.current);
    mesh.userData.isHotspot = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // Pulsing ring
    const ringGeo = new THREE.RingGeometry(6, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(world3D.current);
    // Orient ring to face camera direction (face the center)
    ring.lookAt(0, 0, 0);
    scene.add(ring);
    ringRef.current = ring;

    return () => {
      if (meshRef.current)  scene.remove(meshRef.current);
      if (ringRef.current)  scene.remove(ringRef.current);
    };
  }, [scene, position, sphereRadius]);

  // Every frame: project 3D → 2D, pulse ring, check visibility
  useEffect(() => {
    if (!camera || !renderer) return;

    const project = () => {
      animFrameRef.current = requestAnimationFrame(project);

      const t = performance.now() / 1000;

      // Pulse the ring scale
      if (ringRef.current) {
        const scale = 1 + 0.25 * Math.sin(t * 2.5);
        ringRef.current.scale.setScalar(scale);
        ringRef.current.material.opacity = 0.3 + 0.2 * Math.sin(t * 2.5);
      }

      // Project to screen
      const projected = world3D.current.clone().project(camera);

      // Only show if dot is "in front" (dot product with camera dir > 0)
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      const toPoint = world3D.current.clone().normalize();
      const dot = camDir.dot(toPoint);
      const isVisible = dot > 0.1;
      setVisible(isVisible);

      if (isVisible) {
        const w = renderer.domElement.clientWidth;
        const h = renderer.domElement.clientHeight;
        setScreenPos({
          x: (projected.x * 0.5 + 0.5) * w,
          y: (-projected.y * 0.5 + 0.5) * h,
        });
      }
    };

    project();
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [camera, renderer]);

  // Click handler via raycasting
  useEffect(() => {
    if (!renderer || !camera || !scene) return;

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      if (meshRef.current) {
        const hits = raycaster.intersectObject(meshRef.current);
        if (hits.length > 0) onClick?.();
      }
    };

    renderer.domElement.addEventListener('click', handleClick);
    return () => renderer.domElement.removeEventListener('click', handleClick);
  }, [renderer, camera, scene, onClick]);

  if (!screenPos || !visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: screenPos.x,
        top:  screenPos.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {/* Outer glow ring (CSS) */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: `2px solid rgba(255,255,255,${hovered ? 1 : 0.6})`,
        boxShadow: hovered
          ? '0 0 0 4px rgba(255,255,255,0.2), 0 0 20px rgba(255,255,255,0.4)'
          : '0 0 0 3px rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        cursor: 'pointer',
        pointerEvents: 'all',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(4px)',
      }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        {/* Plus icon */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Label */}
      {label && (
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          fontSize: '10px',
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.12em',
          padding: '3px 8px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          border: '1px solid rgba(255,255,255,0.15)',
          opacity: hovered ? 1 : 0.7,
          transition: 'opacity 0.2s',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}
