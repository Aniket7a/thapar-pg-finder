import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import RentalAgreement from '../models/RentalAgreement.js';
import app from '../app.js';

dotenv.config();

const runTests = async () => {
  console.log('--- STARTING THAPAR PG FINDER AUTOMATED INTEGRATION TESTS ---');
  let passed = 0;
  let failed = 0;

  try {
    await connectDB();

    // 1. Check Properties Count
    const count = await Property.countDocuments();
    if (count >= 11) {
      console.log(`[PASS] Test 1: Property Seed Count in MongoDB (${count} properties)`);
      passed++;
    } else {
      console.error(`[FAIL] Test 1: Expected at least 11 properties, found ${count}`);
      failed++;
    }

    // 2. Test Locality Filter on Bhadson Road
    const bhadsonProps = await Property.find({ 'address.locality': /Bhadson Road/i });
    if (bhadsonProps.length > 0) {
      console.log(`[PASS] Test 2: Bhadson Road Locality Query (${bhadsonProps.length} listings found)`);
      passed++;
    } else {
      console.error('[FAIL] Test 2: No Bhadson Road properties found');
      failed++;
    }

    // 3. Test Student User Retrieval & Password Match
    const student = await User.findOne({ email: 'student@thapar.edu' }).select('+password');
    if (student) {
      const match = await student.matchPassword('password123');
      if (match) {
        console.log('[PASS] Test 3: Student authentication and bcrypt password match verified');
        passed++;
      } else {
        console.error('[FAIL] Test 3: Password match failed for student');
        failed++;
      }
    } else {
      console.error('[FAIL] Test 3: Student user not found in MongoDB');
      failed++;
    }

    // 4. Test Owner User Retrieval
    const owner = await User.findOne({ email: 'owner1@patialapg.com' });
    if (owner && owner.role === 'owner' && owner.isVerified) {
      console.log('[PASS] Test 4: Verified owner account validated in MongoDB');
      passed++;
    } else {
      console.error('[FAIL] Test 4: Owner account invalid or unverified');
      failed++;
    }

    // 5. Test Active Booking & Rental Agreement Link
    const agreement = await RentalAgreement.findOne()
      .populate('property')
      .populate('student')
      .populate('owner');

    if (agreement && agreement.status === 'Signed' && agreement.terms.monthlyRent > 0) {
      console.log(`[PASS] Test 5: Digital Rental Agreement verified with student & landlord details (Rent: ₹${agreement.terms.monthlyRent})`);
      passed++;
    } else {
      console.error('[FAIL] Test 5: Rental agreement verification failed');
      failed++;
    }

    // 6. Test Distance Calculations from TIET campus
    const closeProperties = await Property.find({ distanceFromThapar: { $lte: 0.5 } });
    if (closeProperties.length >= 2) {
      console.log(`[PASS] Test 6: Distance filter verified (${closeProperties.length} stays within 500m of TIET)`);
      passed++;
    } else {
      console.error('[FAIL] Test 6: Distance filter returned fewer than 2 close properties');
      failed++;
    }

    console.log(`-----------------------------------------------------`);
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`-----------------------------------------------------`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Integration test encountered an unexpected error:', err);
    process.exit(1);
  }
};

runTests();
