const { dialog, ipcMain } = require('electron');
const fs = require('fs');

module.exports = function (win) {
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click() {
            const filePaths = dialog.showOpenDialogSync();
            if (filePaths && fs.existsSync(filePaths[0])) {
              const filePath = filePaths[0]; 
              const fileData = fs.readFileSync(filePath, 'utf-8');
              win.webContents.send('open-file-data', { fileData, filePath });
            }
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click() {
            const filePath = dialog.showSaveDialogSync();
            if (filePath)
              win.webContents.send('on-start-saving', { filePath });
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        },
      ]
    }
  ];
}