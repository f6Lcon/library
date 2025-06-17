import mongoose from "mongoose"
import User from "../models/user.model.js"
import Branch from "../models/branch.model.js"
import dotenv from "dotenv"

dotenv.config()

const testRegistration = async () => {
  try {
    console.log("🧪 Testing Registration Process...")
    console.log("=================================")

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/key-library-system")
    console.log("✅ Connected to MongoDB")

    // Get first available branch
    const branch = await Branch.findOne({ isActive: true })
    if (!branch) {
      console.log("❌ No branches found! Run: npm run seed:branches")
      process.exit(1)
    }

    console.log(`📍 Using branch: ${branch.name} (${branch._id})`)

    // Test data that matches frontend form
    const testData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@test.com",
      password: "password123",
      role: "community",
      phone: "1234567890",
      address: "123 Main Street, City, State 12345",
      branch: branch._id.toString(),
    }

    console.log("\n📝 Test data:")
    console.log(JSON.stringify(testData, null, 2))

    // Remove existing test user
    await User.deleteOne({ email: testData.email })
    console.log("🗑️  Cleaned up existing test user")

    // Test validation manually
    console.log("\n🔍 Testing validation...")

    // Check required fields
    const requiredFields = ["firstName", "lastName", "email", "password", "phone", "address", "role", "branch"]
    const missingFields = requiredFields.filter((field) => !testData[field])

    if (missingFields.length > 0) {
      console.log(`❌ Missing required fields: ${missingFields.join(", ")}`)
      return
    }

    // Validate field lengths
    if (testData.firstName.length < 2) console.log("❌ First name too short")
    if (testData.lastName.length < 2) console.log("❌ Last name too short")
    if (testData.password.length < 6) console.log("❌ Password too short")
    if (testData.phone.length < 10) console.log("❌ Phone too short")
    if (testData.address.length < 10) console.log("❌ Address too short")

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(testData.email)) {
      console.log("❌ Invalid email format")
      return
    }

    // Validate role
    if (!["student", "community"].includes(testData.role)) {
      console.log("❌ Invalid role")
      return
    }

    // Validate branch ID
    if (!mongoose.Types.ObjectId.isValid(testData.branch)) {
      console.log("❌ Invalid branch ID")
      return
    }

    console.log("✅ All validation checks passed")

    // Try creating user
    console.log("\n👤 Creating user...")
    const user = new User(testData)
    await user.save()

    console.log("✅ User created successfully!")
    console.log(`   ID: ${user._id}`)
    console.log(`   Name: ${user.firstName} ${user.lastName}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)

    // Test API endpoint simulation
    console.log("\n🌐 Testing API endpoint simulation...")

    const apiTestData = { ...testData }
    delete apiTestData._id

    // Simulate express-validator
    const validationErrors = []

    if (!apiTestData.firstName || apiTestData.firstName.trim().length < 2) {
      validationErrors.push("firstName: First name must be between 2 and 50 characters")
    }
    if (!apiTestData.lastName || apiTestData.lastName.trim().length < 2) {
      validationErrors.push("lastName: Last name must be between 2 and 50 characters")
    }
    if (!apiTestData.email || !emailRegex.test(apiTestData.email)) {
      validationErrors.push("email: Please provide a valid email address")
    }
    if (!apiTestData.password || apiTestData.password.length < 6) {
      validationErrors.push("password: Password must be at least 6 characters long")
    }
    if (!apiTestData.phone || apiTestData.phone.trim().length < 10) {
      validationErrors.push("phone: Phone number must be between 10 and 15 characters")
    }
    if (!apiTestData.address || apiTestData.address.trim().length < 10) {
      validationErrors.push("address: Address must be between 10 and 200 characters")
    }
    if (!["student", "community"].includes(apiTestData.role)) {
      validationErrors.push("role: Role must be either student or community")
    }
    if (!mongoose.Types.ObjectId.isValid(apiTestData.branch)) {
      validationErrors.push("branch: Please select a valid branch")
    }

    if (validationErrors.length > 0) {
      console.log("❌ API validation would fail:")
      validationErrors.forEach((error) => console.log(`   ${error}`))
    } else {
      console.log("✅ API validation would pass")
    }

    // Clean up
    await User.deleteOne({ _id: user._id })
    console.log("🧹 Test user cleaned up")

    console.log("\n🎉 Registration test completed successfully!")
  } catch (error) {
    console.error("❌ Test failed:", error.message)

    if (error.name === "ValidationError") {
      console.log("\n📝 Mongoose validation errors:")
      Object.values(error.errors).forEach((err) => {
        console.log(`   - ${err.path}: ${err.message}`)
      })
    }
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

testRegistration()
