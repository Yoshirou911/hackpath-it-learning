@echo off
setlocal
cd /d "%~dp0"

set "HACKPATH_URL=http://localhost:5190/"

rem Check if server is already running
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-WebRequest -UseBasicParsing -Uri %HACKPATH_URL% -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }"

if errorlevel 1 (
  echo HackPathサーバーを起動しています...
  start "HackPath Server" /min cmd /c "npm.cmd run dev -- --host 127.0.0.1 --port 5190 --strictPort"
  
  echo サーバーが起動するのを待っています...
  powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
    "$url=$env:HACKPATH_URL; $limit=(Get-Date).AddSeconds(30); do { try { Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 1 | Out-Null; exit 0 } catch { Start-Sleep -Milliseconds 1000 } } while ((Get-Date) -lt $limit); exit 1"
  
  if errorlevel 1 (
    echo HackPathを起動できませんでした。
    echo Node.jsがインストールされているか確認してください。
    pause
    exit /b 1
  )
)

echo ブラウザを開いています...
start "" %HACKPATH_URL%

echo.
echo ブラウザでHackPathが開きました。
echo このウィンドウを閉じてください。
pause

endlocal
