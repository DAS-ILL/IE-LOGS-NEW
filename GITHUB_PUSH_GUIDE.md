# GitHub Push Guide - Step by Step

This guide will help you push the IE LOGS project to GitHub using Visual Studio Code.

## Prerequisites

✅ **Already Done:**
- Project cleaned up (removed temporary files)
- `.gitignore` configured
- README.md created

**Need to verify:**
- Git installed on your system
- GitHub account access
- Repository created: https://github.com/DAS-ILL/IE-LOGS-NEW

## Step-by-Step Instructions

### Step 1: Open Project in VS Code

1. Open Visual Studio Code
2. Click `File` → `Open Folder`
3. Navigate to `C:\Users\INKUMN\Desktop\VS\ie-logs-new`
4. Click `Select Folder`

### Step 2: Initialize Git (If Not Already Done)

1. Open Terminal in VS Code: `Ctrl + `` (backtick) or `View` → `Terminal`
2. Run:
```powershell
git init
```

### Step 3: Configure Git (First Time Only)

If you haven't configured Git on this machine:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@dasgroup.com"
```

### Step 4: Connect to GitHub Repository

```powershell
git remote add origin https://github.com/DAS-ILL/IE-LOGS-NEW.git
```

To verify it's added:
```powershell
git remote -v
```

### Step 5: Stage All Files

Click on the **Source Control** icon in VS Code sidebar (looks like a branch, 3rd icon from top) or press `Ctrl + Shift + G`

You'll see all files listed as changes. Now stage them:

**Option A: Using VS Code UI**
1. Click the `+` icon next to `Changes` to stage all files
2. OR hover over each file and click the `+` icon

**Option B: Using Terminal**
```powershell
git add .
```

### Step 6: Commit Changes

**Option A: Using VS Code UI**
1. In Source Control panel, you'll see a text box at the top
2. Type your commit message:
   ```
   Initial commit - IE LOGS Project v2.0
   
   - Complete Django + React application
   - Docker containerization ready
   - Full timezone support (IST/MST)
   - Admin and user roles implemented
   ```
3. Click the checkmark ✓ icon above the text box or press `Ctrl + Enter`

**Option B: Using Terminal**
```powershell
git commit -m "Initial commit - IE LOGS Project v2.0"
```

### Step 7: Push to GitHub

**Option A: Using VS Code UI**
1. Click the three dots `...` in the Source Control panel
2. Select `Push` or `Push to...`
3. If prompted, select `origin` as the remote
4. Select `main` as the branch

**Option B: Using Terminal**
```powershell
# If this is your first push:
git push -u origin main

# For subsequent pushes:
git push
```

### Step 8: Authenticate (If Prompted)

You may be asked to authenticate with GitHub:

1. **Personal Access Token (Recommended):**
   - Go to GitHub.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
   - Generate new token with `repo` permissions
   - Copy the token
   - Use it as password when prompted

2. **GitHub Desktop App:**
   - Install GitHub Desktop
   - Sign in through the app
   - VS Code will use those credentials

### Step 9: Verify on GitHub

1. Go to https://github.com/DAS-ILL/IE-LOGS-NEW
2. Refresh the page
3. You should see all your files!

---

## Common Issues & Solutions

### Issue: "fatal: remote origin already exists"

**Solution:**
```powershell
git remote remove origin
git remote add origin https://github.com/DAS-ILL/IE-LOGS-NEW.git
```

### Issue: Authentication Failed

**Solution:** Use Personal Access Token instead of password
1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Generate new token
3. Use token as password

### Issue: "refusing to merge unrelated histories"

**Solution:** (If repository already has files)
```powershell
git pull origin main --allow-unrelated-histories
git push origin main
```

### Issue: Files not showing in Source Control

**Solution:**
1. Make sure you opened the FOLDER, not individual files
2. Restart VS Code
3. Or use terminal: `git status` to see what's tracked

---

## Future: Pulling Latest Changes

When you return after few days:

### Step 1: Pull Latest Changes

**Using VS Code:**
1. Open Source Control panel
2. Click the three dots `...`
3. Select `Pull`

**Using Terminal:**
```powershell
cd c:\Users\INKUMN\Desktop\VS\ie-logs-new
git pull origin main
```

### Step 2: Rebuild Containers

```powershell
docker-compose down
docker-compose up -d --build
```

### Step 3: Run Migrations (If Any)

```powershell
docker-compose exec backend python manage.py migrate
```

---

## Git Workflow for Future Changes

### Making Changes

1. **Make your code changes** in VS Code

2. **Save files** (`Ctrl + S`)

3. **Stage changes:**
   - Go to Source Control panel
   - Click `+` next to changed files

4. **Commit:**
   - Type descriptive message
   - Click checkmark ✓

5. **Push:**
   - Click `...` → `Push`
   - Or use: `git push`

### Good Commit Messages

✅ Good:
- `Fix timezone display issue for created_at field`
- `Add export functionality with date range filters`
- `Update README with deployment instructions`

❌ Bad:
- `fix`
- `changes`
- `update`

---

## Useful Git Commands

```powershell
# Check status of files
git status

# View commit history
git log --oneline

# See what changes were made
git diff

# Discard changes to a file
git checkout -- filename

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# View all branches
git branch -a
```

---

## Need Help?

1. **Check Git status:** `git status`
2. **Check VS Code Output:** View → Output → Select "Git" from dropdown
3. **GitHub Documentation:** https://docs.github.com

---

**Good Luck! 🚀**

Once pushed, your code is safely backed up on GitHub and ready for collaborative development!
