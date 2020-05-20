Set-Location $PSScriptRoot
ionic build --prod

$indexHtmlPath = "$PSScriptRoot/firebase-hosting/examples/index.html"
(Get-Content $indexHtmlPath).
  replace('<base href="/"/>', '<base href="/examples/"/><link rel="canonical" href="https://angular-dnd.web.app/examples/"/>') |
  Set-Content $indexHtmlPath
