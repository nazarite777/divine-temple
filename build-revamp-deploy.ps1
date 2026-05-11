$ErrorActionPreference = 'Stop'

$workspaceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$deployRoot = Join-Path $workspaceRoot 'revamp-deploy'

$htmlFiles = @(
    'CNAME',
    'index.html',
    'home.html',
    'about.html',
    'books.html',
    'music.html',
    'division-i.html',
    'members-new.html',
    'register.html',
    'lesson-01-what-is-programming.html',
    'lesson-02-the-walk-back.html',
    'lesson-03-ini-year.html',
    'lesson-04-aligned-manifestation.html',
    'lesson-05-first-decision.html',
    'manifest.json'
)

$assetDirectories = @(
    'css',
    'images',
    'js'
)

if (Test-Path $deployRoot) {
    Remove-Item $deployRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $deployRoot | Out-Null

foreach ($file in $htmlFiles) {
    $sourcePath = Join-Path $workspaceRoot $file
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination (Join-Path $deployRoot $file) -Force
    }
}

foreach ($directory in $assetDirectories) {
    $sourcePath = Join-Path $workspaceRoot $directory
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination (Join-Path $deployRoot $directory) -Recurse -Force
    }
}

Write-Host "Revamp deploy folder ready at $deployRoot"