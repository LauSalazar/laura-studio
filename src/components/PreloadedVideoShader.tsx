"use client";

import { useEffect, useState } from "react";
import { VideoShader } from "@/components/sketches/VideoShader";

function usePreloadVideos(urls: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    console.log("Preload hook start", urls);
    if (!urls || urls.length === 0) {
      setReady(false);
      return;
    }
    let cancelled = false;
    const videos: HTMLVideoElement[] = [];

    const promises = urls.map((url) =>
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

    Promise.all(promises).then(() => {
      console.log("Preload: all videos settled");
      if (!cancelled) setReady(true);
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
    };
  }, [urls]);

  return ready;
}

export default function PreloadedVideoShader({ videoUrls, labels }: { videoUrls: string[]; labels?: string[] }) {
  const ready = usePreloadVideos(videoUrls);
  useEffect(() => {
    console.log("PreloadedVideoShader mounted", { videoUrls });
  }, [videoUrls]);

  if (!ready) {
    return (
      <div style={{ width: "100%", aspectRatio: "16/5", background: "#000", display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Loading videos</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6B7280' }}>{videoUrls?.length ?? 0} media</div>
        </div>
      </div>
    );
  }

  return <VideoShader videoUrls={videoUrls} labels={labels} />;
}
