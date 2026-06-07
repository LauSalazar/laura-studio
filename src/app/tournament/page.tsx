'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { data, label } from 'framer-motion/client';
import HotspotPoint from '@/components/final/HotspotPoint';
import HotspotModal from '@/components/final/HostpotModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Player { name: string; }

interface University {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  players: [Player, Player];
  bracketSide: 'left' | 'right';
  seed: number;
}

interface BracketNode {
  id: string;
  round: 'octavos' | 'cuartos' | 'semis' | 'final';
  position: THREE.Vector3;
  universityId: string | null;
  side: 'left' | 'right' | 'center';
  slotIndex: number;
}

// ─── Universities ─────────────────────────────────────────────────────────────

const UNIVERSITIES: University[] = [
  { id: 'udea',    name: 'Universidad de Antioquia',            shortName: 'UdeA',     logo: '🔵', color: '#003DA5', players: [{ name: 'Laura Salazar' },   { name: 'Juliana Pulgarín' }],     bracketSide: 'left',  seed: 1 },
  { id: 'unal',    name: 'Universidad Nacional',                shortName: 'UNAL',     logo: '🟡', color: '#F5A800', players: [{ name: 'Daniela Torres' },      { name: 'Mariana Castillo' }],    bracketSide: 'left',  seed: 2 },
  { id: 'eafit',   name: 'Universidad EAFIT',                   shortName: 'EAFIT',    logo: '🟠', color: '#E87722', players: [{ name: 'Camila Ríos' },          { name: 'Sofía Montoya' }],       bracketSide: 'left',  seed: 3 },
  { id: 'udem',    name: 'Universidad de Medellín',             shortName: 'UdeM',     logo: '🔴', color: '#C8102E', players: [{ name: 'Laura Herrera' },        { name: 'Isabella Zapata' }],     bracketSide: 'left',  seed: 4 },
  { id: 'ces',     name: 'Universidad CES',                     shortName: 'CES',      logo: '🟢', color: '#00843D', players: [{ name: 'Natalia Mora' },         { name: 'Sara Osorio' }],         bracketSide: 'left',  seed: 5 },
  { id: 'upb',     name: 'Univ. Pontificia Bolivariana',        shortName: 'UPB',      logo: '🟤', color: '#7B3F00', players: [{ name: 'Juliana Restrepo' },     { name: 'Paola Vélez' }],         bracketSide: 'left',  seed: 6 },
  { id: 'ceat',    name: 'Politécnico Colombiano',              shortName: 'Poli',     logo: '⚫', color: '#555555', players: [{ name: 'Manuela Giraldo' },      { name: 'Alejandra Ruiz' }],      bracketSide: 'left',  seed: 7 },
  { id: 'uis',     name: 'Univ. Industrial de Santander',       shortName: 'UIS',      logo: '🔷', color: '#005F9E', players: [{ name: 'Valeria Mejía' },        { name: 'Catalina Pérez' }],      bracketSide: 'left',  seed: 8 },
  { id: 'udes',  name: 'Universidad de Santander',            shortName: 'UdeS',   logo: '🟣', color: '#6B2D8B', players: [{ name: 'Fernanda López' },       { name: 'Luciana Suárez' }],      bracketSide: 'right', seed: 1 },
  { id: 'javert',  name: 'Pontificia Universidad Javeriana',    shortName: 'Javer.',   logo: '🔹', color: '#1C4587', players: [{ name: 'Andrea Salcedo' },       { name: 'María José Niño' }],     bracketSide: 'right', seed: 2 },
  { id: 'rosario', name: 'Universidad del Rosario',             shortName: 'Rosario',  logo: '🌹', color: '#8B0000', players: [{ name: 'Paula Guerrero' },       { name: 'Daniela Vargas' }],      bracketSide: 'right', seed: 3 },
  { id: 'andes',   name: 'Universidad de los Andes',            shortName: 'Andes',    logo: '⛰️', color: '#C41230', players: [{ name: 'Gabriela Mora' },        { name: 'Valentina Cruz' }],      bracketSide: 'right', seed: 4 },
  { id: 'icesi',   name: 'Universidad ICESI',                   shortName: 'ICESI',    logo: '🟦', color: '#0057A8', players: [{ name: 'Stephanie Rivas' },      { name: 'Daniela Agudelo' }],     bracketSide: 'right', seed: 5 },
  { id: 'valle',   name: 'Universidad del Valle',               shortName: 'Univalle', logo: '🔶', color: '#FF6B00', players: [{ name: 'Lorena Salazar' },       { name: 'Melissa Cardona' }],     bracketSide: 'right', seed: 6 },
  { id: 'usc',     name: 'Universidad Santiago de Cali',        shortName: 'USC',      logo: '🌿', color: '#2D6A4F', players: [{ name: 'Tatiana Muñoz' },        { name: 'Juliana Castaño' }],     bracketSide: 'right', seed: 7 },
  { id: 'libre',   name: 'Universidad Libre',                   shortName: 'U.Libre',  logo: '⚪', color: '#888888', players: [{ name: 'Viviana Cano' },         { name: 'Mariana Ospina' }],      bracketSide: 'right', seed: 8 },
];

