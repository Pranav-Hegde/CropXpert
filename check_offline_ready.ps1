# Check-OfflineReady.ps1
# Checks the project for offline readiness by verifying dependencies and scanning for external links.

$ErrorActionPreference = "Continue"
$root = Get-Location
$issues = 0

Write-Host "`n=== CROP RECOMMENDATION SYSTEM: OFFLINE READINESS CHECK ===`n" -ForegroundColor Cyan

# Function to check Node.js Project
function Check-NodeProject ($path, $name) {
    Write-Host "Checking $name ($path)..." -NoNewline
    if (Test-Path $path) {
        if (Test-Path (Join-Path $path "node_modules")) {
            Write-Host " [OK]" -ForegroundColor Green
        } else {
            Write-Host " [MISSING node_modules]" -ForegroundColor Red
            Write-Host "   ACTION: Run 'npm install' in $path" -ForegroundColor Yellow
            return 1
        }
    } else {
        Write-Host " [NOT FOUND]" -ForegroundColor DarkGray
    }
    return 0
}

# Function to check Python Project (simple venv check)
function Check-PythonProject ($path, $name) {
    Write-Host "Checking $name ($path)..." -NoNewline
    if (Test-Path $path) {
        $venv = (Test-Path (Join-Path $path "venv")) -or (Test-Path (Join-Path $path ".venv"))
        if ($venv) {
            Write-Host " [OK] (venv found)" -ForegroundColor Green
        } else {
            Write-Host " [WARNING]" -ForegroundColor Yellow
            Write-Host "   NOTE: No local 'venv' found. Ensure global Python dependencies are installed." -ForegroundColor Gray
            # Not strictly an error if they use global python
        }
    } else {
        Write-Host " [NOT FOUND]" -ForegroundColor DarkGray
    }
    return 0
}

# 1. Dependency Checks
Write-Host "--- Dependency Checks ---" -ForegroundColor White
$issues += Check-NodeProject -path (Join-Path $root "Crop\Frontend\frontend") -name "Frontend"
$issues += Check-NodeProject -path (Join-Path $root "Crop\Recommend\frontend") -name "Recommend Frontend"
$issues += Check-NodeProject -path (Join-Path $root "Crop\Backend") -name "Backend"
$issues += Check-NodeProject -path (Join-Path $root "Crop\Recommend") -name "Recommend (Node)"
Check-PythonProject -path (Join-Path $root "Crop\Recommend") -name "Recommend (Python)" | Out-Null
Check-PythonProject -path (Join-Path $root "Crop\CarbonFootprint") -name "CarbonFootprint" | Out-Null

# 2. External Link Scan
Write-Host "`n--- Scanning Source Code for External Links ---" -ForegroundColor White
Write-Host "Looking for 'http://' or 'https://' in src/href/axios/fetch/requests..." -ForegroundColor Gray

$searchPath = Join-Path $root "Crop"
$pattern = "(href|src|url|axios\.(get|post)|fetch|requests\.(get|post))\s*[:=(]\s*['`"]https?://"

# Get files, excluding node_modules, venv, .git
$files = Get-ChildItem -Path $searchPath -Recurse -Include *.html, *.js, *.py, *.css, *.jsx | 
    Where-Object { 
        $_.FullName -notmatch "node_modules" -and 
        $_.FullName -notmatch "venv" -and 
        $_.FullName -notmatch "\.git" -and
        $_.FullName -notmatch "coverage"
    }

$foundLinks = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName
    
    # Check for HTTP/HTTPS
    $matches = $content | Select-String -Pattern $pattern
    if ($matches) {
        foreach ($match in $matches) {
            Write-Host "POTENTIAL ISSUE in $($file.Name):" -ForegroundColor Red
            Write-Host "  Line $($match.LineNumber): $($match.Line.Trim())" -ForegroundColor Gray
            $foundLinks++
        }
    }

    # Check for Cloud MongoDB
    $mongoMatches = $content | Select-String -Pattern "mongodb\+srv://"
    if ($mongoMatches) {
        foreach ($match in $mongoMatches) {
            Write-Host "CRITICAL ISSUE in $($file.Name):" -ForegroundColor Red
            Write-Host "  Cloud MongoDB connection found (will fail offline):" -ForegroundColor Yellow
            Write-Host "  Line $($match.LineNumber): $($match.Line.Trim())" -ForegroundColor Gray
            $foundLinks++
        }
    }
}

if ($foundLinks -eq 0) {
    Write-Host "No obvious external calls found in source code. Great!" -ForegroundColor Green
} else {
    Write-Host "`nFound $foundLinks potential external calls." -ForegroundColor Yellow
    Write-Host "Review the lines above. If they are critical (e.g. CDNs, APIs), the app may not work offline." -ForegroundColor Yellow
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor White
if ($issues -eq 0) {
    Write-Host "Dependencies look correctly installed." -ForegroundColor Green
} else {
    Write-Host "There are MISSING DEPENDENCIES ($issues). Fix them before going offline." -ForegroundColor Red
}
Write-Host "Done."
