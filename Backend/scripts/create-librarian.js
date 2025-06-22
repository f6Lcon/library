import mongoose from "mongoose"
import User from "../models/user.model.js"
import Branch from "../models/branch.model.js"
import dotenv from "dotenv"

dotenv.config()

const createLibrarianAccount = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/key-library-system")
    console.log("Connected to MongoDB")

    // Get available branches
    const branches = await Branch.find({ isActive: true })

    if (branches.length === 0) {
      console.log("❌ No active branches found. Please run the branch seeding script first.")
      console.log("Run: node scripts/seed-branches.js")
      return
    }

    console.log("\n📚 Available Branches:")
    branches.forEach((branch, index) => {
      console.log(`   ${index + 1}. ${branch.name} (${branch.code})`)
    })

    // Use the first branch as default (you can modify this logic)
    const defaultBranch = branches[0]

    // Check if librarian already exists
    const existingLibrarian = await User.findOne({
      role: "librarian",
      email: "librarian@keylibrary.com",
    })

    if (existingLibrarian) {
      console.log("⚠️  Default librarian account already exists:")
      console.log(`   📧 Email: ${existingLibrarian.email}`)
      console.log(`   👤 Name: ${existingLibrarian.firstName} ${existingLibrarian.lastName}`)
      console.log(`   🏢 Branch: ${defaultBranch.name}`)
      console.log("\n💡 If you forgot the password, you can update it manually in the database")
      return
    }

    // Create librarian account with proper phone format
    const librarianData = {
      firstName: "Library",
      lastName: "Manager",
      email: "librarian@keylibrary.com",
      password: "librarian123", // This will be hashed automatically by the pre-save hook
      role: "librarian",
      phone: "+1-555-000-0002", // Updated to match validation pattern
      address: `${defaultBranch.address}`,
      isActive: true,
      branch: defaultBranch._id,
    }

    console.log("Creating librarian with data:", {
      ...librarianData,
      password: "[HIDDEN]",
    })

    const librarian = await User.create(librarianData)

    console.log("🎉 Librarian account created successfully!")
    console.log("\n👤 Librarian Account Details:")
    console.log(`   📧 Email: ${librarian.email}`)
    console.log(`   🔑 Password: librarian123`)
    console.log(`   👤 Name: ${librarian.firstName} ${librarian.lastName}`)
    console.log(`   📞 Phone: ${librarian.phone}`)
    console.log(`   🏢 Branch: ${defaultBranch.name}`)
    console.log(`   🆔 Role: ${librarian.role}`)

    console.log("\n🔐 IMPORTANT SECURITY NOTES:")
    console.log("   • Please change the default password after first login")
    console.log("   • Use a strong password for production environments")

    console.log("\n✨ Librarian Capabilities:")
    console.log("   • Manage books in their assigned branch")
    console.log("   • Register students and community members")
    console.log("   • Issue and return books")
    console.log("   • View branch statistics and reports")
    console.log("   • Manage borrowing records")

    console.log("\n🚀 Next Steps:")
    console.log("   1. Start the backend server: npm run dev")
    console.log("   2. Start the frontend: npm run dev")
    console.log("   3. Login with the librarian credentials")
    console.log("   4. Go to Librarian Dashboard to manage books and users")
  } catch (error) {
    console.error("❌ Error creating librarian account:", error.message)

    if (error.code === 11000) {
      console.log("📧 Email already exists. Librarian might already be created.")
    }

    if (error.name === "ValidationError") {
      console.log("Validation errors:")
      Object.values(error.errors).forEach((err) => {
        console.log(`   • ${err.path}: ${err.message}`)
      })
    }
  } finally {
    // Close the connection
    await mongoose.connection.close()
    console.log("\nDatabase connection closed")
    process.exit(0)
  }
}

// Run the librarian creation function
createLibrarianAccount()
