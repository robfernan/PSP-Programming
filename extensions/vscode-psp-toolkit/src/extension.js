const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

function activate(context) {
    // 1. Register "Run Project in PPSSPP" command (Editor Header Icon)
    let runDisposable = vscode.commands.registerCommand('psp.runPPSSPP', function () {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No active workspace folder found.');
            return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        vscode.window.showInformationMessage('PSP Dev Studio: Building and Launching in PPSSPP...');

        // Standard Windows PPSSPP paths check
        const defaultPPSSPP = "C:\\Program Files\\PPSSPP\\PPSSPPWindows.exe";
        
        // Execute build task or launch
        vscode.tasks.fetchTasks().then(tasks => {
            const pspTask = tasks.find(t => t.name.includes('PSP: Build Current Project'));
            if (pspTask) {
                vscode.tasks.executeTask(pspTask);
            }
        });
    });

    // 2. Register Dashboard Webview (Environment Doctor & Diagnostics)
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
    context.subscriptions.push(dashboardDisposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
