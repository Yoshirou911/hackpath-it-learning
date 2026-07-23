Set WshShell = CreateObject("WScript.Shell")
Set Shortcut = WshShell.CreateShortcut(WshShell.SpecialFolders("Desktop") & "\HackPath.lnk")
Shortcut.TargetPath = "c:\Users\yoshi\OneDrive\デスクトップ\IT学習\HackPathを開く.cmd"
Shortcut.WorkingDirectory = "c:\Users\yoshi\OneDrive\デスクトップ\IT学習"
Shortcut.Save
