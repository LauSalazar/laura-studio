"use client";

import { useEffect, useState } from "react";
import { VideoShader } from "@/components/sketches/VideoShader";

function usePreloadVideos(urls: string[], audioUrl?: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ((!urls || urls.length === 0) && !audioUrl) {
      setReady(false);
      return;
    }
    let cancelled = false;
    const videos: HTMLVideoElement[] = [];
    const audios: HTMLAudioElement[] = [];

    const videoPromises = (urls || []).map((url) =>
      new Promise<void>((resolve) => {
        const v = document.createElement("video");
        v.muted = true;
        v.preload = "auto";
        v.crossOrigin = "anonymous";
        v.src = url;
        const onLoaded = () => {
          v.removeEventListener("loadeddata", onLoaded);
          v.removeEventListener("error", onError);
          resolve();
        };
        const onError = () => {
          v.removeEventListener("loadeddata", onLoaded);
          v.removeEventListener("error", onError);
          resolve();
        };
        v.addEventListener("loadeddata", onLoaded);
        v.addEventListener("error", onError);
        videos.push(v);
      })
    );

    const audioPromises: Promise<void>[] = audioUrl
      ? [
          new Promise<void>((resolve) => {
            const a = document.createElement("audio");
            a.preload = "auto";
            a.crossOrigin = "anonymous";
            a.src = audioUrl;
            a.loop = true;
            a.volume = 0.5;
            // Start muted so autoplay is allowed, we'll provide a mute toggle later
            a.muted = true;
            // Trigger loading
            try {
              a.load();
            } catch (e) {
              /* ignore */
            }
            // expose preloaded audio element globally for AudioPlayer to reuse
            try {
              (window as any).__preloadedAudioElement = a;
              (window as any).audioPreloaded = true;
            } catch (e) {
              /* ignore */
            }
            const onLoaded = () => {
              a.removeEventListener("canplaythrough", onLoaded);
              a.removeEventListener("error", onError);
              resolve();
            };
            const onError = () => {
              a.removeEventListener("canplaythrough", onLoaded);
              a.removeEventListener("error", onError);
              resolve();
            };
            a.addEventListener("canplaythrough", onLoaded);
            a.addEventListener("error", onError);
            audios.push(a);
          }),
        ]
      : [];

    Promise.all([...videoPromises, ...audioPromises]).then(() => {
      if (!cancelled) {
        setReady(true);
        // Try to autoplay muted audio so user sees immediate playback (browser allows muted autoplay)
        try {
          const pre = (window as any).__preloadedAudioElement as HTMLMediaElement | undefined;
          if (pre) {
            pre.muted = true;
            pre.play().catch(() => {});
          }
        } catch (e) {
          /* ignore */
        }
      }
    });

    return () => {
      cancelled = true;
      videos.forEach((v) => {
        try {
          v.pause();
          v.src = "";
        } catch (e) {
          /* ignore */
        }
      });
      audios.forEach((a) => {
        try {
          a.pause();
          a.src = "";
        } catch (e) {
          /* ignore */
        }
      });
    };
  }, [urls, audioUrl]);

  return ready;
}

export default function PreloadedVideoShader({ videoUrls, labels, audioUrl }: { videoUrls: string[]; labels?: string[]; audioUrl?: string }) {
  const ready = usePreloadVideos(videoUrls, audioUrl);
  useEffect(() => {}, [videoUrls]);

  if (!ready) {
    return (
      <div style={{ width: "100%", aspectRatio: "16/5", background: "#000", display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Loading videos</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6B7280' }}>{videoUrls?.length ?? 0} media{audioUrl ? ' + audio' : ''}</div>
        </div>
      </div>
    );
  }

  return <VideoShader videoUrls={videoUrls} labels={labels} audioUrl={audioUrl} />;
}
