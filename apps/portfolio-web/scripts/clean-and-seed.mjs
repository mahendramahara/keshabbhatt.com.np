import dns from "node:dns";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveMongoUri(uri) {
  if (uri && uri.includes("main-cluster.q0du6xs.mongodb.net")) {
    const match = uri.match(/^(?:mongodb(?:\+srv)?:\/\/)([^@]+)@main-cluster\.q0du6xs\.mongodb\.net\/?([^?]*)(\?.*)?$/);
    if (match) {
      const auth = match[1];
      const db = match[2] || "portfolio_db";
      return `mongodb://${auth}@ac-1yb1jll-shard-00-00.q0du6xs.mongodb.net:27017,ac-1yb1jll-shard-00-01.q0du6xs.mongodb.net:27017,ac-1yb1jll-shard-00-02.q0du6xs.mongodb.net:27017/${db}?ssl=true&replicaSet=atlas-5iciy9-shard-0&authSource=admin&retryWrites=true&w=majority`;
    }
  }
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

function getEnvVar(key) {
  if (process.env[key]) {
    return process.env[key];
  }
  const envLocalPath = path.resolve(__dirname, "../.env.local");
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, "utf-8");
    const match = content.match(new RegExp(`${key}=["']?([^"'\\r\\n]+)["']?`));
    if (match) return match[1];
  }
  const rootEnvPath = path.resolve(__dirname, "../../../.env");
  if (fs.existsSync(rootEnvPath)) {
    const content = fs.readFileSync(rootEnvPath, "utf-8");
    const match = content.match(new RegExp(`${key}=["']?([^"'\\r\\n]+)["']?`));
    if (match) return match[1];
  }
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(new RegExp(`${key}=["']?([^"'\\r\\n]+)["']?`));
    if (match) return match[1];
  }
  return "";
}

const RAW_MONGODB_URI = getEnvVar("MONGODB_URI");
if (!RAW_MONGODB_URI) {
  console.error("Error: MONGODB_URI is required. Please define it in your environment or .env.local.");
  process.exit(1);
}

const MONGODB_URI = resolveMongoUri(RAW_MONGODB_URI);

// Load JSON article data
const enArticlesPath = path.resolve(__dirname, "../../../packages/content/src/data/en/articles.json");
const neArticlesPath = path.resolve(__dirname, "../../../packages/content/src/data/ne/articles.json");

const enArticles = JSON.parse(fs.readFileSync(enArticlesPath, "utf-8")).items || [];
const neArticles = JSON.parse(fs.readFileSync(neArticlesPath, "utf-8")).items || [];

