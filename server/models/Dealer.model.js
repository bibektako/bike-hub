import mongoose from 'mongoose';

const dealerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dealer name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['showroom', 'service_type'],
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'Nepal'
    }
  },
  location: {
    latitude: {
      type: Number,
      required: false
    },
    longitude: {
      type: Number,
      required: false
    },
    mapLink: {
      type: String,
      required: false
    }
  },
  workingHours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: true } }
  },
  brands: [String], // Brands they deal with
  services: [String], // Services offered
  onRoadPrices: [{
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bike'
    },
    price: Number,
    lastUpdated: Date
  }],
  sparePartsPrices: [{
    partName: String,
    price: Number,
    bikeModel: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Dealer', dealerSchema);

