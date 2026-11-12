# Thapar PG Finder | Full-Stack MERN Platform

> **Production-Ready, Modern PG & Rental Accommodation Finder for Thapar Institute of Engineering & Technology (TIET), Patiala, Punjab, India.**

Designed and built specifically for students studying at Thapar University to discover, compare, review, and rent PGs, student hostels, and independent flats across Patiala localities (Bhadson Road, Prem Nagar, SST Nagar, Model Town, Urban Estate, Punjabi Bagh, Leela Bhawan, etc.).

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), React Router DOM v6, Tailwind CSS, Axios, Lucide React, Leaflet & OpenStreetMap, HTML5 Canvas Signature Pad, jsPDF.
- **Backend**: Node.js, Express.js (Modular MVC), JWT Authentication, bcryptjs, Multer, Express Validator, Helmet, CORS, Morgan.
- **Database**: MongoDB (Atlas connection string or local daemon), Mongoose ODM with compound indexes, text indexes, aggregate pipeline calculations, and strict schema validation.

---

## 👥 User Roles & Seed Demo Accounts

The database is pre-seeded with realistic records, reviews, bookings, and digital agreements. Quick-fill credentials available on `/login`:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `student@thapar.edu` | `password123` | Aarav Sharma (B.Tech COE, 3rd Year, Roll: 102203045) |
| **Student 2** | `riya@thapar.edu` | `password123` | Riya Verma (B.Tech ENC, 2nd Year, Roll: 102303099) |
| **Property Owner** | `owner1@patialapg.com` | `password123` | Sardar Gurpreet Singh (Thapar Haven Accommodations, Verified) |
| **Property Owner 2**| `owner2@patialapg.com`| `password123` | Mrs. Sunita Sharma (Royal Palms Residency, Verified) |
| **Admin** | `admin@thapar.edu` | `admin123` | TIET Accommodations Compliance Admin |

---

## 🌟 Key Application Features

1. **MongoDB-Backed Persistence**:
   - Zero mock data or localStorage substitution. All 11 collections (`User`, `Property`, `Review`, `Booking`, `Favorite`, `RentalAgreement`, `Message`, `Notification`, `Complaint`, `PropertyVisit`, `Report`) reside in MongoDB.
2. **Campus-Specific Discovery & Distance Calculations**:
   - Filter by exact distance from Thapar University Gates (0.2 km - 5.0 km).
   - Filter by campus localities: Bhadson Road, Prem Nagar, SST Nagar, Model Town, Urban Estate, Punjabi Bagh, etc.
   - Filter by Gender (Boys / Girls / Co-ed), Room sharing type, Rent min/max, Food and AC amenities.
3. **Interactive OpenStreetMap (Leaflet)**:
   - Visual map centered on Thapar University campus with customized markers for campus landmarks and all PG locations with pricing popups.
4. **Digital Rental Agreement & Electronic Signature**:
   - Generates customized Punjab tenancy agreements including landlord and student particulars, Thapar roll number, rent covenants, deposit policies, and curfew rules.
   - Interactive HTML5 Canvas signature pad captures electronic signatures with consent verification.
   - One-click downloadable PDF generated via `jsPDF`.
5. **Side-by-Side Property Comparison**:
   - Compare up to 4 accommodations across rent, deposit, distance to TIET, verified ratings, and amenities.
6. **Rent Affordability Calculator**:
   - Computes monthly recurring expenses (rent + utilities + mess fees) and total initial move-in capital required.
7. **TIET Student Move-In Checklist**:
   - Interactive checklist for switchboards, AC cooling, sub-meter readings, key handover, and police verification.
8. **Direct In-App Messaging & Notifications**:
   - Secure communication between student and landlord with unread message badges.
9. **Admin Oversight & Fraud Protection**:
   - Listing verification badges, owner verification, review moderation, and investigation of fraud reports.

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18+)
- MongoDB (Local service or MongoDB Atlas cluster URI)

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI if connecting to MongoDB Atlas
# e.g.: MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/thapar_pg_finder

npm install
npm run seed     # Seeds 11 sample properties, real users, and agreements into MongoDB
npm start        # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite React dev server on http://localhost:5173
```

Alternatively, the backend automatically serves the pre-built `frontend/dist` bundle, so running `npm start` in `backend` serves both API and frontend on `http://localhost:5000`!

---

## 🧪 Integration Tests

Run automated integration tests verifying database connectivity, schemas, queries, and authentication:
```bash
cd backend
node test/api.test.js
```

---

## ⚖️ Legal & Tenancy Disclaimer
Digital agreement templates and checklists provided on this platform serve as structured mutual records between students and accommodation owners. They do not automatically substitute for mandatory local stamp duty, municipal tenancy registration, or Punjab Rent Act statutory requirements. Both parties are advised to verify legal compliance for their specific tenancy tenure.
