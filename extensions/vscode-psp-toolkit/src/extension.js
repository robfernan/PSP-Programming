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
                if (fs.existsSync(path.join(currentDir, 'CMakeLists.txt')) ||
                    fs.existsSync(path.join(currentDir, 'Cargo.toml')) ||
                    fs.existsSync(path.join(currentDir, 'build.zig'))) {
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
        let candidateEbootPaths = [];
        let projectType = 'CMake';

        if (fs.existsSync(path.join(projectDir, 'Cargo.toml'))) {
            projectType = 'Rust';
            candidateEbootPaths = [
                path.join(projectDir, 'target', 'mipsel-sony-psp', 'release', 'EBOOT.PBP'),
                path.join(projectDir, 'target', 'mipsel-sony-psp', 'debug', 'EBOOT.PBP'),
                path.join(projectDir, 'EBOOT.PBP')
            ];
        } else if (fs.existsSync(path.join(projectDir, 'build.zig'))) {
            projectType = 'Zig';
            candidateEbootPaths = [
                path.join(projectDir, 'zig-out', 'bin', 'EBOOT.PBP'),
                path.join(projectDir, 'build', 'EBOOT.PBP'),
                path.join(projectDir, 'EBOOT.PBP')
            ];
        } else {
            projectType = 'CMake';
            candidateEbootPaths = [
                path.join(projectDir, 'build', 'EBOOT.PBP'),
                path.join(projectDir, 'EBOOT.PBP')
            ];
        }

        const outputChannel = vscode.window.createOutputChannel('PSP Dev Studio');
        outputChannel.clear();
        outputChannel.show(true);
        outputChannel.appendLine(`[PSP Dev Studio] Target Project: ${projectDir} (${projectType})`);

        function launchInPPSSPP(ebootFile) {
            outputChannel.appendLine(`[PSP Dev Studio] Launching PPSSPP with: ${ebootFile}`);
            vscode.window.showInformationMessage(`PSP Dev Studio: Launching ${path.basename(projectDir)} in PPSSPP!`);
            const { spawn } = require('child_process');
            const child = spawn(ppssppExecutable, [ebootFile], { detached: true, stdio: 'ignore' });
            child.unref();
        }

        const existingEboot = candidateEbootPaths.find(p => fs.existsSync(p));

        // If the active editor is directly focused on an EBOOT.PBP, run it immediately!
        if (activeEditor && activeEditor.document.uri.fsPath.endsWith('EBOOT.PBP') && fs.existsSync(activeEditor.document.uri.fsPath)) {
            outputChannel.appendLine(`[PSP Dev Studio] Directly launching active EBOOT file: ${activeEditor.document.uri.fsPath}`);
            launchInPPSSPP(activeEditor.document.uri.fsPath);
            return;
        }

        // Determine the best build command based on environment & OS
        let buildCmd = '';
        const isWindows = process.platform === 'win32';
        const workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : path.dirname(projectDir);
        const relToRoot = path.relative(workspaceRoot, projectDir).replace(/\\/g, '/');
        const workdirInContainer = `/workspace/${relToRoot}`;

        if (projectType === 'Rust') {
            buildCmd = 'cargo psp --release';
        } else if (projectType === 'Zig') {
            if (isWindows) {
                buildCmd = `docker run --rm -v "${workspaceRoot}:/workspace" -w "${workdirInContainer}" pspdev/pspdev:latest sh -c "mkdir -p build && zig build-obj -target mipsel-freestanding-none -mcpu=allegrex+noabicalls -OReleaseFast main.zig -femit-bin=build/zig_obj.o && printf '\\x01\\x30\\xa2\\x10' | dd of=build/zig_obj.o bs=1 seek=36 count=4 conv=notrunc && psp-gcc -I/usr/local/pspdev/psp/sdk/include -DPSP -c psp_entry.c -o build/psp_entry.o && psp-gcc -I/usr/local/pspdev/psp/sdk/include -DPSP -L/usr/local/pspdev/lib -L/usr/local/pspdev/psp/lib -L/usr/local/pspdev/psp/sdk/lib -Wl,-zmax-page-size=128 build/psp_entry.o build/zig_obj.o -o build/zig_cube_psp.elf -lpspgum -lpspgu -lpspdisplay -lpspge -lpspctrl -lm && psp-fixup-imports build/zig_cube_psp.elf && mksfoex -d MEMSIZE=1 'Zig Cube PSP' build/PARAM.SFO && pack-pbp build/EBOOT.PBP build/PARAM.SFO NULL NULL NULL NULL NULL build/zig_cube_psp.elf NULL"`;
            } else {
                buildCmd = `mkdir -p build && zig build-obj -target mipsel-freestanding-none -mcpu=allegrex+noabicalls -OReleaseFast main.zig -femit-bin=build/zig_obj.o && printf '\\x01\\x30\\xa2\\x10' | dd of=build/zig_obj.o bs=1 seek=36 count=4 conv=notrunc && psp-gcc -I$(psp-config --pspsdk-path)/include -DPSP -c psp_entry.c -o build/psp_entry.o && psp-gcc -I$(psp-config --pspsdk-path)/include -DPSP -L$(psp-config --pspsdk-path)/lib -Wl,-zmax-page-size=128 build/psp_entry.o build/zig_obj.o -o build/zig_cube_psp.elf -lpspgum -lpspgu -lpspdisplay -lpspge -lpspctrl -lm && psp-fixup-imports build/zig_cube_psp.elf && mksfoex -d MEMSIZE=1 'Zig Cube PSP' build/PARAM.SFO && pack-pbp build/EBOOT.PBP build/PARAM.SFO NULL NULL NULL NULL NULL build/zig_cube_psp.elf NULL`;
            }
        } else {
            // CMake PSP build
            if (isWindows) {
                buildCmd = `docker run --rm -v "${workspaceRoot}:/workspace" -w "${workdirInContainer}" pspdev/pspdev:latest sh -c "mkdir -p build && cd build && psp-cmake .. && make"`;
            } else {
                buildCmd = `mkdir -p build && cd build && psp-cmake .. && make`;
            }
        }

        // If pre-existing EBOOT exists and no build command needed or user requested run
        outputChannel.appendLine(`[PSP Dev Studio] Building & Launching [${path.basename(projectDir)}] (${projectType})...`);
        outputChannel.appendLine(`[PSP Dev Studio] Command: ${buildCmd}\n`);
        vscode.window.showInformationMessage(`PSP Dev Studio: Compiling [${path.basename(projectDir)}]...`);

        exec(buildCmd, { cwd: projectDir }, (err, stdout, stderr) => {
            if (stdout) { outputChannel.append(stdout); }
            if (stderr) { outputChannel.append(stderr); }
            if (err) {
                outputChannel.appendLine(`\n[PSP Dev Studio] Build command error: ${err.message}`);
            }

            const foundEboot = candidateEbootPaths.find(p => fs.existsSync(p));

            if (foundEboot) {
                launchInPPSSPP(foundEboot);
            } else if (existingEboot) {
                outputChannel.appendLine(`\n[PSP Dev Studio] Rebuild failed, but found pre-existing EBOOT at: ${existingEboot}`);
                launchInPPSSPP(existingEboot);
            } else {
                outputChannel.appendLine(`\n[PSP Dev Studio] Build failed and no EBOOT.PBP was found in candidate paths:`);
                candidateEbootPaths.forEach(p => outputChannel.appendLine(`  - ${p}`));

                if (projectType === 'Rust' && err) {
                    vscode.window.showErrorMessage('PSP Dev Studio: Rust build failed. Make sure cargo-psp is installed (`cargo install cargo-psp`). See Output panel.');
                } else if (err) {
                    vscode.window.showErrorMessage(`PSP Dev Studio: Build failed for ${projectType}. Check Output panel for details.`);
                } else {
                    vscode.window.showWarningMessage('PSP Dev Studio: Compiled, but EBOOT.PBP was not found. Check compiler output in the Output panel.');
                }
            }
        });
    });

    // 2. Automated Installer / Doctor Command
    let installDisposable = vscode.commands.registerCommand('psp.installToolchain', function () {
        const platform = os.platform();
        const existingPPSSPP = getPPSSPPPath();

        if (existingPPSSPP && (fs.existsSync(existingPPSSPP) || existingPPSSPP === 'ppsspp')) {
            vscode.window.showInformationMessage(`PSP Dev Studio: PPSSPP is already installed at: ${existingPPSSPP}`);
            return;
        }

        if (platform === 'win32') {
            vscode.window.showInformationMessage('PSP Dev Studio: PPSSPP not detected. Installing via Windows Package Manager (winget)...');
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

    // 4. Open In-IDE Live Web Preview (WASM / Virtual PSP Console)
    let livePreviewDisposable = vscode.commands.registerCommand('psp.openLivePreview', function () {
        const activeEditor = vscode.window.activeTextEditor;
        let activeProjectName = 'PSP Live Preview';
        let activeFileType = 'C';

        if (activeEditor) {
            const fileName = path.basename(activeEditor.document.uri.fsPath);
            let dir = path.dirname(activeEditor.document.uri.fsPath);
            activeProjectName = path.basename(dir);
            if (fileName.endsWith('.zig')) activeFileType = 'Zig';
            else if (fileName.endsWith('.rs')) activeFileType = 'Rust';
            else if (fileName.endsWith('.c') || fileName.endsWith('.h')) activeFileType = 'C / SDL2';
        }

        const panel = vscode.window.createWebviewPanel(
            'pspLivePreview',
            `PSP Live Preview: ${activeProjectName}`,
            vscode.ViewColumn.Beside,
            { enableScripts: true, retainContextWhenHidden: true }
        );

        const htmlPath = path.join(context.extensionPath, 'media', 'live_preview.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Pass the active project details to the webview
        panel.webview.html = htmlContent;

        // Post message with project information once webview is ready
        setTimeout(() => {
            panel.webview.postMessage({
                command: 'setProject',
                projectName: activeProjectName,
                fileType: activeFileType
            });
        }, 300);
    });

    context.subscriptions.push(runDisposable);
    context.subscriptions.push(installDisposable);
    context.subscriptions.push(dashboardDisposable);
    context.subscriptions.push(livePreviewDisposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
