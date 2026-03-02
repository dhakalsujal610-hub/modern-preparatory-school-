# QUICK DEPLOYMENT GUIDE - COPY & PASTE STEPS

## Option 1: Deploy Frontend to Netlify (5 minutes) ⚡ RECOMMENDED

### Step 1: Go to Netlify
1. Visit: https://app.netlify.com
2. Click **"Sign up"** → Choose **"Continue with GitHub"**
3. Authorize Netlify to access your GitHub

### Step 2: Create New Site
1. Click **"Add new site"** → **"Import an existing project"**
2. Click **"GitHub"**
3. Search and select: **`modern-preparatory-school-`**
4. Click **"Deploy"**

Netlify will automatically:
- ✅ Detect it's a Vite/React project
- ✅ Run `npm run build` automatically  
- ✅ Deploy the `frontend/dist` folder

**You'll get a URL like:** `https://your-project-name.netlify.app`

---

## Option 2: Deploy Backend to Railway (10 minutes)

### Step 1: Go to Railway
1. Visit: https://railway.app
2. Click **"Create"** → **"Deploy from GitHub repo"**
3. Select: **`modern-preparatory-school-`**
4. Click **"Deploy"**

### Step 2: Set Environment Variables
1. In Railway dashboard, click your project
2. Go to **Variables** tab  
3. Add these:
```
NODE_ENV=production
PORT=3000
```

### Step 3: Get Your Backend URL
Railway will give you a URL like: `https://your-railway-app.up.railway.app`

---

## FINAL SETUP: Connect Frontend to Backend

.After you get both URLs:

1. Go to Netlify site settings
2. Go to **Build & Deploy** → **Environment**
3. Add variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-app.up.railway.app/api`
4. Trigger redeploy

---

## YOUR SHAREABLE URL
Once deployed, share this URL with anyone:

**Frontend:** `https://your-netlify-app.netlify.app`

---

## Database Setup (First Time Only)

After backend deploys:

1. Open your Railway project
2. Go to **Deployments** tab
3. Click the three dots (⋯) → **View logs**
4. In logs, run command:
   ```
   npm run init-db
   ```

You'll see:
```
Default admin user created with username "admin" and password "gracelight9810"
```

Login credentials:
- **Username:** `admin`
- **Password:** `gracelight9810`

⚠️ **Change this password immediately!**

---

## Summary

| Part | Platform | URL Format |
|------|----------|-----------|
| **Frontend (React)** | Netlify | `https://yourapp.netlify.app` |
| **Backend (Node.js)** | Railway | `https://yourapp.up.railway.app` |
| **Database** | Railway (SQLite) | Automatic |

---

## Need Help?

- Netlify Docs: https://docs.netlify.com
- Railway Docs: https://docs.railway.app
