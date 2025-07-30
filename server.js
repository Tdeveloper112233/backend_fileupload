const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

// File upload route
app.post("/upload", upload.array("files"), async (req, res) => {
    try {
        const files = req.files.map((file) => ({
            name: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
        }));
        res.json({ status: "ok", files });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// ✅ Get all uploaded files
app.get("/files", (req, res) => {
    const uploadsDir = path.join(__dirname, "uploads");

    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to read upload directory" });
        }

        const fileList = files.map((filename) => ({
            name: filename,
            url: `http://localhost:${PORT}/uploads/${filename}`,
        }));
        res.json(fileList);
    });
});

// ✅ Delete a file by name
app.delete("/files/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "uploads", filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
            return res.status(404).json({ error: "File not found" });
        }
        res.json({ status: "ok", message: "File deleted" });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
