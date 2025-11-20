# 🔗 How to Connect to GitHub

## Step 1: Create a GitHub Repository

1. **Go to GitHub:** https://github.com/new
2. **Repository name:** `silvercraft-saas`
3. **Description:** "Multi-tenant SaaS platform for jewellery businesses"
4. **Visibility:** Private (recommended) or Public
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. **Click:** "Create repository"

**Keep this page open!** You'll need the repository URL.

---

## Step 2: Configure Git (First Time Only)

If you haven't used Git before, set your name and email:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 3: Initialize and Push to GitHub

Open a terminal in the project root:

```bash
cd E:\AntiGravity_Test1\silvercraft-saas
```

### Add all files to Git

```bash
git add .
```

### Create your first commit

```bash
git commit -m "Initial commit: Backend foundation with auth and tenant management"
```

### Connect to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/silvercraft-saas.git
```

### Push to GitHub

```bash
git branch -M main
git push -u origin main
```

**Enter your GitHub credentials when prompted.**

---

## Step 4: Verify on GitHub

1. Go to: `https://github.com/YOUR_USERNAME/silvercraft-saas`
2. You should see all your files!
3. Check that `.env` is **NOT** visible (it's in `.gitignore`)

---

## 🔐 Important Security Notes

### Files That Should NOT Be in GitHub

These are automatically excluded by `.gitignore`:
- ✅ `backend/.env` - Contains secrets
- ✅ `backend/node_modules/` - Dependencies
- ✅ `backend/logs/` - Log files
- ✅ Database files

### Files That SHOULD Be in GitHub

- ✅ `backend/.env.example` - Template (no secrets)
- ✅ All source code
- ✅ `README.md` and documentation
- ✅ `package.json` and configuration files

---

## 📝 Making Changes and Pushing Updates

After making changes to your code:

```bash
# See what changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

---

## 🌿 Working with Branches (Optional)

For new features, create a branch:

```bash
# Create and switch to new branch
git checkout -b feature/catalogue-endpoints

# Make your changes, then commit
git add .
git commit -m "Add catalogue CRUD endpoints"

# Push the branch
git push -u origin feature/catalogue-endpoints
```

Then create a Pull Request on GitHub to merge into `main`.

---

## 🚀 Setting Up Deployment (After GitHub Push)

### Backend: Railway

1. **Sign up:** https://railway.app/
2. **New Project** → "Deploy from GitHub repo"
3. **Select:** `silvercraft-saas`
4. **Add PostgreSQL** database
5. **Environment Variables:**
   - Copy from your local `.env`
   - Railway will auto-set `DATABASE_URL`
6. **Deploy!**

### Frontend: Vercel (When Ready)

1. **Sign up:** https://vercel.com/
2. **Import Project** from GitHub
3. **Root Directory:** `frontend`
4. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app`
5. **Deploy!**

---

## 🔄 Keeping GitHub and Local in Sync

### Pull latest changes from GitHub

```bash
git pull origin main
```

### If you have conflicts

```bash
# See conflicts
git status

# After fixing conflicts
git add .
git commit -m "Resolved merge conflicts"
git push
```

---

## 📚 Useful Git Commands

```bash
# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes (CAREFUL!)
git reset --hard HEAD

# See what changed in a file
git diff backend/src/app.ts

# Create a new branch
git checkout -b branch-name

# Switch branches
git checkout main

# Delete a branch
git branch -d branch-name
```

---

## 🆘 Troubleshooting

### "Authentication failed"

**Option 1: Use Personal Access Token (Recommended)**

1. Go to: https://github.com/settings/tokens
2. **Generate new token (classic)**
3. **Scopes:** Select `repo`
4. **Copy the token**
5. When Git asks for password, paste the token

**Option 2: Use GitHub CLI**

```bash
# Install GitHub CLI
winget install GitHub.cli

# Login
gh auth login
```

### "Remote origin already exists"

```bash
# Remove old remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/silvercraft-saas.git
```

### "Large files detected"

If you accidentally tried to commit `node_modules/`:

```bash
# Remove from Git (but keep locally)
git rm -r --cached backend/node_modules

# Commit the removal
git commit -m "Remove node_modules from Git"

# Push
git push
```

---

## ✅ GitHub Setup Checklist

- [ ] Created GitHub repository
- [ ] Configured Git with name and email
- [ ] Initialized Git in project (`git init`)
- [ ] Added all files (`git add .`)
- [ ] Created first commit
- [ ] Connected to GitHub remote
- [ ] Pushed to GitHub (`git push`)
- [ ] Verified `.env` is NOT in GitHub
- [ ] Repository is visible on GitHub

---

## 🎯 Next Steps

1. **Invite collaborators** (Settings → Collaborators)
2. **Set up branch protection** (Settings → Branches)
3. **Enable GitHub Actions** for CI/CD (optional)
4. **Deploy to Railway/Vercel** (see deployment section)

---

**Your code is now safely backed up on GitHub!** 🎉

You can access it from anywhere and collaborate with others.