async function cleanAndSeed() {
  console.log("======================================================");
  console.log("STARTING DATABASE CLEAN AND SEED FOR KESHAB BHATT PORTAL");
  console.log("======================================================");
  console.log("Connecting to MongoDB Atlas...");

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 12000,
  });
  console.log("Connected successfully to portfolio_db on Atlas!\n");

  const db = mongoose.connection.db;

  // 1. CLEAN EXISTING COLLECTIONS
  console.log("[1/5] Cleaning existing collections...");
  const collectionsToWipe = ["blogs", "blogcategories", "admins", "cvdocuments", "cvs"];
  for (const collName of collectionsToWipe) {
    try {
      await db.collection(collName).deleteMany({});
      console.log(`  - Cleaned collection: ${collName}`);
    } catch (err) {
      console.log(`  - Notice on ${collName}: ${err.message}`);
    }
  }

  // Drop stale indexes on blogs
  try {
    await db.collection("blogs").dropIndexes();
  } catch {}

  // 2. SEED DEFAULT CATEGORIES (Master of Accounting & Finance Level)
  console.log("\n[2/5] Seeding Master-level professional categories (EN & NE)...");
  const categoryCollection = db.collection("blogcategories");
  const defaultCategories = [
    // English Categories
    {
      name: "Executive Profile & Leadership",
      slug: "executive-profile-leadership",
      description: "Biographical journey, fiduciary governance, professional philosophy, and economic vision",
      color: "#c98516", // Gold
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Accounting & Financial Reporting",
      slug: "accounting-financial-reporting",
      description: "Forensic accounting, NFRS/IFRS compliance, earnings quality, and audit architecture",
      color: "#0284c7", // Slate blue
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Banking & Financial Services",
      slug: "banking-financial-services",
      description: "Commercial banking operations, ALM, interest rate sensitivity, and NRB directives",
      color: "#1d4ed8", // Deep blue
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Capital Markets & Investment",
      slug: "capital-markets-investment",
      description: "Securities valuation, NEPSE market microstructure, liquidity depth, and book-building",
      color: "#b45309", // Amber
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Corporate Governance & Risk",
      slug: "corporate-governance-risk",
      description: "COSO internal controls, fraud prevention, board oversight, and ethical accountability",
      color: "#059669", // Emerald
      order: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Strategic Management & Valuation",
      slug: "strategic-management-valuation",
      description: "Discounted Cash Flow (DCF), WACC calibration, and economic moat appraisal",
      color: "#7c3aed", // Violet
      order: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Nepali Categories
    {
      name: "नेतृत्व तथा जीवनी परिचय",
      slug: "executive-profile-leadership-ne",
      description: "जीवनी, संस्थागत उत्तरदायित्व, नेतृत्व दर्शन तथा आर्थिक रूपान्तरणको दृष्टिकोण",
      color: "#c98516",
      order: 7,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "लेखा तथा वित्तीय प्रतिवेदन",
      slug: "accounting-financial-reporting-ne",
      description: "फोरेन्सिक लेखापरीक्षण, एनएफआरएस ९ कार्यान्वयन, नाफाको गुणस्तर तथा वित्तीय सुशासन",
      color: "#0284c7",
      order: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "बैंकिङ तथा वित्तीय सेवा",
      slug: "banking-financial-services-ne",
      description: "वाणिज्य बैंकिङ, सम्पत्ति-दायित्व व्यवस्थापन, तरलता विश्लेषण तथा राष्ट्र बैंकका निर्देशनहरू",
      color: "#1d4ed8",
      order: 9,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "पुँजी बजार तथा लगानी",
      slug: "capital-markets-investment-ne",
      description: "धितोपत्र मूल्यांकन, नेप्सेको बजार संरचना, संस्थागत लगानी तथा नीतिगत सुधार",
      color: "#b45309",
      order: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "संस्थागत सुशासन तथा जोखिम",
      slug: "corporate-governance-risk-ne",
      description: "आन्तरिक नियन्त्रण प्रणाली, संस्थागत जालसाजी रोकथाम तथा सञ्चालक समितिको उत्तरदायित्व",
      color: "#059669",
      order: 11,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "रणनीतिक व्यवस्थापन तथा मूल्यांकन",
      slug: "strategic-management-valuation-ne",
      description: "छुट नगद प्रवाह (DCF), पुँजी लागत (WACC), र कम्पनीको आर्थिक सुरक्षा घेराको विश्लेषण",
      color: "#7c3aed",
      order: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const categoryMap = new Map();
  for (const cat of defaultCategories) {
    const res = await categoryCollection.insertOne(cat);
    categoryMap.set(cat.name, res.insertedId);
    console.log(`  + Category: "${cat.name}" [${cat.slug}]`);
  }

  // 3. SEED SUPERADMIN USER
  console.log("\n[3/5] Seeding executive superadmin user...");
  const adminsCollection = db.collection("admins");
  const superadminName = getEnvVar("SUPERADMIN_NAME") || "Keshab Datt Bhatt";
  const superadminEmail = (getEnvVar("SUPERADMIN_EMAIL") || "").toLowerCase();
  const superadminUsername = (getEnvVar("SUPERADMIN_USERNAME") || "").toLowerCase();
  const superadminPassword = getEnvVar("SUPERADMIN_PASSWORD");

  if (!superadminEmail || !superadminUsername || !superadminPassword) {
    console.error("Error: SUPERADMIN_EMAIL, SUPERADMIN_USERNAME, and SUPERADMIN_PASSWORD must be configured in environment or .env/.env.local");
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(superadminPassword, salt);

  await adminsCollection.insertOne({
    name: superadminName,
    email: superadminEmail,
    username: superadminUsername,
    password: hashedPassword,
    role: "superadmin",
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log(`  + Superadmin verified: username: '${superadminUsername}' | email: '${superadminEmail}' | role: 'superadmin'`);

  // 4. SEED DEFAULT ACTIVE CV RECORD
  console.log("\n[4/5] Seeding default executive CV record...");
  const cvsCollection = db.collection("cvdocuments");
  const legacyCvsCollection = db.collection("cvs");

  const defaultCvDoc = {
    filename: "keshabbhatt.com.np.pdf",
    originalName: "Keshab-Datt-Bhatt-Executive-CV.pdf",
    filePath: "public/cv/keshabbhatt.com.np.pdf",
    url: "/cv/keshabbhatt.com.np.pdf",
    mimeType: "application/pdf",
    size: 154361,
    isActive: true,
    uploadedBy: "System Seed",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await cvsCollection.insertOne({ ...defaultCvDoc });
  await legacyCvsCollection.insertOne({ ...defaultCvDoc });
  console.log("  + Active CV seeded: 'keshabbhatt.com.np.pdf' (154.3 KB)");

  // 5. SEED IN-DEPTH LONG ARTICLES (EN & NE)
  console.log("\n[5/5] Seeding in-depth master articles (English & Nepali)...");
  const blogsCollection = db.collection("blogs");

  // Create clean compound indexes
  await blogsCollection.createIndex({ slug: 1, locale: 1 }, { unique: true });
  await blogsCollection.createIndex({ isPublished: 1, locale: 1, publishedAt: -1 });

  const fallbackCatId = categoryMap.values().next().value;
  let enCount = 0;
  let neCount = 0;

  for (let i = 0; i < enArticles.length; i++) {
    const art = enArticles[i];
    const catId = categoryMap.get(art.category) || fallbackCatId;
    const pubDate = art.date ? new Date(art.date) : new Date(Date.now() - i * 86400000 * 7);

    const doc = {
      title: art.title,
      slug: art.slug,
      excerpt: art.summary,
      content: Array.isArray(art.content) ? art.content.join("\n\n") : art.content,
      category: catId,
      categoryName: art.category,
      tags: [art.category, "Finance", "Accounting", "Capital Markets", "Leadership"],
      isPublished: true,
      publishedAt: isNaN(pubDate.getTime()) ? new Date() : pubDate,
      locale: "en",
      seoTitle: `${art.title} | Keshab Datt Bhatt`,
      seoDescription: art.summary,
      viewCount: 180 + i * 27,
      author: {
        name: "Keshab Datt Bhatt",
        role: "Management Consultant & Financial Sector Leader",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await blogsCollection.insertOne(doc);
    enCount++;
    console.log(`  + [EN] ${art.title.slice(0, 55)}...`);
  }

  for (let i = 0; i < neArticles.length; i++) {
    const art = neArticles[i];
    const catId = categoryMap.get(art.category) || fallbackCatId;
    const pubDate = art.date ? new Date(art.date) : new Date(Date.now() - i * 86400000 * 7);

    const doc = {
      title: art.title,
      slug: art.slug,
      excerpt: art.summary,
      content: Array.isArray(art.content) ? art.content.join("\n\n") : art.content,
      category: catId,
      categoryName: art.category,
      tags: [art.category, "वित्तीय", "लेखा", "पुँजी बजार", "सुशासन"],
      isPublished: true,
      publishedAt: isNaN(pubDate.getTime()) ? new Date() : pubDate,
      locale: "ne",
      seoTitle: `${art.title} | केशव दत्त भट्ट`,
      seoDescription: art.summary,
      viewCount: 145 + i * 22,
      author: {
        name: "केशव दत्त भट्ट",
        role: "व्यावसायिक सल्लाहकार तथा वित्तीय क्षेत्र विज्ञ",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await blogsCollection.insertOne(doc);
    neCount++;
    console.log(`  + [NE] ${art.title.slice(0, 55)}...`);
  }

  const finalBlogCount = await blogsCollection.countDocuments();
  const finalCatCount = await categoryCollection.countDocuments();
  const finalAdminCount = await adminsCollection.countDocuments();
  const finalCvCount = await cvsCollection.countDocuments();

  console.log("\n======================================================");
  console.log("SUCCESSFULLY CLEANED & SEEDED PRODUCTION DATABASE!");
  console.log("======================================================");
  console.log(`- Total Blogs: ${finalBlogCount} (${enCount} English + ${neCount} Nepali)`);
  console.log(`  * Includes Flagship Article: "Who is Keshab Datt Bhatt?" (EN & NE)`);
  console.log(`- Total Categories: ${finalCatCount}`);
  console.log(`- Total Admins: ${finalAdminCount} (Active Superadmin: admin)`);
  console.log(`- Total Active CVs: ${finalCvCount} (Downloadable at /cv/keshabbhatt.com.np.pdf)`);
  console.log("======================================================\n");

  await mongoose.disconnect();
  process.exit(0);
}

cleanAndSeed().catch((err) => {
  console.error("Clean and seed failed:", err);
  process.exit(1);
});
