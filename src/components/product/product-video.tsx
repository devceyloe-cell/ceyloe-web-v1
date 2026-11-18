"use client";

import { useEffect, useRef, useState } from "react";
import { Play, VideoOff } from "lucide-react";
import { getYouTubeEmbedUrl, isDirectVideoUrl, isYouTubeUrl } from "@/lib/video-utils";
import { cn } from "@/lib/utils";

interface ProductVideoProps {
  videoUrl?: string;
  poster: string;
  title: string;
  variant?: "gallery" | "section";
  showHeading?: boolean;
}

function VideoUnavailable() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111] px-6 text-center text-white">
      <VideoOff className="mb-3 h-10 w-10 text-white/55" strokeWidth={1.5} aria-hidden />
      <p className="font-manrope text-sm font-semibold tracking-[0.16em] uppercase">
        Video not available
      </p>
    </div>
  );
}

function CenterPlayButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group absolute inset-0 z-10 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold focus-visible:ring-inset"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
        <Play className="h-7 w-7 fill-current sm:h-8 sm:w-8" strokeWidth={0} aria-hidden />
      </span>
    </button>
  );
}

export function ProductVideo({
  videoUrl,
  poster,
  title,
  variant = "section",
  showHeading = true,
}: ProductVideoProps) {
  const isGallery = variant === "gallery";
  const trimmed = videoUrl?.trim() || "";
  const youtubeEmbed = trimmed && isYouTubeUrl(trimmed) ? getYouTubeEmbedUrl(trimmed) : null;
  const direct = Boolean(trimmed) && isDirectVideoUrl(trimmed);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setFailed(false);
    setPlaying(false);
    if (!direct) return;

    let cancelled = false;
    fetch(trimmed, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && !res.ok) setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [trimmed, direct]);

  useEffect(() => {
    if (!playing || !direct) return;
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {
      /* browser may still require native controls */
    });
  }, [playing, direct]);

  const unavailable = !trimmed || failed;

  const content = unavailable ? (
    <VideoUnavailable />
  ) : youtubeEmbed ? (
    playing ? (
      <iframe
        src={`${youtubeEmbed}?rel=0&modestbranding=1&autoplay=1`}
        title={`${title} video`}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    ) : (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <CenterPlayButton
          label={`Play ${title} video`}
          onClick={() => setPlaying(true)}
        />
      </>
    )
  ) : direct ? (
    playing ? (
      <video
        ref={videoRef}
        controls
        playsInline
        autoPlay
        poster={poster || undefined}
        className="h-full w-full object-cover"
        aria-label={`${title} video`}
        onError={() => setFailed(true)}
      >
        <source src={trimmed} type="video/mp4" />
      </video>
    ) : (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <CenterPlayButton label={`Play ${title} video`} onClick={() => setPlaying(true)} />
      </>
    )
  ) : playing ? (
    <iframe
      src={trimmed}
      title={`${title} video`}
      className="absolute inset-0 h-full w-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  ) : (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <CenterPlayButton label={`Play ${title} video`} onClick={() => setPlaying(true)} />
    </>
  );

  if (isGallery) {
    return (
      <div className="absolute inset-0 h-full w-full max-w-full min-w-0 overflow-hidden bg-surface-elevated">
        {content}
      </div>
    );
  }

  return (
    <div className={cn(showHeading ? "mt-8" : "")}>
      {showHeading && (
        <h3 className="mb-3 text-xs tracking-[0.15em] text-muted uppercase">Gemstone Video</h3>
      )}
      <div className="relative aspect-video w-full min-w-0 max-w-full overflow-hidden bg-surface-elevated">
        {content}
      </div>
    </div>
  );
}
