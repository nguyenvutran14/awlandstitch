Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$ogDir = Join-Path $root 'public\og'
$publicDir = Join-Path $root 'public'
New-Item -ItemType Directory -Force -Path $ogDir | Out-Null

$paper = [System.Drawing.ColorTranslator]::FromHtml('#f7efe4')
$paper2 = [System.Drawing.ColorTranslator]::FromHtml('#efe2d2')
$surface = [System.Drawing.ColorTranslator]::FromHtml('#fffaf2')
$ink = [System.Drawing.ColorTranslator]::FromHtml('#241a14')
$muted = [System.Drawing.ColorTranslator]::FromHtml('#5c4b3f')
$line = [System.Drawing.ColorTranslator]::FromHtml('#d9cbbd')
$leather = [System.Drawing.ColorTranslator]::FromHtml('#8a4b1f')
$leatherDark = [System.Drawing.ColorTranslator]::FromHtml('#5e2f12')
$tan = [System.Drawing.ColorTranslator]::FromHtml('#c98f5a')
$steel = [System.Drawing.ColorTranslator]::FromHtml('#b9c2c7')
$steelDark = [System.Drawing.ColorTranslator]::FromHtml('#7d8a91')
$cream = [System.Drawing.ColorTranslator]::FromHtml('#fff8ef')

