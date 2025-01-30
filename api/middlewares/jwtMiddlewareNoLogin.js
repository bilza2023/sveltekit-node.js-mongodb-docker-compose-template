const jwt = require('jsonwebtoken');
const User = require('../schemas/User');

async function jwtMiddlewareNoLogin(req, res, next) {
   
  const token = req.headers.authorization?.split(' ')[1]; // Extract token

  if (!token) {
    // No token provided, allow access but set user to null
    req.user = null;
    return next();
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, 'eea2c1ce3117d5bbba96b9e6791d97d98ca5efd90d242e96927e7ecf79fe97ddf05f071f2ef2352715008adaa4cb2163a647fd0e9cf2343728052be0ceecbfd3'); // Replace with your secret key

    // Fetch the user from the database
    const user = await User.findById(decoded.id);
    if (!user) {
      req.user = null; // Set user to null if not found
      return next();
    }

    // Attach the user --if there is user it has to have role.
    req.user = user;
    if (!user.role) {
        return res.status(403).json({ message: 'User role not found or invalid' });
      }
    next();
  } catch (err) {
    // On invalid token, allow access but set user to null
    req.user = null;
    next();
  }
}

module.exports = jwtMiddlewareNoLogin;
