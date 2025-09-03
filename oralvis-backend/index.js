require('dotenv').config();
const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary')


const app = express()

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use(express.json())

const allowedOrigins = [
  "http://localhost:5173", 
  "https://oralvis-delta.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },  
    credentials: true,               
}));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT || 3000;

let db = null
const dbPath = path.join(__dirname, 'oralvis.db')

const InitializeDbAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}/`)
        })
    }
    catch (e) {
        console.log(`Error: ${e.message}`)
    }

}

InitializeDbAndServer()

// Register API
/*
app.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body

        if (!email || !password || !role) {
            return res.status(400).json({ error: "Email, password, and role are required" })
        }

        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email])
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const userId = uuidv4()
        await db.run(
            `INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)`,
            [userId, email, hashedPassword, role]
        )

        res.status(201).json({ message: "User registered successfully", userId })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
    */

// Login API

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const verifyTechnician = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Invalid token" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== "Technician") {
      return res.status(403).json({ error: "Access forbidden: Technician only" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

const verifyDentist = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== "Dentist") {
      return res.status(403).json({ error: "Access forbidden: Dentist only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.get('/', (req, res) => {
  res.send(`Server Running at ${PORT}`)
})


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!existingUser) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign(
            { id: existingUser.id, role: existingUser.role },
            SECRET_KEY,
        );

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post('/upload', verifyTechnician, upload.single('file'), async (req, res) => {
  try {
    const { patientName, patientId, scanType, region } = req.body;
    if (!patientName || !patientId || !scanType || !region || !req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "dental_scans",
      public_id: `${patientId}_${Date.now()}`
    });

    const imageUrl = result.secure_url;
    const scanId = uuidv4()

    await db.run(
      `INSERT INTO scans (id, patientName, patientId, scanType, region, imageUrl, uploadDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [scanId, patientName, patientId, scanType, region, imageUrl, new Date().toISOString()]
    );

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });

    res.json({ message: "Upload successful", imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/scans', verifyDentist, async (req, res) => {
  try {
    const { patientId } = req.query;
    let scans;

    if (patientId) {
      scans = await db.all(
        `SELECT * FROM scans WHERE patientId = ? ORDER BY uploadDate DESC`,
        [patientId]
      );
    } else {
      scans = await db.all(`SELECT * FROM scans ORDER BY uploadDate DESC`);
    }

    res.json(scans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
