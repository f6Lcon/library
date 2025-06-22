"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { motion } from "framer-motion"
import {
  MdClose,
  MdCloudUpload,
  MdImage,
  MdDelete,
  MdSave,
  MdEdit,
  MdBook,
  MdPerson,
  MdDateRange,
  MdCategory,
  MdBusiness,
  MdLanguage,
  MdPages,
  MdDescription,
} from "react-icons/md"

const BookForm = ({ book, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
    publisher: "",
    publishedYear: "",
    totalCopies: "",
    language: "English",
    pages: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "History",
    "Biography",
    "Romance",
    "Mystery",
    "Fantasy",
    "Educational",
  ]

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        category: book.category || "",
        description: book.description || "",
        publisher: book.publisher || "",
        publishedYear: book.publishedYear || "",
        totalCopies: book.totalCopies || "",
        language: book.language || "English",
        pages: book.pages || "",
      })
      if (book.imageUrl) {
        setImagePreview(book.imageUrl)
      }
    }
  }, [book])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
      setError("")
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    // Reset file input
    const fileInput = document.getElementById("book-image")
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return null

    setUploadingImage(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("image", imageFile)

      const response = await fetch("/api/upload/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: uploadFormData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      return {
        imageUrl: data.imageUrl,
        imagePublicId: data.publicId,
      }
    } catch (err) {
      console.error("Image upload error:", err)
      throw new Error("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let imageData = {}

      // Upload image if a new one is selected
      if (imageFile) {
        imageData = await uploadImage()
      } else if (book && book.imageUrl && imagePreview) {
        // Keep existing image
        imageData = {
          imageUrl: book.imageUrl,
          imagePublicId: book.imagePublicId,
        }
      }

      const bookData = {
        ...formData,
        publishedYear: Number.parseInt(formData.publishedYear),
        totalCopies: Number.parseInt(formData.totalCopies),
        pages: Number.parseInt(formData.pages),
        ...imageData,
      }

      if (book) {
        await bookService.updateBook(book._id, bookData)
      } else {
        await bookService.addBook(bookData)
      }

      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              {book ? <MdEdit className="w-5 h-5 text-white" /> : <MdBook className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{book ? "Edit Book" : "Add New Book"}</h3>
              <p className="text-sm text-gray-600">
                {book ? "Update book information" : "Add a new book to the library"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <MdClose className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2"
            >
              <MdClose className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Upload Section */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MdImage className="w-5 h-5 mr-2 text-primary-500" />
                Book Cover
              </h4>

              <div className="space-y-4">
                {/* Image Preview */}
                <div className="w-full h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border-2 border-dashed border-primary-200 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Book cover preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <MdCloudUpload className="w-12 h-12 text-primary-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload book cover</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="relative">
                  <input
                    id="book-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <MdCloudUpload className="w-5 h-5" />
                    <span>{imagePreview ? "Change Image" : "Upload Image"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MdBook className="w-5 h-5 mr-2 text-primary-500" />
                  Basic Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder="Enter book title"
                      />
                      <MdBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="author"
                        required
                        value={formData.author}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder="Enter author name"
                      />
                      <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN *</label>
                    <input
                      type="text"
                      name="isbn"
                      required
                      value={formData.isbn}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="Enter ISBN"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <div className="relative">
                      <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <MdCategory className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Publication Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MdDateRange className="w-5 h-5 mr-2 text-primary-500" />
                  Publication Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Publisher *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="publisher"
                        required
                        value={formData.publisher}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder="Enter publisher name"
                      />
                      <MdBusiness className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Published Year *</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="publishedYear"
                        required
                        value={formData.publishedYear}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder="Enter year"
                      />
                      <MdDateRange className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Copies *</label>
                    <input
                      type="number"
                      name="totalCopies"
                      required
                      min="1"
                      value={formData.totalCopies}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="Enter number of copies"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pages *</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="pages"
                        required
                        min="1"
                        value={formData.pages}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder="Enter page count"
                      />
                      <MdPages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder="Enter language"
                      />
                      <MdLanguage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <MdDescription className="w-4 h-4 mr-2" />
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
                  placeholder="Enter book description..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-200"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || uploadingImage}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center space-x-2"
            >
              {loading || uploadingImage ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>{uploadingImage ? "Uploading..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <MdSave className="w-5 h-5" />
                  <span>{book ? "Update Book" : "Add Book"}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default BookForm
