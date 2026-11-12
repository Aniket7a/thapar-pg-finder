import Favorite from '../models/Favorite.js';
import Property from '../models/Property.js';

// @desc    Toggle property favorite
// @route   POST /api/favorites/:propertyId
// @access  Private (Student)
export const toggleFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const existing = await Favorite.findOne({
      student: req.user.id,
      property: propertyId,
    });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        favorited: false,
        message: 'Removed from saved properties.',
      });
    }

    await Favorite.create({
      student: req.user.id,
      property: propertyId,
    });

    res.status(201).json({
      success: true,
      favorited: true,
      message: 'Saved to favorites.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's favorite properties
// @route   GET /api/favorites
// @access  Private (Student)
export const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ student: req.user.id })
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name phone email avatar isVerified' },
      })
      .sort({ createdAt: -1 });

    const properties = favorites.map((f) => f.property).filter(Boolean);

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};
