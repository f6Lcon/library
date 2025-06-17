import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import bookRoutes from "./routes/book.routes.js"
import borrowRoutes from "./routes/borrow.routes.js"
import branchRoutes from "./routes/branch.routes.js"
import uploadRoutes from "./routes/upload.routes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/borrow", borrowRoutes)
app.use("/api/branches", branchRoutes)
app.use("/api/upload", uploadRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
