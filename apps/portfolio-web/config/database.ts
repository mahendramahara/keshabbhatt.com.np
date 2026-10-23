import mongoose from "mongoose";
import { Admin, BlogCategoryModel, BlogModel, CvModel, generateSlug } from "@/models";
import { getArticlesData } from "@keshab-bhatt/content";

declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

function resolveMongoUri(uri: string): string {
  if (uri && uri.startsWith("mongodb+srv://") && uri.includes("keshabbhatt-portfolio.wfwxft3.mongodb.net")) {
    const match = uri.match(/^mongodb\+srv:\/\/([^@]+)@keshabbhatt-portfolio\.wfwxft3\.mongodb\.net\/?([^?]*)(\?.*)?$/);
    if (match) {
      const auth = match[1];
      const db = match[2] || "portfolio_db";
      return `mongodb://${auth}@ac-rl0fktc-shard-00-00.wfwxft3.mongodb.net:27017,ac-rl0fktc-shard-00-01.wfwxft3.mongodb.net:27017,ac-rl0fktc-shard-00-02.wfwxft3.mongodb.net:27017/${db}?ssl=true&replicaSet=atlas-scw68d-shard-0&authSource=admin&retryWrites=true&w=majority`;
    }
  }
  return uri;
}

const RAW_MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/keshabbhatt_portfolio";

const MONGODB_URI = resolveMongoUri(RAW_MONGODB_URI);

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

/**
 * Automatically seeds the superadmin, categories, initial blogs (both EN & NE),
 * and the default CV record into MongoDB if not present.
 */
export async function seedInitialData() {
  try {
    // 1. Seed Super Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const superadminEmail = (
        process.env.SUPERADMIN_EMAIL || "admin@keshabbhatt.com.np"
      ).toLowerCase();
      const superadminUsername = (
        process.env.SUPERADMIN_USERNAME || "admin"
      ).toLowerCase();
      const superadminPassword =
        process.env.SUPERADMIN_PASSWORD || "AdminSecurePassword123!";
      const superadminName =
        process.env.SUPERADMIN_NAME || "Keshab Datt Bhatt";

      await Admin.create({
        name: superadminName,
        email: superadminEmail,
        username: superadminUsername,
        password: superadminPassword, // hashed via pre-save hook
        role: "superadmin",
        isActive: true,
      });

      console.log(`[Database Seed] Superadmin initialized: ${superadminUsername} (${superadminEmail})`);
    }

    // 2. Seed Default Categories (Both English & Nepali)
    const categoryCount = await BlogCategoryModel.countDocuments();
    const defaultCategories = [
      // English Categories
      { name: "Executive Profile & Leadership", slug: "executive-profile-leadership", description: "Biographical journey, fiduciary governance, professional philosophy, and economic vision", color: "#c98516", order: 1 },
      { name: "Accounting & Financial Reporting", slug: "accounting-financial-reporting", description: "Forensic accounting, NFRS/IFRS compliance, earnings quality, and audit architecture", color: "#0284c7", order: 2 },
      { name: "Banking & Financial Services", slug: "banking-financial-services", description: "Commercial banking operations, ALM, interest rate sensitivity, and NRB directives", color: "#1d4ed8", order: 3 },
      { name: "Capital Markets & Investment", slug: "capital-markets-investment", description: "Securities valuation, NEPSE market microstructure, liquidity depth, and book-building", color: "#b45309", order: 4 },
      { name: "Corporate Governance & Risk", slug: "corporate-governance-risk", description: "COSO internal controls, fraud prevention, board oversight, and ethical accountability", color: "#059669", order: 5 },
      { name: "Strategic Management & Valuation", slug: "strategic-management-valuation", description: "Discounted Cash Flow (DCF), WACC calibration, and economic moat appraisal", color: "#7c3aed", order: 6 },
      // Nepali Categories
      { name: "नेतृत्व तथा जीवनी परिचय", slug: "executive-profile-leadership-ne", description: "जीवनी, संस्थागत उत्तरदायित्व, नेतृत्व दर्शन तथा आर्थिक रूपान्तरणको दृष्टिकोण", color: "#c98516", order: 7 },
      { name: "लेखा तथा वित्तीय प्रतिवेदन", slug: "accounting-financial-reporting-ne", description: "फोरेन्सिक लेखापरीक्षण, एनएफआरएस ९ कार्यान्वयन, नाफाको गुणस्तर तथा वित्तीय सुशासन", color: "#0284c7", order: 8 },
      { name: "बैंकिङ तथा वित्तीय सेवा", slug: "banking-financial-services-ne", description: "वाणिज्य बैंकिङ, सम्पत्ति-दायित्व व्यवस्थापन, तरलता विश्लेषण तथा राष्ट्र बैंकका निर्देशनहरू", color: "#1d4ed8", order: 9 },
      { name: "पुँजी बजार तथा लगानी", slug: "capital-markets-investment-ne", description: "धितोपत्र मूल्यांकन, नेप्सेको बजार संरचना, संस्थागत लगानी तथा नीतिगत सुधार", color: "#b45309", order: 10 },
      { name: "संस्थागत सुशासन तथा जोखिम", slug: "corporate-governance-risk-ne", description: "आन्तरिक नियन्त्रण प्रणाली, संस्थागत जालसाजी रोकथाम तथा सञ्चालक समितिको उत्तरदायित्व", color: "#059669", order: 11 },
      { name: "रणनीतिक व्यवस्थापन तथा मूल्यांकन", slug: "strategic-management-valuation-ne", description: "छुट नगद प्रवाह (DCF), पुँजी लागत (WACC), र कम्पनीको आर्थिक सुरक्षा घेराको विश्लेषण", color: "#7c3aed", order: 12 },
    ];

    const categoryMap = new Map<string, string>(); // categoryName -> ObjectId string

    if (categoryCount === 0) {
      for (const cat of defaultCategories) {
        try {
          const created = await BlogCategoryModel.create(cat);
          categoryMap.set(created.name, created._id.toString());
        } catch {
          // In case of conflict, continue
        }
      }
      console.log(`[Database Seed] Default blog categories created.`);
    } else {
      const existing = await BlogCategoryModel.find();
      for (const cat of existing) {
        categoryMap.set(cat.name, cat._id.toString());
      }
    }

    // 3. Seed Initial Blogs from @keshab-bhatt/content if no blogs exist
    const blogCount = await BlogModel.countDocuments();
    if (blogCount === 0) {
      const enArticles = getArticlesData("en")?.items || [];
      const neArticles = getArticlesData("ne")?.items || [];

      // Fallback category id if specific name isn't matched
      const fallbackCatId = categoryMap.values().next().value || undefined;

      const blogsToInsert = [];

      for (let i = 0; i < enArticles.length; i++) {
        const art = enArticles[i];
        const catId = categoryMap.get(art.category) || fallbackCatId;
        const articleDate = art.date ? new Date(art.date) : new Date(Date.now() - i * 86400000 * 7);

        blogsToInsert.push({
          title: art.title,
          slug: art.slug || generateSlug(art.title),
          excerpt: art.summary,
          content: (art.content || [art.keyArgument, art.implications]).join("\n\n"),
          category: catId,
          categoryName: art.category,
          tags: [art.category, "Finance", "Strategy", "Capital Markets"],
          isPublished: true,
          publishedAt: isNaN(articleDate.getTime()) ? new Date() : articleDate,
          locale: "en",
          seoTitle: `${art.title} | Keshab Datt Bhatt`,
          seoDescription: art.summary,
          viewCount: 140 + i * 18,
          author: {
            name: "Keshab Datt Bhatt",
            role: "Management & Financial Sector Professional",
          },
        });
      }

      for (let i = 0; i < neArticles.length; i++) {
        const art = neArticles[i];
        const catId = categoryMap.get(art.category) || fallbackCatId;
        const articleDate = art.date ? new Date(art.date) : new Date(Date.now() - i * 86400000 * 7);

        blogsToInsert.push({
          title: art.title,
          slug: art.slug || generateSlug(art.title),
          excerpt: art.summary,
          content: (art.content || [art.keyArgument, art.implications]).join("\n\n"),
          category: catId,
          categoryName: art.category,
          tags: [art.category, "वित्तीय", "रणनीति", "बैंकिङ"],
          isPublished: true,
          publishedAt: isNaN(articleDate.getTime()) ? new Date() : articleDate,
          locale: "ne",
          seoTitle: `${art.title} | केशव दत्त भट्ट`,
          seoDescription: art.summary,
          viewCount: 110 + i * 14,
          author: {
            name: "केशव दत्त भट्ट",
            role: "व्यवस्थापन तथा वित्तीय क्षेत्र विज्ञ",
          },
        });
      }

      if (blogsToInsert.length > 0) {
        await BlogModel.insertMany(blogsToInsert);
        console.log(`[Database Seed] ${blogsToInsert.length} articles (EN + NE) seeded successfully into MongoDB.`);
      }
    }

    // 4. Seed Default CV Record if empty
    const cvCount = await CvModel.countDocuments();
    if (cvCount === 0) {
      await CvModel.create({
        filename: "keshabbhatt.com.np.pdf",
        originalName: "Keshab-Datt-Bhatt-Executive-CV.pdf",
        filePath: "public/cv/keshabbhatt.com.np.pdf",
        url: "/cv/keshabbhatt.com.np.pdf",
        mimeType: "application/pdf",
        size: 134900,
        isActive: true,
        uploadedBy: "System Seed",
      });
      console.log(`[Database Seed] Default active CV record initialized.`);
    }
  } catch (error) {
    console.error("[Database Seed] Error during initial data seeding:", error);
  }
}

