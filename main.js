const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const getMenuTemplate = require('./menuTemplate');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const mainMenu = Menu.buildFromTemplate(getMenuTemplate(win));
  win.setMenu(mainMenu);

  // win.webContents.openDevTools();
  win.loadFile('index.html');

  ipcMain.on('save-file-data', function(event, file) {
    const { filePath, fileData } = file;
    fs.writeFileSync(filePath, fileData, 'utf-8');
  });

  win.on('maximize', () => {
    win.unmaximize()
  });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});
