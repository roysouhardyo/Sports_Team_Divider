# 🚀 Deployment Guide for Team Divider

This guide will help you deploy your Team Divider application to Vercel while keeping your database credentials secure.

## 🔒 Security First - Environment Variables

### What NOT to commit to GitHub:
- ❌ `.env` files
- ❌ `.env.local` files  
- ❌ Any files containing real database credentials
- ❌ API keys or secrets

### What IS safe to commit:
- ✅ `env.example` (template file)
- ✅ `setup-env.js` (setup script)
- ✅ Source code without credentials

## 📋 Pre-Deployment Checklist

### 1. Verify Your `.gitignore`
Make sure your `.gitignore` includes:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 2. Check for Sensitive Files
Run this command to ensure no sensitive files are tracked:
```bash
git status
```

You should NOT see any `.env` files in the output.

### 3. Create a Clean Repository
If you accidentally committed sensitive files:
```bash
# Remove from git tracking (but keep the file locally)
git rm --cached .env.local
git commit -m "Remove sensitive files from tracking"
```

## 🌐 Deploying to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository

### Step 3: Configure Environment Variables in Vercel
In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | Production, Preview, Development |
| `ADMIN_USERNAME` | Your admin username | Production, Preview, Development |
| `ADMIN_PASSWORD` | Your secure admin password | Production, Preview, Development |

### Step 4: Deploy
1. Vercel will automatically detect it's a Next.js project
2. Click "Deploy"
3. Wait for the build to complete

## 🔧 Environment Variables Setup

### For Local Development:
Create a `.env.local` file (this file is already ignored by git):
```bash
node setup-env.js
```

Then edit `.env.local` with your actual credentials:
```env
MONGODB_URI=your_mongodb_connection_string_here
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

### For Vercel Production:
Set these in Vercel's Environment Variables section:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `ADMIN_USERNAME`: Your admin username
- `ADMIN_PASSWORD`: Your secure admin password

## 🛡️ Security Best Practices

### 1. MongoDB Atlas Security
- Use MongoDB Atlas (cloud database)
- Create a dedicated database user for your app
- Use IP whitelist (0.0.0.0/0 for Vercel)
- Enable SSL/TLS connections

### 2. Password Security
- Use strong, unique passwords
- Consider using a password manager
- Never reuse passwords from other services

### 3. Environment Variables
- Never hardcode credentials in your source code
- Always use environment variables
- Use different credentials for development and production

## 🔍 Troubleshooting

### Common Issues:

**1. "MONGODB_URI is not defined"**
- Check that you've set the environment variable in Vercel
- Verify the variable name is exactly `MONGODB_URI`

**2. "Authentication failed"**
- Verify your MongoDB Atlas credentials
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure the database user has the correct permissions

**3. "Build failed"**
- Check Vercel build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify your Next.js configuration

### Getting Help:
- Check Vercel's [deployment logs](https://vercel.com/docs/concepts/projects/environment-variables)
- Review MongoDB Atlas [connection issues](https://docs.atlas.mongodb.com/troubleshoot-connection/)
- Check the [Next.js deployment guide](https://nextjs.org/docs/deployment)

## 🎉 Success!
Once deployed, your app will be available at:
`https://your-project-name.vercel.app`

## 📞 Support
If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel's documentation
3. Check MongoDB Atlas status
4. Verify your environment variables are set correctly

---

**Remember**: Never commit sensitive information to your repository. Always use environment variables for credentials!
