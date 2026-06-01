export type SectionType = "hero" | "text" | "image" | "textImage";

export interface CmsSection {
  id: string;
  type: SectionType;
  heading?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
}

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  description?: string;
  published: boolean;
  sections: CmsSection[];
  createdAt: string;
  updatedAt: string;
}

export interface CmsStore {
  pages: CmsPage[];
}

export const emptySection = (type: SectionType = "text"): CmsSection => ({
  id: crypto.randomUUID(),
  type,
  heading: "",
  body: "",
  image: "",
  imageAlt: "",
  imagePosition: "right",
});

export const emptyPage = (): Omit<CmsPage, "id" | "createdAt" | "updatedAt"> => ({
  slug: "",
  title: "",
  description: "",
  published: false,
  sections: [emptySection("hero")],
});
