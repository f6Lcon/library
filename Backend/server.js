import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import { errorHandler } from "./middlewares/errorHandler.middleware.js"

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
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Connect to MongoDB
connectDB()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/users", userRoutes)
app.use("/api/borrow", borrowRoutes)
app.use("/api/branches", branchRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/reviews", reviewRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "KEY Library System API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Error handling middleware (should be last)
app.use(errorHandler)

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 KEY Library System API`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`)
})

export default app
