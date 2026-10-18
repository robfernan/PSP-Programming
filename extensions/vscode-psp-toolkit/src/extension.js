const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');

function getPPSSPPPath() {
    const platform = os.platform();
    if (platform === 'win32') {
        const candidatePaths = [
            "C:\\Program Files\\PPSSPP\\PPSSPPWindows.exe",
            "C:\\Program Files\\PPSSPP\\PPSSPPWindows64.exe",
            "C:\\Program Files (x86)\\PPSSPP\\PPSSPPWindows.exe",
            "C:\\Program Files (x86)\\PPSSPP\\PPSSPPWindows64.exe",
            path.join(os.homedir(), "scoop", "apps", "ppsspp", "current", "PPSSPPWindows64.exe")
        ];
        return candidatePaths.find(p => fs.existsSync(p)) || "PPSSPPWindows.exe";
    } else if (platform === 'darwin') {
        return "/Applications/PPSSPP.app/Contents/MacOS/PPSSPP";
    } else {
        // Linux / BSD
        return "ppsspp";
    }
}

function activate(context) {
    // 1. Cross-Platform "Run Project in PPSSPP" (Editor Header Icon)
    let runDisposable = vscode.commands.registerCommand('psp.runPPSSPP', async function () {
        const activeEditor = vscode.window.activeTextEditor;
        let projectDir = null;

        if (activeEditor) {
            let currentDir = path.dirname(activeEditor.document.uri.fsPath);
            while (currentDir && currentDir !== path.dirname(currentDir)) {
                if (fs.existsSync(path.join(currentDir, 'CMakeLists.txt'))) {
                    projectDir = currentDir;
                    break;
                }
                currentDir = path.dirname(currentDir);
            }
        }

        if (!projectDir && vscode.workspace.workspaceFolders) {
            projectDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
        }

        if (!projectDir) {
            vscode.window.showErrorMessage('PSP Dev Studio: No active PSP project or CMakeLists.txt found.');
            return;
        }

        const ppssppExecutable = getPPSSPPPath();
        const ebootPath = path.join(projectDir, 'build', 'EBOOT.PBP');

        vscode.window.showInformationMessage(`PSP Dev Studio: Building & Launching [${path.basename(projectDir)}]...`);

        // Trigger compilation
        exec(`mkdir -p build && cd build && psp-cmake .. && make`, { cwd: projectDir }, (err, stdout, stderr) => {
            if (fs.existsSync(ebootPath)) {
                vscode.window.showInformationMessage(`PSP Dev Studio: Launching ${path.basename(projectDir)} in PPSSPP!`);
                exec(`"${ppssppExecutable}" "${ebootPath}"`);
            } else {
                vscode.window.showWarningMessage('PSP Dev Studio: Compiled, but EBOOT.PBP was not found in build directory. Check compiler output.');
            }
        });
    });

    // 2. Automated Installer / Doctor Command
    let installDisposable = vscode.commands.registerCommand('psp.installToolchain', function () {
        const platform = os.platform();
        if (platform === 'win32') {
            vscode.window.showInformationMessage('PSP Dev Studio: Windows installer detected. Launching winget / ppsspp setup...');
            exec('winget install HenrikRydgard.PPSSPP --accept-source-agreements --accept-package-agreements', (err, stdout) => {
                if (!err) {
                    vscode.window.showInformationMessage('PPSSPP installed successfully via winget!');
                }
            });
        } else if (platform === 'darwin') {
            exec('brew install --cask ppsspp');
        } else {
            exec('flatpak install -y flathub org.ppsspp.PPSSPP || sudo apt install -y ppsspp');
        }
    });

    // 3. Open Diagnostics Dashboard
    let dashboardDisposable = vscode.commands.registerCommand('psp.openDashboard', function () {
        const panel = vscode.window.createWebviewPanel(
            'pspDevStudio',
            'PSP Dev Studio Dashboard',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        const htmlPath = path.join(context.extensionPath, 'media', 'dashboard.html');
        panel.webview.html = fs.readFileSync(htmlPath, 'utf8');
    });

    context.subscriptions.push(runDisposable);
    context.subscriptions.push(installDisposable);
    context.subscriptions.push(dashboardDisposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
