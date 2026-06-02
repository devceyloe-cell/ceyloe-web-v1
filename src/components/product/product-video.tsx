"use client";

import { Play } from "lucide-react";
import Image from "next/image";

interface ProductVideoProps {
  videoUrl?: string;
  poster: string;
  title: string;
}

export function ProductVideo({ videoUrl, poster, title }: ProductVideoProps) {
  if (videoUrl) {
    return (
      <div className="mt-8">
        <h3 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">Gemstone Video</h3>
        <div className="relative aspect-video overflow-hidden bg-surface-elevated">
          <video controls poster={poster} className="h-full w-full object-cover">
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">Gemstone Video</h3>
      <div className="relative aspect-video overflow-hidden bg-surface-elevated">
        <Image src={poster} alt={title} fill className="object-cover opacity-80" sizes="(max-width: 1024px) 100vw, 50vw" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
          <Play className="mb-2 h-10 w-10" />
          <p className="text-xs uppercase tracking-widest">Video tour available on request</p>
          <p className="mt-1 text-[10px] text-white/70">Contact us via WhatsApp for a live viewing</p>
        </div>
      </div>
    </div>
  );
}
