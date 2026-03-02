# Deployment Guide - Railway

This guide will help you deploy the School Management Application on Railway.

## Prerequisites

1. **GitHub Account** - Your code is already uploaded ✅
2. **Railway Account** - Sign up at [railway.app](https://railway.app)

## Step-by-Step Deployment

### Step 1: Create a Railway Project

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click **"Create New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `modern-preparatory-school-`
5. Click **"Deploy"**

### Step 2: Configure Environment Variables

After deployment starts, go to your project settings:

1. Click on your project
2. Go to **Variables** tab
3. Add the following environment variables:

```
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-secure-secret-key-here
DB_DIALECT=sqlite
```

Optional (for MySQL):
```
DB_DIALECT=mysql
DB_HOST=your-database-host
DB_USER=your-username
DB_PASS=your-password
DB_NAME=scool
```

### Step 3: Configure Build & Deploy Settings

1. In your Railway project, go to **Settings**
2. Under **Build**, set:
   - **Build Command**: `npm run build:all`
   - **Start Command**: `npm start`
   - **Root Directory**: `/` (leave empty)

### Step 4: Initialize Database (First Time Only)

After deployment, the backend will have SQLite database initialized.

To create the admin user:
1. Connect to your Railway project terminal
2. Run: `npm run init-db`
3. Login credentials will be displayed

### Step 5: Access Your Application

1. View your deployed URL on Railway dashboard
2. Your app will be live at: `https://your-project-name.up.railway.app`

## Default Login Credentials

After running `init-db`:
- **Username**: `admin`
- **Password**: `gracelight9810`

⚠️ **Change this password immediately after first login!**

## Custom Domain (Optional)

1. Go to Railway project settings
2. Under **Domains**, click **"Add Domain"**
3. Configure your custom domain (requires DNS configuration)

## Environment Variables Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | production | Environment mode |
| `SESSION_SECRET` | keyboard cat | Session encryption key |
| `DB_DIALECT` | sqlite | Database type (sqlite/mysql) |
| `DB_FILE` | database.sqlite | SQLite file location |

## Troubleshooting

### Build Fails
- Check that both `backend/package.json` and `frontend/package.json` exist
- Verify Node.js version is >=14
- Check build logs in Railway dashboard

### Application Crashes
- Review logs in Railway dashboard
- Ensure environment variables are set correctly
- Check database connectivity

### Database Issues
- For SQLite: Database file will be created automatically
- For MySQL: Ensure database exists and credentials are correct

## Making Updates

After making changes to your code:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update message"
   git push
   ```

2. Railway will automatically redeploy your changes

## Support

For Railway support: [docs.railway.app](https://docs.railway.app)
