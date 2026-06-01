import path from "path";

export const CMS_DATA_DIR = path.join(process.cwd(), "content", "cms");
export const CMS_PAGES_FILE = path.join(CMS_DATA_DIR, "pages.json");
export const CMS_UPLOADS_DIR = path.join(process.cwd(), "public", "cms-uploads");
