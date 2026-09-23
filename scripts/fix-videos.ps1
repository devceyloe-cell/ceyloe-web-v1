# Fix all corrupted (0 byte) video files
# Usage: .\scripts\fix-videos.ps1

Write-Host "Fixing Corrupted Videos..."
Write-Host "================================"
Write-Host ""

$OUTPUT_DIR = "public\videos\gemstones"

# Video mappings
$videos = @{
    "0-58-ct-padparadscha" = "http://ceyloe.com/wp-content/uploads/2024/04/output-20.mp4"
    "0-63-ct-blue-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/output-29.mp4"
    "0-81-ct-greenish-blue-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/output-15.mp4"
    "0-82-ct-bi-color-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/output-35.mp4"
    "0-88-ct-yellow-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/output-16.mp4"
    "0-98-ct-pink-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/output-17.mp4"
    "1-02-ct-blue-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/03/output-1-1.mp4"
    "1-03-ct-orange-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/output-11.mp4"
    "1-05-ct-blue-sapphire-2" = "http://ceyloe.com/wp-content/uploads/2024/04/output-25.mp4"
    "1-07-ct-white-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/Reduced-Size.mp4"
    "1-13-ct-blue-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/output-19.mp4"
    "1-13-ct-light-blue-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/output-Reduced-Size.mp4"
    "1-14-ct-white-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/output-24.mp4"
    "1-18-ct-white-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/output-27.mp4"
    "1-21-ct-royal-blue-sapphire" = "http://ceyloe.com/wp-content/uploads/2024/04/output.mp4"
}

$fixed = 0
$failed = 0

foreach ($handle in $videos.Keys) {
    $filename = "$handle.mp4"
    $filepath = Join-Path $OUTPUT_DIR $filename
    $url = $videos[$handle]
    
    Write-Host "Processing: $handle"
    
    try {
        Write-Host "  Downloading..."
        Invoke-WebRequest -Uri $url -OutFile $filepath
        
        $size = (Get-Item $filepath).Length
        if ($size -gt 0) {
            $sizeMB = [math]::Round($size / 1MB, 2)
            Write-Host "  SUCCESS: $sizeMB MB" -ForegroundColor Green
            $fixed++
        } else {
            Write-Host "  FAILED: Still 0 bytes" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "================================"
Write-Host "Summary:"
Write-Host "  Fixed: $fixed"
Write-Host "  Failed: $failed"
Write-Host ""
Write-Host "Done! Refresh your browser to see the videos."
