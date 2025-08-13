#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔒 Security Check for Team Divider');
console.log('==================================\n');

const sensitiveFiles = [
  '.env',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local'
];

let hasIssues = false;

// Check for sensitive files
console.log('📁 Checking for sensitive files...');
sensitiveFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  Found: ${file}`);
    console.log(`   This file should NOT be committed to GitHub!`);
    console.log(`   Make sure it's in your .gitignore file.\n`);
    hasIssues = true;
  } else {
    console.log(`✅ Not found: ${file}`);
  }
});

// Check .gitignore
console.log('\n📋 Checking .gitignore configuration...');
const gitignorePath = path.join(process.cwd(), '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  const requiredPatterns = [
    '.env',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local'
  ];
  
  let allPatternsFound = true;
  requiredPatterns.forEach(pattern => {
    if (gitignoreContent.includes(pattern)) {
      console.log(`✅ .gitignore includes: ${pattern}`);
    } else {
      console.log(`❌ .gitignore missing: ${pattern}`);
      allPatternsFound = false;
      hasIssues = true;
    }
  });
  
  if (allPatternsFound) {
    console.log('\n✅ .gitignore is properly configured!');
  }
} else {
  console.log('❌ .gitignore file not found!');
  hasIssues = true;
}

// Check for hardcoded credentials in source code
console.log('\n🔍 Checking source code for hardcoded credentials...');
const sourceFiles = [
  'lib/mongodb.js',
  'lib/auth.js',
  'app/api/auth/login/route.js',
  'app/api/auth/logout/route.js'
];

let foundHardcoded = false;
sourceFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for common hardcoded patterns
    const hardcodedPatterns = [
      /mongodb\+srv:\/\/[^@]+@[^/]+\//,
      /password\s*=\s*['"][^'"]+['"]/,
      /username\s*=\s*['"][^'"]+['"]/,
      /MONGODB_URI\s*=\s*['"][^'"]+['"]/
    ];
    
    hardcodedPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        console.log(`⚠️  Potential hardcoded credentials found in: ${file}`);
        foundHardcoded = true;
        hasIssues = true;
      }
    });
    
    if (!foundHardcoded) {
      console.log(`✅ No hardcoded credentials found in: ${file}`);
    }
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (hasIssues) {
  console.log('❌ Security issues found!');
  console.log('\n🔧 To fix these issues:');
  console.log('1. Make sure all .env files are in .gitignore');
  console.log('2. Remove any hardcoded credentials from source code');
  console.log('3. Use environment variables for all sensitive data');
  console.log('4. Run this check again before deploying');
  process.exit(1);
} else {
  console.log('✅ All security checks passed!');
  console.log('\n🚀 Your code is ready for deployment to Vercel!');
  console.log('\n📝 Next steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Connect your repository to Vercel');
  console.log('3. Set environment variables in Vercel dashboard');
  console.log('4. Deploy!');
}

console.log('\n📖 For detailed deployment instructions, see: DEPLOYMENT.md');
