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

// Smart port selection with fallback
const findAvailablePort = async (startPort) => {
  return new Promise((resolve) => {
    const server = app.listen(startPort, () => {
      const port = server.address().port
      server.close(() => resolve(port))
    })

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(findAvailablePort(startPort + 1))
      } else {
        resolve(null)
      }
    })
  })
}

const startServer = async () => {
  const preferredPort = Number.parseInt(process.env.PORT || "5000", 10)

  try {
    // Try preferred port first
    const server = app.listen(preferredPort, () => {
      console.log(`🚀 Server running on port ${preferredPort}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
      console.log(`🔗 Health check: http://localhost:${preferredPort}/health`)
      console.log(`🌐 API Base URL: http://localhost:${preferredPort}/api`)
    })

    server.on("error", async (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`⚠️  Port ${preferredPort} is already in use`)
        console.log(`🔍 Finding available port...`)

        const availablePort = await findAvailablePort(preferredPort + 1)
        if (availablePort) {
          app.listen(availablePort, () => {
            console.log(`🚀 Server running on port ${availablePort} (fallback)`)
            console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
            console.log(`🔗 Health check: http://localhost:${availablePort}/health`)
            console.log(`🌐 API Base URL: http://localhost:${availablePort}/api`)
            console.log(`💡 Update your frontend to use port ${availablePort}`)
          })
        } else {
          console.error("❌ Could not find an available port")
          process.exit(1)
        }
      } else {
        console.error("❌ Server error:", err)
        process.exit(1)
      }
    })

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("🛑 SIGTERM received, shutting down gracefully")
      server.close(() => {
        console.log("✅ Server closed")
        process.exit(0)
      })
    })

    process.on("SIGINT", () => {
      console.log("🛑 SIGINT received, shutting down gracefully")
      server.close(() => {
        console.log("✅ Server closed")
        process.exit(0)
      })
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