// UdeA path node IDs (seed 1 left → always top bracket)
const UDEA_PATH_IDS = new Set(['oct-l-0', 'qtr-l-0', 'semi-l-0', 'final-0']);

const HOSTPOT = [
    {
        id: 'groups',
        label: 'Groups',
        position: { lon: 100, lat: 20 },
        data: {
            title: 'Fase de grupos',
            description: 'La fase de grupos premia la constancia; la eliminación directa pone a prueba la capacidad de adaptarse bajo presión.',
            image: '/laura-studio/images/groups.png',
            imageAlt: 'Fase de grupos'
        }
    }
]
// ─── Bracket geometry ─────────────────────────────────────────────────────────
//
// Visual mapping (mirrors the image):
//
//  LON axis  = horizontal  (left teams far left, right teams far right, final center)
//  LAT axis  = vertical    (top half positive lat, bottom half negative lat)
//
//  LEFT side  (lon decreasing toward center):
//    Octavos:  lon = 200   8 slots top-to-bottom
//    Cuartos:  lon = 215   4 slots (pairs merged)
//    Semis:    lon = 230   2 slots
//
//  CENTER:
//    Final:    lon = 270   lat = 0
//
//  RIGHT side (lon increasing toward center):
//    Octavos:  lon = 340
//    Cuartos:  lon = 325
//    Semis:    lon = 310
//
//  Vertical spacing: 8 teams → lats spread evenly from +56 to -56
//  Each round collapses pairs to midpoint lat
//
// ─────────────────────────────────────────────────────────────────────────────

