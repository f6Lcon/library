import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import { errorHandler, notFound } from "./middlewares/errorHandler.middleware.js"

// Import routes
import authRoutes from "./routes/auth.routes.js"
import bookRoutes from "./routes/book.routes.js"
import borrowRoutes from "./routes/borrow.routes.js"
import branchRoutes from "./routes/branch.routes.js"
import userRoutes from "./routes/user.routes.js"
import uploadRoutes from "./routes/upload.routes.js"

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Request logging middleware (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      body: req.method !== "GET" ? { ...req.body, password: req.body.password ? "[HIDDEN]" : undefined } : undefined,
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
    })
    next()
  })
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/borrow", borrowRoutes)
app.use("/api/branches", branchRoutes)
app.use("/api/users", userRoutes)
app.use("/api/upload", uploadRoutes)

// 404 handler
app.use(notFound)

// Error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})
