"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import * as THREE from "three";
import HotspotPoint from "../../components/final/HotspotPoint";
import HotspotModal from "../../components/final/HostpotModal";

const HOTSPOTS = [
  {
    id: 'cup',
    label: 'Route',
    position: { lon: 180, lat: 50 },
    data: {
      title: 'La Copa',
      description:
        'Quien gana no es solo quien hace más puntos; es el resultado visible de una red invisible de sincronías corporales, decisiones instantáneas, confianza mutua, adaptación constante y trabajo continuo.',
      image: '/laura-studio/images/thropy.jpg',
      imageAlt: 'La copa',
      stats: [
        { label: 'Movimiento',  value: 'Pensamiento en acción' },
        { label: 'Equipo',  value: 'Inteligencia compartica'   },
        { label: 'Victoria', value: 'Sincronia hecha resultado' },
      ],
    },
  },
  {
    id: 'dupla1',
    label: 'UdeA',
    position: { lon: 210, lat: -28 },
    data: {
      title: 'Presentación dupla 1',
      description:
        'Se distinguen por su precisión técnica y por convertir sus capacidades físicas en decisiones estratégicas dentro de la cancha.',
      image: '/laura-studio/images/dupla1.png',
      imageAlt: 'Dupla 1',
      stats: [
        { label: 'Jugador 1', value: 'Laura' },
        { label: 'Jugador 2', value: 'Juliana' }, 
      ],
    },
  },
  {
    id: 'dupla2',
    label: 'UdeS',
    position: { lon: 150, lat: -28 },
    data: {
      title: 'Presentación dupla 2',
      description:
        'Destacan por un juego de potencia, donde fuerza y control corporal definen su presencia en la cancha.',
      image: '/laura-studio/images/dupla2.png',
      imageAlt: 'Dupla 2',
      stats: [
        { label: 'Jugador 1', value: 'Sara' },
        { label: 'Jugador 2', value: 'Tatiana' },
      ],
    },
  },
  {
    id: 'estrategia',
    label: 'Estrategia',
    position: { lon: 60, lat: -28 },
    data: {
      title: 'Presentación de la estrategia',
      description:
        'La victoria se construyó haciendo mover al rival, anticipando sus patrones de ataque y transformando la precisión en ventaja competitiva.',
      image: '/laura-studio/images/estrategia.png',
      imageAlt: 'Estrategia',
      stats: [],
    },
  },
  {
    id: 'apoyo',
    label: 'Apoyo',
    position: { lon: -90, lat: 8 },
    data: {
      title: 'Red de apoyo',
      description:
        'Nadie juega completamente solo.',
      image: '/laura-studio/images/apoyo.png',
      imageAlt: 'Apoyo',
      stats: [],
    },
  },
];

