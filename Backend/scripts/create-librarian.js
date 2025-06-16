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
      return
    }

    console.log("📚 Available Branches:")
    branches.forEach((branch, index) => {
      console.log(`   ${index + 1}. ${branch.name} (${branch.code})`)
    })

    // For demo purposes, create a librarian for the main branch
    const mainBranch = branches.find((b) => b.code === "KEY-MAIN") || branches[0]

    // Check if librarian already exists for this branch
    const existingLibrarian = await User.findOne({
      role: "librarian",
      branch: mainBranch._id,
    })

    if (existingLibrarian) {
      console.log(`⚠️  Librarian already exists for ${mainBranch.name}:`)
      console.log(`   📧 Email: ${existingLibrarian.email}`)
      console.log(`   👤 Name: ${existingLibrarian.firstName} ${existingLibrarian.lastName}`)
      return
    }

    // Create librarian account
    const librarianData = {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "librarian@keylibrary.com",
      password: "librarian123", // This will be hashed automatically
      role: "librarian",
      phone: "(555) 000-0002",
      address: "456 Library Street, Book District",
      isActive: true,
      branch: mainBranch._id,
    }

    const librarian = await User.create(librarianData)

    console.log("\n🎉 Librarian account created successfully!")
    console.log("\n👤 Librarian Account Details:")
    console.log(`   📧 Email: ${librarian.email}`)
    console.log(`   🔑 Password: librarian123`)
    console.log(`   👤 Name: ${librarian.firstName} ${librarian.lastName}`)
    console.log(`   🏢 Branch: ${mainBranch.name}`)
    console.log(`   🆔 Role: ${librarian.role}`)

    console.log("\n✨ Librarian Capabilities:")
    console.log("   • Manage books in their assigned branch")
    console.log("   • Issue and return books")
    console.log("   • View borrowing history and overdue books")
    console.log("   • Manage student and community member accounts")
    console.log("   • Generate branch reports")
  } catch (error) {
    console.error("❌ Error creating librarian account:", error.message)

    if (error.code === 11000) {
      console.log("📧 Email already exists. Librarian might already be created.")
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
