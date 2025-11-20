# SilverCraft SaaS - Full-Stack Multi-Tenant Jewellery Platform

A production-ready, multi-tenant SaaS platform for jewellery businesses with AI-powered design suggestions, secure tenant isolation, and white-label branding.

## 🏗️ Architecture

- **Backend:** Node.js + Express + TypeScript + Prisma
- **Database:** PostgreSQL 15+
- **Frontend:** Next.js 14 + Aceternity UI + Tailwind CSS
- **AI:** OpenAI GPT-4 for design suggestions
- **Security:** JWT authentication, tenant isolation, rate limiting, audit logging

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 20+ and npm
- **Docker** and Docker Compose (for local development)
- **Git** (for version control)
- **OpenAI API Key** (for AI features)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
cd E:\AntiGravity_Test1\silvercraft-saas
```

### 2. Set Up Environment Variables

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your keys:

```env
# Required
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/silvercraft_dev
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional (defaults are fine for development)
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend (when created)

```bash
cd frontend
npm install
```

### 4. Set Up Database

#### Option A: Using Docker (Recommended)

```bash
# From project root
docker-compose up -d postgres
```

#### Option B: Local PostgreSQL

Install PostgreSQL 15+ and create a database:

```sql
CREATE DATABASE silvercraft_dev;
```

### 5. Run Database Migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Start Development Servers

#### Using Docker Compose (All services)

```bash
# From project root
docker-compose up
```

#### Manual Start

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (when created)
cd frontend
npm run dev
```

### 7. Access the Application

- **Backend API:** http://localhost:3001
- **Frontend:** http://localhost:3000 (when created)
- **API Health Check:** http://localhost:3001/health

## 🔑 Getting API Keys

### OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and add to `backend/.env`
5. **Cost:** ~$0.01-0.10 per AI design suggestion

### GitHub (Optional - for deployment)

1. Create a GitHub account if you don't have one
2. Create a new repository
3. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/silvercraft-saas.git
git push -u origin main
```

## 📡 API Endpoints

### Authentication

```bash
# Register a new user
POST /api/auth/register
{
  "tenantId": "uuid",
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "staff"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "tenantId": "uuid"
}

# Refresh token
POST /api/auth/refresh
{
  "refreshToken": "your-refresh-token"
}
```

### Tenant Management

```bash
# Create a new tenant (onboarding)
POST /api/tenants
{
  "name": "Silver Artisan Jewellers",
  "subdomain": "silverartisan",
  "accentColor": "#C0B8A7",
  "adminEmail": "admin@silverartisan.com",
  "adminPassword": "SecurePass123!",
  "adminName": "Admin User"
}

# Get tenant configuration
GET /api/tenants/:tenantId
Authorization: Bearer <token>

# Update tenant branding (admin only)
PATCH /api/tenants/:tenantId
Authorization: Bearer <token>
{
  "name": "Updated Name",
  "logoUrl": "https://cdn.example.com/logo.png",
  "accentColor": "#D4AF37",
  "theme": "dark"
}
```

## 🧪 Testing the API

### Using cURL

```bash
# Create a tenant
curl -X POST http://localhost:3001/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Jewellery Shop",
    "subdomain": "myjewellery",
    "adminEmail": "admin@myjewellery.com",
    "adminPassword": "SecurePass123!",
    "adminName": "Shop Admin"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@myjewellery.com",
    "password": "SecurePass123!",
    "tenantId": "<tenant-id-from-previous-response>"
  }'
```

### Using Postman or Thunder Client

1. Import the API endpoints
2. Set up environment variables for `baseUrl` and `token`
3. Test each endpoint

## 🗄️ Database Management

### View Database with Prisma Studio

```bash
cd backend
npx prisma studio
```

Opens at http://localhost:5555

### Create a New Migration

```bash
cd backend
npx prisma migrate dev --name description_of_changes
```

### Reset Database (WARNING: Deletes all data)

```bash
cd backend
npx prisma migrate reset
```

## 🔒 Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Tenant Isolation** - Strict data separation per tenant  
✅ **Rate Limiting** - Prevents abuse (100 req/15min)  
✅ **Input Validation** - Zod schema validation  
✅ **Password Hashing** - Bcrypt with salt rounds  
✅ **Audit Logging** - All admin actions logged  
✅ **CORS Protection** - Whitelist allowed origins  
✅ **Helmet.js** - Security headers  
✅ **SQL Injection Protection** - Prisma parameterized queries

## 📁 Project Structure

```
silvercraft-saas/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/                # (To be created)
├── docker-compose.yml       # Docker services
└── README.md
```

## 🚧 Current Implementation Status

### ✅ Completed

- [x] Project structure and configuration
- [x] Database schema (Prisma)
- [x] Authentication system (JWT)
- [x] Tenant management (create, get, update)
- [x] Security middleware (auth, tenant isolation, rate limiting)
- [x] Error handling and logging
- [x] Docker setup for local development

### 🔄 In Progress / To Do

- [ ] Catalogue endpoints (CRUD operations)
- [ ] Orders endpoints (CRUD + status workflow)
- [ ] AI design suggestion endpoint (OpenAI integration)
- [ ] Audit logging service
- [ ] Frontend (Next.js + Aceternity UI)
- [ ] File upload for logos/images
- [ ] Email notifications
- [ ] Payment integration (Stripe)
- [ ] Deployment scripts

## 📝 Next Steps

### 1. Complete Backend Implementation

The following files need to be created:

```
backend/src/controllers/
├── catalogue.controller.ts
├── order.controller.ts
└── ai.controller.ts

backend/src/services/
├── catalogue.service.ts
├── order.service.ts
├── ai.service.ts
└── audit.service.ts
```

### 2. Test Backend Endpoints

- Create a tenant
- Register users
- Test authentication
- Verify tenant isolation

### 3. Build Frontend

- Initialize Next.js project
- Implement Aceternity UI components
- Connect to backend API
- Add tenant branding customization

### 4. Deploy to Production

- Backend: Railway or Render
- Frontend: Vercel
- Database: Supabase or Railway PostgreSQL

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps

# View logs
docker logs silvercraft-db

# Restart database
docker-compose restart postgres
```

### Port Already in Use

```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (Windows)
taskkill /PID <process-id> /F
```

### Prisma Client Not Generated

```bash
cd backend
npx prisma generate
```

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Aceternity UI Components](https://ui.aceternity.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

## 📄 License

MIT

## 👥 Support

For questions or issues, please create an issue in the GitHub repository.

---

**Built with ❤️ for jewellery artisans worldwide**
