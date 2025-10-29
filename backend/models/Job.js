const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceProviderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  serviceCategory: {
    type: String,
    enum: ["Home Repair", "Cleaning", "Other"],
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      "Plumbing", "Electrical Work", "Appliance Repair",
      "Regular Cleaning", "Deep Cleaning", "Move-in/Move-out Cleaning", "Post-renovation Cleaning",
      "Gardening & Landscaping", "Pet Care", "IT Support"
    ]
  },
  description: { type: String },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Cancelled"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


module.exports = mongoose.model("Job", jobSchema);
