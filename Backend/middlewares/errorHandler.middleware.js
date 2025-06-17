// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err)
  
    // Default error
    let error = { ...err }
    error.message = err.message
  
    // Log error for debugging
    console.error(err.stack)
  
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
      const message = "Resource not found"
      error = { message, statusCode: 404 }
    }
  
    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = "Duplicate field value entered"
      error = { message, statusCode: 400 }
    }
  
    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ")
      error = { message, statusCode: 400 }
    }
  
    // JWT errors
    if (err.name === "JsonWebTokenError") {
      const message = "Invalid token"
      error = { message, statusCode: 401 }
    }
  
    if (err.name === "TokenExpiredError") {
      const message = "Token expired"
      error = { message, statusCode: 401 }
    }
  
    // Multer errors (file upload)
    if (err.code === "LIMIT_FILE_SIZE") {
      const message = "File too large"
      error = { message, statusCode: 400 }
    }
  
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      const message = "Too many files"
      error = { message, statusCode: 400 }
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    })
  }
  
  // Async handler wrapper
  export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
  
  // 404 handler
  export const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error)
  }
  