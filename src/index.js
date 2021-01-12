const path = require('path');
const amdLoader = require('monaco-editor/min/vs/loader.js');
const amdRequire = amdLoader.require;
const amdDefine = amdLoader.require.define;

const { ipcRenderer } = require('electron');
const { getFileExtension, getFileLanguage, getLanguageExtension } = require('./src/fileHelper');

let editor;

function uriFromPath(_path) {
  var pathName = path.resolve(_path).replace(/\\/g, '/');
  if (pathName.length > 0 && pathName.charAt(0) !== '/') {
    pathName = '/' + pathName;
  }
  return encodeURI('file://' + pathName);
}

function initMonaco() {
  amdRequire.config({
    baseUrl: uriFromPath(path.join(__dirname, './node_modules/monaco-editor/min'))
  });

  self.module = undefined;

  return new Promise((resolve) => {
    amdRequire(['vs/editor/editor.main'], function () {
      resolve(true);
    });
  });
}

function setLanguage(filePath) {
  monaco.editor.setModelLanguage(editor.getModel(), getFileLanguage(filePath));
}

ipcRenderer.on('open-file-data', function (event, file) {
  const { fileData, filePath } = file;
  setLanguage(filePath);
  editor.getModel().setValue(fileData);
});

ipcRenderer.on('on-start-saving', function (event, file) {
  let { filePath } = file;
  if (!getFileExtension(filePath)) {
    filePath = filePath + '.' + getLanguageExtension(editor.getModel().getLanguageIdentifier());
  }
  ipcRenderer.send('save-file-data', { filePath, fileData: editor.getModel().getValue() });
});

(async function () {

  await initMonaco();
  editor = monaco.editor.create(document.getElementById('container'), {
    value: "",
    language: 'javascript'
  });
  monaco.editor.setTheme('vs-dark');

})();