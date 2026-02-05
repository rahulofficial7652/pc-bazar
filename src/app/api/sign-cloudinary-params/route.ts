import { v2 as cloudinary } from "cloudinary";
import { handleRouteError, ValidationError, InternalServerError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    // Parse input
    const body = await request.json();
    const { paramsToSign } = body;

    // Validate input
    if (!paramsToSign) {
      throw new ValidationError("Parameters to sign are required");
    }

    // Check environment variable
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new InternalServerError("Cloudinary configuration missing", {
        configMissing: "CLOUDINARY_API_SECRET",
      });
    }

    // Sign params
    try {
      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        process.env.CLOUDINARY_API_SECRET
      );

      return Response.json({ signature }, { status: 200 });
    } catch (cloudinaryError) {
      throw new InternalServerError("Failed to sign Cloudinary parameters", {
        originalError: cloudinaryError,
      });
    }
  } catch (error) {
    return handleRouteError(error, "POST /api/sign-cloudinary-params");
  }
}
