const dbConnect = require('../../lib/db');
const Admin = require('../../models/Admin');
const { comparePassword, hashPassword, signToken } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  // Setup CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    await dbConnect();

    const { username, password, setupKey } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Check if any admin exists in the database
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      // First-time setup seed helper
      const envSetupKey = process.env.ADMIN_SETUP_KEY;
      if (!envSetupKey) {
        return res.status(500).json({ 
          success: false, 
          message: 'System is uninitialized. Please define ADMIN_SETUP_KEY in your environment to seed the first admin.' 
        });
      }

      if (setupKey === envSetupKey) {
        const hashedPassword = await hashPassword(password);
        const newAdmin = new Admin({
          username,
          password: hashedPassword
        });
        await newAdmin.save();

        const token = signToken({ id: newAdmin._id, username: newAdmin.username });
        return res.status(201).json({
          success: true,
          message: 'Admin account initialized successfully.',
          token
        });
      } else {
        return res.status(400).json({
          success: false,
          needsSetup: true,
          message: 'System is uninitialized. Provide a valid setupKey in the request body to seed the first admin.'
        });
      }
    }

    // Standard Login Authentication
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = signToken({ id: admin._id, username: admin.username });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error('Login Endpoint Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
