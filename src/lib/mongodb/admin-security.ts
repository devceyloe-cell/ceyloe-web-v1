import { getDb } from "@/lib/mongodb/client";

const SETTINGS_KEY = "admin-security";

export type AdminSecuritySettings = {
  /** When true, password login must be followed by email OTP */
  mfaEnabled: boolean;
  updatedAt: string | null;
};

function defaultMfaEnabled(): boolean {
  return process.env.NODE_ENV === "production";
}

export async function getAdminSecuritySettings(): Promise<AdminSecuritySettings> {
  try {
    const db = await getDb();
    if (!db) {
      return { mfaEnabled: defaultMfaEnabled(), updatedAt: null };
    }

    const doc = await db.collection("site_settings").findOne({ key: SETTINGS_KEY });
    if (!doc || typeof doc.mfaEnabled !== "boolean") {
      return { mfaEnabled: defaultMfaEnabled(), updatedAt: null };
    }

    return {
      mfaEnabled: doc.mfaEnabled,
      updatedAt: typeof doc.updatedAt === "string" ? doc.updatedAt : null,
    };
  } catch {
    return { mfaEnabled: defaultMfaEnabled(), updatedAt: null };
  }
}

export async function saveAdminSecuritySettings(input: {
  mfaEnabled: boolean;
}): Promise<AdminSecuritySettings | null> {
  const db = await getDb();
  if (!db) return null;

  const updatedAt = new Date().toISOString();
  const mfaEnabled = Boolean(input.mfaEnabled);

  await db.collection("site_settings").updateOne(
    { key: SETTINGS_KEY },
    {
      $set: {
        key: SETTINGS_KEY,
        mfaEnabled,
        updatedAt,
      },
    },
    { upsert: true },
  );

  return { mfaEnabled, updatedAt };
}