let isSeedRun = false;
let lastFailureTime = 0;

/**
 * Connect to MongoDB with Mongoose and ensure initial seeding
 */
export async function connectDatabase(): Promise<typeof mongoose> {
  // 1. If an active connection exists, reuse it immediately (readyState 1 = connected)
  if (cached!.conn && mongoose.connection.readyState === 1) {
    return cached!.conn;
  }

  // 2. If already in the process of connecting (readyState 2 = connecting), await existing promise
  if (mongoose.connection.readyState === 2 && cached!.promise) {
    cached!.conn = await cached!.promise;
    return cached!.conn;
  }

  // 3. Fast failover if failed within cooldown window (4 seconds)
  if (Date.now() - lastFailureTime < 4000) {
    throw new Error("MongoDB recently failed to connect. Cooldown active for fallback.");
  }

  // Reset stale cache if previous connection dropped
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached!.conn = null;
    cached!.promise = null;
  }

  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log(`[MongoDB] Connected successfully to ${RAW_MONGODB_URI.split("@").pop()?.split("/")[0] || "database"}`);
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;

    // Run seed once in development or initial setup
    if (!isSeedRun) {
      isSeedRun = true;
      if (process.env.NODE_ENV === "development") {
        seedInitialData().catch((err) => {
          console.warn("[Database] Initial seeding skipped/failed:", (err as Error).message);
        });
      }
    }

    return cached!.conn;
  } catch (e) {
    cached!.conn = null;
    cached!.promise = null;
    lastFailureTime = Date.now();
    if (process.env.NEXT_PHASE !== "phase-production-build") {
      console.error("[MongoDB] Connection error:", (e as Error).message || e);
    }
    throw e;
  }
}

export const connectToDatabase = connectDatabase;
export default connectDatabase;
