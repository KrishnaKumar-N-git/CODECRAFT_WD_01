/**
 * Seed Script — creates demo admin and user accounts.
 * Run: node seed.js
 *
 * Credentials created:
 *   Admin: admin@demo.com / Admin@12345
 *   User:  user@demo.com  / User@12345
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'Admin@12345',
    role: 'admin',
  },
  {
    name: 'Regular User',
    email: 'user@demo.com',
    password: 'User@12345',
    role: 'user',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing seed accounts
    await User.deleteMany({
      email: { $in: seedUsers.map((u) => u.email) },
    });

    // Create users (passwords hashed by pre-save hook)
    const created = await User.create(seedUsers);
    console.log(`✅ Seeded ${created.length} users:`);
    created.forEach((u) => console.log(`   - ${u.email} [${u.role}]`));
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

seed();
