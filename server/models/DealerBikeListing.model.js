import mongoose from 'mongoose';

const dealerBikeListingSchema = new mongoose.Schema({
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',
    required: true
  },
  bike: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bike',
    required: true
  },
  availableForTestRide: {
    type: Boolean,
    default: true
  },
  availableForPurchase: {
    type: Boolean,
    default: true
  },
  onRoadPrice: {
    type: Number,
    required: false
  },
  stock: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index to prevent duplicate listings
dealerBikeListingSchema.index({ dealer: 1, bike: 1 }, { unique: true });

export default mongoose.model('DealerBikeListing', dealerBikeListingSchema);

