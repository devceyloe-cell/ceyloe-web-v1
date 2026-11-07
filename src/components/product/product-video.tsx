"use client";

import { useEffect, useState } from "react";
import { VideoOff } from "lucide-react";
import { getYouTubeEmbedUrl, isDirectVideoUrl, isYouTubeUrl } from "@/lib/video-utils";

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
      <p className="font-manrope text-sm font-semibold uppercase tracking-[0.16em]">
        Video not available
      </p>
    </div>
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

  useEffect(() => {
    setFailed(false);
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

  const unavailable = !trimmed || failed;

  const content = unavailable ? (
    <VideoUnavailable />
  ) : youtubeEmbed ? (
    <iframe
      src={`${youtubeEmbed}?rel=0&modestbranding=1`}
      title={`${title} video`}
      className="absolute inset-0 h-full w-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  ) : direct ? (
    <video
      controls
      playsInline
      poster={poster || undefined}
      className="h-full w-full object-cover"
      aria-label={`${title} video`}
      onError={() => setFailed(true)}
    >
      <source src={trimmed} type="video/mp4" />
    </video>
  ) : (
    <iframe
      src={trimmed}
      title={`${title} video`}
      className="absolute inset-0 h-full w-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );

  if (isGallery) {
    return (
      <div className="absolute inset-0 h-full w-full max-w-full min-w-0 overflow-hidden bg-surface-elevated">
        {content}
      </div>
    );
  }

  return (
    <div className="mt-8">
      {showHeading && (
        <h3 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">Gemstone Video</h3>
      )}
      <div className="relative aspect-video w-full max-w-full min-w-0 overflow-hidden bg-surface-elevated">
        {content}
      </div>
    </div>
  );
}
