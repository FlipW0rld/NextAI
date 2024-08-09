import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; // Import multer
import chat from "./chat.js";
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());

// Configure multer
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, "uploads/");
},
filename: function (req, file, cb) {
cb(null, file.originalname);
},
});
const upload = multer({ storage: storage });

const PORT = 5001;

let filePath;

app.post("/upload", upload.single("file"), async (req, res) => {
// Use multer to handle file upload
filePath = req.file.path; // The path where the file is temporarily saved
res.send(filePath + " upload successfully.");
});

app.get("/chat", async (req, res) => {
const resp = await chat(filePath, req.query.question); // Pass the file path to your main function
res.send(resp.text);
});

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// API routes
app.get('/api/some-endpoint', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
