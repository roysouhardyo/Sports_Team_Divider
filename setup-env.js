#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Team Divider Environment Setup');
console.log('================================\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('If you want to recreate it, please delete the existing file first.\n');
  process.exit(0);
}

// Create the .env.local content
const envContent = `# MongoDB Atlas Connection String
# Replace with your actual MongoDB Atlas connection string
# Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/team_divider?retryWrites=true&w=majority

# Authentication Credentials (optional - defaults to admin/password123)
# Change these to your preferred admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Open .env.local in your code editor');
  console.log('2. Replace the MongoDB URI with your actual connection string');
  console.log('3. Optionally change the admin credentials');
  console.log('\n🔗 Get your MongoDB Atlas connection string:');
  console.log('   https://cloud.mongodb.com');
  console.log('\n🚀 Then run: npm run dev');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  process.exit(1);
}
