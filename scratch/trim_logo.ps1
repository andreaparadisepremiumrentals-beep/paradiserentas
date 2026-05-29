Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\david\Paradise-Premium\public\assets\logoparadise.png"
$destPath = "c:\Users\david\Paradise-Premium\public\assets\logoparadise.png"

if (-not (Test-Path $srcPath)) {
    Write-Error "Source file not found at $srcPath"
    exit 1
}

# Load image
$bmp = New-Object System.Drawing.Bitmap($srcPath)
$width = $bmp.Width
$height = $bmp.Height

Write-Output "Original size: $width x $height"

# Find bounding box of non-transparent pixels
$minX = $width
$maxX = 0
$minY = $height
$maxY = 0

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $pixelColor = $bmp.GetPixel($x, $y)
        if ($pixelColor.A -gt 5) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Bounding box: X=$minX to $maxX, Y=$minY to $maxY"

$cropWidth = $maxX - $minX + 1
$cropHeight = $maxY - $minY + 1

if ($cropWidth -le 0 -or $cropHeight -le 0) {
    Write-Error "Image appears to be completely transparent!"
    $bmp.Dispose()
    exit 1
}

Write-Output "Cropped size: $cropWidth x $cropHeight"

# Create new bitmap with cropped dimensions plus 10px padding for safety
$padding = 10
$paddedWidth = $cropWidth + ($padding * 2)
$paddedHeight = $cropHeight + ($padding * 2)

$croppedBmp = New-Object System.Drawing.Bitmap($paddedWidth, $paddedHeight)
$g = [System.Drawing.Graphics]::FromImage($croppedBmp)
$g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

# Set quality rendering
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $cropWidth, $cropHeight)
$destRect = New-Object System.Drawing.Rectangle($padding, $padding, $cropWidth, $cropHeight)

$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Dispose $bmp first so we can overwrite the file
$bmp.Dispose()

# Save
$croppedBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Clean up
$g.Dispose()
$croppedBmp.Dispose()

Write-Output "Successfully trimmed and saved to $destPath"
