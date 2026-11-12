import RentalAgreement from '../models/RentalAgreement.js';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';

// @desc    Generate or initialize rental agreement from booking
// @route   POST /api/agreements/generate
// @access  Private (Owner/Student)
export const generateAgreement = async (req, res, next) => {
  try {
    const { bookingId, customTerms } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('property')
      .populate('student')
      .populate('owner');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Check if agreement already exists for this booking
    let agreement = await RentalAgreement.findOne({ booking: bookingId });
    if (agreement) {
      return res.status(200).json({
        success: true,
        message: 'Existing agreement retrieved.',
        agreement,
      });
    }

    const startDate = booking.moveInDate || new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (booking.rentalDurationMonths || 11));

    const defaultTerms = {
      landlordLegalName: booking.owner.name,
      landlordAddress: `${booking.property.address.street}, ${booking.property.address.locality}, Patiala, Punjab`,
      landlordPhone: booking.owner.phone,
      tenantLegalName: booking.student.name,
      tenantAddress: booking.student.studentDetails?.thaparRollNo
        ? `Thapar University Enrolled (Roll: ${booking.student.studentDetails.thaparRollNo}), Patiala`
        : 'Student Resident, Patiala',
      tenantPhone: booking.student.phone,
      tenantThaparId: booking.student.studentDetails?.thaparRollNo || 'TIET-ENROLLED',
      propertyAddress: `${booking.property.title}, ${booking.property.address.street}, ${booking.property.address.locality}, Patiala, Punjab - ${booking.property.address.pincode}`,
      roomDetails: `${booking.roomType} (${booking.property.propertyType})`,
      monthlyRent: booking.monthlyRent || booking.property.pricing.monthlyRent,
      securityDeposit: booking.securityDeposit || booking.property.pricing.securityDeposit,
      paymentDueDate: 5,
      electricityCharges: booking.property.pricing.electricityCharges || 'Included',
      waterCharges: booking.property.pricing.waterCharges || 'Included',
      maintenanceCharges: booking.property.pricing.maintenanceCharges || 0,
      startDate,
      endDate,
      minimumStayMonths: booking.property.minRentalDurationMonths || 6,
      noticePeriodDays: booking.property.noticePeriodDays || 30,
      lateFeePerDay: 50,
      damageDepositDeductionPolicy:
        'Damage to furnishings, electricals, or structure beyond ordinary wear and tear will be deducted with documented invoices.',
      houseRules: booking.property.rulesAndRestrictions || [
        'Curfew: 10:00 PM',
        'No smoking or substance consumption',
        'Quiet hours: 11:00 PM to 06:00 AM',
      ],
      guestPolicy: 'Visitors permitted in public lounge until 8:00 PM. No unauthorized overnight guests.',
      disputeResolution: 'Exclusive jurisdiction of civil courts at Patiala, Punjab, India.',
    };

    agreement = await RentalAgreement.create({
      booking: booking._id,
      property: booking.property._id,
      student: booking.student._id,
      owner: booking.owner._id,
      terms: { ...defaultTerms, ...customTerms },
      status: 'Pending Student Signature',
      legalDisclaimerAcknowledged: true,
    });

    // Update booking reference
    booking.agreement = agreement._id;
    booking.status = 'Agreement Pending';
    await booking.save();

    await Notification.create({
      user: booking.student._id,
      title: 'Rental Agreement Ready for Signature',
      message: `A digital rental agreement for ${booking.property.title} is ready for your review and signature.`,
      type: 'agreement',
      link: `/student/agreements/${agreement._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Rental agreement drafted successfully.',
      agreement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sign agreement digitally
// @route   POST /api/agreements/:id/sign
// @access  Private
export const signAgreement = async (req, res, next) => {
  try {
    const { signatureData, legalDisclaimerConsent } = req.body;

    if (!legalDisclaimerConsent) {
      return res.status(400).json({
        success: false,
        message: 'You must acknowledge and consent to the legal terms and statutory disclaimer before signing.',
      });
    }

    if (!signatureData) {
      return res.status(400).json({
        success: false,
        message: 'Signature capture data is required.',
      });
    }

    const agreement = await RentalAgreement.findById(req.params.id)
      .populate('property')
      .populate('student')
      .populate('owner');

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Rental agreement not found.',
      });
    }

    const isStudent = agreement.student._id.toString() === req.user.id;
    const isOwner = agreement.owner._id.toString() === req.user.id;

    if (!isStudent && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to sign this agreement.',
      });
    }

    if (isStudent) {
      agreement.studentSignature = {
        signed: true,
        signatureData,
        signedAt: new Date(),
        signedByName: req.user.name,
      };
      if (!agreement.ownerSignature.signed) {
        agreement.status = 'Pending Owner Signature';
      }
    }

    if (isOwner) {
      agreement.ownerSignature = {
        signed: true,
        signatureData,
        signedAt: new Date(),
        signedByName: req.user.name,
      };
    }

    // If both signed, mark as Signed!
    if (agreement.studentSignature.signed && agreement.ownerSignature.signed) {
      agreement.status = 'Signed';

      // Update booking to Confirmed!
      await Booking.findByIdAndUpdate(agreement.booking, { status: 'Confirmed' });
      // Reduce available beds in Property
      await Property.findByIdAndUpdate(agreement.property._id, { $inc: { availableBeds: -1 } });

      await Notification.create({
        user: agreement.student._id,
        title: 'Agreement Fully Executed!',
        message: `Both parties have executed the rental agreement for ${agreement.property.title}. Welcome to your new stay!`,
        type: 'agreement',
        link: `/agreements/${agreement._id}`,
      });

      await Notification.create({
        user: agreement.owner._id,
        title: 'Agreement Fully Executed!',
        message: `Rental agreement for ${agreement.property.title} is now fully signed and confirmed.`,
        type: 'agreement',
        link: `/agreements/${agreement._id}`,
      });
    }

    await agreement.save();

    res.status(200).json({
      success: true,
      message: 'Agreement signed successfully.',
      agreement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agreement by ID
// @route   GET /api/agreements/:id
// @access  Private
export const getAgreementById = async (req, res, next) => {
  try {
    const agreement = await RentalAgreement.findById(req.params.id)
      .populate('property')
      .populate('student', 'name email phone studentDetails')
      .populate('owner', 'name email phone avatar');

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Rental agreement not found.',
      });
    }

    res.status(200).json({
      success: true,
      agreement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my agreements
// @route   GET /api/agreements/my/list
// @access  Private
export const getMyAgreements = async (req, res, next) => {
  try {
    const query =
      req.user.role === 'owner' ? { owner: req.user.id } : { student: req.user.id };

    const agreements = await RentalAgreement.find(query)
      .populate('property', 'title address pricing images')
      .populate('student', 'name email phone')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: agreements.length,
      agreements,
    });
  } catch (error) {
    next(error);
  }
};
