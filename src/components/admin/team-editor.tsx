"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Plus,
  Save,
  Trash2,
  Users,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import type { AboutTeamMember } from "@/data/about-content";
import { DEFAULT_ABOUT_TEAM, type AboutTeamSection } from "@/lib/about/team";

function newMember(): AboutTeamMember {
  return {
    id: crypto.randomUUID(),
    name: "",
    role: "",
    bio: "",
    image: "",
    objectPosition: "center center",
  };
}

interface TeamEditorProps {
  initial: AboutTeamSection;
  mongoConfigured: boolean;
}

export function TeamEditor({ initial, mongoConfigured }: TeamEditorProps) {
  const router = useRouter();
  const [section, setSection] = useState<AboutTeamSection>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateMember(index: number, patch: Partial<AboutTeamMember>) {
    setSection((s) => ({
      ...s,
      members: s.members.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function moveMember(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= section.members.length) return;
    setSection((s) => {
      const members = [...s.members];
      const [row] = members.splice(index, 1);
      members.splice(next, 0, row);
      return { ...s, members };
    });
  }

  function removeMember(index: number) {
    if (!confirm("Remove this team member?")) return;
    setSection((s) => ({
      ...s,
      members: s.members.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/admin/about-team", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(section),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setSection(data.section);
      setMessage("Saved. Our Team on /about is updated.");
      router.refresh();
    } else {
      setError(data.error || "Save failed");
    }
    setSaving(false);
  }

  function resetDefaults() {
    if (!confirm("Reset to the default team members?")) return;
    setSection({
      ...DEFAULT_ABOUT_TEAM,
      members: DEFAULT_ABOUT_TEAM.members.map((m) => ({ ...m })),
    });
  }

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/30 focus:border-gold focus:ring-2";
  const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-muted";

  return (
    <>
      <AdminHeader title="Our Team" />
      <div className="mx-auto max-w-4xl px-4 py-8 pb-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">About page</p>
            <h1 className="mt-1 font-display text-3xl font-light tracking-tight">Our Team</h1>
            <p className="mt-1 text-sm text-muted">
              Photos, names, roles, and bios shown on /about
            </p>
          </div>
          <a
            href="/about#team-heading"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-gold"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on site
          </a>
        </div>

        {!mongoConfigured ? (
          <div className="mb-6 border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            Set <code className="text-foreground">MONGODB_URI</code> to save team changes.
          </div>
        ) : null}

        <section className="mb-6 border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
            Section text
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => setSection((s) => ({ ...s, title: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Intro</label>
              <textarea
                value={section.intro}
                onChange={(e) => setSection((s) => ({ ...s, intro: e.target.value }))}
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
            Members ({section.members.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={resetDefaults}>
              Reset defaults
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-1.5"
              onClick={() =>
                setSection((s) => ({ ...s, members: [...s.members, newMember()] }))
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Add member
            </Button>
          </div>
        </div>

        {section.members.length === 0 ? (
          <div className="border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
            <Users className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 text-sm text-muted">No team members yet.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {section.members.map((member, index) => (
              <li key={member.id} className="border border-border bg-surface p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {member.name || `Member ${index + 1}`}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="Move up"
                      onClick={() => moveMember(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="Move down"
                      onClick={() => moveMember(index, 1)}
                      disabled={index === section.members.length - 1}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-400"
                      onClick={() => removeMember(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-[160px_1fr]">
                  <div className="relative mx-auto aspect-square w-full max-w-[160px] overflow-hidden border border-border bg-background">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name || "Preview"}
                        fill
                        className="object-cover"
                        style={{ objectPosition: member.objectPosition || "center center" }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted">
                        No photo
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Name</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateMember(index, { name: e.target.value })}
                          className={inputClass}
                          placeholder="Ireka"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Role</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateMember(index, { role: e.target.value })}
                          className={inputClass}
                          placeholder="Founder & Gemstone Specialist"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Bio</label>
                      <textarea
                        value={member.bio}
                        onChange={(e) => updateMember(index, { bio: e.target.value })}
                        rows={3}
                        className={inputClass}
                      />
                    </div>
                    <ImageUploadField
                      label="Photo"
                      value={member.image}
                      onChange={(url) => updateMember(index, { image: url })}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="text-sm text-muted hover:text-gold">
            Back to dashboard
          </Link>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={saving || !mongoConfigured}
            className="inline-flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving…" : "Save team"}
          </Button>
        </div>
      </div>
    </>
  );
}
