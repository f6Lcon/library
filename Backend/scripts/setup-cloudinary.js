import { uploadFounderImage, uploadSampleBookCovers } from "../utils/imageUtils.js"
import dotenv from "dotenv"

dotenv.config()

const setupCloudinaryImages = async () => {
  try {
    console.log("🚀 Setting up Cloudinary images...")
    console.log("=====================================")

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log("❌ Cloudinary configuration missing!")
      console.log("Please add the following to your .env file:")
      console.log("CLOUDINARY_CLOUD_NAME=your_cloud_name")
      console.log("CLOUDINARY_API_KEY=your_api_key")
      console.log("CLOUDINARY_API_SECRET=your_api_secret")
      return
    }

    console.log("📸 Uploading founder image...")
    const founderImageUrl = await uploadFounderImage()

    console.log("\n📚 Uploading sample book covers...")
    const bookCovers = await uploadSampleBookCovers()

    console.log("\n🎉 Cloudinary setup complete!")
    console.log("=====================================")

    if (founderImageUrl) {
      console.log("👩‍💼 Founder image URL:", founderImageUrl)
    }

    console.log("\n📖 Book cover URLs:")
    Object.entries(bookCovers).forEach(([id, url]) => {
      console.log(`   ${id}: ${url}`)
    })

    console.log("\n💡 Next steps:")
    console.log("   1. Update your frontend to use these Cloudinary URLs")
    console.log("   2. Use the upload endpoints to add more images")
    console.log("   3. Images are automatically optimized and converted to WebP")
  } catch (error) {
    console.error("❌ Error setting up Cloudinary:", error.message)
  }
}

// Run the setup
setupCloudinaryImages()
