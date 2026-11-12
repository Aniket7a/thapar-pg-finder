import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a property title'],
      trim: true,
      maxlength: [120, 'Title cannot be more than 120 characters'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please select property type'],
      enum: ['PG', 'Hostel', 'Flat', 'Single Room', 'Shared Room'],
      default: 'PG',
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed property description'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      street: { type: String, required: true },
      locality: {
        type: String,
        required: true,
        trim: true,
      }, // e.g. Bhadson Road, Prem Nagar, Model Town, SST Nagar, Punjabi Bagh, Thapar Gate 1
      city: { type: String, default: 'Patiala' },
      state: { type: String, default: 'Punjab' },
      pincode: { type: String, default: '147004' },
      landmark: { type: String, default: 'Near Thapar University Main Gate' },
    },
    distanceFromThapar: {
      type: Number, // in kilometers, e.g. 0.4, 1.2
      required: [true, 'Please provide distance from Thapar University (km)'],
    },
    coordinates: {
      lat: { type: Number, default: 30.3533 },
      lng: { type: Number, default: 76.3620 },
    },
    pricing: {
      monthlyRent: {
        type: Number,
        required: [true, 'Please specify monthly rent per student/bed'],
      },
      securityDeposit: {
        type: Number,
        required: [true, 'Please specify security deposit amount'],
      },
      electricityCharges: {
        type: String,
        default: 'Included in rent',
      }, // e.g. 'Included', '₹9/unit submeter', 'Shared actuals'
      waterCharges: {
        type: String,
        default: 'Included',
      },
      maintenanceCharges: {
        type: Number,
        default: 0,
      },
    },
    genderPreference: {
      type: String,
      required: [true, 'Please specify gender preference'],
      enum: ['Boys', 'Girls', 'Co-ed'],
      default: 'Boys',
    },
    occupancyTypes: {
      type: [String], // ['Single', 'Double Sharing', 'Triple Sharing', 'Four Sharing']
      default: ['Double Sharing'],
    },
    totalRooms: {
      type: Number,
      default: 10,
    },
    totalBeds: {
      type: Number,
      required: [true, 'Please specify total number of beds'],
      default: 20,
    },
    availableBeds: {
      type: Number,
      required: [true, 'Please specify available beds'],
      default: 5,
    },
    amenities: {
      wifi: { type: Boolean, default: true },
      ac: { type: Boolean, default: true },
      food: { type: Boolean, default: true },
      foodType: {
        type: String,
        enum: ['Veg', 'Non-Veg', 'Both', 'None'],
        default: 'Both',
      },
      mealsProvided: {
        type: [String], // ['Breakfast', 'Lunch', 'Evening Tea', 'Dinner']
        default: ['Breakfast', 'Dinner'],
      },
      laundry: { type: Boolean, default: true },
      powerBackup: { type: Boolean, default: true },
      cctv: { type: Boolean, default: true },
      parking: { type: Boolean, default: true },
      attachedBathroom: { type: Boolean, default: true },
      furnished: {
        type: String,
        enum: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'],
        default: 'Fully Furnished',
      },
      refrigerator: { type: Boolean, default: true },
      waterCoolerRO: { type: Boolean, default: true },
      studyTable: { type: Boolean, default: true },
      geyser: { type: Boolean, default: true },
      housekeeping: { type: Boolean, default: true },
    },
    rulesAndRestrictions: {
      type: [String],
      default: [
        'Curfew time: 10:00 PM',
        'No smoking or alcohol on premises',
        'Day visitors allowed in reception area only',
        'Maintain quiet hours after 11:00 PM',
      ],
    },
    minRentalDurationMonths: {
      type: Number,
      default: 6,
    },
    noticePeriodDays: {
      type: Number,
      default: 30,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        caption: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    nearbyFacilities: [
      {
        name: { type: String },
        category: {
          type: String,
          enum: ['University Gate', 'Hospital', 'Library', 'Market', 'Gym', 'Metro/Bus', 'Cafe'],
        },
        distance: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound and text indexes for fast querying and full-text search
propertySchema.index({
  title: 'text',
  description: 'text',
  'address.locality': 'text',
});
propertySchema.index({ distanceFromThapar: 1 });
propertySchema.index({ 'pricing.monthlyRent': 1 });
propertySchema.index({ genderPreference: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ isVerified: 1, isFeatured: 1 });

const Property = mongoose.model('Property', propertySchema);
export default Property;
