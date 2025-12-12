/**
 * Server-only image upload utilities
 * This file contains Node.js dependencies (sharp) and must not be imported in client code
 */
import { s3 } from "@/lib/s3";
import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import crypto from "crypto";
import sharp from "sharp";

/** WebP conversion quality (0-100) */
const WEBP_QUALITY = 80;

/** Result of uploading an image to R2 */
type UploadResult = {
  key: string | undefined;
  response: PutObjectCommandOutput;
};

/**
 * Convert image buffer to WebP format
 * @param buffer - Original image buffer
 * @returns WebP buffer
 * @throws Error if conversion fails (e.g., corrupted or unsupported format)
 */
const convertToWebP = async (buffer: Buffer): Promise<Buffer> => {
  try {
    return await sharp(buffer).webp({ quality: WEBP_QUALITY }).toBuffer();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to convert image to WebP: ${message}`);
  }
};

/**
 * Generate a unique filename with .webp extension
 */
const generateWebPFilename = (originalName: string): string => {
  // Remove original extension and add .webp
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  return `${Date.now()}-${crypto.randomUUID()}-${baseName}.webp`;
};

/**
 * Upload an image to Cloudflare R2
 * Automatically converts to WebP format for optimization
 * @param image - File to upload
 * @param folder - Folder path in R2 bucket (default: "uploads")
 * @returns Upload result with key and response
 */
export const uploadImageToCloudflareR2 = async (
  image: File,
  folder: string = "uploads"
): Promise<UploadResult> => {
  const originalBuffer = Buffer.from(await image.arrayBuffer());

  // Convert to WebP for optimization
  const webpBuffer = await convertToWebP(originalBuffer);
  const webpFilename = generateWebPFilename(image.name);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `${folder}/${webpFilename}`,
    Body: webpBuffer,
    ContentType: "image/webp",
  });

  const response = await s3.send(command);

  return {
    key: command.input.Key,
    response,
  };
};
