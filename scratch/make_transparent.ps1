Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\david\.gemini\antigravity\brain\7d5766ba-e185-4ad1-a104-165c08ad92b7\media__1780011291890.png"
$destPath = "c:\Users\david\Paradise-Premium\assets\logoparadise.png"

if (-not (Test-Path $srcPath)) {
    Write-Error "Source file not found at $srcPath"
    exit 1
}

# Load image and convert to Bitmap
$srcImg = [System.Drawing.Image]::FromFile($srcPath)
$bmp = New-Object System.Drawing.Bitmap($srcImg)

$width = $bmp.Width
$height = $bmp.Height

Write-Output "Original dimensions: $width x $height"

# Loop through each pixel and make near-white transparent
for ($x = 0; $x -lt $width; $x++) {
    for ($y = 0; $y -lt $height; $y++) {
        $pixelColor = $bmp.GetPixel($x, $y)
        # If the pixel is very close to white, make it transparent
        if ($pixelColor.R -ge 248 -and $pixelColor.G -ge 248 -and $pixelColor.B -ge 248) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

# Backup the original logo just in case
$backupPath = "c:\Users\david\Paradise-Premium\assets\logoparadise_backup.png"
if (-not (Test-Path $backupPath)) {
    Copy-Item $destPath $backupPath -Force
}

# Save new transparent image
$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Clean up
$bmp.Dispose()
$srcImg.Dispose()

Write-Output "Saved transparent logo to $destPath"
