# Weekly Engineering Journal — Ajay Bhatti (Database & DevOps Lead)
Roll Number: 1024030989 | UCS503 Software Engineering Project | TIET Patiala

## Weeks 1–2: Database Schema & Atlas Architecture
- Designed MongoDB collection schemas across 11 collections using Mongoose ODM.
- Configured MongoDB Atlas M0 cluster and network security access controls.

## Weeks 3–4: Indexes & Model Validation
- Established schema validators, enum constraints, and unique indexes on email and phone.
- Configured compound indexes for efficient listing filtering.

## Weeks 5–6: 2dsphere Geospatial Discovery
- Engineered GeoJSON coordinate pairing for all properties.
- Built  aggregation pipeline delivering campus proximity search in 214 ms (beating 500 ms target).

## Weeks 7–8: Seed Data & Database Seeding
- Authored realistic seed scripts with authentic Patiala student accommodation listings.
- Populated database with real Punjab PG photographs, pricing bands, and student reviews.

## Weeks 9–10: Review Integrity & Trust Scoring
- Enforced data-layer gating for reviews (reviews only accepted for completed bookings).
- Implemented multi-criteria weighted trust score aggregation.
