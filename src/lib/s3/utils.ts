import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

export const uploadImageToCloudflareR2 = async (
  image: File,
  folder: string = "uploads"
) => {
  const buffer = Buffer.from(await image.arrayBuffer());
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `${folder}/${Date.now()}-${crypto.randomUUID()}-${image.name}`,
    Body: buffer,
    ContentType: image.type,
  });

  const response = await s3.send(command);

  return {
    key: command.input.Key,
    response,
  };
};

export const getImageUrl = (key: string) => {
  return `${process.env.NEXT_PUBLIC_R2_URL}/${key}`;
};
