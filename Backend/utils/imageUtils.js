import cloudinary from "../config/cloudinary.js"

// Upload image to Cloudinary
export const uploadToCloudinary = async (file, folder = "key-library") => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: "auto",
      transformation: [{ width: 800, height: 600, crop: "limit", quality: "auto" }, { format: "webp" }],
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw new Error("Failed to upload image")
  }
}

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    throw new Error("Failed to delete image")
  }
}

// Upload book cover with specific transformations
export const uploadBookCover = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "key-library/books",
      transformation: [{ width: 400, height: 600, crop: "fill", quality: "auto" }, { format: "webp" }],
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    console.error("Error uploading book cover:", error)
    throw new Error("Failed to upload book cover")
  }
}

// Upload profile image with specific transformations
export const uploadProfileImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "key-library/profiles",
      transformation: [{ width: 500, height: 500, crop: "fill", quality: "auto", gravity: "face" }, { format: "webp" }],
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    console.error("Error uploading profile image:", error)
    throw new Error("Failed to upload profile image")
  }
}

// Get optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const { width = 800, height = 600, crop = "limit", quality = "auto", format = "webp" } = options

  return cloudinary.url(publicId, {
    transformation: [{ width, height, crop, quality }, { format }],
  })
}

// Extract public ID from Cloudinary URL
export const extractPublicId = (url) => {
  if (!url) return null

  try {
    const parts = url.split("/")
    const filename = parts[parts.length - 1]
    const publicId = filename.split(".")[0]

    // Handle nested folders
    const folderIndex = parts.findIndex((part) => part === "key-library")
    if (folderIndex !== -1) {
      const folderParts = parts.slice(folderIndex, -1)
      return `${folderParts.join("/")}/${publicId}`
    }

    return publicId
  } catch (error) {
    console.error("Error extracting public ID:", error)
    return null
  }
}
