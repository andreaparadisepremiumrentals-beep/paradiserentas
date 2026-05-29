Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\david\Paradise-Premium\assets\logoparadise.png"
$destPath = "C:\Users\david\Downloads\logoparadise_4k.jpg"

if (-not (Test-Path $srcPath)) {
    Write-Error "Source file not found at $srcPath"
    exit 1
}

# Load original image
$srcImg = [System.Drawing.Image]::FromFile($srcPath)
$srcWidth = $srcImg.Width
$srcHeight = $srcImg.Height

Write-Output "Original dimensions: $srcWidth x $srcHeight"

# Calculate 4K dimensions maintaining aspect ratio (target width = 3840)
$destWidth = 3840
$destHeight = [int]($srcHeight * ($destWidth / $srcWidth))

Write-Output "Target 4K dimensions: $destWidth x $destHeight"

# Create new bitmap with target dimensions
$bmp = New-Object System.Drawing.Bitmap($destWidth, $destHeight)
$g = [System.Drawing.Graphics]::FromImage($bmp)

# Set background to white
$g.Clear([System.Drawing.Color]::White)

# Set high quality rendering
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

# Draw the original image onto the new white bitmap
$g.DrawImage($srcImg, 0, 0, $destWidth, $destHeight)

# Setup JPEG quality
$encoder = [System.Drawing.Imaging.Encoder]::Quality
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 95) # 95% quality

# Find JPEG codec
$codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
$jpegCodec = $codecs | Where-Object { $_.FormatDescription -eq "JPEG" }

# Save image
$bmp.Save($destPath, $jpegCodec, $encoderParams)

# Clean up
$g.Dispose()
$bmp.Dispose()
$srcImg.Dispose()

Write-Output "Saved 4K JPG to $destPath"
