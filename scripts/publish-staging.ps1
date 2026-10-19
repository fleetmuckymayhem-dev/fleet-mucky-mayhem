param([switch]$UsePreparedBuild)
$ErrorActionPreference = 'Stop'
$sourceRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$owner = 'Martin-Ferrero-Thompson'
$name = 'staging-fleet-mucky-mayhem'
$repo = "$owner/$name"
$remote = "https://github.com/$repo.git"
$site = "https://martin-ferrero-thompson.github.io/$name/"
$description = 'Client testing preview of Fleet Mucky Mayhem. Built website files only.'
function Invoke-Git {
  param([string[]]$GitArgs)
  & git @GitArgs
  if ($LASTEXITCODE -ne 0) { throw "Git command failed: $($GitArgs[0])" }
}
if ((git -C $sourceRoot remote get-url origin) -ne "https://github.com/$owner/fleet-mucky-mayhem-astro.git") {
  throw 'Unexpected source repository.'
}
if (!$UsePreparedBuild) {
  Push-Location -LiteralPath $sourceRoot
  try { & npm.cmd run build:staging; if ($LASTEXITCODE -ne 0) { throw 'Staging build failed.' } }
  finally { Pop-Location }
}
$buildRoot = Join-Path $sourceRoot 'artifacts/staging-site'
if (!(Test-Path -LiteralPath (Join-Path $buildRoot '.nojekyll'))) { throw 'Validated staging build is missing.' }
if (!(Get-Content -LiteralPath (Join-Path $buildRoot 'index.html') -Raw).Contains('/staging-fleet-mucky-mayhem/_astro/')) {
  throw 'Build has the wrong Pages path.'
}
$env:GIT_TERMINAL_PROMPT = '0'
$env:GCM_INTERACTIVE = 'never'
$credential = "protocol=https`nhost=github.com`nusername=$owner`n`n" | git credential fill 2>$null
if ($LASTEXITCODE -ne 0) { throw 'GitHub sign-in is unavailable.' }
$fields = @{}
foreach ($line in $credential) {
  $separator = $line.IndexOf('=')
  if ($separator -gt 0) { $fields[$line.Substring(0, $separator)] = $line.Substring($separator + 1) }
}
if (!$fields.password) { throw 'No GitHub credential available.' }
$headers = @{ Authorization = "Bearer $($fields.password)"; Accept = 'application/vnd.github+json'; 'User-Agent' = 'FMM-Staging-Publisher' }
try {
  $user = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers $headers
  if ($user.login -ne $owner) { throw 'Signed-in account does not match the staging owner.' }
  $source = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/fleet-mucky-mayhem-astro" -Headers $headers
  if (!$source.private) { throw 'Expected source repository to remain private.' }
  $target = $null
  try { $target = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo" -Headers $headers }
  catch { if ([int]$_.Exception.Response.StatusCode -ne 404) { throw } }
  if ($target) {
    if ($target.private -or $target.description -ne $description) { throw 'An unexpected repository already uses the staging name.' }
  } else {
    $body = @{ name = $name; private = $false; auto_init = $false; description = $description; homepage = $site; has_issues = $false; has_wiki = $false; has_projects = $false } | ConvertTo-Json
    $target = Invoke-RestMethod -Method Post -Uri 'https://api.github.com/user/repos' -Headers $headers -ContentType 'application/json' -Body $body
    Write-Output "Created public staging repository: $($target.html_url)"
  }
  # Fresh, isolated checkout. Never copy the source repository or its Git history.
  $artifactsRoot = (Resolve-Path -LiteralPath (Join-Path $sourceRoot 'artifacts')).Path
  $publishRoot = [IO.Path]::GetFullPath((Join-Path $artifactsRoot ('staging-publish-' + [guid]::NewGuid().ToString('N'))))
  if (!$publishRoot.StartsWith($artifactsRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Publish checkout is outside artifacts.' }
  Invoke-Git -GitArgs @('clone', '--depth', '1', $remote, $publishRoot)
  $stagingHead = & git -C $publishRoot rev-parse --verify HEAD 2>$null
  if ($LASTEXITCODE -eq 0) {
    # Remove only tracked files in this disposable staging checkout before copying the build.
    Invoke-Git -GitArgs @('-C', $publishRoot, 'rm', '-r', '--ignore-unmatch', '--quiet', '.')
  }
  Get-ChildItem -LiteralPath $buildRoot -Force | Copy-Item -Destination $publishRoot -Recurse -Force
  $authorName = git -C $sourceRoot log -1 --format=%an
  $authorEmail = git -C $sourceRoot log -1 --format=%ae
  Invoke-Git -GitArgs @('-C', $publishRoot, 'config', 'user.name', $authorName)
  Invoke-Git -GitArgs @('-C', $publishRoot, 'config', 'user.email', $authorEmail)
  Invoke-Git -GitArgs @('-C', $publishRoot, 'add', '--all')
  & git -C $publishRoot diff --cached --quiet
  if ($LASTEXITCODE -eq 1) {
    $revision = git -C $sourceRoot rev-parse --short HEAD
    Invoke-Git -GitArgs @('-C', $publishRoot, 'commit', '-q', '-m', "Publish staging preview ($revision)")
  } elseif ($LASTEXITCODE -ne 0) {
    throw 'Cannot inspect staged website changes.'
  }
  Invoke-Git -GitArgs @('-C', $publishRoot, 'branch', '-M', 'main')
  Invoke-Git -GitArgs @('-C', $publishRoot, 'push', '--set-upstream', 'origin', 'main')
  $pages = $null
  try { $pages = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/pages" -Headers $headers }
  catch { if ([int]$_.Exception.Response.StatusCode -ne 404) { throw } }
  if (!$pages) {
    $body = @{ build_type = 'legacy'; source = @{ branch = 'main'; path = '/' } } | ConvertTo-Json -Depth 3
    $pages = Invoke-RestMethod -Method Post -Uri "https://api.github.com/repos/$repo/pages" -Headers $headers -ContentType 'application/json' -Body $body
  } elseif ($pages.source.branch -ne 'main' -or $pages.source.path -ne '/') {
    throw 'Existing Pages configuration does not match the staging branch.'
  }
  Write-Output "Pages publishing enabled: $($pages.html_url)"
  Write-Output 'Deployment is asynchronous; verify the live site before sharing.'
} finally {
  $headers = $null; $credential = $null; $fields = $null
}
