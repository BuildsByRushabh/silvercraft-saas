# 🚀 How to Run the SilverCraft SaaS MVP

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js 20+ installed
- ✅ Docker Desktop installed and running
- ⚠️ OpenAI API key (we'll add this in Step 2)

---

## Step 1: Configure Environment Variables

**IMPORTANT:** You need to update the `.env` file with your API keys.

1. Open `backend/.env` in your editor
2. Update these values:

```env
# CHANGE THESE SECRETS! (Generate random 32+ character strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too

# ADD YOUR OPENAI API KEY HERE
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**To generate secure secrets (PowerShell):**
```powershell
# Run this twice to get two different secrets
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**To get OpenAI API key:**
1. Go to: https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. Paste it in the `.env` file

---

## Step 2: Start the Database

Open a terminal and run:

```bash
cd E:\AntiGravity_Test1\silvercraft-saas
docker-compose up -d postgres
```

**Verify it's running:**
```bash
docker ps
```

You should see `silvercraft-db` running on port 5432.

---

## Step 3: Run Database Migrations

This creates all the tables in the database:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

You should see output like:
```
✔ Generated Prisma Client
✔ Database schema created
```

---

## Step 4: Start the Backend Server

```bash
npm run dev
```

You should see:
```
Server running on port 3001
Environment: development
API URL: http://localhost:3001
Database connected successfully
```

**Keep this terminal open!** The server is now running.

---

## Step 5: Test the API

Open a **new terminal** and test:

### Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-11-20T..."}
```

### Create Your First Tenant

```bash
curl -X POST http://localhost:3001/api/tenants -H "Content-Type: application/json" -d "{\"name\":\"My Jewellery Shop\",\"subdomain\":\"myjewellery\",\"accentColor\":\"#C0B8A7\",\"adminEmail\":\"admin@myjewellery.com\",\"adminPassword\":\"SecurePass123!\",\"adminName\":\"Shop Admin\"}"
```

**Save the response!** You'll get:
- `tenant.id` - Your tenant UUID
- `token` - JWT access token
- `admin.email` - Admin email

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@myjewellery.com\",\"password\":\"SecurePass123!\",\"tenantId\":\"PASTE_TENANT_ID_HERE\"}"
```

---

## Step 6: View Your Data (Optional)

Open Prisma Studio to see your database:

```bash
cd backend
npx prisma studio
```

Opens at: http://localhost:5555

You can see all tenants, users, and data!

---

## 🐛 Troubleshooting

### "Port 3001 already in use"
```bash
# Find the process
netstat -ano | findstr :3001

# Kill it (replace PID)
taskkill /PID <process-id> /F
```

### "Database connection failed"
```bash
# Check if Docker is running
docker ps

# Restart database
docker-compose restart postgres

# View logs
docker logs silvercraft-db
```

### "Cannot find module '@prisma/client'"
```bash
cd backend
npx prisma generate
```

---

## 🎯 Quick Commands Reference

```bash
# Start database
docker-compose up -d postgres

# Stop database
docker-compose down

# Start backend
cd backend && npm run dev

# View database
cd backend && npx prisma studio

# Run migrations
cd backend && npx prisma migrate dev

# Reset database (WARNING: deletes all data)
cd backend && npx prisma migrate reset
```

---

## ✅ Success Checklist

- [ ] Docker Desktop is running
- [ ] Updated `.env` with OpenAI API key
- [ ] Updated `.env` with JWT secrets
- [ ] Database started (`docker-compose up -d postgres`)
- [ ] Migrations ran successfully (`npx prisma migrate dev`)
- [ ] Backend server running (`npm run dev`)
- [ ] Health check works (`curl http://localhost:3001/health`)
- [ ] Created first tenant successfully
- [ ] Can login with admin credentials

---

## 🚀 Next: Connect to GitHub

See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for instructions on pushing to GitHub and setting up deployment.
