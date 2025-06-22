import mongoose from "mongoose"
import User from "../models/user.model.js"
import Branch from "../models/branch.model.js"
import dotenv from "dotenv"

dotenv.config()

const createAdminAccount = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/key-library-system")
    console.log("Connected to MongoDB")

    // Check if any branches exist, if not create a default one
    let defaultBranch = await Branch.findOne({ code: "KEY-MAIN" })

    if (!defaultBranch) {
      console.log("No branches found. Creating default main branch...")
      defaultBranch = await Branch.create({
        name: "KEY Library Main Branch",
        code: "KEY-MAIN",
        address: "123 Knowledge Avenue, Downtown District, City Center 10001",
        phone: "+1-555-123-4567",
        email: "main@keylibrary.com",
        isActive: true,
      })
      console.log("✅ Default branch created")
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" })

    if (existingAdmin) {
      console.log("⚠️  Admin account already exists:")
      console.log(`   📧 Email: ${existingAdmin.email}`)
      console.log(`   👤 Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`)
      console.log(`   🏢 Branch: ${defaultBranch.name}`)
      console.log("\n💡 If you forgot the password, you can update it manually in the database")
      return
    }

    // Create admin account with proper phone format
    const adminData = {
      firstName: "System",
      lastName: "Administrator",
      email: "admin@keylibrary.com",
      password: "admin123", // This will be hashed automatically by the pre-save hook
      role: "admin",
      phone: "+1-555-000-0001", // Updated to match validation pattern
      address: "KEY Library System Headquarters, 123 Admin Street, City Center 10001",
      isActive: true,
      branch: defaultBranch._id,
    }

    console.log("Creating admin with data:", {
      ...adminData,
      password: "[HIDDEN]",
    })

    const admin = await User.create(adminData)

    console.log("🎉 Admin account created successfully!")
    console.log("\n👤 Admin Account Details:")
    console.log(`   📧 Email: ${admin.email}`)
    console.log(`   🔑 Password: admin123`)
    console.log(`   👤 Name: ${admin.firstName} ${admin.lastName}`)
    console.log(`   📞 Phone: ${admin.phone}`)
    console.log(`   🏢 Branch: ${defaultBranch.name}`)
    console.log(`   🆔 Role: ${admin.role}`)

    console.log("\n🔐 IMPORTANT SECURITY NOTES:")
    console.log("   • Please change the default password after first login")
    console.log("   • Use a strong password for production environments")
    console.log("   • Consider enabling two-factor authentication")

    console.log("\n✨ Admin Capabilities:")
    console.log("   • Create and manage librarian accounts")
    console.log("   • Add, edit, and delete library branches")
    console.log("   • Manage user roles and permissions")
    console.log("   • View system-wide statistics and reports")
    console.log("   • Configure system settings")

    console.log("\n🚀 Next Steps:")
    console.log("   1. Start the backend server: npm run dev")
    console.log("   2. Start the frontend: npm run dev")
    console.log("   3. Login with the admin credentials")
    console.log("   4. Go to Admin Dashboard to manage the system")
  } catch (error) {
    console.error("❌ Error creating admin account:", error.message)

    if (error.code === 11000) {
      console.log("📧 Email already exists. Admin might already be created.")
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

// Run the admin creation function
createAdminAccount()
