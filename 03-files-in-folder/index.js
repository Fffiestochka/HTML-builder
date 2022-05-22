// Импорт всех требуемых модулей
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');
// Чтение содержимого папки secret-folder
const pathToFolder = path.join(__dirname, 'secret-folder');
let fileName;
let fileType;
let fileSize;
fsPromises.readdir(pathToFolder, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      let pathToFile = path.join(pathToFolder, file.name);
      fs.stat(pathToFile, (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          // console.log(stats);
          fileType = path.extname(file.name).slice(1);
          fileSize = stats.size / 1000;
          fileName = path.parse(pathToFile).name;
          console.log(`${fileName} - ${fileType} - ${fileSize}kb`);
        }
      });
    }
  });
});

// Получение данных о каждом объекте который содержит папка secret-folder
// Проверка объекта на то, что он является файлом
// Вывод данных о файле в консоль
