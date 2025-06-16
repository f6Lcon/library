import mongoose from "mongoose"
import Branch from "../models/branch.model.js"
import dotenv from "dotenv"

dotenv.config()

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
  {
    name: "KEY Library University Branch",
    code: "KEY-UNI",
    address: "987 Campus Drive, University District, College Town 10006",
    phone: "(555) 678-9012",
    email: "university@keylibrary.com",
    isActive: true,
  },
  {
    name: "KEY Library Community Branch",
    code: "KEY-COMM",
    address: "147 Community Plaza, Residential District, Hometown 10007",
    phone: "(555) 789-0123",
    email: "community@keylibrary.com",
    isActive: true,
  },
]

const seedBranches = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/key-library-system")
    console.log("Connected to MongoDB")

    // Clear existing branches
    await Branch.deleteMany({})
    console.log("Cleared existing branches")

    // Insert new branches
    const createdBranches = await Branch.insertMany(branches)
    console.log(`✅ Successfully created ${createdBranches.length} branches:`)

    createdBranches.forEach((branch) => {
      console.log(`   📍 ${branch.name} (${branch.code})`)
      console.log(`      📧 ${branch.email}`)
      console.log(`      📞 ${branch.phone}`)
      console.log(`      🏠 ${branch.address}`)
      console.log("")
    })

    console.log("🎉 Branch seeding completed successfully!")
    console.log("\n📝 You can now register with any of these branches:")
    console.log("   • Select a branch during registration")
    console.log("   • Use the branch code for quick identification")
    console.log("   • All branches are active and ready for use")
  } catch (error) {
    console.error("❌ Error seeding branches:", error.message)
  } finally {
    // Close the connection
    await mongoose.connection.close()
    console.log("Database connection closed")
    process.exit(0)
  }
}

// Run the seeding function
seedBranches()
