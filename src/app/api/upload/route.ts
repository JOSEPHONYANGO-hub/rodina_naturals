import { v2 as cloudinary } from "cloudinary";
import { badRequest, ok, unauthorized } from "@/lib/api-response";
import { requireAdmin } from "@/lib/authz";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return badRequest("Missing image file.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploaded = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "rodina-naturals" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(bytes);
  });

  return ok(uploaded);
}
