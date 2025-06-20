import mongoose from "mongoose"

const connectDB = async () => {
  try {
    console.log("🔗 Connecting to MongoDB Atlas...")
    console.log(`📦 Mongoose version: ${mongoose.version}`)

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    // Minimal options that work with simple connection strings
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    }

    console.log("🔍 Using minimal connection options for simple URI")

    const conn = await mongoose.connect(process.env.MONGODB_URI, options)

    console.log(`✅ MongoDB Atlas Connected Successfully!`)
    console.log(`🌐 Host: ${conn.connection.host}`)
    console.log(`🗄️ Database: ${conn.connection.name}`)
    console.log(`📊 Ready State: ${conn.connection.readyState}`)

    // Connection event handlers
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message)
    })

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected")
    })

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected")
    })
  } catch (error) {
    console.error("❌ MongoDB Atlas Connection Failed:")
    console.error("Error:", error.message)

    // Specific error handling
    if (error.message.includes("ETIMEOUT")) {
      console.log("\n🔧 Connection timeout - this usually means:")
      console.log("1. Network connectivity issue")
      console.log("2. IP not whitelisted in Atlas")
      console.log("3. Incorrect credentials")
    }

    if (error.message.includes("authentication failed")) {
      console.log("\n🔐 Authentication failed:")
      console.log("1. Check username and password in connection string")
      console.log("2. Verify database user exists in Atlas")
    }

    process.exit(1)
  }
}

export default connectDB