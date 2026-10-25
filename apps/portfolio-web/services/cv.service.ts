import fs from "fs";
import path from "path";
import { connectDatabase } from "@/config/database";
import { CvModel, ICvDocument } from "@/models";

export interface CvItemMeta {
  id: string;
  filename: string;
  originalName: string;
  filePath: string;
  url: string;
  size: number;
  mimeType: string;
  isActive: boolean;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
  downloadUrl: string;
}

export class CvService {
  private static getAllStorageDirs(): string[] {
    const dirs = [
      path.join(process.cwd(), "apps", "portfolio-web", "public", "cv"),
      path.join(process.cwd(), "public", "cv"),
    ];
    return dirs.filter((d) => fs.existsSync(/*turbopackIgnore: true*/ d));
  }

  private static getCvStorageDir(): string {
    const monorepoDir = path.join(process.cwd(), "apps", "portfolio-web", "public", "cv");
    const directDir = path.join(process.cwd(), "public", "cv");

    let dir = directDir;
    if (fs.existsSync(/*turbopackIgnore: true*/ path.join(process.cwd(), "apps", "portfolio-web", "public"))) {
      dir = monorepoDir;
    }

    if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  /**
   * Generates a unique, executive filename for every CV upload so files never overwrite each other.
   */
  public static generateExecutiveFilename(originalName: string): string {
    const ext = path.extname(originalName) || ".pdf";
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `Keshab-Bhatt-CV-${timestamp}-${randomSuffix}${ext}`;
  }

  /**
   * Cleans up old, stale, or evicted CV files from the server filesystem
   * so server storage never accumulates unnecessary files.
   */
  public static cleanupServerStorage(retainedFilenames: string[]): void {
    const dirs = this.getAllStorageDirs();
    const protectedFiles = new Set([
      "keshabbhatt.com.np.pdf",
      "keshab-bhatt-cv.pdf",
      "keshab-datt-bhatt-cv.pdf",
      ...retainedFilenames.filter(Boolean),
    ]);

    for (const dir of dirs) {
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.toLowerCase().endsWith(".pdf") && !protectedFiles.has(file)) {
            try {
              const fullPath = path.join(dir, file);
              fs.unlinkSync(fullPath);
              console.log(`Cleaned old CV from server disk: ${file}`);
            } catch (unlinkErr) {
              console.warn(`Failed to unlink old CV file (${file}):`, unlinkErr);
            }
          }
        }
      } catch (err) {
        console.warn(`Error reading directory (${dir}) for storage cleanup:`, err);
      }
    }
  }

  /**
   * Syncs the active file content to the public master aliases (keshabbhatt.com.np.pdf and keshab-bhatt-cv.pdf)
   * so visitor downloads directly from static URLs or API routes receive the active CV.
   */
  private static syncActiveToPublicMaster(sourceBuffer: Buffer, storageDir: string): void {
    const publicAliases = [
      path.join(storageDir, "keshabbhatt.com.np.pdf"),
      path.join(storageDir, "keshab-bhatt-cv.pdf"),
      path.join(storageDir, "keshab-datt-bhatt-cv.pdf"),
    ];

    for (const aliasPath of publicAliases) {
      try {
        fs.writeFileSync(aliasPath, sourceBuffer);
      } catch (err) {
        console.warn(`Failed to sync active CV to public alias (${aliasPath}):`, err);
      }
    }
  }

  /**
   * Retrieves the current active CV for public download directly from physical server file.
   */
  public static async getActiveCv(): Promise<{
    filename: string;
    mimeType: string;
    buffer: Buffer;
  } | null> {
    const storageDir = this.getCvStorageDir();

    try {
      await connectDatabase();

      // 1. Look up active CV record in MongoDB
      let active = (await CvModel.findOne({ isActive: true }).lean()) as ICvDocument | null;
      if (!active) {
        // Fallback to latest CV record
        active = (await CvModel.findOne().sort({ createdAt: -1 }).lean()) as ICvDocument | null;
      }

      if (active && active.filename) {
        const physicalPath = path.join(storageDir, active.filename);
        if (fs.existsSync(physicalPath)) {
          const buffer = fs.readFileSync(physicalPath);
          return {
            filename: active.originalName || active.filename,
            mimeType: active.mimeType || "application/pdf",
            buffer,
          };
        }
      }
    } catch (err) {
      console.warn("CvService.getActiveCv: database query failed, using physical disk fallback:", err);
    }

    // Physical disk fallbacks
    const candidateFiles = [
      "default-system-cv.pdf",
      "keshabbhatt.com.np.pdf",
      "keshab-bhatt-cv.pdf",
      "keshab-datt-bhatt-cv.pdf",
    ];

    for (const fname of candidateFiles) {
      const fullPath = path.join(/*turbopackIgnore: true*/ storageDir, fname);
      if (fs.existsSync(/*turbopackIgnore: true*/ fullPath)) {
        return {
          filename: "Keshab-Datt-Bhatt-Executive-CV.pdf",
          mimeType: "application/pdf",
          buffer: fs.readFileSync(/*turbopackIgnore: true*/ fullPath),
        };
      }
    }

    return null;
  }

  /**
   * Retrieves all CV records in the queue (maximum 2 kept in system).
   */
  public static async getAllCvs(): Promise<CvItemMeta[]> {
    try {
      await connectDatabase();

      const docs = await CvModel.find()
        .sort({ createdAt: -1 })
        .limit(2);

      return docs.map((doc) => ({
        id: doc._id.toString(),
        filename: doc.filename,
        originalName: doc.originalName,
        filePath: doc.filePath,
        url: doc.url,
        size: doc.size,
        mimeType: doc.mimeType,
        isActive: doc.isActive,
        uploadedBy: doc.uploadedBy,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
        downloadUrl: `/api/cv/${doc._id.toString()}`,
      }));
    } catch (err) {
      console.error("CvService.getAllCvs failed:", err);
      return [];
    }
  }

  /**
   * Uploads a new CV PDF with strict FIFO Queue (Max Size = 2):
   * 1. If 2 CVs already exist, deletes the oldest CV completely (unlinks from disk and deletes from MongoDB).
   * 2. Saves the new CV to its own unique physical file (never overwrites the remaining older CV).
   * 3. Sets the new CV as active and syncs its content to public download aliases.
   * 4. Retains exactly the 2 distinct versions, with the new one active.
   */
  public static async uploadCv(
    file: {
      buffer: Buffer;
      originalname: string;
      size: number;
      mimetype: string;
    },
    uploadedBy: string = "Admin"
  ): Promise<CvItemMeta> {
    await connectDatabase();

    const storageDir = this.getCvStorageDir();

    // --- FIFO QUEUE (MAX SIZE = 2) ---
    // Fetch all existing CVs ordered oldest to newest
    const existingCvs = await CvModel.find().sort({ createdAt: 1 });

    // If queue is at capacity (>= 2), delete oldest until space for 1 new item remains
    if (existingCvs.length >= 2) {
      const numToDelete = existingCvs.length - 1; // Leaves exactly 1, so adding 1 gives exactly 2
      const toDelete = existingCvs.slice(0, numToDelete);

      for (const oldDoc of toDelete) {
        // Delete physical file from disk (avoid unlinking static alias files)
        if (
          oldDoc.filename &&
          oldDoc.filename !== "keshabbhatt.com.np.pdf" &&
          oldDoc.filename !== "keshab-bhatt-cv.pdf"
        ) {
          const physicalPath = path.join(storageDir, oldDoc.filename);
          if (fs.existsSync(physicalPath)) {
            try {
              fs.unlinkSync(physicalPath);
            } catch (unlinkErr) {
              console.warn(`Failed to unlink old CV file (${physicalPath}):`, unlinkErr);
            }
          }
        }

        // Delete from MongoDB
        await CvModel.findByIdAndDelete(oldDoc._id);
      }
    }

    // 1. Generate unique file name and save to disk
    const cleanFilename = this.generateExecutiveFilename(file.originalname);
    const physicalPath = path.join(storageDir, cleanFilename);
    const relativeFilePath = `public/cv/${cleanFilename}`;
    const publicUrl = `/cv/${cleanFilename}`;

    fs.writeFileSync(physicalPath, file.buffer);

    // 2. Mark any remaining CV as inactive
    await CvModel.updateMany({}, { $set: { isActive: false } });

    // 3. Save new CV in MongoDB as active
    const newCv = new CvModel({
      filename: cleanFilename,
      originalName: file.originalname,
      filePath: relativeFilePath,
      url: publicUrl,
      size: file.size,
      mimeType: file.mimetype || "application/pdf",
      isActive: true,
      uploadedBy,
    });
    await newCv.save();

    // 4. Sync new active CV to public download aliases
    this.syncActiveToPublicMaster(file.buffer, storageDir);

    // 5. Sweep server storage: permanently delete any old or orphaned CV files from server disk
    const retainedDocs = await CvModel.find();
    this.cleanupServerStorage(retainedDocs.map((d) => d.filename));

    return {
      id: newCv._id.toString(),
      filename: newCv.filename,
      originalName: newCv.originalName,
      filePath: newCv.filePath,
      url: newCv.url,
      size: newCv.size,
      mimeType: newCv.mimeType,
      isActive: newCv.isActive,
      uploadedBy: newCv.uploadedBy,
      createdAt: newCv.createdAt.toISOString(),
      updatedAt: newCv.updatedAt.toISOString(),
      downloadUrl: `/api/cv/${newCv._id.toString()}`,
    };
  }

  /**
   * Sets a specific CV as active.
   * Updates database flag and syncs its physical file to the public download aliases.
   */
  public static async setActiveCv(id: string): Promise<boolean> {
    await connectDatabase();

    const target = await CvModel.findById(id);
    if (!target) return false;

    // Set all to inactive and activate target
    await CvModel.updateMany({}, { $set: { isActive: false } });
    target.isActive = true;
    await target.save();

    // Copy target's physical file to public master aliases
    const storageDir = this.getCvStorageDir();
    const sourcePath = path.join(storageDir, target.filename);
    if (fs.existsSync(sourcePath)) {
      const targetBuffer = fs.readFileSync(sourcePath);
      this.syncActiveToPublicMaster(targetBuffer, storageDir);
    }

    return true;
  }

  /**
   * Deletes a CV by ID.
   * Removes physical file from server directory and removes record from MongoDB.
   */
  public static async deleteCv(id: string): Promise<boolean> {
    await connectDatabase();

    const doc = await CvModel.findById(id);
    if (!doc) return false;

    const wasActive = doc.isActive;
    const filename = doc.filename;

    // Remove record from MongoDB
    await CvModel.findByIdAndDelete(id);

    // Remove physical file from disk
    const storageDir = this.getCvStorageDir();
    if (
      filename &&
      filename !== "keshabbhatt.com.np.pdf" &&
      filename !== "keshab-bhatt-cv.pdf"
    ) {
      const physicalPath = path.join(storageDir, filename);
      if (fs.existsSync(physicalPath)) {
        try {
          fs.unlinkSync(physicalPath);
        } catch (err) {
          console.warn("Failed to delete physical file:", err);
        }
      }
    }

    // If the active CV was deleted, activate the remaining document in the queue
    if (wasActive) {
      const remaining = await CvModel.findOne().sort({ createdAt: -1 });
      if (remaining) {
        remaining.isActive = true;
        await remaining.save();

        const remainingPath = path.join(storageDir, remaining.filename);
        if (fs.existsSync(remainingPath)) {
          const remainingBuffer = fs.readFileSync(remainingPath);
          this.syncActiveToPublicMaster(remainingBuffer, storageDir);
        }
      }
    }

    // Sweep server storage
    const allRemaining = await CvModel.find();
    this.cleanupServerStorage(allRemaining.map((d) => d.filename));

    return true;
  }

  /**
   * Retrieves a specific CV by ID with its binary data read from its own physical disk file.
   */
  public static async getCvById(id: string): Promise<{
    filename: string;
    mimeType: string;
    buffer: Buffer;
  } | null> {
    await connectDatabase();

    const doc = await CvModel.findById(id);
    if (!doc) return null;

    const storageDir = this.getCvStorageDir();
    const physicalPath = path.join(storageDir, doc.filename);

    if (fs.existsSync(physicalPath)) {
      return {
        filename: doc.originalName || doc.filename,
        mimeType: doc.mimeType || "application/pdf",
        buffer: fs.readFileSync(physicalPath),
      };
    }

    return null;
  }
}

export default CvService;

