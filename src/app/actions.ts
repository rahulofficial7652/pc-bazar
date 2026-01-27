"use server";

import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData) {
  const file = formData.get('image') as File;
  
  if (!file) throw new Error("No file uploaded");

  // File ko buffer mein convert karna
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Cloudinary par upload karna (With Type Safety and Compression)
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        folder: 'pc-bazar-products',
        // Compression settings jo humne discuss ki thi
        transformation: [
          { width: 1200, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
      }, 
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Upload failed: No result from Cloudinary"));
        }
        resolve(result);
      }
    ).end(buffer);
  });

  return { url: result.secure_url }; // Image ka URL return karna
}