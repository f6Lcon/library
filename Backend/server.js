import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import { errorHandler, notFound } from "./middlewares/errorHandler.middleware.js"

// Import routes
import authRoutes from "./routes/auth.routes.js"
import bookRoutes from "./routes/book.routes.js"
import userRoutes from "./routes/user.routes.js"
import borrowRoutes from "./routes/borrow.routes.js"
import branchRoutes from "./routes/branch.routes.js"
import uploadRoutes from "./routes/upload.routes.js"
import reviewRoutes from "./routes/review.routes.js"

// Load environment variables
dotenv.config()

const app = express()

// Connect to database
connectDB()

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Body parsing middleware with increased limits and better error handling
app.use(
  express.json({
    limit: "10mb",
    strict: true,
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf)
      } catch (e) {
        console.error("JSON Parse Error:", e.message)
        console.error("Raw body:", buf.toString())
        res.status(400).json({
          success: false,
          message: "Invalid JSON format",
          error: e.message,
        })
        return
      }
    },
  }),
)

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
)

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  if (req.method === "POST" || req.method === "PUT") {
    console.log("Request body:", req.body)
  }
  next()
})

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Library Management System API is running!" })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/users", userRoutes)
app.use("/api/borrow", borrowRoutes)
app.use("/api/branches", branchRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/reviews", reviewRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`)
})
