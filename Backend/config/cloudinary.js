import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

// Validate required environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ Missing Cloudinary configuration. Please check your environment variables:")
  console.error("- CLOUDINARY_CLOUD_NAME")
  console.error("- CLOUDINARY_API_KEY")
  console.error("- CLOUDINARY_API_SECRET")
  process.exit(1)
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping()
    console.log("✅ Cloudinary connected successfully")
    return true
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message)
    return false
  }
}

// Test connection on startup
testCloudinaryConnection()

export default cloudinary
