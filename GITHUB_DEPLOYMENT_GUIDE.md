# GitHub & Deployment Guide - SoulBridge

## ⚠️ CRITICAL: API Key Security

**BEFORE pushing to GitHub:**
1. All API keys in `.env.local` must be rotated
2. Never commit `.env.local` to GitHub
3. Use `.env.example` as template for developers

## Step 1: Initialize Git Repository

```bash
cd soulbridge
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 2: Verify .gitignore is Correct

The `.gitignore` file already excludes:
- `.env.local` ✅
- `.env.*.local` ✅
- `node_modules/` ✅
- `.next/` ✅
- `*.db` ✅

## Step 3: Add Files to Git

```bash
git add .
git status  # Verify .env.local is NOT listed
```

**Expected output should NOT include:**
- `.env.local`
- `node_modules/`
- `.next/`
- `web.db`

## Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: SoulBridge healthcare platform

- Next.js 15 + React 18 + TypeScript + TailwindCSS
- Firebase authentication
- Supabase database integration
- Polygon blockchain integration
- AI bill audit with Gemini
- MetaMask wallet integration
- Monthly transfer limit (10 lakh)
- ID verification system"
```

## Step 5: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `soulbridge` (or your preferred name)
3. Description: "Healthcare bill audit platform with blockchain payments"
4. Choose: **Private** (recommended for security)
5. Do NOT initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 6: Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/soulbridge.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 7: Add GitHub Secrets for Deployment

If deploying to Vercel or GitHub Actions:

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add these secrets (copy from your `.env.local`):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_BLOCKCHAIN_RPC_URL`
   - `NEXT_PUBLIC_GEMINI_API_KEY`

## Step 8: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts and select your GitHub repository.

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables (same as GitHub Secrets)
5. Click "Deploy"

## Step 9: Verify Deployment

After deployment:
1. Check that `.env.local` is NOT visible in the repository
2. Verify `.env.example` is present as template
3. Test all features on the deployed URL
4. Confirm no API keys are exposed in logs

## Security Checklist

- [ ] All API keys rotated before pushing
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.local` is NOT in git history
- [ ] `.env.example` has placeholder values only
- [ ] GitHub repository is set to Private
- [ ] Environment variables added to GitHub Secrets
- [ ] Environment variables added to Vercel
- [ ] No API keys in code comments
- [ ] No API keys in documentation files

## Troubleshooting

### ".env.local already tracked by Git"

If you accidentally committed `.env.local`:

```bash
git rm --cached .env.local
git commit -m "Remove .env.local from tracking"
git push
```

Then rotate all API keys immediately.

### "Repository not found" error

```bash
# Verify remote URL
git remote -v

# Update if needed
git remote set-url origin https://github.com/YOUR_USERNAME/soulbridge.git
```

### Build fails on Vercel

1. Check that all environment variables are added
2. Verify variable names match exactly
3. Check Vercel build logs for specific errors
4. Ensure `package.json` has correct build script

## Environment Variables Reference

| Variable | Type | Where to Get |
|----------|------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public | Firebase Console |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase Dashboard |
| `NEXT_PUBLIC_BLOCKCHAIN_RPC_URL` | Public | Alchemy Dashboard |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Public | Google AI Studio |

**Note:** All these are marked "NEXT_PUBLIC_" because they're used in the browser. This is normal and secure as long as they're restricted at the service level (Firebase rules, Supabase policies, etc.).

## Next Steps

1. Rotate all API keys
2. Follow steps 1-6 to push to GitHub
3. Deploy to Vercel
4. Test all features on production
5. Monitor logs for any issues

