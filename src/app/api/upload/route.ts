import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { badRequest, ok, unauthorized } from "@/lib/api-response";
import { requireAdmin } from "@/lib/authz";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function saveLocalImage(file: File, bytes: Buffer) {
  const extension = IMAGE_TYPES[file.type];
  if (!extension) return null;

  const fileName = `${randomUUID()}.${extension}`;
  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, fileName), bytes);

  return {
    secure_url: `/uploads/${fileName}`,
  };
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return badRequest("Missing image file.");
  }

  if (!IMAGE_TYPES[file.type]) {
    return badRequest("Upload a JPG, PNG, WebP, or GIF image file.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const hasCloudinaryConfig = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

  if (!hasCloudinaryConfig) {
    const localUpload = await saveLocalImage(file, bytes);
    return ok(localUpload);
  }

  try {
    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "rodina-naturals" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(bytes);
    });
    return ok(uploaded);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Cloudinary upload failed:", message);
    return badRequest(`Cloudinary upload failed: ${message}`);
  }
}
