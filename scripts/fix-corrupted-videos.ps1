# Fix all corrupted (0 byte) video files by re-downloading from ceyloe.com
# Usage: .\scripts\fix-corrupted-videos.ps1

Write-Host "🔧 Fixing Corrupted Videos" -ForegroundColor Cyan
Write-Host ("=" * 50)
Write-Host ""

$OUTPUT_DIR = "public\videos\gemstones"

# Video URL mappings (from ceyloe.com)
$videoMappings = @{
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

foreach ($handle in $videoMappings.Keys) {
    $filename = "$handle.mp4"
    $filepath = Join-Path $OUTPUT_DIR $filename
    $videoUrl = $videoMappings[$handle]
    
    Write-Host "📦 $handle" -ForegroundColor Yellow
    
    # Check if file is 0 bytes
    if (Test-Path $filepath) {
        $fileInfo = Get-Item $filepath
        if ($fileInfo.Length -gt 0) {
            Write-Host "  ✓ Already fixed ($(($fileInfo.Length / 1MB).ToString('F2')) MB)" -ForegroundColor Green
            $fixed++
            continue
        }
    }
    
    try {
        Write-Host "  📥 Downloading from: $videoUrl" -ForegroundColor Gray
        Invoke-WebRequest -Uri $videoUrl -OutFile $filepath -ErrorAction Stop
        
        # Verify download
        $fileInfo = Get-Item $filepath
        if ($fileInfo.Length -gt 0) {
            $sizeMB = ($fileInfo.Length / 1MB).ToString('F2')
            Write-Host "  ✅ Downloaded: $sizeMB MB" -ForegroundColor Green
            $fixed++
        } else {
            Write-Host "  ❌ Still 0 bytes" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host "  ❌ Error: $_" -ForegroundColor Red
        $failed++
    }
    
    # Small delay
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host ("=" * 50)
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   Total: $($videoMappings.Count)"
Write-Host "   Fixed: $fixed" -ForegroundColor Green
Write-Host "   Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($fixed -gt 0) {
    Write-Host "✨ Done! Refresh your browser to see the videos." -ForegroundColor Green
}
Write-Host ""
