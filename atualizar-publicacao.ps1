$ErrorActionPreference = 'Stop'

$origem = Join-Path $env:USERPROFILE 'Documents\F360\PORTAL ALVORAR'
$destino = $PSScriptRoot

if (-not (Test-Path -LiteralPath $origem)) {
  throw "Pasta de desenvolvimento não encontrada: $origem"
}

$arquivos = @(
  'index.html',
  'portal-alvorar-seed.js',
  'portal-alvorar.css',
  'alvorar.js',
  'alvorar-worker.js',
  'visual-refinements.css',
  'uso-consumo.css',
  'uso-consumo.js',
  'zip-logo-topbar.webp',
  'zip-logo.webp',
  'netlify.toml',
  'package.json',
  'package-lock.json'
)

foreach ($arquivo in $arquivos) {
  Copy-Item -LiteralPath (Join-Path $origem $arquivo) -Destination (Join-Path $destino $arquivo) -Force
}

$funcoesOrigem = Join-Path $origem 'netlify\functions'
$funcoesDestino = Join-Path $destino 'netlify\functions'
New-Item -ItemType Directory -Force -Path $funcoesDestino | Out-Null
Get-ChildItem -LiteralPath $funcoesOrigem -File | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $funcoesDestino $_.Name) -Force
}

Write-Host 'Pasta de publicação atualizada a partir do PORTAL ALVORAR.' -ForegroundColor Green
Write-Host 'Próximo passo: confira git status, crie o commit e envie para main.'

