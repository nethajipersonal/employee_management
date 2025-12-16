# MongoDB Setup Guide

Your application needs MongoDB to run. Choose one of these options:

## Option 1: MongoDB Atlas (Cloud - Recommended for Quick Start)

**Easiest and fastest option:**

1. **Create Free Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up with email/Google

2. **Create Free Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a region close to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Setup Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Create username and password (SAVE THESE!)
   - Set privileges to "Read and write to any database"

4. **Setup Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

6. **Update .env.local**
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/employee_management?retryWrites=true&w=majority
   ```
   Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and cluster URL with your actual values

## Option 2: Local MongoDB Installation

### For macOS:

```bash
# Install MongoDB Community Edition
# First install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
brew services list | grep mongodb
```

Your `.env.local` should have:
```env
MONGODB_URI=mongodb://localhost:27017/employee_management
```

### For Linux (Ubuntu/Debian):

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update packages
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

### For Windows:

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service
5. MongoDB will start automatically

## After Setup

1. **Restart your development server:**
   ```bash
   # Stop current server (Ctrl+C in terminal)
   # Then start again
   npm run dev
   ```

2. **Seed the database:**
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```
   
   Or visit: http://localhost:3000/api/seed in your browser

3. **Login with demo credentials:**
   - **Admin**: admin@company.com / admin123
   - **Manager**: manager@company.com / manager123
   - **Employee**: employee@company.com / employee123

## Troubleshooting

**Connection Refused:**
- Make sure MongoDB is running: `mongod --version` or check Atlas cluster status
- Check your `.env.local` has the correct `MONGODB_URI`
- Restart the Next.js dev server

**Authentication Failed (Atlas):**
- Double-check username and password in connection string
- Make sure you're using the database user credentials, not your Atlas account credentials
- Password should be URL-encoded if it contains special characters

**Network Timeout (Atlas):**
- Check IP whitelist in Atlas Network Access
- Make sure your IP is allowed or use "Allow Access from Anywhere"

## Quick Start Recommendation

**Use MongoDB Atlas (Option 1)** - it's free, takes 5 minutes, and you don't need to install anything locally!
