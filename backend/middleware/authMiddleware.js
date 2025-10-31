const jwt = require("jsonwebtoken");

module.exports = function (roles = []) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      console.log('🔐 Auth Middleware - Headers:', {
        authorization: authHeader,
        url: req.url,
        method: req.method
      });

      if (!authHeader) {
        console.log(' No authorization header');
        return res.status(401).json({ message: "Authorization header missing" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        console.log(' No token in authorization header');
        return res.status(401).json({ message: "Token missing" });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          console.log(' JWT verification failed:', err.message);
          return res.status(403).json({ message: "Invalid or expired token" });
        }

        console.log(' JWT verified - User:', user);
        req.user = user;

        // Convert single role to array if needed
        const requiredRoles = Array.isArray(roles) ? roles : [roles];
        
        // Role-based access check (if roles provided)
        if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
          console.log(' Role check failed - User role:', user.role, 'Required:', requiredRoles);
          return res.status(403).json({ message: "Access denied: insufficient role" });
        }

        console.log(' Auth successful, proceeding to route');
        next();
      });
    } catch (error) {
      console.error(' Auth middleware error:', error);
      return res.status(500).json({ message: "Auth Middleware error" });
    }
  };
};
