import cloudinary from "../config/cloudinary.js"

// Upload Rita's founder image to Cloudinary
export const uploadFounderImage = async () => {
  try {
    // Upload Rita's image to Cloudinary
    const result = await cloudinary.uploader.upload(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-TpZTyt7xjasW0AMkHFWYlZpnVzBkIo.png",
      {
        folder: "key-library/profiles",
        public_id: "rita-field-marsham",
        transformation: [
          { width: 500, height: 500, crop: "fill", quality: "auto", gravity: "face" },
          { format: "webp" },
        ],
      },
    )

    console.log("✅ Rita's image uploaded to Cloudinary:", result.secure_url)
    return result.secure_url
  } catch (error) {
    console.error("❌ Error uploading Rita's image:", error)
    return null
  }
}

// Upload sample book covers to Cloudinary
export const uploadSampleBookCovers = async () => {
  const sampleBooks = [
    {
      id: "great-gatsby",
      url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center",
      title: "The Great Gatsby",
    },
    {
      id: "to-kill-mockingbird",
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center",
      title: "To Kill a Mockingbird",
    },
    {
      id: "1984",
      url: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop&crop=center",
      title: "1984",
    },
    {
      id: "pride-prejudice",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
      title: "Pride and Prejudice",
    },
    {
      id: "catcher-rye",
      url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center",
      title: "The Catcher in the Rye",
    },
  ]

  const uploadedImages = {}

  for (const book of sampleBooks) {
    try {
      const result = await cloudinary.uploader.upload(book.url, {
        folder: "key-library/books",
        public_id: book.id,
        transformation: [{ width: 400, height: 600, crop: "fill", quality: "auto" }, { format: "webp" }],
      })

      uploadedImages[book.id] = result.secure_url
      console.log(`✅ ${book.title} cover uploaded:`, result.secure_url)
    } catch (error) {
      console.error(`❌ Error uploading ${book.title} cover:`, error)
    }
  }

  return uploadedImages
}
