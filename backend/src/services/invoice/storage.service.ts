import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '../../config/env.js';

const s3 = new S3Client({ region: env.AWS_REGION });

export async function storeInvoiceFile(buffer: Buffer, originalName: string, contentType: string) {
  const safe = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `${env.S3_PREFIX}/${Date.now()}-${safe}`;
  if (env.S3_ENABLED && env.S3_BUCKET) {
    await s3.send(new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, Body: buffer, ContentType: contentType, ServerSideEncryption: 'AES256' }));
    return { storage: 's3', uri: `s3://${env.S3_BUCKET}/${key}` };
  }
  const dir = path.resolve(env.LOCAL_UPLOAD_DIR);
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${Date.now()}-${safe}`);
  await writeFile(file, buffer);
  return { storage: 'local', uri: file };
}
