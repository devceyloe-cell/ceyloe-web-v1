import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? "ceyloe";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/** Reuse one client across warm serverless invocations (dev + production). */
function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null;

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }

  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db | null> {
  const promise = getClientPromise();
  if (!promise) return null;
  try {
    const client = await promise;
    return client.db(dbName);
  } catch (err) {
    // Connection failed (e.g. DNS error during SSG build or missing env var).
    // Return null so all callers fall back to their default data gracefully.
    console.warn(
      "[mongodb] Connection failed, returning null:",
      err instanceof Error ? err.message : err,
    );
    // Reset so the next warm invocation can retry.
    global._mongoClientPromise = undefined;
    return null;
  }
}
