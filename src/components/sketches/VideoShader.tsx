"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const fluorVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fluorFragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uDistortion;
  varying vec2 vUv;

  vec3 fluorMap(vec3 color) {
    float lum = dot(color, vec3(0.299, 0.587, 0.114));

    vec3 magenta    = vec3(1.0, 0.0, 0.8);
    vec3 cyan       = vec3(0.0, 1.0, 0.9);
    vec3 acidGreen  = vec3(0.4, 1.0, 0.0);
    vec3 elecYellow = vec3(1.0, 0.95, 0.0);

    vec3 col;
    if (lum < 0.25) {
      col = mix(magenta, cyan, lum * 4.0);
    } else if (lum < 0.5) {
      col = mix(cyan, acidGreen, (lum - 0.25) * 4.0);
    } else if (lum < 0.75) {
      col = mix(acidGreen, elecYellow, (lum - 0.5) * 4.0);
    } else {
      col = mix(elecYellow, magenta, (lum - 0.75) * 4.0);
    }

    return col * (0.6 + lum * 0.8);
  }

  // Ruido simple para distorsión orgánica
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  void main() {
    // Distorsión orgánica suave
    vec2 uv = vUv;
    float nx = noise(uv * 3.0 + uTime * 0.2) - 0.5;
    float ny = noise(uv * 3.0 + uTime * 0.2 + 5.3) - 0.5;
    uv += vec2(nx, ny) * uDistortion;

    vec4 tex = texture2D(uTexture, uv);
    vec3 fluor = fluorMap(tex.rgb);

    gl_FragColor = vec4(fluor, tex.a);
  }
`;

// Plano con shader aplicado a un video
function VideoPlane({
  url,
  position,
  width = 5.2,
  height = 2.8,
}: {
  url: string;
  position: [number, number, number];
  width?: number;
  height?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useVideoTexture(url, {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: "anonymous",
  });

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={fluorVertexShader}
        fragmentShader={fluorFragmentShader}
        uniforms={{
          uTexture:    { value: texture },
          uTime:       { value: 0 },
          uDistortion: { value: 0.008 },
        }}
      />
    </mesh>
  );
}

function Scene({ videoUrls }: { videoUrls: string[] }) {
  const count = videoUrls.length;

  // Layout in columns of 2 (stacked vertically)
  const cols = Math.ceil(count / 2);
  const rows = Math.min(2, count);

  // Adjust plane size and spacing based on number of columns
  // Increase base sizes so videos occupy more canvas space
  const planeWidth = cols > 3 ? 2.6 : count > 4 ? 3.6 : 4.8;
  const planeHeight = (planeWidth / 3.2) * 1.8;
  const gapX = planeWidth * 0.01; // horizontal gap
  const spacingX = planeWidth + gapX;
  const startX = -((cols - 1) * spacingX) / 2;

  const gapY = planeHeight * 0.01; // vertical gap between stacked videos
  const spacingY = planeHeight + gapY;
  const yTop = spacingY / 2;
  const yBottom = -spacingY / 2;

  return (
    <>
      {videoUrls.map((url, i) => {
        const col = Math.floor(i / 2);
        const row = i % 2; // 0 -> top, 1 -> bottom
        const x = startX + col * spacingX;
        const y = row === 0 ? yTop : yBottom;
        return (
          <VideoPlane
            key={i}
            url={url}
            position={[x, y, 0]}
            width={planeWidth}
            height={planeHeight}
          />
        );
      })}
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

interface Props {
  videoUrls?: string[];
  labels?: string[];
}

export function VideoShader({ videoUrls, labels }: Props) {
  if (!videoUrls || videoUrls.length === 0) return null;
  const urls: string[] = videoUrls || []  ;
  const count = urls.length;
  const cols = Math.ceil(count / 2);

  // Labels per video: use provided label if exists, otherwise fallback
  const labelList = urls.map((_, i) => (labels && labels[i] ? labels[i] : `Video ${i + 1}`));

  // Adjust camera distance based on number of columns so they fit in view
  // Bring camera closer to make planes appear larger
  const cameraZ = Math.max(4, 1 + cols * 1.2);

  return (
    <div>
      <div style={{ width: "100%", height: "80%", aspectRatio: "16/6", background: "#000" }}>
        <Canvas
          camera={{ position: [0, 0, cameraZ], fov: 50 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          dpr={[1, 2]}
        >
          <Scene videoUrls={urls} />
        </Canvas>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, cols)}, 1fr)`, gap: 1, marginTop: 8 }}>
        {labelList.map((l, i) => (
          <p key={i} style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#8B949E",
            letterSpacing: "0.08em",
            textAlign: "center",
            textTransform: "uppercase",
          }}>
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}