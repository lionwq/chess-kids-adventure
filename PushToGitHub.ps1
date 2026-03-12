# GitHub Upload Script - PowerShell Version
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     GitHub Upload - PowerShell Version" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set location to project directory
Set-Location "c:\Users\admin\WorkBuddy\20260312173804"

# Step 1: Initialize Git if needed
Write-Host "[Step 1/5] Preparing Git repository..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    git init
    Write-Host "[OK] Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "[OK] Git repository already exists" -ForegroundColor Green
}

# Step 2: Create .gitignore
Write-Host ""
Write-Host "[Step 2/5] Creating .gitignore..." -ForegroundColor Yellow
$gitignoreContent = @"
node_modules
.next
dist
.DS_Store
*.log
.env*
*.bat
*.md
*.txt
"@
Set-Content -Path .gitignore -Value $gitignoreContent -Encoding UTF8
Write-Host "[OK] .gitignore created" -ForegroundColor Green

# Step 3: Add files and commit
Write-Host ""
Write-Host "[Step 3/5] Adding files and creating commit..." -ForegroundColor Yellow
git add .
$commitResult = git commit -m "Initial commit: Chess Kids Adventure"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[INFO] No new files to commit" -ForegroundColor Cyan
} else {
    Write-Host "[OK] Commit created successfully" -ForegroundColor Green
}

# Step 4: Set branch to main
Write-Host ""
Write-Host "[Step 4/5] Setting branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "[OK] Branch set to main" -ForegroundColor Green

# Step 5: Get credentials
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     GitHub Credentials" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please enter your GitHub information:" -ForegroundColor Yellow
Write-Host ""

$githubUsername = Read-Host "GitHub Username"
$githubToken = Read-Host "GitHub Personal Access Token" -AsSecureString
$githubToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($githubToken))

if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host ""
    Write-Host "[ERROR] Username cannot be empty" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if ([string]::IsNullOrWhiteSpace($githubToken)) {
    Write-Host ""
    Write-Host "[ERROR] Token cannot be empty" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 6: Push to GitHub
Write-Host ""
Write-Host "[Step 6/6] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Repository: https://github.com/$githubUsername/chess-kids-adventure.git" -ForegroundColor Cyan
Write-Host ""

# Remove old remote if exists
git remote remove origin 2>$null

# Add new remote
$repoUrl = "https://$githubToken@github.com/$githubUsername/chess-kids-adventure.git"
git remote add origin $repoUrl

# Push to GitHub
$pushResult = git push -u origin main 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "     [ERROR] Push Failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common reasons:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Repository does not exist on GitHub" -ForegroundColor White
    Write-Host "   Solution: Create repository at https://github.com/new" -ForegroundColor Gray
    Write-Host "             Name: chess-kids-adventure" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Repository name is incorrect" -ForegroundColor White
    Write-Host "   Solution: Verify the name is exactly 'chess-kids-adventure'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Token is incorrect or expired" -ForegroundColor White
    Write-Host "   Solution: Regenerate token at https://github.com/settings/tokens" -ForegroundColor Gray
    Write-Host "             Make sure to select 'repo' permissions" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Token lacks permissions" -ForegroundColor White
    Write-Host "   Solution: Token must have 'repo' scope enabled" -ForegroundColor Gray
    Write-Host ""
    Write-Host "5. Network connection issue" -ForegroundColor White
    Write-Host "   Solution: Check your internet connection" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Quick check:" -ForegroundColor Yellow
    Write-Host "Visit: https://github.com/$githubUsername/chess-kids-adventure" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "If page says '404 Not Found':" -ForegroundColor Red
    Write-Host "   - You need to create the repository first" -ForegroundColor White
    Write-Host "   - Go to: https://github.com/new" -ForegroundColor Gray
    Write-Host "   - Name: chess-kids-adventure" -ForegroundColor Gray
    Write-Host "   - Click 'Create repository'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Error details:" -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "     [SUCCESS] Upload Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your repository is now on GitHub:" -ForegroundColor Cyan
Write-Host "https://github.com/$githubUsername/chess-kids-adventure" -ForegroundColor White
Write-Host ""
Write-Host "Next: Deploy to Vercel" -ForegroundColor Yellow
Write-Host "1. Visit: https://vercel.com" -ForegroundColor Gray
Write-Host "2. Login with GitHub" -ForegroundColor Gray
Write-Host "3. Click 'New Project'" -ForegroundColor Gray
Write-Host "4. Select 'chess-kids-adventure'" -ForegroundColor Gray
Write-Host "5. Click 'Import' then 'Deploy'" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"
