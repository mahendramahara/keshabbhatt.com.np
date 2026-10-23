import dns from "node:dns";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure Atlas SRV resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch {
  // Ignore in restricted environments
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://digitalnepal1122_db_user:ubWANNACdxHCi8NF@keshabbhatt-portfolio.wfwxft3.mongodb.net/portfolio_db";

// Load JSON article data
const enArticlesPath = path.resolve(__dirname, "../../../packages/content/src/data/en/articles.json");
const neArticlesPath = path.resolve(__dirname, "../../../packages/content/src/data/ne/articles.json");

const enArticles = JSON.parse(fs.readFileSync(enArticlesPath, "utf-8")).items || [];
const neArticles = JSON.parse(fs.readFileSync(neArticlesPath, "utf-8")).items || [];

async function runSeed() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("Connected successfully to portfolio_db on Atlas!");

  const db = mongoose.connection.db;

  // 1. Seed Categories
  const categoryCollection = db.collection("blogcategories");
  const defaultCategories = [
    { name: "Banking & Financial Services", slug: "banking-financial-services", description: "Commercial banking, monetary policy, ALM & liquidity analysis", color: "#1d4ed8", order: 1, createdAt: new Date(), updatedAt: new Date() },
    { name: "Capital Markets & Investment", slug: "capital-markets-investment", description: "Securities, NEPSE, regulatory frameworks & equity valuation", color: "#c98516", order: 2, createdAt: new Date(), updatedAt: new Date() },
    { name: "Business Strategy & Management", slug: "business-strategy-management", description: "Corporate governance, operational resilience & leadership", color: "#059669", order: 3, createdAt: new Date(), updatedAt: new Date() },
    { name: "Corporate Governance & Risk", slug: "corporate-governance-risk", description: "Board oversight, compliance, ICAAP & fiduciary accountability", color: "#d97706", order: 4, createdAt: new Date(), updatedAt: new Date() },
    { name: "Investment Analysis & Research", slug: "investment-analysis-research", description: "Fundamental valuation, DCF modeling & portfolio strategies", color: "#7c3aed", order: 5, createdAt: new Date(), updatedAt: new Date() },
    { name: "Financial Valuation & Modeling", slug: "financial-valuation-modeling", description: "Corporate valuation, financial engineering & scenario analysis", color: "#0284c7", order: 6, createdAt: new Date(), updatedAt: new Date() },
    { name: "बैंकिङ तथा वित्तीय सेवा", slug: "banking-financial-services-ne", description: "वाणिज्य बैंकिङ, मौद्रिक नीति, सम्पत्ति-दायित्व व्यवस्थापन तथा तरलता विश्लेषण", color: "#1d4ed8", order: 7, createdAt: new Date(), updatedAt: new Date() },
    { name: "पुँजी बजार तथा लगानी", slug: "capital-markets-investment-ne", description: "धितोपत्र, नेप्से, नियमनकारी संरचना तथा शेयर मूल्यांकन", color: "#c98516", order: 8, createdAt: new Date(), updatedAt: new Date() },
    { name: "व्यापार रणनीति तथा व्यवस्थापन", slug: "business-strategy-management-ne", description: "संस्थागत सुशासन, सञ्चालन लचिलोपन तथा नेतृत्व विकास", color: "#059669", order: 9, createdAt: new Date(), updatedAt: new Date() },
    { name: "संस्थागत सुशासन तथा जोखिम", slug: "corporate-governance-risk-ne", description: "सञ्चालक समिति सुपरिवेक्षण, नियमन पालना तथा जोखिम न्यूनीकरण", color: "#d97706", order: 10, createdAt: new Date(), updatedAt: new Date() },
    { name: "लगानी विश्लेषण तथा अनुसन्धान", slug: "investment-analysis-research-ne", description: "आधारभूत मूल्यांकन, वित्तीय विवरण विश्लेषण तथा लगानी रणनीति", color: "#7c3aed", order: 11, createdAt: new Date(), updatedAt: new Date() },
    { name: "वित्तीय मूल्यांकन तथा मोडलिङ", slug: "financial-valuation-modeling-ne", description: "कम्पनी मूल्यांकन, नगद प्रवाह विश्लेषण तथा वित्तीय खाका", color: "#0284c7", order: 12, createdAt: new Date(), updatedAt: new Date() },
  ];

  const categoryMap = new Map();
  for (const cat of defaultCategories) {
    const existing = await categoryCollection.findOne({ name: cat.name });
    if (!existing) {
      const res = await categoryCollection.insertOne(cat);
      categoryMap.set(cat.name, res.insertedId);
    } else {
      categoryMap.set(cat.name, existing._id);
    }
  }
  console.log(`Categories verified: ${categoryMap.size}`);

  // 2. Seed Superadmin
  const adminsCollection = db.collection("admins");
  const existingAdmin = await adminsCollection.findOne({
    $or: [{ username: "admin" }, { email: "admin@keshabbhatt.com.np" }],
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash("AdminSecurePassword123!", salt);
    await adminsCollection.insertOne({
      name: "Keshab Datt Bhatt",
      email: "admin@keshabbhatt.com.np",
      username: "admin",
      password: hashedPassword,
      role: "superadmin",
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Superadmin seeded: admin (admin@keshabbhatt.com.np)");
  } else {
    console.log("Superadmin already verified.");
  }

  // 3. Seed Blogs
  const blogsCollection = db.collection("blogs");

  try {
    await blogsCollection.dropIndex("slug_1");
  } catch {}
  try {
    await blogsCollection.dropIndex("slug_1_locale_1");
  } catch {}

  // Ensure compound index { slug: 1, locale: 1 } (unique)
  await blogsCollection.createIndex({ slug: 1, locale: 1 }, { unique: true });
  await blogsCollection.createIndex({ isPublished: 1, locale: 1, publishedAt: -1 });

  const fallbackCatId = categoryMap.values().next().value;
  let enCount = 0;
  let neCount = 0;

  for (let i = 0; i < enArticles.length; i++) {
    const art = enArticles[i];
    const catId = categoryMap.get(art.category) || fallbackCatId;
    const date = art.date ? new Date(art.date) : new Date(Date.now() - i * 86400000 * 7);

    const doc = {
      title: art.title,
      slug: art.slug,
      excerpt: art.summary,
      content: (art.content || [art.keyArgument, art.implications]).join("\n\n"),
      category: catId,
      categoryName: art.category,
      tags: [art.category, "Finance", "Strategy", "Capital Markets"],
      isPublished: true,
      publishedAt: isNaN(date.getTime()) ? new Date() : date,
      locale: "en",
      seoTitle: `${art.title} | Keshab Datt Bhatt`,
      seoDescription: art.summary,
      viewCount: 140 + i * 19,
      author: {
        name: "Keshab Datt Bhatt",
        role: "Management & Financial Sector Professional",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updateRes = await blogsCollection.updateOne(
      { slug: art.slug, locale: "en" },
      { $set: doc },
      { upsert: true }
    );
    if (updateRes.upsertedCount > 0 || updateRes.modifiedCount > 0) {
      enCount++;
    }
  }

  for (let i = 0; i < neArticles.length; i++) {
    const art = neArticles[i];
    const catId = categoryMap.get(art.category) || fallbackCatId;
    const date = art.date ? new Date(art.date) : new Date(Date.now() - i * 86400000 * 7);

    const doc = {
      title: art.title,
      slug: art.slug,
      excerpt: art.summary,
      content: (art.content || [art.keyArgument, art.implications]).join("\n\n"),
      category: catId,
      categoryName: art.category,
      tags: [art.category, "वित्तीय", "रणनीति", "बैंकिङ"],
      isPublished: true,
      publishedAt: isNaN(date.getTime()) ? new Date() : date,
      locale: "ne",
      seoTitle: `${art.title} | केशव दत्त भट्ट`,
      seoDescription: art.summary,
      viewCount: 115 + i * 14,
      author: {
        name: "केशव दत्त भट्ट",
        role: "व्यवस्थापन तथा वित्तीय क्षेत्र विज्ञ",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updateRes = await blogsCollection.updateOne(
      { slug: art.slug, locale: "ne" },
      { $set: doc },
      { upsert: true }
    );
    if (updateRes.upsertedCount > 0 || updateRes.modifiedCount > 0) {
      neCount++;
    }
  }

  // 4. Seed CV document
  const cvsCollection = db.collection("cvs");
  const cvDoc = await cvsCollection.findOne({ filename: "keshabbhatt.com.np.pdf" });
  if (!cvDoc) {
    await cvsCollection.insertOne({
      filename: "keshabbhatt.com.np.pdf",
      originalName: "Keshab-Datt-Bhatt-Executive-CV.pdf",
      filePath: "public/cv/keshabbhatt.com.np.pdf",
      url: "/cv/keshabbhatt.com.np.pdf",
      mimeType: "application/pdf",
      size: 134900,
      isActive: true,
      uploadedBy: "System Seed",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Default active CV record seeded.");
  }

  const totalBlogs = await blogsCollection.countDocuments();
  const totalCategories = await categoryCollection.countDocuments();
  const totalAdmins = await adminsCollection.countDocuments();

  console.log("=========================================");
  console.log(`DATABASE SEEDING VERIFIED!`);
  console.log(`- Total Blogs: ${totalBlogs} (${enCount} EN + ${neCount} NE)`);
  console.log(`- Total Categories: ${totalCategories}`);
  console.log(`- Total Admins: ${totalAdmins}`);
  console.log("=========================================");

  await mongoose.disconnect();
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
