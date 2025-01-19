# Setting Up Angular + Electron Project with TypeScript and Electron-Builder  

In this guide, we’ll walk through the setup of a full-fledged Angular and Electron project, using **TypeScript** and the **Electron-Builder** package. By the end, you’ll have a working desktop application ready to be deployed.  

Let’s get started!  

---

## **Step 1: Project Initialization**  

1. **Create a New Folder**  
   Open your terminal and run:  
   ```bash
   mkdir electron-angular-setup
   cd electron-angular-setup
   code .
   ```  

2. **Create an Angular Project**  
   Inside the `electron-angular-setup` folder, create a new Angular project:  
   ```bash
   ng new angular
   ```  
   This will generate the Angular app inside the `angular` folder.  

---

## **Step 2: Setting Up the Electron Project**  

### **Folder Structure**  
After completing the setup, your project structure should look like this:  
```
electron-angular-setup
 ├── angular/
 ├── src/
 │   ├── main.ts
 │   ├── preload.ts
 ├── package.json
 ├── tsconfig.json
```

---

### **2.1 Create `package.json`**  
Create a `package.json` file in the root directory with the following content:  
```json
{
  "name": "electron-angular-setup",
  "version": "1.0.0",
  "description": "Demo Application using Angular and Electron",
  "main": "dist/main.js",
  "author": "Suraj Kushvaha",
  "license": "ISC",
  "scripts": {
    "postinstall": "electron-builder install-app-deps",
    "build": "tsc",
    "build:watch": "tsc -w",
    "app:serve": "npm-run-all -p angular:serve build:watch electron:serve",
    "angular:serve": "cd angular && ng serve",
    "electron:serve": "electron ./dist/main.js --serve",
    "start": "npm run build && electron ./dist/main.js",
    "deploy": "npm run remove && cd angular && npm run build && cd .. && npm run build && electron-builder",
    "remove": "rimraf -rf ./dist && rimraf -rf ./build",
    "electron": "electron"
  },
  "devDependencies": {
    "7zip-bin": "^5.2.0",
    "electron": "^34.0.0",
    "electron-builder": "^25.1.8",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.3"
  },
  "dependencies": {
    "electron-reloader": "^1.2.3",
    "npm-run-all": "^4.1.5",
    "rimraf": "^6.0.1"
  },
  "build": {
    "files": [
      "dist/**/*",
      "package.json"
    ],
    "directories": {
      "output": "build"
    },
    "win": {
      "icon": "assets/images/icon.ico",
      "target": [
        {
          "target": "nsis",
          "arch": ["x64", "ia32"]
        },
        "zip"
      ]
    },
    "mac": {
      "icon": "assets/images/icon.icns",
      "target": ["zip", "dmg"],
      "hardenedRuntime": true
    },
    "linux": {
      "target": ["deb", "zip"],
      "category": "Utility",
      "icon": "assets/images/linux-icon.png"
    }
  }
}
```

---

### **2.2 Create `tsconfig.json`**  
Add the following configuration to a `tsconfig.json` file in the root:  
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "noImplicitAny": true,
    "sourceMap": false,
    "outDir": "dist",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "baseUrl": ".",
    "paths": {
      "*": ["node_modules/*"]
    }
  },
  "include": ["src/**/*"]
}
```

---

## **Step 3: Add Electron Files**  

1. **Create the `src` Folder**  
   Inside the `src` folder, create the following files:  

   - **`preload.ts`**  
     ```ts
     import { contextBridge, ipcRenderer } from 'electron';

     contextBridge.exposeInMainWorld('electron', {
         sendMessage: (channel: string, data: any) => ipcRenderer.send(channel, data),
         getData: (channel: string) => ipcRenderer.invoke(channel),
         onDataUpdate: (callback: any) => ipcRenderer.on('update-data', callback)
     });
     ```

   - **`main.ts`**  
     ```ts
     import { app, BrowserWindow, screen } from 'electron';
     import path from 'path';
     import electronReloader from "electron-reloader";

     app.whenReady().then(() => {
         const args = process.argv.slice(1);
         const serve = args.includes('--serve');
         const size = screen.getPrimaryDisplay().workAreaSize;

         let win = new BrowserWindow({
             width: size.width,
             height: size.height,
             webPreferences: {
                 preload: path.join(__dirname, 'preload.js'),
                 contextIsolation: true
             }
         });

         if (serve) {
             electronReloader(module);
             win.loadURL('http://localhost:4200');
         } else {
             win.loadFile(path.join(__dirname, 'angular/browser/index.html'));
         }

         win.on('closed', () => {
             app.quit();
         });
     });
     ```

---

## **Step 4: Update Angular Configuration**  

1. In `angular.json`, change the `outputPath`:  
   ```json
   "outputPath": "../dist/angular"
   ```  

2. Add `<base href="./">` in the `<head>` section of `index.html`:  
   ```html
   <base href="./">
   ```

---

## **Step 5: Running the Application**  

- **Development Mode**  
  Run the following command to start the application in dev mode:  
  ```bash
  npm run app:serve
  ```  

- **Build and Package the App**  
  To build and package the application as an executable:  
  ```bash
  npm run deploy
  ```  

Your packaged app will be available in the `build` folder. Run the `.exe` file and enjoy!  

