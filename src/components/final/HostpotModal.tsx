'use client';

import { useEffect, useRef } from 'react';
import './HostpotModal.css';

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
