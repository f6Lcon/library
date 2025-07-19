import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload image to Cloudinary
export const uploadToCloudinary = async (buffer, options = {}) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: "image",
        folder: options.folder || "library",
        public_id: options.public_id,
        transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }, { fetch_format: "auto" }],
        ...options,
      }

      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error)
            reject(error)
          } else {
            resolve(result)
          }
        })
        .end(buffer)
    })
  } catch (error) {
    console.error("Upload to Cloudinary error:", error)
    throw error
  }
}

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Delete from Cloudinary error:", error)
    throw error
  }
}

// Upload book cover with specific transformations
export const uploadBookCover = async (file) => {
  try {
    const buffer = file.buffer || file
    const result = await uploadToCloudinary(buffer, {
      folder: "library/books",
      transformation: [
        { width: 400, height: 600, crop: "fill", gravity: "center" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error("Upload book cover error:", error)
    throw error
  }
}

// Upload profile image with specific transformations
export const uploadProfileImage = async (file) => {
  try {
    const buffer = file.buffer || file
    const result = await uploadToCloudinary(buffer, {
      folder: "library/profiles",
      transformation: [
        { width: 300, height: 300, crop: "fill", gravity: "face" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error("Upload profile image error:", error)
    throw error
  }
}

// Get optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  try {
    return cloudinary.url(publicId, {
      transformation: [
        { width: options.width || 400, height: options.height || 300, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    })
  } catch (error) {
    console.error("Get optimized image URL error:", error)
    return null
  }
}

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadBookCover,
  uploadProfileImage,
  getOptimizedImageUrl,
}
