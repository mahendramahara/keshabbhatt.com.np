import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICvDocument extends Document {
  filename: string;
  originalName: string;
  filePath: string;
  url: string;
  mimeType: string;
  size: number;
  isActive: boolean;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CvSchema = new Schema<ICvDocument>(
  {
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, "Original filename is required"],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, "Server file path is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Public URL is required"],
      trim: true,
    },
    mimeType: {
      type: String,
      default: "application/pdf",
      trim: true,
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
    },
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
    uploadedBy: {
      type: String,
      default: "Superadmin",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.id = ret._id ? ret._id.toString() : "";
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

CvSchema.index({ createdAt: -1 });

// Ensure any stale cached model in HMR dev server memory is purged
if (mongoose.models && mongoose.models.CvDocument) {
  delete mongoose.models.CvDocument;
}

export const CvModel: Model<ICvDocument> =
  (mongoose.models.CvDocument as Model<ICvDocument>) ||
  mongoose.model<ICvDocument>("CvDocument", CvSchema);

export default CvModel;
