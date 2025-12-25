import express from 'express';
import Bike from '../models/Bike.model.js';
import Booking from '../models/Booking.model.js';
import User from '../models/User.model.js';
import Dealer from '../models/Dealer.model.js';
import Promotion from '../models/Promotion.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { sendDealerWelcomeEmail } from '../utils/emailService.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images and 3D models
const fileFilter = (req, file, cb) => {
  // Allow images
  if (file.fieldname === 'images') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for images field'), false);
    }
  }
  // Allow 3D models (GLB/GLTF)
  else if (file.fieldname === 'model360') {
    const allowedTypes = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
    const allowedExtensions = ['.glb', '.gltf'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only GLB or GLTF files are allowed for 3D models'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBikes = await Bike.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalDealers = await Dealer.countDocuments();
    
    // Most viewed bikes
    const mostViewedBikes = await Bike.find()
      .sort({ views: -1 })
      .limit(5)
      .select('name brand views');
    
    // Most compared bikes
    const mostComparedBikes = await Bike.find()
      .sort({ comparisons: -1 })
      .limit(5)
      .select('name brand comparisons');
    
    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('bike', 'name brand')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      totalUsers,
      totalBikes,
      totalBookings,
      totalDealers,
      mostViewedBikes,
      mostComparedBikes,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/bikes
// @desc    Create bike with image and 3D model upload
// @access  Private/Admin
router.post('/bikes', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'model360', maxCount: 1 }
]), async (req, res) => {
  try {
    const bikeData = { ...req.body };
    
    // Parse JSON fields
    if (bikeData.specifications) {
      bikeData.specifications = JSON.parse(bikeData.specifications);
    }
    if (bikeData.images && typeof bikeData.images === 'string') {
      bikeData.images = JSON.parse(bikeData.images);
    }
    
    // Add uploaded images
    if (req.files && req.files.images && req.files.images.length > 0) {
      const imageUrls = req.files.images.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: bikeData.name || 'Bike image'
      }));
      bikeData.images = [...(bikeData.images || []), ...imageUrls];
    }
    
    // Add 3D model if uploaded
    if (req.files && req.files.model360 && req.files.model360.length > 0) {
      bikeData.model360 = `/uploads/${req.files.model360[0].filename}`;
    }
    
    const bike = await Bike.create(bikeData);
    res.status(201).json(bike);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/bikes/:id
// @desc    Update bike with image and 3D model upload
// @access  Private/Admin
router.put('/bikes/:id', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'model360', maxCount: 1 }
]), async (req, res) => {
  try {
    const bikeData = { ...req.body };
    
    // Parse JSON fields
    if (bikeData.specifications) {
      bikeData.specifications = JSON.parse(bikeData.specifications);
    }
    
    // Handle images
    if (req.files && req.files.images && req.files.images.length > 0) {
      const imageUrls = req.files.images.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: bikeData.name || 'Bike image'
      }));
      
      // Get existing bike to merge images
      const existingBike = await Bike.findById(req.params.id);
      const existingImages = existingBike?.images || [];
      bikeData.images = [...existingImages, ...imageUrls];
    }
    
    // Handle 3D model
    if (req.files && req.files.model360 && req.files.model360.length > 0) {
      bikeData.model360 = `/uploads/${req.files.model360[0].filename}`;
    }
    
    const bike = await Bike.findByIdAndUpdate(
      req.params.id,
      bikeData,
      { new: true, runValidators: true }
    );
    
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    
    res.json(bike);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/dealers
// @desc    Get all dealers (Admin)
// @access  Private/Admin
router.get('/dealers', async (req, res) => {
  try {
    const dealers = await Dealer.find().sort({ createdAt: -1 });
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/dealers
// @desc    Create dealer and user account
// @access  Private/Admin
router.post('/dealers', async (req, res) => {
  try {
    const { email, phone, name, ...dealerData } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Generate temporary password
    const temporaryPassword = crypto.randomBytes(8).toString('hex').toUpperCase();
    const passwordExpiry = new Date();
    passwordExpiry.setDate(passwordExpiry.getDate() + 3); // 3 days from now
    
    // Create dealer
    const dealer = await Dealer.create({
      ...dealerData,
      email,
      phone,
      name
    });
    
    // Create user account for dealer
    const user = await User.create({
      name: dealer.name,
      email: dealer.email,
      phone: dealer.phone,
      password: temporaryPassword, // Will be hashed by pre-save hook
      role: 'dealer',
      dealerId: dealer._id,
      mustChangePassword: true,
      temporaryPassword: temporaryPassword,
      temporaryPasswordExpiry: passwordExpiry
    });
    
    // Send welcome email with temporary password
    const emailSent = await sendDealerWelcomeEmail(
      email,
      dealer.name,
      temporaryPassword,
      dealer.name
    );
    
    if (!emailSent) {
      console.warn(`⚠️ Failed to send email to ${email}, but dealer account created`);
    }
    
    res.status(201).json({
      dealer,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      message: 'Dealer created successfully. Welcome email sent with temporary password.'
    });
  } catch (error) {
    console.error('Error creating dealer:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/dealers/:id
// @desc    Delete dealer
// @access  Private/Admin
router.delete('/dealers/:id', async (req, res) => {
  try {
    await Dealer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Dealer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/promotions
// @desc    Get all promotions (Public for home page, Admin for management)
// @access  Public (for viewing), Private/Admin (for management)
router.get('/promotions', async (req, res) => {
  try {
    const promotions = await Promotion.find({ isActive: true }).sort({ priority: -1, createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/promotions
// @desc    Create promotion
// @access  Private/Admin
router.post('/promotions', upload.single('image'), async (req, res) => {
  try {
    const promotionData = { ...req.body };
    
    if (req.file) {
      promotionData.image = `/uploads/${req.file.filename}`;
    }
    
    const promotion = await Promotion.create(promotionData);
    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/promotions/:id
// @desc    Update promotion
// @access  Private/Admin
router.put('/promotions/:id', upload.single('image'), async (req, res) => {
  try {
    const promotionData = { ...req.body };
    
    if (req.file) {
      promotionData.image = `/uploads/${req.file.filename}`;
    }
    
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      promotionData,
      { new: true }
    );
    
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/promotions/:id
// @desc    Delete promotion
// @access  Private/Admin
router.delete('/promotions/:id', async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

