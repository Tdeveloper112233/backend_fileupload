
const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    name: String,
    path: String,
    mimetype: String,
    size: Number,
}, { timestamps: true });

module.exports = mongoose.model("File", FileSchema);
