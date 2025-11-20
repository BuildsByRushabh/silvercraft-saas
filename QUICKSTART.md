# ⚡ Quick Start - Run the MVP Right Now!

## 🔴 Before You Start

**1. Start Docker Desktop**
   - Open Docker Desktop application
   - Wait for it to say "Docker Desktop is running"
   - You should see the Docker icon in your system tray

**2. Update Environment Variables**

Open `backend/.env` and update these lines:

```env
# Change these to random strings (32+ characters each)
JWT_SECRET=put-a-random-32-character-string-here
JWT_REFRESH_SECRET=put-another-random-32-character-string-here

# Add your OpenAI API key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Generate random secrets in PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

---

## 🚀 Run Commands (Copy & Paste)

### Terminal 1: Start Database

```powershell
cd E:\AntiGravity_Test1\silvercraft-saas
docker-compose up -d postgres
```

Wait for: `✔ Container silvercraft-db  Started`

### Terminal 2: Setup Database & Start Backend

```powershell
cd E:\AntiGravity_Test1\silvercraft-saas\backend

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Start the server
npm run dev
```

Wait for: `Server running on port 3001`

---

## ✅ Test It Works

### Terminal 3: Test API

```powershell
# Health check
curl http://localhost:3001/health

# Create your first tenant
curl -X POST http://localhost:3001/api/tenants -H "Content-Type: application/json" -d '{\"name\":\"My Jewellery Shop\",\"subdomain\":\"myjewellery\",\"accentColor\":\"#C0B8A7\",\"adminEmail\":\"admin@myjewellery.com\",\"adminPassword\":\"SecurePass123!\",\"adminName\":\"Shop Admin\"}'
```

**Success!** You should get a JSON response with tenant details and a token.

---

## 🔗 Connect to GitHub (After MVP is Running)

```powershell
cd E:\AntiGravity_Test1\silvercraft-saas

# Initialize Git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Backend foundation"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/silvercraft-saas.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**First, create the repository on GitHub:**
1. Go to https://github.com/new
2. Name: `silvercraft-saas`
3. Private repository
4. Don't initialize with anything
5. Create repository

---

## 🎯 What You'll See

### When Database Starts:
```
✔ Container silvercraft-db  Started
```

### When Backend Starts:
```
Server running on port 3001
Environment: development
API URL: http://localhost:3001
Database connected successfully
```

### When Health Check Works:
```json
{"status":"ok","timestamp":"2025-11-20T..."}
```

---

## 🐛 If Something Goes Wrong

### Docker not running?
- Open Docker Desktop app
- Wait for "Docker Desktop is running"

### Port 3001 already in use?
```powershell
netstat -ano | findstr :3001
taskkill /PID <process-id> /F
```

### Database connection failed?
```powershell
docker-compose restart postgres
docker logs silvercraft-db
```

---

## 📱 Access Points

- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health
- **Database GUI:** http://localhost:5555 (run `npx prisma studio` in backend folder)

---

**That's it!** Your MVP is now running locally. 🎉

For detailed instructions, see:
- [HOW_TO_RUN.md](./HOW_TO_RUN.md) - Complete setup guide
- [GITHUB_SETUP.md](./GITHUB_SETUP.md) - GitHub integration
- [README.md](./README.md) - Full documentation
