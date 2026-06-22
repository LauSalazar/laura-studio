"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

declare global {
  interface Window {
    playAppAudio?: () => void;
    audioReady?: boolean;
    setAppSoundMuted?: (muted: boolean) => void;
  }
}

let appSound: THREE.Audio | null = null;

export default function AudioPlayer({ url, loop = true, volume = 0.5 }: { url: string; loop?: boolean; volume?: number }) {
  const { camera } = useThree();

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    // If a preloaded HTMLAudioElement exists, reuse it to avoid re-downloading
    const preloaded: HTMLAudioElement | undefined = (typeof window !== 'undefined' && (window as any).__preloadedAudioElement) || undefined;
    if (preloaded) {
      try {
        // Connect media element to WebAudio via THREE
        const source = listener.context.createMediaElementSource(preloaded as HTMLMediaElement);
        (sound as any).setNodeSource?.(source);
      } catch (e) {
        // Fallback: THREE provides setMediaElementSource on Audio
        try {
          (sound as any).setMediaElementSource(preloaded);
        } catch (err) {
          console.warn('AudioPlayer: could not set media element source', err);
        }
      }
      // When using a media element source, playback control is on the element itself.
      try {
        (preloaded as HTMLMediaElement).loop = loop;
        (preloaded as HTMLMediaElement).volume = volume;
      } catch (e) {
        /* ignore */
      }
      appSound = sound;
      window.playAppAudio = () => {
        try {
          // Ensure AudioContext is resumed on user gesture
          try {
            listener.context.resume().catch(() => {});
          } catch (e) {
            /* ignore */
          }
          (preloaded as HTMLMediaElement).play();
        } catch (e) {
          console.warn('Audio play blocked or failed', e);
        }
      };
      window.audioReady = true;
          
      // expose mute control for UI
      window.setAppSoundMuted = (muted: boolean) => {
        try {
          const preEl = (window as any).__preloadedAudioElement as HTMLMediaElement | undefined;
          if (preEl) {
            preEl.muted = !!muted;
            return;
          }
          if (appSound) {
            appSound.setVolume(muted ? 0 : volume);
          }
        } catch (e) {
          console.warn('AudioPlayer: setAppSoundMuted failed', e);
        }
      };
    } else {
      const loader = new THREE.AudioLoader();
      loader.load(
        url,
        (buffer) => {
          sound.setBuffer(buffer);
          sound.setLoop(loop);
          sound.setVolume(volume);
          appSound = sound;
          // expose a play function for user gesture
          window.playAppAudio = () => {
            try {
              try {
                listener.context.resume().catch(() => {});
              } catch (e) {
                /* ignore */
              }
              sound.play();
            } catch (e) {
              console.warn('Audio play blocked or failed', e);
            }
          };
          // mark ready for UI
          window.audioReady = true;
          

          // expose mute control for UI when using buffer-based audio
          window.setAppSoundMuted = (muted: boolean) => {
            try {
              if (appSound) {
                appSound.setVolume(muted ? 0 : volume);
              }
            } catch (e) {
              console.warn('AudioPlayer: setAppSoundMuted failed', e);
            }
          };

          // try autoplay (may be blocked by browser)
          try {
            sound.play();
          } catch (e) {
            // ignore — user gesture required
          }
        },
        undefined,
        (err) => {
          console.error('Audio load error', err);
        }
      );
    }

    return () => {
      try {
        if (appSound) {
          appSound.stop();
          appSound = null;
        }
      } catch {}
      camera.remove(listener);
      if (window.playAppAudio) delete window.playAppAudio;
    };
  }, [camera, url, loop, volume]);

  return null;
}
