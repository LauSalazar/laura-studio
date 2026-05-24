"use client";

import { useP5Loader } from "@/lib/useP5Loader";
import { useEffect, useRef, useState } from "react";

interface RizomaSketchProps {
    onRestart?: () => void;
}

export function RizomaSketch({ onRestart }: RizomaSketchProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isP5Loaded = useP5Loader();
    const [duration, setDuration] = useState(20);
    const durationRef = useRef(duration);
    const [restartTrigger, setRestartTrigger] = useState(0);

    useEffect(() => {
        durationRef.current = duration;
    }, [duration]);

    useEffect(() => {
        if (!containerRef.current) return;
        if (!isP5Loaded) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p5 = (window as any).p5;
        if (!p5) return;

        let p5Instance: { remove: () => void } | null = null;

        const sketch = (p: any) => {
            let x: number, y: number;
            let img: any;
            let trail: Array<{ x: number; y: number }> = [];

            let vx: number, vy: number;

            const IMG_SIZE = 40;
            const SPEED = 1.5;
            const STEP_DISTANCE = IMG_SIZE / 2; // distancia entre imágenes = ancho/2

            let distanceSinceLastStamp = 0;
            let startTime: number;
            let isDrawing = true;

            p.preload = () => {
                img = p.loadImage("/laura-studio/images/FlorDeLoto.png");
            };

            p.setup = () => {
                const container = containerRef.current!;
                const cnv = p.createCanvas(container.offsetWidth, container.offsetHeight);
                cnv.parent(container);
                const canvases = container.querySelectorAll("canvas");
                canvases.forEach((c: HTMLCanvasElement, i: number) => {
                    if (i > 0) c.remove();
                });
                p.smooth();

                x = p.width / 2;
                y = p.height / 2;

                const angle = p.random(p.TWO_PI);
                vx = p.cos(angle);
                vy = p.sin(angle);

                startTime = p.millis();
                isDrawing = true;
                trail = [];
                // Registrar posición inicial
                trail.push({ x, y });
            };

            p.draw = () => {
                p.background("#0c0b0bff");

                const elapsed = (p.millis() - startTime) / 1000;

                if (isDrawing && elapsed < durationRef.current) {
                    // Mover en línea recta
                    x += vx * SPEED;
                    y += vy * SPEED;
                    distanceSinceLastStamp += SPEED;

                    const margin = IMG_SIZE;

                    if (x < margin) {
                        x = margin;
                        vx = Math.abs(vx);
                    }
                    if (x > p.width - margin) {
                        x = p.width - margin;
                        vx = -Math.abs(vx);
                    }
                    if (y < margin) {
                        y = margin;
                        vy = Math.abs(vy);
                    }
                    if (y > p.height - margin) {
                        y = p.height - margin;
                        vy = -Math.abs(vy);
                    }
                    vx += p.random(-0.2, 0.2);
                    vy += p.random(-0.2, 0.2);

                    const mag = Math.sqrt(vx * vx + vy * vy);
                    vx = (vx / mag) * SPEED;
                    vy = (vy / mag) * SPEED;

                    // Estampar imagen cada STEP_DISTANCE píxeles
                    if (distanceSinceLastStamp >= STEP_DISTANCE) {
                        trail.push({ x, y });
                        distanceSinceLastStamp = 0;
                    }
                } else {
                    isDrawing = false;
                }

                // Dibujar todas las imágenes del rastro
                if (img) {
                    for (const point of trail) {
                        p.drawingContext.shadowBlur = 40; // Tamaño o radio del resplandor
                        p.drawingContext.shadowColor = p.color(255, 255, 255);

                        p.image(img, point.x - IMG_SIZE / 2, point.y - IMG_SIZE / 2, IMG_SIZE, IMG_SIZE);
                    }
                }

                // HUD: tiempo restante
                const remaining = Math.max(0, durationRef.current - (p.millis() - startTime) / 1000);
                p.fill(0, 0, 0, 180);
                p.noStroke();
                p.textSize(14);
                p.color(234);
                p.textAlign(p.RIGHT, p.TOP);
                if (isDrawing) {
                    p.text(`Dibujando: ${remaining.toFixed(1)}s`, p.width - 10, 10);
                } else {
                    p.text("✓ Dibujo completo", p.width - 10, 10);
                }
            };
        };

        p5Instance = new p5(sketch);

        return () => {
            p5Instance?.remove();
        };
    }, [isP5Loaded, restartTrigger]);

    return (
        <div className="flex flex-col w-full h-full">
            {/* Panel de control */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.5rem 1rem",
                    background: "rgba(0,0,0,0.07)",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                    fontFamily: "monospace",
                    fontSize: 13,
                }}
            >
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>⏱ Duración:</span>
                    <input
                        type="range"
                        min={3}
                        max={60}
                        step={1}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        style={{ width: 100 }}
                    />
                    <span style={{ minWidth: 30 }}>{duration}s</span>
                </label>
                <button
                    onClick={() => {
                        onRestart?.();
                        setRestartTrigger(prev => prev + 1);
                    }}
                    style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: 4,
                        border: "1px solid #999",
                        cursor: "pointer",
                        background: "#fff",
                    }}
                >
                    ↺ Reiniciar
                </button>
            </div>

            {/* Canvas */}
            <div ref={containerRef} className="w-full flex-1" />
        </div>
    );
}