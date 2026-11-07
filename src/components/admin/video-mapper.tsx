"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

type BlobVideo = {
  pathname: string;
  url: string;
  handleGuess: string;
};

type ProductOption = {
  id: string;
  handle: string;
  title: string;
  videoUrl: string;
};

export function VideoMapper() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videos, setVideos] = useState<BlobVideo[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [selectedUrl, setSelectedUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [onlyUnmapped, setOnlyUnmapped] = useState(true);
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/videos");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Could not load videos");
      setLoading(false);
      return;
    }
    const nextVideos = (data.videos || []) as BlobVideo[];
    const nextProducts = (data.products || []) as ProductOption[];
    const nextPicks: Record<string, string> = {};
    for (const video of nextVideos) {
      const assigned = nextProducts.find((product) => product.videoUrl === video.url);
      const guessed = nextProducts.find((product) => product.handle === video.handleGuess);
      nextPicks[video.url] = assigned?.id || guessed?.id || "";
    }
    setVideos(nextVideos);
    setProducts(nextProducts);
    setPicks(nextPicks);
    setSelectedUrl((current) => current || nextVideos[0]?.url || "");
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  const productByUrl = useMemo(() => {
    const map = new Map<string, ProductOption>();
    for (const product of products) {
      if (product.videoUrl) map.set(product.videoUrl, product);
    }
    return map;
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((video) => {
      const assigned = productByUrl.get(video.url);
      if (onlyUnmapped && assigned) return false;
      if (!q) return true;
      return (
        video.handleGuess.includes(q) ||
        video.pathname.toLowerCase().includes(q) ||
        assigned?.title.toLowerCase().includes(q) ||
        assigned?.handle.toLowerCase().includes(q)
      );
    });
  }, [videos, query, onlyUnmapped, productByUrl]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageVideos = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selected = videos.find((video) => video.url === selectedUrl) ?? pageVideos[0] ?? null;

  async function assign(video: BlobVideo) {
    const productId = picks[video.url];
    if (!productId) {
      setMessage("Choose a product first.");
      return;
    }
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, videoUrl: video.url }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage(data.error || "Could not save mapping");
      setSaving(false);
      return;
    }
    setProducts((current) =>
      current.map((product) => {
        if (product.id === productId) return { ...product, videoUrl: video.url };
        if (product.videoUrl === video.url) return { ...product, videoUrl: "" };
        return product;
      }),
    );
    const title = products.find((product) => product.id === productId)?.title || "product";
    setMessage(`Saved ${video.handleGuess} to ${title}.`);
    setSaving(false);
  }

  return (
    <>
      <AdminHeader title="Videos" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Blob storage</p>
        <h1 className="mt-1 font-display text-3xl font-light">Match videos to products</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Pick a video thumbnail, choose the product it belongs to, then save.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search video or product…"
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/40 focus:ring-2 sm:max-w-sm"
          />
          <label className="inline-flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={onlyUnmapped}
              onChange={(e) => {
                setOnlyUnmapped(e.target.checked);
                setPage(1);
              }}
              className="h-4 w-4 accent-[var(--gold,#C09A4A)]"
            />
            Unmapped only
          </label>
          <p className="text-xs text-muted sm:ml-auto">
            {visible.length} videos · page {currentPage} of {pageCount}
          </p>
        </div>

        {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {loading ? <p className="mt-8 text-sm text-muted">Loading videos…</p> : null}

        {!loading && visible.length === 0 ? (
          <p className="mt-8 text-sm text-muted">No videos match this view.</p>
        ) : null}

        {pageVideos.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {pageVideos.map((video) => {
              const assigned = productByUrl.get(video.url);
              const active = selected?.url === video.url;
              return (
                <li key={video.url}>
                  <button
                    type="button"
                    onClick={() => setSelectedUrl(video.url)}
                    className={`w-full overflow-hidden rounded-md border text-left transition ${
                      active
                        ? "border-gold ring-2 ring-gold/40"
                        : "border-border hover:border-gold/60"
                    }`}
                    aria-pressed={active}
                    aria-label={`Pick ${video.handleGuess}`}
                  >
                    <span className="relative block aspect-video bg-black">
                      <video
                        src={`${video.url}#t=0.5`}
                        muted
                        playsInline
                        preload="metadata"
                        tabIndex={-1}
                        className="pointer-events-none h-full w-full object-cover"
                      />
                    </span>
                    <span className="block truncate px-2 py-1.5 text-xs">
                      {video.handleGuess}
                    </span>
                    <span className="block truncate px-2 pb-2 text-[10px] text-muted">
                      {assigned ? assigned.title : "Not assigned"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {pageCount > 1 ? (
          <div className="mt-4 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <p className="text-xs text-muted">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, visible.length)} of {visible.length}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= pageCount}
            >
              Next
            </Button>
          </div>
        ) : null}

        {selected ? (
          <section className="mt-8 grid gap-4 border border-border bg-surface p-4 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            <video
              key={selected.url}
              src={selected.url}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full bg-black object-contain"
            />
            <div className="min-w-0">
              <p className="truncate font-medium">{selected.handleGuess}</p>
              <p className="mt-1 truncate text-xs text-muted">{selected.pathname}</p>
              <p className="mt-2 text-xs text-muted">
                {productByUrl.get(selected.url)
                  ? `Currently on ${productByUrl.get(selected.url)?.title}`
                  : "Not assigned to a product"}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <select
                  value={picks[selected.url] || ""}
                  onChange={(e) =>
                    setPicks((current) => ({ ...current, [selected.url]: e.target.value }))
                  }
                  className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/40 focus:ring-2"
                  aria-label={`Product for ${selected.handleGuess}`}
                >
                  <option value="">Choose product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title} ({product.handle})
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => assign(selected)}
                  disabled={saving || !picks[selected.url]}
                >
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
