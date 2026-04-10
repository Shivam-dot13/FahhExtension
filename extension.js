const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');

function activate(context) {

    // Listen for when a terminal command finishes
    const disposable = vscode.window.onDidEndTerminalShellExecution((event) => {
        // Exit code 0 means success. Anything else (like 1 or 127) is an error.
        if (event.exitCode !== 0 && event.exitCode !== undefined) {
            playSound(context);
        }
    });

    context.subscriptions.push(disposable);
}

function playSound(context) {
    const soundPath = path.join(context.extensionPath, 'assets', 'alert.mp3');
    
    let command;
    if (process.platform === 'win32') {
        // This version uses a hidden background player that is more reliable for MP3s
        command = `powershell -c "Add-Type -AssemblyName presentationCore; $player = New-Object system.windows.media.mediaplayer; $player.open('${soundPath}'); $player.Play(); Start-Sleep 3"`;
    } else {
        command = `afplay "${soundPath}"`; // Mac
    }


    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error('Playback Error:', err);
        }
        if (stderr) {
            console.error('PowerShell Stderr:', stderr);
        }
    });
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}