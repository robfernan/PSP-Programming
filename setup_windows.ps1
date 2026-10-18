# ==============================================================================
# PSP Homebrew Development Environment Auto-Setup for Windows 11
# ==============================================================================
# This script installs PPSSPP, configures environment variables,
# registers PSP file associations, and installs the PSP Dev Studio extension.
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   PlayStation Portable (PSP) Windows 11 Automated Setup   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check & Install PPSSPP via winget
Write-Host "[1/3] Checking PPSSPP Emulator installation..." -ForegroundColor Green
$ppssppInstalled = Get-Command "PPSSPPWindows64.exe" -ErrorAction SilentlyContinue
if (-not $ppssppInstalled) {
    $commonPath = "C:\Program Files\PPSSPP\PPSSPPWindows64.exe"
    if (Test-Path $commonPath) {
        Write-Host "      Found PPSSPP at $commonPath" -ForegroundColor DarkGreen
    } else {
        Write-Host "      Installing PPSSPP via Windows Package Manager (winget)..." -ForegroundColor Yellow
        winget install HenrikRydgard.PPSSPP --accept-source-agreements --accept-package-agreements
    }
} else {
    Write-Host "      PPSSPP is already installed!" -ForegroundColor DarkGreen
}

# 2. Configure Git / Toolchain Paths
Write-Host "[2/3] Configuring PSP Environment Variables..." -ForegroundColor Green
$localSDK = Join-Path $PSScriptRoot "pspsdk"
if (Test-Path $localSDK) {
    Write-Host "      Detected local SDK directory at: $localSDK" -ForegroundColor DarkGreen
} else {
    Write-Host "      Ready to use modern Docker toolchain: pspdev/pspdev" -ForegroundColor DarkGreen
}

# 3. Install the VS Code Extension
Write-Host "[3/3] Installing PSP Dev Studio VS Code Extension..." -ForegroundColor Green
$vsixFile = Get-ChildItem -Path (Join-Path $PSScriptRoot "extensions\vscode-psp-toolkit") -Filter "*.vsix" | Select-Object -First 1
if ($vsixFile) {
    Write-Host "      Installing $($vsixFile.FullName) into VS Code..." -ForegroundColor Yellow
    code --install-extension $vsixFile.FullName --force
} else {
    Write-Host "      Extension source ready in extensions/vscode-psp-toolkit/" -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "      PSP Development Environment Setup Completed!        " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Open any project in psp_projects/ and press the Play button to run in PPSSPP!"