export default function FinalPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [currentFOV, setCurrentFOV] = useState(75);
  const [toast, setToast] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const stateRef = useRef({
    isPointerDown: false,
    lastX: 0,
    lastY: 0,
    lon: 0,
    lat: 0,
    targetLon: 0,
    targetLat: 0,
  });
  const [activeHotspot, setActiveHotspot] = useState<typeof HOTSPOTS[0] | null>(null);
  const [threeReady, setThreeReady]       = useState(false);
  const router = useRouter();

  const DEFAULT_IMAGE_PATH = "/laura-studio/images/default-360.png";

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  useEffect(() => {
    let progress = 0;
    const loaderInterval = setInterval(() => {
      progress += 1.5;
      setLoadProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(loaderInterval);
        setTimeout(() => setShowLoader(false), 300);
      }
    }, 30);

    return () => clearInterval(loaderInterval);
  }, []);

  useEffect(() => {
    if (!containerRef.current || showLoader) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // clamp pixel ratio to avoid excessive GPU work on high-DPI devices
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(
      120,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 0.001);
    cameraRef.current = camera;

    const sphereGeo = new THREE.SphereGeometry(500, 80, 60);
    sphereGeo.scale(-1, 1, 1);

    const sphereMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.BackSide,
    });
    sphereMatRef.current = sphereMat;

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(DEFAULT_IMAGE_PATH); 

    setThreeReady(true);

    const material = new THREE.MeshBasicMaterial({ 
        map: texture 
    });
    const sphere = new THREE.Mesh(sphereGeo, material);
    scene.add(sphere);

    const particleGeo = new THREE.BufferGeometry();
    const pCount = 300;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 80 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

    const canvas = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      stateRef.current.isPointerDown = true;
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isPointerDown) return;
      const dx = e.clientX - stateRef.current.lastX;
      const dy = e.clientY - stateRef.current.lastY;
      stateRef.current.targetLon -= dx * 0.25;
      stateRef.current.targetLat += dy * 0.25;
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;
    };

    const onMouseUp = () => {
      stateRef.current.isPointerDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      setCurrentFOV((prev) => {
        const newFOV = Math.max(30, Math.min(120, prev + e.deltaY * 0.05));
        camera.fov = newFOV;
        camera.updateProjectionMatrix();
        return newFOV;
      });
    };

    const onTouchStart = (e: TouchEvent) => {
      stateRef.current.isPointerDown = true;
      stateRef.current.lastX = e.touches[0].clientX;
      stateRef.current.lastY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!stateRef.current.isPointerDown) return;
      const dx = e.touches[0].clientX - stateRef.current.lastX;
      const dy = e.touches[0].clientY - stateRef.current.lastY;
      stateRef.current.targetLon -= dx * 0.25;
      stateRef.current.targetLat += dy * 0.25;
      stateRef.current.lastX = e.touches[0].clientX;
      stateRef.current.lastY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      stateRef.current.isPointerDown = false;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();

    // animation control (pause when page is hidden to save GPU)
    let rafId: number | null = null;
    let running = true;

    const animateFrame = () => {
      if (!running) return;
      rafId = requestAnimationFrame(animateFrame);

      const t = clock.getElapsedTime();

      if (autoRotate && !stateRef.current.isPointerDown) {
        stateRef.current.targetLon += 0.00;
      }

      stateRef.current.lon += (stateRef.current.targetLon - stateRef.current.lon) * 0.06;
      stateRef.current.lat += (stateRef.current.targetLat - stateRef.current.lat) * 0.06;
      stateRef.current.lat = Math.max(-85, Math.min(85, stateRef.current.lat));

      const phi = THREE.MathUtils.degToRad(90 - stateRef.current.lat);
      const theta = THREE.MathUtils.degToRad(stateRef.current.lon);

      camera.lookAt(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );

      renderer.render(scene, camera);
    };

    const startLoop = () => {
      if (!running) {
        running = true;
        animateFrame();
      } else if (rafId === null) {
        animateFrame();
      }
    };

    const stopLoop = () => {
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    document.addEventListener("visibilitychange", onVisibility, false);

    // start
    startLoop();
    showToast("Arrastra para mirar alrededor · Scroll para zoom");

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      stopLoop();
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [showLoader, autoRotate]);

  const handleReset = () => {
    stateRef.current.targetLon = 0;
    stateRef.current.targetLat = 0;
    stateRef.current.lon = 0;
    stateRef.current.lat = 0;
    setCurrentFOV(75);
    if (cameraRef.current) {
      cameraRef.current.fov = 75;
      cameraRef.current.updateProjectionMatrix();
    }
    showToast("Cámara reiniciada");
  };

  const handleToggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
    showToast(!autoRotate ? "Rotación automática activada" : "Rotación manual");
  };

  const handleFOVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentFOV(val);
    if (cameraRef.current) {
      cameraRef.current.fov = val;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      showToast("Modo pantalla completa");
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        background: "#000",
        overflow: "hidden",
        fontFamily: "'Space Mono', monospace",
        color: "#e0f7ff",
      }}
    >
      {showLoader && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            opacity: loadProgress >= 100 ? 0 : 1,
            transition: "opacity 0.8s",
            pointerEvents: loadProgress >= 100 ? "none" : "auto",
          }}
        >
          <h2
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 28,
              letterSpacing: "0.4em",
              color: "#00e5ff",
              textShadow: "0 0 30px rgba(0,229,255,0.8)",
              marginBottom: 40,
              textTransform: "uppercase",
            }}
          >
            360°
          </h2>
          <div
            style={{
              width: 300,
              height: 2,
              background: "rgba(0,229,255,0.15)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#00e5ff",
                boxShadow: "0 0 12px #00e5ff",
                width: `${loadProgress}%`,
                transition: "width 0.3s",
              }}
            />
          </div>
          <p
            style={{
              marginTop: 16,
              fontSize: 10,
              letterSpacing: "0.3em",
              color: "rgba(0,229,255,0.4)",
              textTransform: "uppercase",
            }}
          >
            Iniciando motor
          </p>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
        }}
      />

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 5 }}>
        <svg
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            width: 60,
            height: 60,
            opacity: 0.5,
          }}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 40 L0 0 L40 0" stroke="#00e5ff" strokeWidth="1.5" opacity="0.6" />
          <path d="M0 20 L20 0" stroke="#00e5ff" strokeWidth="0.5" opacity="0.3" />
        </svg>

        <svg
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 60,
            height: 60,
            opacity: 0.5,
            transform: "scaleX(-1)",
          }}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 40 L0 0 L40 0" stroke="#00e5ff" strokeWidth="1.5" opacity="0.6" />
          <path d="M0 20 L20 0" stroke="#00e5ff" strokeWidth="0.5" opacity="0.3" />
        </svg>

        <svg
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            width: 60,
            height: 60,
            opacity: 0.5,
            transform: "scaleY(-1)",
          }}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 40 L0 0 L40 0" stroke="#00e5ff" strokeWidth="1.5" opacity="0.6" />
          <path d="M0 20 L20 0" stroke="#00e5ff" strokeWidth="0.5" opacity="0.3" />
        </svg>

        <svg
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            width: 60,
            height: 60,
            opacity: 0.5,
            transform: "scale(-1)",
          }}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 40 L0 0 L40 0" stroke="#00e5ff" strokeWidth="1.5" opacity="0.6" />
          <path d="M0 20 L20 0" stroke="#00e5ff" strokeWidth="0.5" opacity="0.3" />
        </svg>

        <div
          style={{
            position: "absolute",
            top: 28,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <h1
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(14px, 2.5vw, 22px)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#00e5ff",
              textShadow: "0 0 20px rgba(0,229,255,0.8), 0 0 60px rgba(0,229,255,0.3)",
              whiteSpace: "nowrap",
              margin: 0,
            }}
          >
            La Final 360°
          </h1>
        </div>
          

        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 12,
            alignItems: "center",
            pointerEvents: "all",
          }}
        >
          <button
            onClick={handleReset}
            style={{
              background: "rgba(0,229,255,0.08)",
              border: "1px solid rgba(0,229,255,0.3)",
              color: "#00e5ff",
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              padding: "8px 16px",
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "all 0.2s",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,229,255,0.2)";
              e.currentTarget.style.borderColor = "rgba(0,229,255,0.8)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,229,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ⟳ Reset
          </button>
          <div style={{ width: 1, height: 30, background: "rgba(0,229,255,0.25)" }} />
          <div style={{ width: 1, height: 30, background: "rgba(0,229,255,0.25)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label
              style={{
                fontSize: 9,
                letterSpacing: "0.15em",
                color: "rgba(0,229,255,0.6)",
                textTransform: "uppercase",
              }}
            >
              FOV
            </label>
            <input
              type="range"
              min="40"
              max="120"
              value={currentFOV}
              onChange={handleFOVChange}
              style={{
                width: 80,
                height: 2,
                background: "rgba(0,229,255,0.2)",
                outline: "none",
                cursor: "pointer",
              }}
            />
          </div>
          <div style={{ width: 1, height: 30, background: "rgba(0,229,255,0.25)" }} />
          
          <div style={{ width: 1, height: 30, background: "rgba(0,229,255,0.25)" }} />
          <button
            onClick={handleToggleFullscreen}
            style={{
              background: "rgba(0,229,255,0.08)",
              border: "1px solid rgba(0,229,255,0.3)",
              color: "#00e5ff",
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              padding: "8px 16px",
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "all 0.2s",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,229,255,0.2)";
              e.currentTarget.style.borderColor = "rgba(0,229,255,0.8)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,229,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ⊞ VR
          </button>
        </div>

        {/* Hotspot points — rendered as CSS overlays */}
      {threeReady && HOTSPOTS.map((hs) => (
        <HotspotPoint
          key={hs.id}
          position={hs.position}
          label={hs.label}
          camera={cameraRef.current!}
          renderer={rendererRef.current!}
          scene={sceneRef.current!}
          onClick={() => {
            if (hs.id === 'cup') {
              router.push('/tournament');
            } else {
              setActiveHotspot(hs);
            }
          }}
        />
      ))}

      {/* Modal */}
      <HotspotModal
        isOpen={!!activeHotspot}
        onClose={() => setActiveHotspot(null)}
        data={activeHotspot?.data}
      />
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,10,20,0.9)",
            border: "1px solid rgba(0,229,255,0.4)",
            color: "#00e5ff",
            fontSize: 11,
            letterSpacing: "0.15em",
            padding: "10px 20px",
            textTransform: "uppercase",
            zIndex: 50,
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
      )}

      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 5,
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)",
        }}
      />
    </div>
  );
}