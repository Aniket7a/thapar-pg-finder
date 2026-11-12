import Property from '../models/Property.js';
import { uploadToStorage } from '../config/cloudinary.js';

// @desc    Get all properties with filtering, sorting, pagination
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res, next) => {
  try {
    const {
      keyword,
      locality,
      propertyType,
      genderPreference,
      occupancyType,
      minRent,
      maxRent,
      maxDistance,
      wifi,
      ac,
      food,
      laundry,
      parking,
      attachedBathroom,
      powerBackup,
      cctv,
      availableOnly,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    // Search keyword in title or locality or description
    if (keyword && keyword.trim() !== '') {
      const regex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { 'address.locality': regex },
        { 'address.street': regex },
      ];
    }

    if (locality && locality !== 'all') {
      query['address.locality'] = new RegExp(locality.trim(), 'i');
    }

    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    if (genderPreference && genderPreference !== 'all') {
      query.genderPreference = genderPreference;
    }

    if (occupancyType && occupancyType !== 'all') {
      query.occupancyTypes = { $in: [occupancyType] };
    }

    // Rent filter
    if (minRent || maxRent) {
      query['pricing.monthlyRent'] = {};
      if (minRent) query['pricing.monthlyRent'].$gte = Number(minRent);
      if (maxRent) query['pricing.monthlyRent'].$lte = Number(maxRent);
    }

    // Distance from Thapar University filter
    if (maxDistance) {
      query.distanceFromThapar = { $lte: Number(maxDistance) };
    }

    // Amenity filters
    if (wifi === 'true') query['amenities.wifi'] = true;
    if (ac === 'true') query['amenities.ac'] = true;
    if (food === 'true') query['amenities.food'] = true;
    if (laundry === 'true') query['amenities.laundry'] = true;
    if (parking === 'true') query['amenities.parking'] = true;
    if (attachedBathroom === 'true') query['amenities.attachedBathroom'] = true;
    if (powerBackup === 'true') query['amenities.powerBackup'] = true;
    if (cctv === 'true') query['amenities.cctv'] = true;

    // Available beds filter
    if (availableOnly === 'true') {
      query.availableBeds = { $gt: 0 };
    }

    // Sorting
    let sortOption = { isFeatured: -1, createdAt: -1 }; // default featured first
    if (sort === 'rentAsc') sortOption = { 'pricing.monthlyRent': 1 };
    else if (sort === 'rentDesc') sortOption = { 'pricing.monthlyRent': -1 };
    else if (sort === 'ratingDesc') sortOption = { averageRating: -1, totalReviews: -1 };
    else if (sort === 'distanceAsc') sortOption = { distanceFromThapar: 1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar isVerified')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone avatar isVerified ownerDetails emergencyContact');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found.',
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property listing (Owner only)
// @route   POST /api/properties
// @access  Private (Owner/Admin)
export const createProperty = async (req, res, next) => {
  try {
    const propertyData = req.body;

    // Attach current user as owner
    propertyData.owner = req.user.id;

    // Parse nested objects if sent as JSON strings via form-data
    if (typeof propertyData.address === 'string') propertyData.address = JSON.parse(propertyData.address);
    if (typeof propertyData.pricing === 'string') propertyData.pricing = JSON.parse(propertyData.pricing);
    if (typeof propertyData.amenities === 'string') propertyData.amenities = JSON.parse(propertyData.amenities);
    if (typeof propertyData.coordinates === 'string') propertyData.coordinates = JSON.parse(propertyData.coordinates);
    if (typeof propertyData.occupancyTypes === 'string') propertyData.occupancyTypes = JSON.parse(propertyData.occupancyTypes);
    if (typeof propertyData.rulesAndRestrictions === 'string') propertyData.rulesAndRestrictions = JSON.parse(propertyData.rulesAndRestrictions);
    if (typeof propertyData.nearbyFacilities === 'string') propertyData.nearbyFacilities = JSON.parse(propertyData.nearbyFacilities);

    // Handle uploaded files if any
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const uploaded = await uploadToStorage(file);
        uploadedImages.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
          isPrimary: i === 0,
        });
      }
      propertyData.images = uploadedImages;
    }

    // Fallback if no images provided
    if (!propertyData.images || propertyData.images.length === 0) {
      propertyData.images = [
        {
          url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
          caption: 'Spacious PG Room near Thapar University',
          isPrimary: true,
        },
      ];
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property listing created successfully.',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property listing
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
export const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this listing.',
      });
    }

    const updateData = req.body;

    if (typeof updateData.address === 'string') updateData.address = JSON.parse(updateData.address);
    if (typeof updateData.pricing === 'string') updateData.pricing = JSON.parse(updateData.pricing);
    if (typeof updateData.amenities === 'string') updateData.amenities = JSON.parse(updateData.amenities);

    property = await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully.',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing.',
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner listings
// @route   GET /api/properties/owner/my-listings
// @access  Private (Owner)
export const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare multiple properties side-by-side
// @route   POST /api/properties/compare
// @access  Public
export const compareProperties = async (req, res, next) => {
  try {
    const { propertyIds } = req.body;
    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of property IDs to compare.',
      });
    }

    const properties = await Property.find({ _id: { $in: propertyIds } })
      .populate('owner', 'name phone email avatar isVerified');

    res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    next(error);
  }
};
