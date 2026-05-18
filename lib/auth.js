const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env');
}

/**
 * Hash password with bcrypt using 12 salt rounds
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

/**
 * Compare plain password against bcrypt hash
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Sign JWT token valid for 24 hours
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Verify JWT token and return decoded payload or null
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Middleware wrapper for Vercel serverless functions to secure admin routes.
 * Inspects Authorization header for a Bearer JWT.
 */
function withAdminAuth(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Token is missing.' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Token is invalid or expired.' });
      }

      // Attach decoded admin payload to request object
      req.admin = decoded;

      return await handler(req, res);
    } catch (err) {
      console.error('Auth Middleware Error:', err);
      return res.status(500).json({ success: false, message: 'Internal server authorization error.' });
    }
  };
}

module.exports = {
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
  withAdminAuth
};
