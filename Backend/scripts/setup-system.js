import mongoose from "mongoose"
import User from "../models/user.model.js"
import Branch from "../models/branch.model.js"
import dotenv from "dotenv"

dotenv.config()

const setupCompleteSystem = async () => {
  try {
    console.log("🚀 Setting up KEY Library System...")
    console.log("=====================================")

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/key-library-system")
    console.log("✅ Connected to MongoDB")

    // 1. Create Branches
    console.log("\n📍 Setting up branches...")
    await Branch.deleteMany({}) // Clear existing branches

    const branches = [
      {
        name: "KEY Library Main Branch",
        code: "KEY-MAIN",
        address: "123 Knowledge Avenue, Downtown District, City Center 10001",
        phone: "(555) 123-4567",
        email: "main@keylibrary.com",
        isActive: true,
      },
      {
        name: "KEY Library North Branch",
        code: "KEY-NORTH",
        address: "456 Learning Street, North District, Northside 10002",
        phone: "(555) 234-5678",
        email: "north@keylibrary.com",
        isActive: true,
      },
      {
        name: "KEY Library East Branch",
        code: "KEY-EAST",
        address: "789 Education Boulevard, East District, Eastville 10003",
        phone: "(555) 345-6789",
        email: "east@keylibrary.com",
        isActive: true,
      },
      {
        name: "KEY Library West Branch",
        code: "KEY-WEST",
        address: "321 Wisdom Way, West District, Westfield 10004",
        phone: "(555) 456-7890",
        email: "west@keylibrary.com",
        isActive: true,
      },
      {
        name: "KEY Library South Branch",
        code: "KEY-SOUTH",
        address: "654 Scholar Circle, South District, Southpark 10005",
        phone: "(555) 567-8901",
        email: "south@keylibrary.com",
        isActive: true,
      },
    ]

    const createdBranches = await Branch.insertMany(branches)
    console.log(`✅ Created ${createdBranches.length} branches`)

    // 2. Create Admin Account
    console.log("\n👤 Creating admin account...")
    await User.deleteMany({ role: "admin" }) // Clear existing admin

    const mainBranch = createdBranches.find((b) => b.code === "KEY-MAIN")

    const adminData = {
      firstName: "System",
      lastName: "Administrator",
      email: "admin@keylibrary.com",
      password: "admin123",
      role: "admin",
      phone: "(555) 000-0001",
      address: "KEY Library System Headquarters",
      isActive: true,
      branch: mainBranch._id,
    }

    const admin = await User.create(adminData)
    console.log("✅ Admin account created")

    // 3. Create Sample Librarians
    console.log("\n📚 Creating librarian accounts...")

    const librarians = [
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@keylibrary.com",
        password: "librarian123",
        role: "librarian",
        phone: "(555) 100-0001",
        address: "123 Librarian Lane",
        branch: createdBranches.find((b) => b.code === "KEY-MAIN")._id,
      },
      {
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@keylibrary.com",
        password: "librarian123",
        role: "librarian",
        phone: "(555) 100-0002",
        address: "456 Book Avenue",
        branch: createdBranches.find((b) => b.code === "KEY-NORTH")._id,
      },
      {
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.rodriguez@keylibrary.com",
        password: "librarian123",
        role: "librarian",
        phone: "(555) 100-0003",
        address: "789 Reading Road",
        branch: createdBranches.find((b) => b.code === "KEY-EAST")._id,
      },
    ]

    const createdLibrarians = await User.insertMany(librarians)
    console.log(`✅ Created ${createdLibrarians.length} librarian accounts`)

    // 4. Display Summary
    console.log("\n🎉 KEY Library System Setup Complete!")
    console.log("=====================================")

    console.log("\n👤 ADMIN ACCOUNT:")
    console.log(`   📧 Email: ${admin.email}`)
    console.log(`   🔑 Password: admin123`)
    console.log(`   🏢 Branch: ${mainBranch.name}`)

    console.log("\n📚 LIBRARIAN ACCOUNTS:")
    createdLibrarians.forEach((librarian, index) => {
      const branch = createdBranches.find((b) => b._id.equals(librarian.branch))
      console.log(`   ${index + 1}. ${librarian.firstName} ${librarian.lastName}`)
      console.log(`      📧 ${librarian.email}`)
      console.log(`      🔑 librarian123`)
      console.log(`      🏢 ${branch.name}`)
    })

    console.log("\n🏢 AVAILABLE BRANCHES:")
    createdBranches.forEach((branch, index) => {
      console.log(`   ${index + 1}. ${branch.name} (${branch.code})`)
    })

    console.log("\n🚀 NEXT STEPS:")
    console.log("   1. Start the backend: npm run dev")
    console.log("   2. Start the frontend: npm run dev")
    console.log("   3. Login as admin to manage the system")
    console.log("   4. Create additional users as needed")

    console.log("\n🔐 SECURITY REMINDER:")
    console.log("   • Change default passwords after first login")
    console.log("   • Use strong passwords in production")
    console.log("   • Regularly backup your database")
  } catch (error) {
    console.error("❌ Error setting up system:", error.message)
  } finally {
    await mongoose.connection.close()
    console.log("\nDatabase connection closed")
    process.exit(0)
  }
}

// Run the complete setup
setupCompleteSystem()
