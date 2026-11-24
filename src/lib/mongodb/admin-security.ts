import { getDb } from "@/lib/mongodb/client";

const SETTINGS_KEY = "admin-security";

export type AdminSecuritySettings = {
  /** When true, every admin login must use MFA regardless of personal toggle */
  mfaRequired: boolean;
  updatedAt: string | null;
};

function defaultMfaRequired(): boolean {
  return process.env.NODE_ENV === "production";
}

export async function getAdminSecuritySettings(): Promise<AdminSecuritySettings> {
  try {
    const db = await getDb();
    if (!db) {
      return { mfaRequired: defaultMfaRequired(), updatedAt: null };
    }

    const doc = await db.collection("site_settings").findOne({ key: SETTINGS_KEY });
    if (!doc) {
      return { mfaRequired: defaultMfaRequired(), updatedAt: null };
    }

    // Prefer mfaRequired; migrate legacy mfaEnabled → mfaRequired
    let mfaRequired: boolean;
    if (typeof doc.mfaRequired === "boolean") {
      mfaRequired = doc.mfaRequired;
    } else if (typeof doc.mfaEnabled === "boolean") {
      mfaRequired = doc.mfaEnabled;
      await db.collection("site_settings").updateOne(
        { key: SETTINGS_KEY },
        {
          $set: {
            mfaRequired: doc.mfaEnabled,
            updatedAt: new Date().toISOString(),
          },
        },
      );
    } else {
      mfaRequired = defaultMfaRequired();
    }

    return {
      mfaRequired,
      updatedAt: typeof doc.updatedAt === "string" ? doc.updatedAt : null,
    };
  } catch {
    return { mfaRequired: defaultMfaRequired(), updatedAt: null };
  }
}

export async function saveAdminSecuritySettings(input: {
  mfaRequired: boolean;
}): Promise<AdminSecuritySettings | null> {
  const db = await getDb();
  if (!db) return null;

  const updatedAt = new Date().toISOString();
  const mfaRequired = Boolean(input.mfaRequired);

  await db.collection("site_settings").updateOne(
    { key: SETTINGS_KEY },
    {
      $set: {
        key: SETTINGS_KEY,
        mfaRequired,
        // Keep legacy field in sync for older readers
        mfaEnabled: mfaRequired,
        updatedAt,
      },
    },
    { upsert: true },
  );

  return { mfaRequired, updatedAt };
}
