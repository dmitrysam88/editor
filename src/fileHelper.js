const languageList = require('./languageList');

function getFileExtension(filename) {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}

function getLanguageExtension(lang) {
  if (typeof(lang) === 'object') {
    lang = lang.language;
  }
  const selectedLanguage = languageList.find((langEl) => langEl.name === lang);
  return selectedLanguage && selectedLanguage.extensions && selectedLanguage.extensions.length ? selectedLanguage.extensions[0] : undefined;
}

function getFileLanguage (filename) {
  const extension = getFileExtension(filename);
  const selectedLanguage = languageList.find((langEl) => langEl.extensions.includes(extension));
  return selectedLanguage ? selectedLanguage.name : extension;
}

module.exports = { getFileExtension, getLanguageExtension, getFileLanguage };