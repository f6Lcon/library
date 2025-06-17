import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js"

// Configure Cloudinary storage for book covers
const bookStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "key-library/books",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 600, crop: "fill", quality: "auto" }, { format: "webp" }],
  },
})

// Configure Cloudinary storage for general images
const generalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "key-library/general",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit", quality: "auto" }, { format: "webp" }],
  },
})

// Configure Cloudinary storage for founder/staff photos
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "key-library/profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "fill", quality: "auto", gravity: "face" }, { format: "webp" }],
  },
})

export const uploadBookCover = multer({ storage: bookStorage })
export const uploadGeneralImage = multer({ storage: generalStorage })
export const uploadProfileImage = multer({ storage: profileStorage })

// Helper function to delete images from Cloudinary
export const deleteCloudinaryImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    throw error
  }
}
