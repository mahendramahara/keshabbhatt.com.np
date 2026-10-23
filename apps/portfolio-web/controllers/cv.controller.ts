import { NextRequest } from "next/server";
import { CvService } from "@/services";
import { getAuthenticatedAdmin } from "@/lib/auth";
import {
  apiSuccess,
  apiBadRequest,
  apiNotFound,
  apiInternalError,
} from "@/utils";

export class CvController {
  public static async listCvs() {
    try {
      const cvs = await CvService.getAllCvs();
      return apiSuccess(cvs, "CV documents retrieved successfully.");
    } catch (err) {
      console.error("CvController.listCvs error:", err);
      return apiInternalError("Failed to retrieve CV documents.");
    }
  }

  public static async uploadCv(request: NextRequest) {
    try {
      const auth = getAuthenticatedAdmin(request);
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return apiBadRequest("No file uploaded. Please select a valid PDF file.");
      }

      // Validate PDF MIME type or extension
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        return apiBadRequest(
          "Invalid file format. Only PDF (.pdf) documents are accepted for CV uploads."
        );
      }

      // 15MB max file size check
      const maxSizeBytes = 15 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return apiBadRequest(
          "File size exceeds 15MB. Please upload an optimized PDF document."
        );
      }

      // Convert file stream to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadedCv = await CvService.uploadCv(
        {
          buffer,
          originalname: file.name,
          size: file.size,
          mimetype: file.type || "application/pdf",
        },
        auth?.username || "Admin"
      );

      return apiSuccess(
        uploadedCv,
        "New executive CV successfully uploaded and set as active.",
        201
      );
    } catch (err) {
      console.error("CvController.uploadCv error:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      return apiInternalError(`Failed to upload and process CV file: ${errMsg}`);
    }
  }

  public static async setActive(_request: NextRequest, id: string) {
    try {
      if (!id) {
        return apiBadRequest("CV ID is required.");
      }

      const success = await CvService.setActiveCv(id);
      if (!success) {
        return apiNotFound("CV document not found.");
      }

      return apiSuccess(null, "CV successfully set as active public document.");
    } catch (err) {
      console.error("CvController.setActive error:", err);
      return apiInternalError("Failed to set active CV.");
    }
  }

  public static async deleteCv(_request: NextRequest, id: string) {
    try {
      if (!id) {
        return apiBadRequest("CV ID is required.");
      }

      const success = await CvService.deleteCv(id);
      if (!success) {
        return apiNotFound("CV document not found.");
      }

      return apiSuccess(null, "CV successfully removed.");
    } catch (err) {
      console.error("CvController.deleteCv error:", err);
      return apiInternalError("Failed to delete CV.");
    }
  }
}

export default CvController;