function lonLatToVec3(lon: number, lat: number, r: number): THREE.Vector3 {
  const phi   = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// The 8 vertical slots for octavos (top-to-bottom, like the image)
// Use an evenly spaced symmetric range around the equator. Reduce the
// half-extent (`OCT_EXTENT`) to tighten vertical spacing while preserving symmetry.
const OCT_COUNT = 8;
const OCT_EXTENT = 42; // half-extent in degrees (was ~56); lower => tighter spacing
const OCT_LATS: number[] = Array.from({ length: OCT_COUNT }, (_, i) => {
  return OCT_EXTENT - (i * (2 * OCT_EXTENT) / (OCT_COUNT - 1));
});
// Cuartos: midpoint of each pair of octavos
const QTR_LATS  = [
  (OCT_LATS[0] + OCT_LATS[1]) / 2,  // 49
  (OCT_LATS[2] + OCT_LATS[3]) / 2,  //  5
  (OCT_LATS[4] + OCT_LATS[5]) / 2,  // -39
  (OCT_LATS[6] + OCT_LATS[7]) / 2,  // -75
];
// Semis: midpoint of each pair of cuartos
const SEMI_LATS = [
  (QTR_LATS[0] + QTR_LATS[1]) / 2,  // 27
  (QTR_LATS[2] + QTR_LATS[3]) / 2,  // -57
];

// Longitude columns
const LON = {
  octL:  200,
  qtrL:  215,
  semiL: 232,
  final: 270,
  semiR: 308,
  qtrR:  325,
  octR:  340,
};

function buildBracketNodes(): BracketNode[] {
  const R = 480;
  const nodes: BracketNode[] = [];
  const leftUnis  = UNIVERSITIES.filter(u => u.bracketSide === 'left');
  const rightUnis = UNIVERSITIES.filter(u => u.bracketSide === 'right');

  // LEFT octavos
  OCT_LATS.forEach((lat, i) => {
    nodes.push({ id: `oct-l-${i}`, round: 'octavos', position: lonLatToVec3(LON.octL,  lat, R), universityId: leftUnis[i]?.id ?? null, side: 'left',  slotIndex: i });
  });
  // LEFT cuartos
  QTR_LATS.forEach((lat, i) => {
    nodes.push({ id: `qtr-l-${i}`, round: 'cuartos', position: lonLatToVec3(LON.qtrL,  lat, R), universityId: leftUnis[i * 2]?.id ?? null, side: 'left',  slotIndex: i });
  });
  // LEFT semis
  SEMI_LATS.forEach((lat, i) => {
    nodes.push({ id: `semi-l-${i}`, round: 'semis',   position: lonLatToVec3(LON.semiL, lat, R), universityId: leftUnis[i * 4]?.id ?? null, side: 'left',  slotIndex: i });
  });

  // RIGHT octavos
  OCT_LATS.forEach((lat, i) => {
    nodes.push({ id: `oct-r-${i}`, round: 'octavos', position: lonLatToVec3(LON.octR,  lat, R), universityId: rightUnis[i]?.id ?? null, side: 'right', slotIndex: i });
  });
  // RIGHT cuartos
  QTR_LATS.forEach((lat, i) => {
    nodes.push({ id: `qtr-r-${i}`, round: 'cuartos', position: lonLatToVec3(LON.qtrR,  lat, R), universityId: rightUnis[i * 2]?.id ?? null, side: 'right', slotIndex: i });
  });
  // RIGHT semis
  SEMI_LATS.forEach((lat, i) => {
    nodes.push({ id: `semi-r-${i}`, round: 'semis',   position: lonLatToVec3(LON.semiR, lat, R), universityId: rightUnis[i * 4]?.id ?? null, side: 'right', slotIndex: i });
  });

  // FINAL
  nodes.push({ id: 'final-0', round: 'final', position: lonLatToVec3(LON.final, 0, R), universityId: null, side: 'center', slotIndex: 0 });

  return nodes;
}

// All bracket connections: [fromId, toId]
// Pattern: each pair of octavos → one cuartos, each pair of cuartos → one semi, each semi → final
const CONNECTIONS: [string, string][] = [
  // Left oct → qtr
  ['oct-l-0','qtr-l-0'], ['oct-l-1','qtr-l-0'],
  ['oct-l-2','qtr-l-1'], ['oct-l-3','qtr-l-1'],
  ['oct-l-4','qtr-l-2'], ['oct-l-5','qtr-l-2'],
  ['oct-l-6','qtr-l-3'], ['oct-l-7','qtr-l-3'],
  // Left qtr → semi
  ['qtr-l-0','semi-l-0'], ['qtr-l-1','semi-l-0'],
  ['qtr-l-2','semi-l-1'], ['qtr-l-3','semi-l-1'],
  // Left semi → final
  ['semi-l-0','final-0'], ['semi-l-1','final-0'],
  // Right oct → qtr
  ['oct-r-0','qtr-r-0'], ['oct-r-1','qtr-r-0'],
  ['oct-r-2','qtr-r-1'], ['oct-r-3','qtr-r-1'],
  ['oct-r-4','qtr-r-2'], ['oct-r-5','qtr-r-2'],
  ['oct-r-6','qtr-r-3'], ['oct-r-7','qtr-r-3'],
  // Right qtr → semi
  ['qtr-r-0','semi-r-0'], ['qtr-r-1','semi-r-0'],
  ['qtr-r-2','semi-r-1'], ['qtr-r-3','semi-r-1'],
  // Right semi → final
  ['semi-r-0','final-0'], ['semi-r-1','final-0'],
];

// Check if a connection belongs to UdeA's path
function isUdeaConnection(fromId: string, toId: string): boolean {
  return UDEA_PATH_IDS.has(fromId) && UDEA_PATH_IDS.has(toId);
}

// ─── Arc geometry between two sphere-surface points ──────────────────────────
// Interpolates along the sphere surface (great-circle arc)
function buildArcPoints(from: THREE.Vector3, to: THREE.Vector3, R: number, steps = 32): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mix = new THREE.Vector3().lerpVectors(from, to, t);
    mix.normalize().multiplyScalar(R);
    points.push(mix);
  }
  return points;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TournamentScene() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const rendererRef     = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef       = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef        = useRef<THREE.Scene | null>(null);
  const rafRef          = useRef<number>(0);
  const ballGroupRef    = useRef<THREE.Group | null>(null);

  // Orbit state
  const isDownRef  = useRef(false);
  const lastXRef   = useRef(0);
  const lastYRef   = useRef(0);
  const lonRef     = useRef(270);
  const latRef     = useRef(8);
  const tLonRef    = useRef(270);
  const tLatRef    = useRef(8);

  // Three objects
  const hotspotMeshes = useRef<Map<string, THREE.Mesh>>(new Map());
  const lineMatMap    = useRef<Map<string, THREE.LineBasicMaterial>>(new Map());
  const nodes         = useRef<BracketNode[]>([]);

  // UdeA state
  const [udeaActive, setUdeaActive] = useState(false);
  const udeaActiveRef = useRef(false);

  // Modal
  const [modal, setModal] = useState<University | null>(null);

  // CSS screen positions
  const [screenPos, setScreenPos] = useState<Map<string, { x: number; y: number; visible: boolean }>>(new Map());

  const router = useRouter()
    const [activeHotspot, setActiveHotspot] = useState<typeof HOSTPOT[0] | null>(null);
    const [hotspotDebug, setHotspotDebug] = useState<string | null>(null);
    const [threeReady, setThreeReady]       = useState(false);

  function updateUdeaLines(active: boolean) {
    lineMatMap.current.forEach((mat, key) => {
      const [from, to] = key.split('→');
      const isPath = isUdeaConnection(from, to);
      if (isPath) {
        mat.color.set(active ? 0x00ddff : 0x003DA5);
        mat.opacity = active ? 1.0 : 0.7;
      }
    });
  }

  const buildScene = useCallback(() => {
    if (!containerRef.current) return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 3000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    camera.position.set(0, 0, 0.001);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    containerRef.current.appendChild(renderer.domElement);

    sceneRef.current    = scene;
    cameraRef.current   = camera;
    rendererRef.current = renderer;

    // ── Background sphere ────────────────────────────────────────────────
    const bgGeo = new THREE.SphereGeometry(900, 64, 48);
    bgGeo.scale(-1, 1, 1);
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = 2048; bgCanvas.height = 1024;
    const bgCtx = bgCanvas.getContext('2d')!;
    bgCtx.fillStyle = '#010510';
    bgCtx.fillRect(0, 0, 2048, 1024);
    for (let i = 0; i < 1400; i++) {
      bgCtx.globalAlpha = 0.2 + Math.random() * 0.7;
      bgCtx.fillStyle = '#ffffff';
      bgCtx.beginPath();
      bgCtx.arc(Math.random() * 2048, Math.random() * 1024, Math.random() * 1.3, 0, Math.PI * 2);
      bgCtx.fill();
    }
    bgCtx.globalAlpha = 1;
    scene.add(new THREE.Mesh(bgGeo, new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(bgCanvas) })));

    // ── Lights ───────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x223355, 2));
    const pLight = new THREE.PointLight(0xffd060, 3, 700);
    pLight.position.set(0, 40, -150);
    scene.add(pLight);

    // ── Volleyball ───────────────────────────────────────────────────────
    const ballGroup = new THREE.Group();
    ballGroupRef.current = ballGroup;

    const bCanvas = document.createElement('canvas');
    bCanvas.width = 512; bCanvas.height = 512;
    const bCtx = bCanvas.getContext('2d')!;
    bCtx.fillStyle = '#f5f0e8'; bCtx.fillRect(0, 0, 512, 512);
    bCtx.strokeStyle = '#1a1a2e'; bCtx.lineWidth = 7;
    [[256,256,220],[256,256,110]].forEach(([cx,cy,r]) => {
      bCtx.beginPath(); bCtx.arc(cx,cy,r,0,Math.PI*2); bCtx.stroke();
    });
    bCtx.beginPath(); bCtx.moveTo(36,256); bCtx.lineTo(476,256); bCtx.stroke();
    bCtx.beginPath(); bCtx.moveTo(256,36); bCtx.lineTo(256,476); bCtx.stroke();

    const ballMesh = new THREE.Mesh(
      new THREE.SphereGeometry(20, 48, 48),
      new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(bCanvas), roughness: 0.45, metalness: 0 })
    );
    ballGroup.add(ballMesh);

    // outer glow
    ballGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(26, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.06, side: THREE.BackSide })
    ));

    ballGroup.position.set(0, 0, -210);
    scene.add(ballGroup);

    // ── Build nodes ───────────────────────────────────────────────────────
    const builtNodes = buildBracketNodes();
    nodes.current = builtNodes;
    const nodeMap = new Map<string, BracketNode>();
    builtNodes.forEach(n => nodeMap.set(n.id, n));

    builtNodes.forEach((node) => {
      const isOct   = node.round === 'octavos';
      const isFinal = node.round === 'final';
      const isUdea  = node.universityId === 'udea';
      const isPath  = UDEA_PATH_IDS.has(node.id);

      // Dot size: universities bigger, intermediate smaller, final biggest
      const size = isFinal ? 8 : isOct ? 5.5 : 3.5;

      let color: number;
      if (isFinal)     color = 0xffd700;
      else if (isUdea) color = 0x4499ff;
      else if (isPath) color = 0x2266cc;
      else             color = node.side === 'left' ? 0x335599 : 0x334477;

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(size, 20, 20),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92 })
      );
      mesh.position.copy(node.position);
      mesh.userData.nodeId = node.id;
      scene.add(mesh);
      hotspotMeshes.current.set(node.id, mesh);
    });

    // ── Draw all connection lines ─────────────────────────────────────────
    // First pass: all non-UdeA lines (dim, behind)
    // Second pass: UdeA lines (bright, on top)
    const drawLine = (fromId: string, toId: string) => {
      const from = nodeMap.get(fromId);
      const to   = nodeMap.get(toId);
      if (!from || !to) return;

      const isPath = isUdeaConnection(fromId, toId);
      const isLeft = fromId.includes('-l-');

      const mat = new THREE.LineBasicMaterial({
        color:       isPath ? 0x003DA5 : (isLeft ? 0x1a3a6e : 0x1a2d5e),
        transparent: false,
        opacity:     isPath ? 0.7 : 0.35,
        linewidth:   1,
      });

      const arc = buildArcPoints(from.position, to.position, 478);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(arc), mat);
      scene.add(line);
      lineMatMap.current.set(`${fromId}→${toId}`, mat);
    };

    // Non-UdeA first
    CONNECTIONS.forEach(([f, t]) => { if (!isUdeaConnection(f, t)) drawLine(f, t); });
    // UdeA path on top
    CONNECTIONS.forEach(([f, t]) => { if (isUdeaConnection(f, t)) drawLine(f, t); });

    // ── Raycasting ────────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const handleClick = (e: MouseEvent) => {
      if (!camera || !renderer) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const nx =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const ny = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);

      const hits = raycaster.intersectObjects(Array.from(hotspotMeshes.current.values()));
      if (!hits.length) return;

      const nodeId = hits[0].object.userData.nodeId as string;
      const node   = builtNodes.find(n => n.id === nodeId);
      if (!node?.universityId) return;

      const uni = UNIVERSITIES.find(u => u.id === node.universityId);
      if (!uni) return;

      if (uni.id === 'udea') {
        const next = !udeaActiveRef.current;
        udeaActiveRef.current = next;
        setUdeaActive(next);
        updateUdeaLines(next);
      }
      setModal(uni);
    };
    renderer.domElement.addEventListener('click', handleClick);

    // ── Drag handlers ─────────────────────────────────────────────────────
    const el = renderer.domElement;
    const onDown = (x: number, y: number) => { isDownRef.current = true; lastXRef.current = x; lastYRef.current = y; };
    const onUp   = () => { isDownRef.current = false; };
    const onMove = (x: number, y: number) => {
      if (!isDownRef.current) return;
      tLonRef.current -= (x - lastXRef.current) * 0.20;
      tLatRef.current += (y - lastYRef.current) * 0.20;
      lastXRef.current = x; lastYRef.current = y;
    };
    el.addEventListener('mousedown',  (e) => onDown(e.clientX, e.clientY));
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    el.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    el.addEventListener('wheel', (e) => {
      camera.fov = Math.max(30, Math.min(110, camera.fov + e.deltaY * 0.04));
      camera.updateProjectionMatrix();
    }, { passive: true });

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Render loop ───────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Orbit
      lonRef.current += (tLonRef.current - lonRef.current) * 0.055;
      latRef.current += (tLatRef.current - latRef.current) * 0.055;
      latRef.current  = Math.max(-80, Math.min(80, latRef.current));

      const phi   = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);
      camera.lookAt(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );

      // Ball
      if (ballGroupRef.current) {
        ballGroupRef.current.rotation.y = t * 0.25;
        ballGroupRef.current.position.y = Math.sin(t * 0.6) * 6;
      }

      // Pulse dots
      hotspotMeshes.current.forEach((mesh, nodeId) => {
        const node    = builtNodes.find(n => n.id === nodeId);
        if (!node) return;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const isFinal = node.round === 'final';
        const isUdea  = node.universityId === 'udea';
        const isPath  = UDEA_PATH_IDS.has(nodeId);

        if (udeaActiveRef.current && isPath) {
          // Animated glow on UdeA path
          const pulse = 1 + 0.35 * Math.sin(t * 4 + node.slotIndex);
          mesh.scale.setScalar(pulse);
          mat.color.set(isUdea ? 0x00eeff : 0x00aadd);
          mat.opacity = 0.95;
        } else {
          // Gentle default pulse
          const pulse = 1 + 0.08 * Math.sin(t * 1.8 + node.slotIndex * 0.6);
          mesh.scale.setScalar(pulse);
          if (isFinal)     mat.color.set(0xffd700);
          else if (isUdea) mat.color.set(0x4499ff);
          else if (isPath) mat.color.set(0x2266cc);
          else             mat.color.set(node.side === 'left' ? 0x335599 : 0x334477);
          mat.opacity = 0.92;
        }
      });

      // Animate UdeA lines when active
      if (udeaActiveRef.current) {
        lineMatMap.current.forEach((mat, key) => {
          const [f, to] = key.split('→');
          if (isUdeaConnection(f, to)) {
            mat.opacity = 0.6 + 0.4 * Math.sin(t * 3.5);
          }
        });
      }

      // Project all nodes to screen
      const newPos = new Map<string, { x: number; y: number; visible: boolean }>();
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);

      hotspotMeshes.current.forEach((mesh, nodeId) => {
        const projected = mesh.position.clone().project(camera);
        const toPoint   = mesh.position.clone().normalize();
        const visible   = camDir.dot(toPoint) > 0.08;
        newPos.set(nodeId, {
          x: (projected.x  * 0.5 + 0.5) * window.innerWidth,
          y: (-projected.y * 0.5 + 0.5) * window.innerHeight,
          visible,
        });
      });
      setScreenPos(new Map(newPos));

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cleanup = buildScene();
    return cleanup;
  }, [buildScene]);

  // ── Render ───────────────────────────────────────────────────────────────────

  const roundLabel: Record<string, string> = {
    octavos: 'Oct.', cuartos: 'Ctos.', semis: 'Semi', final: 'FINAL',
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {/* styles for tournament overlays and hotspots moved to `src/styles/globals.css` to avoid SSR/CSR hydration mismatches */}

      {/* Three.js canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* HUD */}
      <div className="hud-title">
        <h1>El Camino a la Final</h1>
        <p>Torneo Universitario · Voleibol Playa Femenino · 16 Duplas</p>
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#335599' }} />
          Octavos
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#4488bb' }} />
          Cuartos
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#6699cc' }} />
          Semifinal
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#ffd700' }} />
          Final
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#4499ff' }} />
          UdeA
        </div>
      </div>

      {/* CSS hotspot overlays */}
      {nodes.current.map((node) => {
        const pos  = screenPos.get(node.id);
        if (!pos || !pos.visible) return null;

        const uni     = node.universityId ? UNIVERSITIES.find(u => u.id === node.universityId) : null;
        const isFinal = node.round === 'final';
        const isOct   = node.round === 'octavos';
        const isUdea  = node.universityId === 'udea';

        return (
          <div
            key={node.id}
            className="hs-wrap"
            style={{ left: pos.x, top: pos.y }}
          >
            <div
              className={
                isFinal ? 'hs-btn hs-final'
                : isOct  ? `hs-btn hs-uni${isUdea ? ' udea' : ''}`
                :           'hs-btn hs-mid'
              }
              onClick={() => {
                // If this node is the final marker, navigate to the La Final page.
                if (isFinal) {
                  router.push('/la-final');
                  return;
                }

                // For non-final nodes, require a university to open the modal.
                if (!uni) return;

                if (isUdea) {
                  const next = !udeaActiveRef.current;
                  udeaActiveRef.current = next;
                  setUdeaActive(next);
                  updateUdeaLines(next);
                }
                setModal(uni);
              }}
            >
              {isFinal && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l1.8 4.5H14l-3.7 2.7 1.4 4.5L8 10.2 4.3 12.7l1.4-4.5L2 5.5h4.2z" fill="#ffd700"/>
                </svg>
              )}
              {!isFinal && (
                <div style={{
                  width:  isOct ? 8 : 5,
                  height: isOct ? 8 : 5,
                  borderRadius: '50%',
                  background: isUdea ? '#4499ff' : 'rgba(100,180,255,0.7)',
                }}/>
              )}
            </div>

            {/* Label: show for universities and final */}
            {(uni || isFinal) && (
              <div className={`hs-label${isUdea ? ' udea' : ''}${isFinal ? ' final' : ''}`}>
                {isFinal ? 'FINAL' : uni?.shortName}
              </div>
            )}
          </div>
        );
      })}

      {/* HOSTPOT (page-level hotspots) */}
      {HOSTPOT.map((hs) => (
        <HotspotPoint
          key={hs.id}
          position={hs.position}
          label={hs.label}
          camera={cameraRef.current!}
          renderer={rendererRef.current!}
          scene={sceneRef.current!}
          onClick={() => {
            console.log('HOSTPOT clicked:', hs.id);
            setHotspotDebug(hs.id);
            setActiveHotspot(hs);
            // clear debug after short delay
            setTimeout(() => setHotspotDebug(null), 1800);
          }}
        />
      ))}

      {/* UdeA path button */}
      <button
        className={`udea-btn${udeaActive ? ' active' : ''}`}
        onClick={() => {
          const next = !udeaActiveRef.current;
          udeaActiveRef.current = next;
          setUdeaActive(next);
          updateUdeaLines(next);
        }}
      >
        {udeaActive ? '✦ Ocultar recorrido UdeA' : '✦ Resaltar recorrido UdeA'}
      </button>

      {/* Modal */}
      <div
        className={`t-overlay${modal ? ' open' : ''}`}
        onClick={(e) => { if (e.currentTarget === e.target) setModal(null); }}
        role="dialog" aria-modal="true"
      >
        {modal && (
          <div className="t-card">
            <div className="t-header">
              <div className="t-logo">{modal.logo}</div>
              <div>
                <p className="t-tag">Universidad participante · Cuadro {modal.bracketSide === 'left' ? 'izquierdo' : 'derecho'}</p>
                <h2 className="t-name">{modal.name}</h2>
              </div>
            </div>
            <div className="t-divider" />
            <div className="t-body">
              <p className="t-section">Dupla competidora</p>
              <div className="t-players">
                {modal.players.map((p, i) => (
                  <div className="t-player" key={i}>
                    <span className="t-num">#{i + 1}</span>
                    <span className="t-pname">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="t-footer">
              <span className="t-badge">Cabeza de serie #{modal.seed}</span>
              <button className="t-close" onClick={() => setModal(null)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for HOSTPOT (page-level hotspots) */}
      <HotspotModal
        isOpen={!!activeHotspot}
        onClose={() => setActiveHotspot(null)}
        data={activeHotspot?.data}
      />

    </div>
  );
}