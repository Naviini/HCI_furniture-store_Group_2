// electron/main.js
import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (process.platform === 'win32') {
//   require('electron-squirrel-startup'); 
}

const buildAppMenu = (targetWindow) => {
  const sendToRenderer = (channel) => {
    const win = targetWindow || BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
    if (win) {
      win.webContents.send(channel);
    }
  };

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Load Project',
          accelerator: process.platform === 'darwin' ? 'Cmd+O' : 'Ctrl+O',
          click: () => sendToRenderer('menu-file-load-project'),
        },
        {
          label: 'Save Project',
          accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
          click: () => sendToRenderer('menu-file-save-project'),
        },
        { type: 'separator' },
        { label: 'Exit', role: process.platform === 'darwin' ? 'close' : 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'ND Furniture Help',
          click: () => sendToRenderer('menu-help-open'),
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
};

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // Allows using Node.js in the renderer
      contextIsolation: false, // Simplifies communication for this coursework
    },
  });

  // Load the React app
  // In development, we load the Vite local server
  // In production, we would load the built index.html file
  mainWindow.loadURL('http://localhost:5173');

  // Apply menu directly to this window to guarantee File items are visible.
  const menu = buildAppMenu(mainWindow);
  Menu.setApplicationMenu(menu);
  mainWindow.setMenu(menu);

  // Open the DevTools (optional - remove this line for final submission)
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  const menu = buildAppMenu();
  Menu.setApplicationMenu(menu);
  createWindow();
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    const menu = buildAppMenu(BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]);
    Menu.setApplicationMenu(menu);
  }
});