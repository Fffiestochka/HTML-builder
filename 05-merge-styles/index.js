// Импорт всех требуемых модулей
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

async function makeBundle() {
  const pathToStylesFolder = path.join(__dirname, 'styles');
  const pathToProjeсtDist = path.join(__dirname, 'project-dist');
  let readableStream;
  let writeableStream = fs.createWriteStream(
    path.join(pathToProjeсtDist, 'bundle.css'),
    { flags: 'a' }
  );
  fs.writeFile(path.join(pathToProjeсtDist, 'bundle.css'), '', (err) => {
    if (err) throw err;
    // console.log('Файл был создан');
  });
  // Чтение содержимого папки styles
  await fsPromises.readdir(pathToStylesFolder).then((files) => {
    // Проверка является ли объект файлом и имеет ли файл нужное расширение
    for (let i = 0; i < files.length; i++) {
      let pathToFile = path.join(pathToStylesFolder, files[i]);
      let fileType = path.extname(files[i]).slice(1);
      if (fileType === 'css') {
        fs.stat(pathToFile, (err, stats) => {
          if (err) throw err;
          if (stats.isFile()) {
            // Чтение файла стилей
            // Запись прочитанных данных в массив
            // Запись массива стилей в файл bundle.css
            readableStream = fs.createReadStream(pathToFile, 'utf-8');
            readableStream.pipe(writeableStream);
          }
        });
      }
    }
  });
}
makeBundle();
