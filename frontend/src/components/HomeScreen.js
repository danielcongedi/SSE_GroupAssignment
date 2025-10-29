import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomeScreen.css";

export default function HomeScreen() {
  const [jobs, setJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [serviceCategory, setServiceCategory] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const categories = {
    "Home Repair": ["Plumbing", "Electrical Work", "Appliance Repair"],
    "Cleaning": [
      "Regular Cleaning",
      "Deep Cleaning",
      "Move-in/Move-out Cleaning",
      "Post-renovation Cleaning"
    ],
    "Other": ["Gardening & Landscaping", "Pet Care", "IT Support"]
  };

  // ✅ Load user's jobs (for clients) or accepted jobs (for providers)
  // const loadJobs = async () => {
  //   try {
  //     setLoading(true);
  //     const token = sessionStorage.getItem("token");
  //     const userId = sessionStorage.getItem("userId");
  //     const userRole = sessionStorage.getItem("userRole");

  //     if (!userId) {
  //       console.error('No userId found in sessionStorage');
  //       navigate('/login');
  //       return;
  //     }

  //     let endpoint;
  //     if (userRole === 'client') {
  //       endpoint = `http://localhost:3001/api/jobs/client/${userId}`;
  //     } else {
  //       // For providers, show jobs they've accepted
  //       endpoint = `http://localhost:3001/api/jobs/provider/my-jobs`;
  //     }

  //     const response = await axios.get(endpoint, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     setJobs(response.data.jobs);
  //   } catch (error) {
  //     console.log("Error fetching jobs:", error);
  //     if (error.response?.status === 403) {
  //       alert('Session expired. Please login again.');
  //       navigate('/login');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const loadJobs = async () => {
  try {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");

    if (!userId) {
      console.error('No userId found in sessionStorage');
      navigate('/login');
      return;
    }

    let endpoint;
    if (userRole === 'client') {
      endpoint = `http://localhost:3001/api/jobs/client/${userId}`;
    } else {
      // For providers, show jobs they've accepted
      endpoint = `http://localhost:3001/api/jobs/provider/my-jobs`;
    }

    console.log('🔍 Loading jobs from endpoint:', endpoint);
    
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Jobs loaded:', response.data.jobs);
    setJobs(response.data.jobs);
  } catch (error) {
    console.log("❌ Error fetching jobs:", error);
    console.log("❌ Error details:", error.response?.data);
    if (error.response?.status === 403) {
      alert('Session expired. Please login again.');
      navigate('/login');
    }
  } finally {
    setLoading(false);
  }
};

  // ✅ Load available jobs for service providers
  const loadAvailableJobs = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/api/jobs/available",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvailableJobs(response.data.jobs);
    } catch (error) {
      console.log("Error loading available jobs:", error);
    }
  };

  // ✅ Create Job (for clients only)
  const createJob = async () => {
    if (!serviceCategory || !serviceType) {
      alert("Please choose a service category and type");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const userRole = sessionStorage.getItem("userRole");

      if (userRole !== 'client') {
        alert('Only clients can create service requests');
        return;
      }

      console.log('🔍 Creating job with:', {
        serviceCategory,
        serviceType, 
        description,
        userRole
      });

      const response = await axios.post(
        "http://localhost:3001/api/jobs/create",
        { serviceCategory, serviceType, description },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      console.log('Job creation response:', response.data);
      alert("Service request submitted ");
      
      // Reset form
      setServiceCategory("");
      setServiceType("");
      setDescription("");
      
      // Reload jobs
      loadJobs();

    } catch (error) {
      console.log("❌ Job creation failed:", error);
      console.log("❌ Error response:", error.response?.data);
      
      if (error.code === 'ECONNABORTED') {
        alert('Request timeout - backend might be down');
      } else if (error.response) {
        alert(`Failed: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        alert('No response from server - check if backend is running');
      } else {
        alert('Unknown error occurred');
      }
    }
  };

  // ✅ Accept a job as a service provider
  const acceptJob = async (jobId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3001/api/jobs/accept/${jobId}`,
        { status: "In Progress" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✅ Job accepted:', response.data);
      alert("Job accepted successfully!");
      
      // Refresh both job lists
      loadAvailableJobs();
      loadJobs();
    } catch (error) {
      console.log("Error accepting job:", error);
      alert("Failed to accept job");
    }
  };

  // ✅ Complete a job as a service provider
  const completeJob = async (jobId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/jobs/update/${jobId}`,
        { status: "Completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Job marked as completed!");
      loadJobs();
    } catch (error) {
      console.log("Error completing job:", error);
      alert("Failed to update job status");
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");
    const userName = sessionStorage.getItem("userName");
    
    if (!token || !userId) {
      navigate("/login");
      return;
    }
    
    setUser({ userId, role: userRole, name: userName });
    loadJobs();
    
    // Load available jobs if user is a service provider
    if (userRole === 'serviceProvider') {
      loadAvailableJobs();
    }
  }, [navigate]);

  // ✅ Render job card with appropriate actions
  const renderJob = (item) => (
    <div key={item._id} className="job-card">
      <h4>📌 {item.serviceType}</h4>
      <p><strong>Category:</strong> {item.serviceCategory}</p>
      <p><strong>Status:</strong> <span className={`status-${item.status.toLowerCase()}`}>{item.status}</span></p>
      <p><strong>Description:</strong> {item.description || "No description provided"}</p>
      <p><strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
      
      {/* Show complete button for providers on in-progress jobs */}
      {user?.role === 'serviceProvider' && item.status === 'In Progress' && (
        <button 
          onClick={() => completeJob(item._id)}
          className="complete-btn"
        >
          Mark as Completed
        </button>
      )}
    </div>
  );

  // ✅ Render available job card for providers
  const renderAvailableJob = (item) => (
    <div key={item._id} className="job-card available">
      <h4>📌 {item.serviceType}</h4>
      <p><strong>Category:</strong> {item.serviceCategory}</p>
      <p><strong>Client:</strong> {item.clientId?.name || 'Unknown Client'}</p>
      <p><strong>Description:</strong> {item.description || "No description provided"}</p>
      <p><strong>Posted:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
      <button 
        onClick={() => acceptJob(item._id)}
        className="accept-btn"
      >
        Accept Job ✅
      </button>
    </div>
  );

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Home Services 🛠</h1>
          {user && (
            <p className="user-info">
              Welcome, {user.name}
            </p>
          )}
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout 🚪</button>
      </header>

      <div className="main-content">
        {/* CLIENT VIEW - Show job creation form */}
        {user?.role === 'client' && (
          <section className="create-job-section">
            <h2>Create Service Request</h2>

            <div className="form-group">
              <label>Choose Category:</label>
              <div className="button-group">
                {Object.keys(categories).map((cat) => (
                  <button
                    key={cat}
                    className={`category-btn ${serviceCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setServiceCategory(cat);
                      setServiceType("");
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {serviceCategory && (
              <div className="form-group">
                <label>Select Service Type:</label>
                <div className="button-group">
                  {categories[serviceCategory].map((type) => (
                    <button
                      key={type}
                      className={`service-type-btn ${serviceType === type ? 'active' : ''}`}
                      onClick={() => setServiceType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Description (optional):</label>
              <textarea
                placeholder="Describe the issue or service needed..."
                className="description-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>

            <button onClick={createJob} className="submit-btn">
              Submit Request ✅
            </button>
          </section>
        )}

        {/* SERVICE PROVIDER VIEW - Show available jobs */}
        {user?.role === 'serviceProvider' && (
          <section className="provider-dashboard">
            <h2>Available Service Requests</h2>
            <div className="available-jobs">
              {availableJobs.length === 0 ? (
                <div className="no-jobs">
                  <p>No service requests available at the moment.</p>
                  <p>Check back later for new requests!</p>
                </div>
              ) : (
                <div className="jobs-list">
                  {availableJobs.map(renderAvailableJob)}
                </div>
              )}
            </div>
          </section>
        )}

        {/* COMMON VIEW - Show user's jobs */}
        <section className="jobs-section">
          <h2>
            {user?.role === 'client' ? 'Your Service Requests' : 'Your Accepted Jobs'}
          </h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="no-jobs">
              <p>
                {user?.role === 'client' 
                  ? 'No service requests yet.' 
                  : 'No accepted jobs yet.'
                }
              </p>
              {user?.role === 'client' && (
                <p>Create your first service request using the form above!</p>
              )}
            </div>
          ) : (
            <div className="jobs-list">
              {jobs.map(renderJob)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}