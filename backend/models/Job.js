const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceCategory: {
    type: String,
    enum: ["Home Repair", "Cleaning", "Other"],
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      // Home Repair
      "Plumbing", "Electrical Work", "Appliance Repair",
      // Cleaning Services
      "Regular Cleaning", "Deep Cleaning", "Move-in/Move-out Cleaning", "Post-renovation Cleaning",
      // Other
      "Gardening & Landscaping", "Pet Care", "IT Support"
    ]
  },
  description: { type: String },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", jobSchema);
