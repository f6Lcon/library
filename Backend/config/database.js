import mongoose from "mongoose"

const connectDB = async () => {
  try {
    // Enhanced connection options for better reliability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      family: 4, // Use IPv4, skip trying IPv6
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
    }

    // Try to connect with enhanced options
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/library-system", options)

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err)
    })

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected")
    })

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected")
    })
  } catch (error) {
    console.error("❌ Database connection error:", error.message)

    // If Atlas connection fails, try local MongoDB
    if (error.message.includes("ETIMEOUT") || error.message.includes("cluster0")) {
      console.log("🔄 Atlas connection failed, trying local MongoDB...")
      try {
        const localConn = await mongoose.connect("mongodb://localhost:27017/library-system", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}`)
        return
      } catch (localError) {
        console.error("❌ Local MongoDB also failed:", localError.message)
        console.log("💡 Please ensure MongoDB is installed and running locally, or fix your Atlas connection")
      }
    }

    console.log("\n🔧 Troubleshooting steps:")
    console.log("1. Check your internet connection")
    console.log("2. Verify your MongoDB Atlas connection string")
    console.log("3. Ensure your IP is whitelisted in Atlas")
    console.log("4. Try using a different network (mobile hotspot)")
    console.log("5. Install and run MongoDB locally as fallback")

    process.exit(1)
  }
}

export default connectDB
