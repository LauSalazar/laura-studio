"use client";

import { useEffect, useRef } from "react";
import { useP5Loader } from "../../lib/useP5Loader";

export function TorusSketch() {
  const containerRef = useRef<HTMLDivElement>(null);

  const isP5Loaded = useP5Loader();

  useEffect(() => {
    if (!containerRef.current) return;
    if (!isP5Loaded) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p5global = (window as any).p5;
    if (!p5global) return;

    let p5Instance: any = null;
    let visibilityHandler: (() => void) | null = null;

    const sketch = (p: any) => {
        let x: number, y: number;
        let vx: number, vy: number;
        let angle = 0;

        const R = 100;
        const r = 38;
        const DETAIL = 24;
        const SPEED = 2.5;

        p.setup = () => {
          const container = containerRef.current!;
          const cnv = p.createCanvas(container.offsetWidth, container.offsetHeight);
          cnv.parent(container);
          const canvases = containerRef.current!.querySelectorAll("canvas");
          canvases.forEach((c: HTMLCanvasElement, i: number) => { if (i > 0) c.remove(); });
          p.smooth();
          x = p.width / 2;
          y = p.height / 2;
          const dir = p.random(p.TWO_PI);
          vx = p.cos(dir) * SPEED;
          vy = p.sin(dir) * SPEED;
        };

        p.draw = () => {
          p.background(255);
          x += vx;
          y += vy;

          const margin = R + r + 10;
          if (x < margin)            { x = margin;             vx =  Math.abs(vx) + p.random(-0.3, 0.3); }
          if (x > p.width - margin)  { x = p.width - margin;  vx = -Math.abs(vx) + p.random(-0.3, 0.3); }
          if (y < margin)            { y = margin;             vy =  Math.abs(vy) + p.random(-0.3, 0.3); }
          if (y > p.height - margin) { y = p.height - margin; vy = -Math.abs(vy) + p.random(-0.3, 0.3); }

          const mag = Math.sqrt(vx * vx + vy * vy);
          vx = (vx / mag) * SPEED;
          vy = (vy / mag) * SPEED;
          angle += 0.01;
          drawTorus(x, y, angle);
        };

        function torusPoint(phi: number, theta: number, camZ: number): [number, number, number] {
          const px = (R + r * p.cos(theta)) * p.cos(phi);
          const py = (R + r * p.cos(theta)) * p.sin(phi);
          const pz = r * p.sin(theta);
          const scale = camZ / (camZ - pz);
          return [px * scale, py * scale, pz];
        }

        function drawTorus(cx: number, cy: number, rot: number) {
          const camZ = 400;
          p.push();
          p.translate(cx, cy);
          p.rotate(rot);
          p.noFill();
          p.strokeWeight(0.9);

          for (let j = 0; j < DETAIL; j++) {
            const theta = (j / DETAIL) * p.TWO_PI;
            p.beginShape();
            for (let i = 0; i <= DETAIL; i++) {
              const phi = (i / DETAIL) * p.TWO_PI;
              const [sx, sy, pz] = torusPoint(phi, theta, camZ);
              p.stroke(p.map(pz, -r, r, 170, 20));
              p.vertex(sx, sy);
            }
            p.endShape();
          }

          for (let i = 0; i < DETAIL; i++) {
            const phi = (i / DETAIL) * p.TWO_PI;
            p.beginShape();
            for (let j = 0; j <= DETAIL; j++) {
              const theta = (j / DETAIL) * p.TWO_PI;
              const [sx, sy, pz] = torusPoint(phi, theta, camZ);
              p.stroke(p.map(pz, -r, r, 170, 20));
              p.vertex(sx, sy);
            }
            p.endShape();
          }

          p.pop();
        }

        p.windowResized = () => {
          if (containerRef.current) {
            p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
          }
        };
    };

    // lazy-mount when the container becomes visible (or on first interaction)
    const container = containerRef.current;
    const mount = () => {
      if (p5Instance) return;
      p5Instance = new p5global(sketch);
      // limit frame rate
      try { p5Instance.frameRate?.(30); } catch (e) {}
      // pause when tab hidden
      visibilityHandler = () => {
        if (document.hidden) p5Instance?.noLoop?.(); else p5Instance?.loop?.();
      };
      document.addEventListener("visibilitychange", visibilityHandler);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        mount();
      }
    }, { threshold: 0.05 });
    observer.observe(container);

    // also allow quick start on user interaction (mobile)
    const onInteraction = () => mount();
    container.addEventListener('pointerdown', onInteraction, { once: true });

    return () => {
      observer.disconnect();
      container.removeEventListener('pointerdown', onInteraction);
      if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler);
      p5Instance?.remove();
    };
  }, [isP5Loaded]);

  return <div ref={containerRef} className="w-full h-full" />;
}