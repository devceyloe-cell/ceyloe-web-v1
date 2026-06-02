"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RotateCw } from "lucide-react";

interface Viewer360Props {
  images: string[];
  title: string;
}

export function Viewer360({ images, title }: Viewer360Props) {
  const [frame, setFrame] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startFrame = useRef(0);

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    startX.current = e.clientX;
    startFrame.current = frame;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || images.length < 2) return;
    const delta = e.clientX - startX.current;
    const step = Math.round(delta / 30);
    const next = (startFrame.current + step + images.length * 100) % images.length;
    setFrame(next);
  }

  function onPointerUp() {
    dragging.current = false;
  }

  return (
    <div className="space-y-2">
      <div
        className="relative aspect-square cursor-grab overflow-hidden bg-surface-elevated active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <Image
          src={images[frame]}
          alt={`${title} 360° view`}
          fill
          className="object-cover select-none"
          sizes="(max-width: 1024px) 100vw, 50vw"
          draggable={false}
        />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-background/80 px-2 py-1 text-[10px] uppercase tracking-widest">
          <RotateCw className="h-3 w-3" />
          Drag to rotate
        </div>
      </div>
      <p className="text-center text-[10px] uppercase tracking-widest text-muted">
        360° viewer — frame {frame + 1} of {images.length}
      </p>
    </div>
  );
}
