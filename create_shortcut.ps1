$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\HackPath.lnk')
$Shortcut.TargetPath = 'c:\Users\yoshi\OneDrive\デスクトップ\IT学習\HackPathを開く.cmd'
$Shortcut.WorkingDirectory = 'c:\Users\yoshi\OneDrive\デスクトップ\IT学習'
$Shortcut.Save()
