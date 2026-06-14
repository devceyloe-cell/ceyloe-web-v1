"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getYouTubeEmbedUrl, isDirectVideoUrl, isYouTubeUrl } from "@/lib/video-utils";

interface ProductVideoProps {
  videoUrl?: string;
  poster: string;
  title: string;
  variant?: "gallery" | "section";
}

export function ProductVideo({ videoUrl, poster, title, variant = "section" }: ProductVideoProps) {
  const isGallery = variant === "gallery";
  const youtubeEmbed = videoUrl && isYouTubeUrl(videoUrl) ? getYouTubeEmbedUrl(videoUrl) : null;

  const content = videoUrl ? (
    youtubeEmbed ? (
      <iframe
        src={`${youtubeEmbed}?rel=0&modestbranding=1`}
        title={`${title} video`}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    ) : isDirectVideoUrl(videoUrl) ? (
      <video
        controls
        playsInline
        poster={poster}
        className="h-full w-full object-cover"
        aria-label={`${title} video`}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    ) : (
      <iframe
        src={videoUrl}
        title={`${title} video`}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    )
  ) : (
    <>
      <Image
        src={poster}
        alt={title}
        fill
        className="object-cover opacity-80"
        sizes={isGallery ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 50vw"}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 px-6 text-center text-white">
        <Play className="mb-2 h-10 w-10" />
        <p className="text-xs uppercase tracking-widest">Video tour available on request</p>
        <p className="mt-1 text-[10px] text-white/70">Contact us via WhatsApp for a live viewing</p>
      </div>
    </>
  );

  return (
    <div className={cn(!isGallery && "mt-8")}>
      {!isGallery && (
        <h3 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">Gemstone Video</h3>
      )}
      <div
        className={cn(
          "relative overflow-hidden bg-surface-elevated",
          isGallery ? "aspect-square" : "aspect-video",
        )}
      >
        {content}
      </div>
    </div>
  );
}
