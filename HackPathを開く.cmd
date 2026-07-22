@echo off
setlocal
cd /d "%~dp0"

set "HACKPATH_URL=http://localhost:5190/"

rem Start a fixed-port local server. If it is already running, the existing one is reused.
start "HackPath Server" /min cmd /c "npm.cmd run dev -- --host 127.0.0.1 --port 5190 --strictPort"

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$url=$env:HACKPATH_URL; $limit=(Get-Date).AddSeconds(15); do { try { Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 1 | Out-Null; Start-Process $url; exit 0 } catch { Start-Sleep -Milliseconds 500 } } while ((Get-Date) -lt $limit); exit 1"

if errorlevel 1 (
  echo HackPathを起動できませんでした。
  echo Node.jsがインストールされているか確認してください。
  pause
)

endlocal
