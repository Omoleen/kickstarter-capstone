import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import ideaRoutes from "./routes/ideas.js";
import commentRoutes from "./routes/comments.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/comments", commentRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ 
    message: "Idea Launchpad API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      ideas: "/api/ideas",
      comments: "/api/comments"
    }
  });
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});