function New-RoundedRectPath {
  param([float]$X, [float]$Y, [float]$W, [float]$H, [float]$R)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $R * 2
  $path.AddArc($X, $Y, $d, $d, 180, 90)
  $path.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
  $path.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
  $path.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-BrandMark {
  param([System.Drawing.Graphics]$G, [float]$X, [float]$Y, [float]$Size)
  $darkBrush = New-Object System.Drawing.SolidBrush($ink)
  $creamPen = New-Object System.Drawing.Pen($cream, [Math]::Max(2, $Size * 0.075))
  $tanPen = New-Object System.Drawing.Pen($tan, [Math]::Max(1.5, $Size * 0.06))
  $tanBrush = New-Object System.Drawing.SolidBrush($tan)
  $creamPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $creamPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $tanPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $tanPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $tanPen.DashPattern = @(3, 4)
  $path = New-RoundedRectPath -X $X -Y $Y -W $Size -H $Size -R ($Size * 0.22)
  $G.FillPath($darkBrush, $path)
  $G.DrawLine($creamPen, $X + $Size * 0.30, $Y + $Size * 0.70, $X + $Size * 0.70, $Y + $Size * 0.30)
  $G.DrawLine($tanPen, $X + $Size * 0.35, $Y + $Size * 0.30, $X + $Size * 0.70, $Y + $Size * 0.65)
  $G.FillEllipse($tanBrush, $X + $Size * 0.27, $Y + $Size * 0.67, $Size * 0.12, $Size * 0.12)
  $path.Dispose()
  $darkBrush.Dispose()
  $creamPen.Dispose()
  $tanPen.Dispose()
  $tanBrush.Dispose()
}

function Draw-Iron {
  param([System.Drawing.Graphics]$G, [float]$X, [float]$Y, [float]$Scale, [int]$Teeth)
  $handleBrush = New-Object System.Drawing.SolidBrush($leatherDark)
  $metalBrush = New-Object System.Drawing.SolidBrush($steel)
  $darkBrush = New-Object System.Drawing.SolidBrush($steelDark)
  $handle = New-RoundedRectPath -X $X -Y $Y -W (180 * $Scale) -H (38 * $Scale) -R (19 * $Scale)
  $G.FillPath($handleBrush, $handle)
  $G.FillRectangle($darkBrush, $X + 172 * $Scale, $Y - 2 * $Scale, 18 * $Scale, 42 * $Scale)
  $G.FillRectangle($metalBrush, $X + 188 * $Scale, $Y + 8 * $Scale, (170 + $Teeth * 18) * $Scale, 22 * $Scale)
  for ($i = 0; $i -lt $Teeth; $i++) {
    $tx = $X + (360 + $i * 18) * $Scale
    $points = [System.Drawing.PointF[]]@(
      [System.Drawing.PointF]::new($tx, $Y + 26 * $Scale),
      [System.Drawing.PointF]::new($tx + 8 * $Scale, $Y + 26 * $Scale),
      [System.Drawing.PointF]::new($tx + 6 * $Scale, $Y + 78 * $Scale),
      [System.Drawing.PointF]::new($tx + 2 * $Scale, $Y + 78 * $Scale)
    )
    $G.FillPolygon($metalBrush, $points)
  }
  $handle.Dispose()
  $handleBrush.Dispose()
  $metalBrush.Dispose()
  $darkBrush.Dispose()
}

function New-OgImage {
  param(
    [string]$Path,
    [string]$Title,
    [string]$Eyebrow,
    [string]$Subtitle,
    [string]$Footer
  )

  $bitmap = New-Object System.Drawing.Bitmap 1200, 630
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  $bgBrush = New-Object System.Drawing.SolidBrush($paper)
  $g.FillRectangle($bgBrush, 0, 0, 1200, 630)

  $circleBrush = New-Object System.Drawing.SolidBrush($paper2)
  $g.FillEllipse($circleBrush, 860, -120, 460, 460)
  $g.FillEllipse($circleBrush, 980, 420, 300, 300)

  $borderPen = New-Object System.Drawing.Pen($line, 2)
  $g.DrawRectangle($borderPen, 24, 24, 1152, 582)

  Draw-BrandMark -G $g -X 64 -Y 58 -Size 46

  $brandFont = New-Object System.Drawing.Font('Georgia', 24, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brandBrush = New-Object System.Drawing.SolidBrush($ink)
  $g.DrawString('AWL & STITCH', $brandFont, $brandBrush, 126, 70)

  $eyebrowFont = New-Object System.Drawing.Font('Segoe UI', 15, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $eyebrowBrush = New-Object System.Drawing.SolidBrush($leatherDark)
  $g.DrawString($Eyebrow.ToUpperInvariant(), $eyebrowFont, $eyebrowBrush, 64, 154)

  $titleFont = New-Object System.Drawing.Font('Georgia', 48, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $titleBrush = New-Object System.Drawing.SolidBrush($ink)
  $titleRect = New-Object System.Drawing.RectangleF 64, 186, 720, 220
  $titleFormat = New-Object System.Drawing.StringFormat
  $titleFormat.Trimming = [System.Drawing.StringTrimming]::EllipsisCharacter
  $g.DrawString($Title, $titleFont, $titleBrush, $titleRect, $titleFormat)

  $subFont = New-Object System.Drawing.Font('Segoe UI', 21, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $subBrush = New-Object System.Drawing.SolidBrush($muted)
  $subRect = New-Object System.Drawing.RectangleF 64, 430, 690, 90
  $subFormat = New-Object System.Drawing.StringFormat
  $subFormat.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $g.DrawString($Subtitle, $subFont, $subBrush, $subRect, $subFormat)

  Draw-Iron -G $g -X 790 -Y 470 -Scale 0.95 -Teeth 8

  $footerFont = New-Object System.Drawing.Font('Segoe UI', 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $footerBrush = New-Object System.Drawing.SolidBrush($muted)
  $g.DrawString($Footer, $footerFont, $footerBrush, 64, 584)

  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)

  $titleFormat.Dispose()
  $subFormat.Dispose()
  $titleFont.Dispose()
  $subFont.Dispose()
  $footerFont.Dispose()
  $brandFont.Dispose()
  $eyebrowFont.Dispose()
  $titleBrush.Dispose()
  $subBrush.Dispose()
  $footerBrush.Dispose()
  $brandBrush.Dispose()
  $eyebrowBrush.Dispose()
  $bgBrush.Dispose()
  $circleBrush.Dispose()
  $borderPen.Dispose()
  $g.Dispose()
  $bitmap.Dispose()
}

$articles = @(
  @{ Slug = 'best-pricking-irons'; Title = 'Best Pricking Irons for Beginners'; Eyebrow = 'Buying hub'; Subtitle = '5 picks · US shipping checked · prices dated November 2026'; Footer = 'awlandstitch.pages.dev · Prices at time of writing · Verify at checkout' },
  @{ Slug = 'best-budget-pricking-irons'; Title = 'Best Budget Pricking Irons Under $30'; Eyebrow = 'Budget guide'; Subtitle = '3 picks · dated prices · no paid rankings'; Footer = 'awlandstitch.pages.dev · Prices at time of writing · Verify at checkout' },
  @{ Slug = '3-38mm-vs-3-85mm-pricking-irons'; Title = '3.38mm vs 3.85mm Pricking Irons'; Eyebrow = 'Comparison'; Subtitle = 'Pitch, SPI, thread, and the wallet decision'; Footer = 'awlandstitch.pages.dev · Research-based comparison' },
  @{ Slug = 'pricking-irons-vs-stitching-chisels'; Title = 'Pricking Irons vs Stitching Chisels'; Eyebrow = 'Tool guide'; Subtitle = 'Marking irons, chisels, and the awl workflow'; Footer = 'awlandstitch.pages.dev · Research-based tool guide' },
  @{ Slug = 'what-size-pricking-irons-for-wallets'; Title = 'What Size Pricking Irons for Wallets?'; Eyebrow = 'Sizing guide'; Subtitle = '3.38mm vs 3.85mm · thread pairing · tooth counts'; Footer = 'awlandstitch.pages.dev · Research-based sizing guide' },
  @{ Slug = 'pricking-iron-size-chart'; Title = 'Pricking Iron Size Chart'; Eyebrow = 'Reference'; Subtitle = 'mm to SPI, tooth counts, and pitch choices'; Footer = 'awlandstitch.pages.dev · Research-based reference' }
)

foreach ($article in $articles) {
  New-OgImage -Path (Join-Path $ogDir ($article.Slug + '.png')) -Title $article.Title -Eyebrow $article.Eyebrow -Subtitle $article.Subtitle -Footer $article.Footer
}

New-OgImage -Path (Join-Path $publicDir 'og-default.png') -Title 'Leathercraft tools, researched before you buy.' -Eyebrow 'Awl & Stitch' -Subtitle 'US-focused pricking iron guides · dated prices · direct links' -Footer 'awlandstitch.pages.dev · Independent, reader-supported research'

function New-Icon {
  param([string]$Path, [int]$Size, [bool]$Rounded)
  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear($ink)
  if ($Rounded) {
    $bg = New-Object System.Drawing.SolidBrush($ink)
    $g.FillRectangle($bg, 0, 0, $Size, $Size)
    $bg.Dispose()
  }
  $creamPen = New-Object System.Drawing.Pen($cream, [Math]::Max(2, $Size * 0.075))
  $tanPen = New-Object System.Drawing.Pen($tan, [Math]::Max(1.5, $Size * 0.06))
  $tanBrush = New-Object System.Drawing.SolidBrush($tan)
  $creamPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $creamPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $tanPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $tanPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $tanPen.DashPattern = @(3, 4)
  $g.DrawLine($creamPen, $Size * 0.30, $Size * 0.70, $Size * 0.70, $Size * 0.30)
  $g.DrawLine($tanPen, $Size * 0.35, $Size * 0.30, $Size * 0.70, $Size * 0.65)
  $g.FillEllipse($tanBrush, $Size * 0.27, $Size * 0.67, $Size * 0.12, $Size * 0.12)
  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $creamPen.Dispose()
  $tanPen.Dispose()
  $tanBrush.Dispose()
  $g.Dispose()
  $bitmap.Dispose()
}

New-Icon -Path (Join-Path $publicDir 'favicon-32.png') -Size 32 -Rounded $true
New-Icon -Path (Join-Path $publicDir 'apple-touch-icon.png') -Size 180 -Rounded $true
New-Icon -Path (Join-Path $publicDir 'logo-512.png') -Size 512 -Rounded $true

Write-Host "Wrote 7 OG images, 3 PNG icons, and reused favicon.svg."
