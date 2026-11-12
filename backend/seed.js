import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Property from './models/Property.js';
import Review from './models/Review.js';
import Booking from './models/Booking.js';
import Favorite from './models/Favorite.js';
import RentalAgreement from './models/RentalAgreement.js';
import Message from './models/Message.js';
import Notification from './models/Notification.js';
import Complaint from './models/Complaint.js';
import PropertyVisit from './models/PropertyVisit.js';
import Report from './models/Report.js';
import { sampleUsers, sampleProperties } from './utils/seedData.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Starting database seed process...');
    await connectDB();

    // Clear existing data in all 11 collections
    console.log('[Seed] Cleaning existing documents...');
    await User.deleteMany();
    await Property.deleteMany();
    await Review.deleteMany();
    await Booking.deleteMany();
    await Favorite.deleteMany();
    await RentalAgreement.deleteMany();
    await Message.deleteMany();
    await Notification.deleteMany();
    await Complaint.deleteMany();
    await PropertyVisit.deleteMany();
    await Report.deleteMany();

    // 1. Insert Users
    console.log('[Seed] Inserting users...');
    const createdUsers = await User.create(sampleUsers);
    console.log(`[Seed] Created ${createdUsers.length} users.`);

    const student1 = createdUsers.find((u) => u.email === 'student@thapar.edu');
    const student2 = createdUsers.find((u) => u.email === 'riya@thapar.edu');
    const owner1 = createdUsers.find((u) => u.email === 'owner1@patialapg.com');
    const owner2 = createdUsers.find((u) => u.email === 'owner2@patialapg.com');
    const owner3 = createdUsers.find((u) => u.email === 'owner3@patialapg.com');

    // 2. Insert Properties distributed among owners
    console.log('[Seed] Inserting properties near Thapar University...');
    const propertiesWithOwners = sampleProperties.map((p, index) => {
      let owner = owner1._id;
      if (p.genderPreference === 'Girls') owner = owner2._id;
      else if (index % 3 === 0) owner = owner3._id;

      return {
        ...p,
        owner,
      };
    });

    const createdProperties = await Property.create(propertiesWithOwners);
    console.log(`[Seed] Inserted ${createdProperties.length} realistic properties near Thapar University.`);

    // 3. Insert Reviews
    console.log('[Seed] Inserting initial student reviews...');
    const reviews = [
      {
        property: createdProperties[0]._id,
        student: student1._id,
        ratings: {
          overall: 5,
          cleanliness: 5,
          location: 5,
          food: 4,
          safety: 5,
          ownerBehaviour: 5,
          valueForMoney: 5,
        },
        comment:
          'Hands down the best boys PG near Thapar! Walking to Gate 2 takes barely 4 minutes. Food is wholesome and the Wi-Fi speed is solid even during online coding assessments.',
        isVerifiedStay: true,
        ownerResponse: {
          text: 'Thank you Aarav! Best wishes for your upcoming placement drives.',
          respondedAt: new Date(),
        },
      },
      {
        property: createdProperties[1]._id,
        student: student2._id,
        ratings: {
          overall: 5,
          cleanliness: 5,
          location: 5,
          food: 5,
          safety: 5,
          ownerBehaviour: 5,
          valueForMoney: 4,
        },
        comment:
          'Extremely safe and comfortable girls hostel. The lady warden is very supportive and the biometric system gives complete peace of mind. Highly recommend to 1st and 2nd year TIET girls.',
        isVerifiedStay: true,
      },
    ];
    await Review.create(reviews);

    // 4. Insert Sample Booking
    console.log('[Seed] Inserting sample booking...');
    const booking = await Booking.create({
      student: student1._id,
      property: createdProperties[0]._id,
      owner: owner1._id,
      roomType: 'Double Sharing',
      monthlyRent: createdProperties[0].pricing.monthlyRent,
      securityDeposit: createdProperties[0].pricing.securityDeposit,
      moveInDate: new Date(),
      rentalDurationMonths: 11,
      personalMessage: 'Hello, looking forward to staying here for the 5th and 6th semester.',
      status: 'Confirmed',
    });

    // 5. Insert Sample Rental Agreement
    console.log('[Seed] Generating sample digital rental agreement...');
    const agreement = await RentalAgreement.create({
      booking: booking._id,
      property: createdProperties[0]._id,
      student: student1._id,
      owner: owner1._id,
      terms: {
        landlordLegalName: owner1.name,
        landlordAddress: `${createdProperties[0].address.street}, Patiala, Punjab`,
        landlordPhone: owner1.phone,
        tenantLegalName: student1.name,
        tenantAddress: `Thapar University Enrolled (Roll: 102203045), Patiala`,
        tenantPhone: student1.phone,
        tenantThaparId: '102203045',
        propertyAddress: `${createdProperties[0].title}, ${createdProperties[0].address.street}, Patiala, Punjab - 147004`,
        roomDetails: 'Double Sharing (PG)',
        monthlyRent: 8500,
        securityDeposit: 8500,
        paymentDueDate: 5,
        electricityCharges: 'Included in rent',
        waterCharges: 'Included',
        maintenanceCharges: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 330 * 24 * 60 * 60 * 1000),
        minimumStayMonths: 6,
        noticePeriodDays: 30,
        lateFeePerDay: 50,
        damageDepositDeductionPolicy: 'Damage beyond regular wear deducted with receipts.',
        houseRules: createdProperties[0].rulesAndRestrictions,
        guestPolicy: 'Day guests permitted in common area until 8:00 PM.',
        disputeResolution: 'Exclusive jurisdiction of Courts at Patiala, Punjab, India.',
      },
      studentSignature: {
        signed: true,
        signatureData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><text x="10" y="25" font-family="cursive" font-size="20">Aarav Sharma</text></svg>',
        signedAt: new Date(),
        signedByName: student1.name,
      },
      ownerSignature: {
        signed: true,
        signatureData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><text x="10" y="25" font-family="cursive" font-size="20">Gurpreet Singh</text></svg>',
        signedAt: new Date(),
        signedByName: owner1.name,
      },
      status: 'Signed',
      legalDisclaimerAcknowledged: true,
    });

    booking.agreement = agreement._id;
    await booking.save();

    // 6. Insert Favorites
    await Favorite.create({
      student: student1._id,
      property: createdProperties[1]._id,
    });
    await Favorite.create({
      student: student1._id,
      property: createdProperties[2]._id,
    });

    // 7. Insert Notifications
    await Notification.create({
      user: student1._id,
      title: 'Welcome to Thapar PG Finder',
      message: 'Explore verified student accommodations near TIET Patiala.',
      type: 'system',
      link: '/properties',
    });
    await Notification.create({
      user: student1._id,
      title: 'Rental Agreement Confirmed',
      message: 'Your rental agreement for Thapar Haven Luxury Boys PG is signed and confirmed.',
      type: 'agreement',
      link: `/agreements/${agreement._id}`,
    });

    console.log('[Seed] Database successfully seeded with 11 sample properties, real users, reviews, agreements, and bookings!');
    return { success: true };
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
    throw err;
  }
};

// If run directly via `node seed.js`
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('[Seed] Seeding completed successfully. Exiting.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Seeding failed:', err);
      process.exit(1);
    });
}
