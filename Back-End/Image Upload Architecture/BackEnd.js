/**
 * ============================================================
 * 📌 PRODUCTION IMAGE UPLOAD — SENIOR DEVELOPER NOTES
 * ============================================================
 *
 * ✅ Stack:
 *    - Express
 *    - Multer (upload handling)
 *    - Sharp (image optimization)
 *    - File system storage
 *
 * ------------------------------------------------------------
 * 🎯 OBJECTIVE
 * ------------------------------------------------------------
 * Build a secure, scalable, and optimized image upload pipeline.
 *
 * Flow:
 * Client → Multer (temp) → Sharp process → Final storage → Response
 *
 * ------------------------------------------------------------
 * 📁 RECOMMENDED FOLDER STRUCTURE
 * ------------------------------------------------------------
 *
 * server/
 *  ├── routes/
 *  │    └── upload.routes.js
 *  ├── controllers/
 *  │    └── upload.controller.js
 *  ├── middlewares/
 *  │    └── upload.middleware.js
 *  ├── utils/
 *  │    └── imageProcessor.js
 *  └── uploads/
 *       ├── temp/
 *       └── images/
 *
 * ============================================================
 */


/* ============================================================
   🔐 MULTER MIDDLEWARE (upload.middleware.js)
   ============================================================ */

const multer = require("multer");
const path = require("path");

/**
 * ✅ Allowed MIME types
 * NOTE:
 * - Never trust file extension alone
 * - Always validate mimetype
 */
const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/**
 * ✅ Temporary storage configuration
 *
 * WHY TEMP?
 * - Never process directly in final folder
 * - Allows validation before permanent save
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/temp");
  },

  filename: (req, file, cb) => {
    // Generate collision-safe temp name
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, unique + path.extname(file.originalname));
  },
});

/**
 * ✅ Production-safe multer instance
 */
const upload = multer({
  storage,

  // 🔒 File size protection (5MB)
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  // 🔒 MIME validation
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;


/* ============================================================
   🧠 IMAGE PROCESSOR (utils/imageProcessor.js)
   ============================================================ */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

/**
 * ✅ Ensure directory exists
 *
 * Senior Tip:
 * Always guard filesystem writes.
 */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * ✅ Core image processing pipeline
 *
 * Responsibilities:
 * - Resize
 * - Convert to WebP
 * - Compress
 * - Remove EXIF
 * - Cleanup temp
 */
const processImage = async (tempPath) => {
  try {
    const outputDir = "uploads/images";
    ensureDir(outputDir);

    // Unique production filename
    const fileName = `${Date.now()}.webp`;
    const finalPath = path.join(outputDir, fileName);

    /**
     * 🔥 Sharp optimization pipeline
     */
    await sharp(tempPath)
      .rotate() // auto-orient
      .resize({
        width: 1200,
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
        effort: 4,
      })
      .toFile(finalPath);

    // ✅ Always cleanup temp file
    await fs.promises.unlink(tempPath);

    return {
      fileName,
      finalPath,
      publicUrl: `/uploads/images/${fileName}`,
    };
  } catch (err) {
    // 🚨 Cleanup on failure (VERY IMPORTANT)
    if (fs.existsSync(tempPath)) {
      await fs.promises.unlink(tempPath);
    }
    throw err;
  }
};

module.exports = { processImage };


/* ============================================================
   🚀 CONTROLLER (upload.controller.js)
   ============================================================ */

const { processImage } = require("../utils/imageProcessor");

/**
 * ✅ Upload image controller
 *
 * Responsibilities:
 * - Validate request
 * - Process image
 * - Return public URL
 * - Handle errors safely
 */
const uploadImage = async (req, res) => {
  try {
    // 🔒 Required file check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    // ⚙️ Process image
    const result = await processImage(req.file.path);

    /**
     * 🗄️ PRODUCTION NOTE:
     * Save metadata to DB here:
     * - userId
     * - original name
     * - size
     * - url
     */

    return res.status(200).json({
      success: true,
      message: "Upload successful",
      data: {
        fileName: result.fileName,
        url: result.publicUrl,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

module.exports = { uploadImage };


/* ============================================================
   🌐 ROUTE (upload.routes.js)
   ============================================================ */

const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { uploadImage } = require("../controllers/upload.controller");

/**
 * ✅ Single image upload endpoint
 */
router.post(
  "/upload-image",
  upload.single("file"),
  uploadImage
);

module.exports = router;


/* ============================================================
   🧩 EXPRESS APP SETUP (app.js)
   ============================================================ */

const express = require("express");
const path = require("path");
const uploadRoutes = require("./routes/upload.routes");

const app = express();

/**
 * ✅ Serve uploaded images
 *
 * Production Note:
 * In high-scale apps, use CDN instead.
 */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api", uploadRoutes);

module.exports = app;


/* ============================================================
   ✅ SENIOR PRODUCTION CHECKLIST
   ============================================================

   Security:
   - [x] MIME validation
   - [x] Size limit
   - [x] Temp isolation
   - [x] Unique naming

   Performance:
   - [x] WebP conversion
   - [x] Resize limit
   - [x] Async FS

   Maintenance:
   - [ ] Temp cleanup cron (recommended)
   - [ ] Rate limiting
   - [ ] Auth middleware
   - [ ] CDN (future scale)

   ============================================================
 */
