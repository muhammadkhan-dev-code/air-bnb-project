import multer from "multer";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ApiError } from "../utils/ApiError.js";
const directory = fileURLToPath(new URL("../../uploads/", import.meta.url));
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 8, fieldSize: 20000 },
  fileFilter(req, file, callback) {
    callback(
      ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)
        ? null
        : new ApiError(400, "Choose a JPG, PNG, or WebP image."),
      true,
    );
  },
});
function cloudConfigured() {
  return Boolean(
    process.env.CLOUD_NAME &&
    process.env.CLOUD_API_KEY &&
    process.env.CLOUD_API_SECRET,
  );
}
export async function storeImage(file) {
  let buffer;
  try {
    buffer = await sharp(file.buffer, { limitInputPixels: 40000000 })
      .rotate()
      .resize({
        width: 1800,
        height: 1800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    throw new ApiError(400, "That file is not a supported, valid image.");
  }
  if (cloudConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "airbnb", resource_type: "image" },
          (error, value) => (error ? reject(error) : resolve(value)),
        )
        .end(buffer);
    });
    return {
      url: result.secure_url,
      filename: result.public_id,
      provider: "cloudinary",
    };
  }
  await mkdir(directory, { recursive: true });
  const filename = `${randomUUID()}.webp`;
  await writeFile(path.join(directory, filename), buffer);
  return { url: `/uploads/${filename}`, filename, provider: "local" };
}
export async function removeImage(image) {
  if (cloudConfigured())
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  if (!image) return;
  try {
    if (image.provider === "local" && /^[a-f0-9-]+\.webp$/.test(image.filename))
      await unlink(path.join(directory, image.filename));
    if (image.provider === "cloudinary" && cloudConfigured())
      await cloudinary.uploader.destroy(image.filename);
  } catch {
    console.warn("An unused image could not be removed; retry cleanup later.");
  }
}
