
import { app, BrowserWindow, screen } from 'electron';
import path from 'path';
import electronReloader from "electron-reloader";

app.whenReady().then(() => {
    const args = process.argv.slice(1),
        serve = args.some(val => val === '--serve');
    const size = screen.getPrimaryDisplay().workAreaSize;
    let win: BrowserWindow | null = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        icon: '../../angular/browser/favicon.ico',
        title: 'Demo',
        webPreferences: {
            allowRunningInsecureContent: (serve),
            nodeIntegration: false,
            contextIsolation: true,
            accessibleTitle: 'Crevan',
            devTools: true,

            preload: path.join(__dirname, '..', 'preload.js'),
            navigateOnDragDrop: true,
            images: true,
            imageAnimationPolicy: 'animate',
        }
    });
    if (serve) {
        console.log('electron-reloader');
        electronReloader(module);
        win.loadURL('http://localhost:4200');
    } else {
        console.log('load file');
        win.loadFile(path.join(__dirname, "./angular/browser/index.html"));
    }

    win.on('closed', () => {
        app.quit();
        win = null;
    });
})
