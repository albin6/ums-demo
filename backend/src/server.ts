import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { AdminInitializationService } from "./utils/AdminInitializationService";
import { authenticate } from "./middleware/auth/auth";
import { UserController } from "./controllers/user/UserController";

// Load environment variables
dotenv.config();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create directory if it doesn't exist
    cb(null, "uploads/profile/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Import routes
import { adminRoutes } from "./routes/admin";
import { userRoutes } from "./routes/user";

const app: Application = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(helmet());

// Configure CORS to allow all origins during development
const corsOptions = {
  origin: "*", // Allow all origins during development
  credentials: true, // Enable credentials (cookies, authorization headers)
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Additional headers for cross-origin resource sharing
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Profile image upload route with authentication
const userController = new UserController();
app.post(
  "/api/users/upload",
  authenticate,
  upload.single("profileImage"),
  (req, res) => userController.uploadProfileImage(req, res)
);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal server error" });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/user-management"
    );
    console.log("Connected to MongoDB");

    // Initialize admin user
    const adminInitService = new AdminInitializationService();
    await adminInitService.initializeAdmin();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

startServer();

export { app };
