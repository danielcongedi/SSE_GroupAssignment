const express = require('express');
const Job = require('../models/Job');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Create Job
router.post("/create", authMiddleware(), async (req, res) => {
  try {
    console.log('Create Job route - User:', req.user);
    const { serviceCategory, serviceType, description } = req.body;

    const validCategories = {
      "Home Repair": ["Plumbing", "Electrical Work", "Appliance Repair"],
      "Cleaning": [
        "Regular Cleaning",
        "Deep Cleaning",
        "Move-in/Move-out Cleaning",
        "Post-renovation Cleaning"
      ],
      "Other": ["Gardening & Landscaping", "Pet Care", "IT Support"]
    };

    if (!validCategories[serviceCategory] ||
        !validCategories[serviceCategory].includes(serviceType)) {
      return res.status(400).json({ message: "Invalid service selection" });
    }

    const job = new Job({
      clientId: req.user.userId,  // ✅ FIXED
      serviceCategory,
      serviceType,
      description
    });

    await job.save();
    console.log('✅ Job created successfully:', job);
    res.status(201).json({ message: "Job created", job });

  } catch (error) {
    console.error('❌ Error creating job:', error);
    res.status(500).json({ message: "Error creating job" });
  }
});

// Get jobs for client
router.get("/client/:clientId", authMiddleware(), async (req, res) => {
  try {
    console.log('🔐 Jobs route - User:', req.user);
    
    if (req.user.role === "client" && req.params.clientId !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ clientId: req.params.clientId }).sort({ createdAt: -1 });
    console.log('✅ Found jobs:', jobs.length);
    res.status(200).json({ jobs });
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// Get available jobs for service providers
router.get("/available", authMiddleware(["serviceProvider"]), async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Pending" })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching available jobs" });
  }
});

// Service provider accepts a job
router.put("/accept/:jobId", authMiddleware(["serviceProvider"]), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { 
        status: "In Progress",
        serviceProviderId: req.user.userId 
      },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.status(200).json({ message: "Job accepted successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Error accepting job" });
  }
});

module.exports = router;