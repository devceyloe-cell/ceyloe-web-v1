import { GridFSBucket, ObjectId, type GridFSFile } from "mongodb";
import { getDb } from "@/lib/mongodb/client";

const BUCKET = "cms_uploads";

async function getBucket() {
  const db = await getDb();
  if (!db) return null;
  return new GridFSBucket(db, { bucketName: BUCKET });
}

export async function saveUpload(params: {
  filename: string;
  contentType: string;
  bytes: Buffer;
  originalName?: string;
}): Promise<{ id: string; url: string } | null> {
  const bucket = await getBucket();
  if (!bucket) return null;

  const id = new ObjectId();
  await new Promise<void>((resolve, reject) => {
    const stream = bucket.openUploadStreamWithId(id, params.filename, {
      metadata: {
        originalName: params.originalName || params.filename,
        contentType: params.contentType,
      },
    });
    stream.on("error", reject);
    stream.on("finish", () => resolve());
    stream.end(params.bytes);
  });

  return { id: id.toString(), url: `/api/uploads/${id.toString()}` };
}

export async function getUpload(
  id: string,
): Promise<{ file: GridFSFile; stream: NodeJS.ReadableStream } | null> {
  if (!ObjectId.isValid(id)) return null;

  const bucket = await getBucket();
  if (!bucket) return null;

  const objectId = new ObjectId(id);
  const files = await bucket.find({ _id: objectId }).limit(1).toArray();
  const file = files[0];
  if (!file) return null;

  return {
    file,
    stream: bucket.openDownloadStream(objectId),
  };
}
