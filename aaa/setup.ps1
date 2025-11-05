# Student Engagement Dashboard - Getting Started

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Student Engagement Dashboard Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "Current Node.js version: $nodeVersion" -ForegroundColor Green

if ($nodeVersion -match "v(\d+)\.") {
    $major = [int]$Matches[1]
    if ($major -lt 20) {
        Write-Host ""
        Write-Host "WARNING: Node.js 20+ recommended for dev server" -ForegroundColor Red
        Write-Host "Your version: $nodeVersion" -ForegroundColor Red
        Write-Host "You can still build for production!" -ForegroundColor Yellow
        Write-Host ""
    }
}

Write-Host ""
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "To run the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Development mode (Node 20+):" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Production mode (works with any Node):" -ForegroundColor White
Write-Host "    npm run preview" -ForegroundColor Yellow
Write-Host ""
Write-Host "Login credentials:" -ForegroundColor Cyan
Write-Host "  Username: admin" -ForegroundColor Yellow
Write-Host "  Password: admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  README.md     - Full documentation" -ForegroundColor White
Write-Host "  QUICKSTART.md - Quick start guide" -ForegroundColor White
Write-Host "  SUMMARY.md    - Project overview" -ForegroundColor White
Write-Host ""
