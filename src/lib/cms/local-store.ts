import { promises as fs } from "fs";
import type { CmsPage, CmsStore } from "./types";
import { CMS_DATA_DIR, CMS_PAGES_FILE } from "./paths";

async function ensureStore(): Promise<CmsStore> {
  try {
    await fs.mkdir(CMS_DATA_DIR, { recursive: true });
    const raw = await fs.readFile(CMS_PAGES_FILE, "utf-8");
    return JSON.parse(raw) as CmsStore;
  } catch {
    const empty: CmsStore = { pages: [] };
    await fs.writeFile(CMS_PAGES_FILE, JSON.stringify(empty, null, 2), "utf-8");
    return empty;
  }
}

async function writeStore(store: CmsStore) {
  await fs.mkdir(CMS_DATA_DIR, { recursive: true });
  await fs.writeFile(CMS_PAGES_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export async function getAllPages(includeDrafts = false): Promise<CmsPage[]> {
  const store = await ensureStore();
  return store.pages
    .filter((p) => includeDrafts || p.published)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  const store = await ensureStore();
  return store.pages.find((p) => p.slug === slug && p.published) ?? null;
}

export async function getPageById(id: string): Promise<CmsPage | null> {
  const store = await ensureStore();
  return store.pages.find((p) => p.id === id) ?? null;
}

export async function savePage(page: CmsPage): Promise<CmsPage> {
  const store = await ensureStore();
  const index = store.pages.findIndex((p) => p.id === page.id);
  const normalized = {
    ...page,
    slug: page.slug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    store.pages[index] = normalized;
  } else {
    store.pages.push(normalized);
  }

  await writeStore(store);
  return normalized;
}

export async function deletePage(id: string): Promise<boolean> {
  const store = await ensureStore();
  const before = store.pages.length;
  store.pages = store.pages.filter((p) => p.id !== id);
  if (store.pages.length === before) return false;
  await writeStore(store);
  return true;
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const store = await ensureStore();
  return store.pages.some((p) => p.slug === slug && p.id !== excludeId);
}
