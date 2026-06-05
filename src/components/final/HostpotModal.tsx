'use client';

import { useEffect, useRef } from 'react';

interface HotspotStat {
  label: string;
  value: string | number;
}

interface HotspotData {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  stats?: HotspotStat[];
}

interface HotspotModalProps {
  isOpen: boolean;
  onClose?: () => void;
  data?: HotspotData | null;
}
/**
 * HotspotModal
 *
 * Full-screen centered modal that appears when a hotspot is clicked.
 * Displays: image, title, description, and optional stats/data.
 *
 * Props:
 *  - isOpen    : boolean
 *  - onClose   : () => void
 *  - data      : {
 *      title       : string,
 *      description : string,
 *      image       : string,        — URL or path
 *      imageAlt    : string,
 *      stats       : [{ label, value }]  — optional array
 *    }
 */
export default function HotspotModal({ isOpen, onClose, data }: HotspotModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!data) return null;

  return (
    <>
      <style>{`
        .hs-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }
        .hs-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .hs-card {
          position: relative;
          width: 100%;
          max-width: 680px;
          background: #0a0c0f;
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          transform: translateY(24px) scale(0.97);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05);
        }
        .hs-overlay.open .hs-card {
          transform: translateY(0) scale(1);
        }

        /* Image area */
        .hs-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: #111;
        }
        .hs-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 6s ease;
        }
        .hs-overlay.open .hs-image-wrap img {
          transform: scale(1.04);
        }

        /* Gradient over image bottom */
        .hs-image-wrap::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60%;
          background: linear-gradient(to top, #0a0c0f 0%, transparent 100%);
          pointer-events: none;
        }

        /* Corner accent top-left */
        .hs-corner-accent {
          position: absolute;
          top: 0; left: 0;
          width: 48px; height: 48px;
          border-top: 2px solid rgba(255,255,255,0.5);
          border-left: 2px solid rgba(255,255,255,0.5);
          pointer-events: none;
          z-index: 2;
        }
        .hs-corner-accent-br {
          top: auto; left: auto;
          bottom: 0; right: 0;
          border-top: none;
          border-left: none;
          border-bottom: 2px solid rgba(255,255,255,0.2);
          border-right: 2px solid rgba(255,255,255,0.2);
        }

        /* Close button */
        .hs-close {
          position: absolute;
          top: 14px; right: 14px;
          z-index: 10;
          width: 34px; height: 34px;
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(6px);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s, background 0.2s;
          padding: 0;
        }
        .hs-close:hover {
          border-color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.1);
        }

        /* Body */
        .hs-body {
          padding: 28px 32px 32px;
        }

        .hs-tag {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 10px;
        }

        .hs-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 5vw, 42px);
          color: #ffffff;
          line-height: 1;
          letter-spacing: 0.03em;
          margin-bottom: 14px;
        }

        .hs-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          margin-bottom: 0;
        }

        /* Stats grid */
        .hs-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 1px;
          margin-top: 28px;
          background: rgba(255,255,255,0.08);
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .hs-stat {
          background: #0a0c0f;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .hs-stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          color: #fff;
          letter-spacing: 0.04em;
          line-height: 1;
        }
        .hs-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        /* Divider line */
        .hs-divider {
          width: 40px;
          height: 2px;
          background: rgba(255,255,255,0.2);
          margin-bottom: 16px;
        }

        @media (max-width: 480px) {
          .hs-body { padding: 20px; }
          .hs-title { font-size: 30px; }
        }
      `}</style>

      <div
        ref={overlayRef}
        className={`hs-overlay${isOpen ? ' open' : ''}`}
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose?.();
        }}
        role="dialog"
        aria-modal="true"
        aria-label={data.title}
      >
        <div className="hs-card">
          {/* Corner accents */}
          <div className="hs-corner-accent" />
          <div className="hs-corner-accent hs-corner-accent-br" />

          {/* Close */}
          <button className="hs-close" onClick={onClose} aria-label="Cerrar">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Image */}
          {data.image && (
            <div className="hs-image-wrap">
              <img src={data.image} alt={data.imageAlt || data.title} />
            </div>
          )}

          {/* Body */}
          <div className="hs-body">
            <span className="hs-tag">Punto de interés</span>
            <div className="hs-divider" />
            <h2 className="hs-title">{data.title}</h2>
            {data.description && (
              <p className="hs-desc">{data.description}</p>
            )}

            {/* Stats */}
            {data.stats && data.stats.length > 0 && (
              <div className="hs-stats">
                {data.stats.map((stat, i) => (
                  <div className="hs-stat" key={i}>
                    <span className="hs-stat-value">{stat.value}</span>
                    <span className="hs-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
