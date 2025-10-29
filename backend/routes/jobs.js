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

//  Service provider accepts a job
router.put("/accept/:jobId", authMiddleware(["serviceProvider"]), async (req, res) => {
  try {
    console.log('🔐 Accepting job:', req.params.jobId, 'by provider:', req.user.userId);
    
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
    
    console.log('✅ Job accepted successfully:', job._id);
    res.status(200).json({ message: "Job accepted successfully", job });
  } catch (error) {
    console.error('❌ Error accepting job:', error);
    res.status(500).json({ message: "Error accepting job" });
  }
});

// Get service provider's accepted jobs
router.get("/provider/my-jobs", authMiddleware(["serviceProvider"]), async (req, res) => {
  try {
    console.log('🔐 Fetching provider jobs for user:', req.user.userId);
    
    const jobs = await Job.find({ 
      serviceProviderId: req.user.userId 
    })
    .populate('clientId', 'name email')
    .sort({ createdAt: -1 });
    
    console.log('✅ Found provider jobs:', jobs.length);
    res.status(200).json({ jobs });
  } catch (error) {
    console.error('❌ Error fetching provider jobs:', error);
    res.status(500).json({ message: "Error fetching your jobs" });
  }
});

// ✅ Update job status - For Service Providers
router.put("/update/:jobId", authMiddleware(["serviceProvider"]), async (req, res) => {
  try {
    const { status } = req.body;
    const { jobId } = req.params;

    console.log('🔐 Updating job status:', { jobId, status, providerId: req.user.userId });

    // Validate status
    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the service provider owns this job
    if (job.serviceProviderId?.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied - you can only update jobs you've accepted" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true }
    ).populate('clientId', 'name email');

    console.log('✅ Job status updated successfully');
    res.status(200).json({ 
      message: "Job status updated successfully", 
      job: updatedJob 
    });

  } catch (error) {
    console.error('❌ Error updating job:', error);
    res.status(500).json({ message: "Error updating job" });
  }
});

// ✅ Update job details - For Clients (update their own jobs)
router.put("/client/update/:jobId", authMiddleware(["client"]), async (req, res) => {
  try {
    const { serviceCategory, serviceType, description } = req.body;
    const { jobId } = req.params;

    console.log('🔐 Client updating job:', { jobId, clientId: req.user.userId });

    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the client owns this job
    if (job.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied - you can only update your own jobs" });
    }

    // Only allow updates if job is still pending
    if (job.status !== "Pending") {
      return res.status(400).json({ message: "Can only update jobs that are still pending" });
    }

    // Validate service selection if provided
    if (serviceCategory || serviceType) {
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

      const finalCategory = serviceCategory || job.serviceCategory;
      const finalType = serviceType || job.serviceType;

      if (!validCategories[finalCategory] || !validCategories[finalCategory].includes(finalType)) {
        return res.status(400).json({ message: "Invalid service selection" });
      }
    }

    const updateData = {};
    if (serviceCategory) updateData.serviceCategory = serviceCategory;
    if (serviceType) updateData.serviceType = serviceType;
    if (description !== undefined) updateData.description = description;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true }
    ).populate('clientId', 'name email');

    console.log('✅ Job details updated successfully');
    res.status(200).json({ 
      message: "Job updated successfully", 
      job: updatedJob 
    });

  } catch (error) {
    console.error('❌ Error updating job:', error);
    res.status(500).json({ message: "Error updating job" });
  }
});

// ✅ Cancel job - For Clients
router.put("/client/cancel/:jobId", authMiddleware(["client"]), async (req, res) => {
  try {
    const { jobId } = req.params;

    console.log('🔐 Client cancelling job:', { jobId, clientId: req.user.userId });

    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the client owns this job
    if (job.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied - you can only cancel your own jobs" });
    }

    // Only allow cancellation if job is still pending
    if (job.status !== "Pending") {
      return res.status(400).json({ message: "Can only cancel jobs that are still pending" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { status: "Cancelled" },
      { new: true }
    );

    console.log('✅ Job cancelled successfully');
    res.status(200).json({ 
      message: "Job cancelled successfully", 
      job: updatedJob 
    });

  } catch (error) {
    console.error('❌ Error cancelling job:', error);
    res.status(500).json({ message: "Error cancelling job" });
  }
});

module.exports = router;