import mongoose from "mongoose"
import User from "../models/user.model.js"
import Branch from "../models/branch.model.js"
import dotenv from "dotenv"

dotenv.config()

const debugRegistration = async () => {
  try {
    console.log("🔍 Debugging registration process...")
    console.log("=====================================")

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/key-library-system")
    console.log("✅ Connected to MongoDB")

    // Check if branches exist
    const branches = await Branch.find({ isActive: true })
    console.log(`📍 Found ${branches.length} active branches:`)
    branches.forEach((branch) => {
      console.log(`   - ${branch.name} (${branch.code}) - ID: ${branch._id}`)
    })

    if (branches.length === 0) {
      console.log("❌ No branches found! Please run: npm run seed:branches")
      return
    }

    // Test user data
    const testUserData = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "Test123!",
      role: "community",
      phone: "+1234567890",
      address: "123 Test Street, Test City, Test State 12345",
      branch: branches[0]._id,
    }

    console.log("\n🧪 Testing user creation with data:")
    console.log(JSON.stringify(testUserData, null, 2))

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUserData.email })
    if (existingUser) {
      console.log("🗑️  Removing existing test user...")
      await User.deleteOne({ email: testUserData.email })
    }

    // Try to create user
    const user = new User(testUserData)
    await user.save()

    console.log("✅ Test user created successfully!")
    console.log(`   ID: ${user._id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)

    // Clean up
    await User.deleteOne({ _id: user._id })
    console.log("🧹 Test user cleaned up")

    console.log("\n✨ Registration process is working correctly!")
  } catch (error) {
    console.error("❌ Registration debug failed:", error)

    if (error.name === "ValidationError") {
      console.log("\n📝 Validation errors:")
      Object.values(error.errors).forEach((err) => {
        console.log(`   - ${err.path}: ${err.message}`)
      })
    }

    if (error.code === 11000) {
      console.log("\n🔄 Duplicate key error:")
      console.log(`   Field: ${Object.keys(error.keyValue)[0]}`)
      console.log(`   Value: ${Object.values(error.keyValue)[0]}`)
    }
  } finally {
    await mongoose.connection.close()
    console.log("\nDatabase connection closed")
    process.exit(0)
  }
}

// Run the debug
debugRegistration()
