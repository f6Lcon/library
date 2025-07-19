import mongoose from "mongoose"

const operatingHoursSchema = new mongoose.Schema({
  open: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  close: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  closed: {
    type: Boolean,
    default: false,
  },
})

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Branch name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Branch name cannot exceed 100 characters"],
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, "Zip code is required"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
        default: "USA",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+?[\d\s\-$$$$]+$/, "Please enter a valid phone number"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    manager: {
      type: String,
      required: [true, "Manager name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    operatingHours: {
      monday: operatingHoursSchema,
      tuesday: operatingHoursSchema,
      wednesday: operatingHoursSchema,
      thursday: operatingHoursSchema,
      friday: operatingHoursSchema,
      saturday: operatingHoursSchema,
      sunday: operatingHoursSchema,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
    capacity: {
      type: Number,
      min: [1, "Capacity must be at least 1"],
      default: 100,
    },
    established: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
branchSchema.index({ name: 1 })
branchSchema.index({ status: 1 })
branchSchema.index({ "address.city": 1 })
branchSchema.index({ "address.state": 1 })

// Virtual for full address
branchSchema.virtual("fullAddress").get(function () {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`
})

// Method to check if branch is open at a given time
branchSchema.methods.isOpenAt = function (day, time) {
  const daySchedule = this.operatingHours[day.toLowerCase()]
  if (!daySchedule || daySchedule.closed) {
    return false
  }

  const openTime = daySchedule.open.replace(":", "")
  const closeTime = daySchedule.close.replace(":", "")
  const checkTime = time.replace(":", "")

  return checkTime >= openTime && checkTime <= closeTime
}

// Static method to find branches by city
branchSchema.statics.findByCity = function (city) {
  return this.find({ "address.city": new RegExp(city, "i") })
}

// Pre-save middleware
branchSchema.pre("save", function (next) {
  // Ensure facilities array doesn't have empty strings
  if (this.facilities) {
    this.facilities = this.facilities.filter((facility) => facility.trim() !== "")
  }
  next()
})

const Branch = mongoose.model("Branch", branchSchema)

export default Branch
