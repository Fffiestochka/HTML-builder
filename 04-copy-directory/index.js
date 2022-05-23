// Импорт всех требуемых модулей
// const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const pathToBasicFolder = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');
async function copyDir() {
  let filesArr;
  // Создание папки files-copy в случае если она ещё не существует
  await fsPromises.mkdir(pathToCopyFolder, { recursive: true });
  // await console.log('Папка создана');
  // Чтение содержимого папки files
  await fsPromises.readdir(pathToBasicFolder).then((files) => {
    filesArr = files;
    // console.log(filesArr);
  });
  // Копирование файлов из папки files в папку files-copy (сначала очистить папку)
  await fsPromises.rm(pathToCopyFolder, {
    recursive: true,
    force: true,
    maxRetries: 100,
  });
  await fsPromises.mkdir(pathToCopyFolder, { recursive: true });
  // await console.log('Папка удалена');
  await fsPromises.mkdir(pathToCopyFolder, { recursive: true });
  // await console.log('И снова создана');
  for (let i = 0; i < filesArr.length; i++) {
    let pathToBasicFile = path.join(pathToBasicFolder, filesArr[i]);
    // console.log(pathToBasicFile);
    let pathToCopyFile = path.join(pathToCopyFolder, filesArr[i]);
    // console.log(pathToCopyFile);
    await fsPromises.copyFile(pathToBasicFile, pathToCopyFile);
  }
}
copyDir();

