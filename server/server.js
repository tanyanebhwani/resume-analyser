const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const matchSkills = require("./utils/matcher");
const matchResumeWithJD = require("./utils/compare");
const app = express(); 
const API_URL = process.env.VITE_API_URL;
app.use(cors({
  origin: ["http://localhost:5173","https://tanyaresumeanalyser.netlify.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// 📂 Folder to save resumes
const UPLOAD_FOLDER = path.join(__dirname, "resumes");
if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER);
}

// ⚡ Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
app.get("/", (req, res) => {
  res.send("Resume Analyser API is running!");
});
// 📌 API Route: Upload Resume
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileMime = req.file.mimetype;

    let text = "";

    if (fileMime === "application/pdf") {
      // PDF case
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (
      fileMime ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileMime === "application/msword"
    ) {
      // DOCX case
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }
    const { found, missing } = matchSkills(text);

    const jobDescription = req.body.jobDescription || "";
    let jdScore, jdFound=[], jdMiss=[];
    if (jobDescription.trim().length > 0) {
      ({ jdScore, jdFound, jdMiss } = matchResumeWithJD(text, jobDescription));
    }
    res.json({
      extractedText: text,
      skills: {
        found,
        missing,
      },
      jdMatch: {
        jdScore,
        jdFound,
        jdMiss
      },
    });
    // Cleanup: remove the uploaded file from "uploads" folder
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process file" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
