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
}: {
  url: string;
  position: [number, number, number];
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
      <planeGeometry args={[3.2, 1.8]} />
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

function Scene({ video1Url, video2Url }: { video1Url: string; video2Url: string }) {
  return (
    <>
      <VideoPlane url={video1Url} position={[-1.7, 0, 0]} />
      <VideoPlane url={video2Url} position={[ 1.7, 0, 0]} />
      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

interface Props {
  video1Url: string;
  video2Url: string;
  label1?: string;
  label2?: string;
}

export function VideoShader({ video1Url, video2Url, label1 = "Video 1", label2 = "Video 2" }: Props) {
  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Canvas R3F */}
      <div style={{ width: "100%", aspectRatio: "16/5", background: "#000" }}>
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 50 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          dpr={[1, 2]}
        >
          <Scene video1Url={video1Url} video2Url={video2Url} />
        </Canvas>
      </div>

      {/* Labels */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        marginTop: 8,
      }}>
        {[label1, label2].map((label) => (
          <p key={label} style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#8B949E",
            letterSpacing: "0.08em",
            textAlign: "center",
            textTransform: "uppercase",
          }}>
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}