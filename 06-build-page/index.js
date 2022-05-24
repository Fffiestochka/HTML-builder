// Импорт всех требуемых модулей
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const pathToProjectFolder = path.join(__dirname, 'project-dist');
const pathToAssetsFolder = path.join(__dirname, 'assets');
const pathToCopyAssetsFolder = path.join(pathToProjectFolder, 'assets');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponentsFolder = path.join(__dirname, 'components');

async function copyAssetsFolder() {
  // Создание папки project-dist/assets в случае если она ещё не существует
  await fsPromises.mkdir(pathToCopyAssetsFolder, { recursive: true });
  // await console.log('Папка project-dist/assets создана');

  // очистить папку перед копированием
  await fsPromises.rm(pathToCopyAssetsFolder, {
    recursive: true,
    force: true,
    maxRetries: 100,
  });
  // await console.log('Папка project-dist/assets удалена');
  await fsPromises.mkdir(pathToCopyAssetsFolder, { recursive: true });
  // console.log('И снова project-dist/assets создана');
}

// рекурс.функция для копирования содержимого assets
async function copyIntAssets(folderFrom, folderTo) {
  let fileName;
  // Чтение содержимого папки
  let files = await fsPromises.readdir(folderFrom, {
    withFileTypes: true,
  });
  // console.log(files);
  for (let i = 0; i < files.length; i++) {
    fileName = files[i].name;
    let newPathToFile = path.join(folderFrom, fileName);
    let newPathToCopyFile = path.join(folderTo, fileName);
    // console.log(fileName); //- названия папок / файлов
    if (files[i].isFile()) {
      await fsPromises.copyFile(newPathToFile, newPathToCopyFile);
      // console.log(`Файл ${fileName} создан`);
    } else {
      await fsPromises.mkdir(newPathToCopyFile, { recursive: true });
      // console.log(`Папка ${fileName} создана`);
      await copyIntAssets(newPathToFile, newPathToCopyFile);
    }
  }
}

async function makeBundle() {
  const pathToStylesFolder = path.join(__dirname, 'styles');
  let readableStream;
  let writeableStream = fs.createWriteStream(
    path.join(pathToProjectFolder, 'style.css'),
    { flags: 'a' }
  );
  fs.writeFile(path.join(pathToProjectFolder, 'style.css'), '', (err) => {
    if (err) throw err;
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
            // Запись массива стилей в файл bundle.css
            readableStream = fs.createReadStream(pathToFile, 'utf-8');
            readableStream.pipe(writeableStream);
          }
        });
      }
    }
  });
}

async function workWithTemplate() {
  //создание index.html в project-dist
  await fsPromises.copyFile(
    pathToTemplate,
    path.join(pathToProjectFolder, 'index.html')
  );
  // Прочтение и сохранение в переменной файла шаблона
  let templateContent = await fsPromises.readFile(pathToTemplate, {
    encoding: 'utf-8',
  });
  // Нахождение всех имён тегов в файле шаблона - массив
  let templateTags = templateContent.match(/{{[a-z]*}}/gi);
  // Замена шаблонных тегов содержимым файлов-компонентов
  for (let i = 0; i < templateTags.length; i++) {
    let tagName = templateTags[i].slice(2, -2);
    let componentFileName = `${tagName}.html`;
    let pathToComponentFile = path.join(
      pathToComponentsFolder,
      componentFileName
    );
    let componentContent = await fsPromises.readFile(
      path.join(pathToComponentFile),
      { encoding: 'utf-8' }
    );
    templateContent = templateContent.replace(templateTags[i], componentContent);
  }
  await fsPromises.writeFile(
    path.join(pathToProjectFolder, 'index.html'),
    templateContent
  );
}

async function buildPage() {
  // создание папки project-dist
  await fsPromises.mkdir(pathToProjectFolder, { recursive: true });
  // создание style.css
  await fsPromises.writeFile(
    path.join(pathToProjectFolder, 'style.css'),
    '',
    (err) => {
      if (err) throw err;
      // console.log('Файл был создан');
    }
  );
  // копирование папки assets в папку project-dist
  await copyAssetsFolder();
  await copyIntAssets(pathToAssetsFolder, pathToCopyAssetsFolder);
  await makeBundle();
  await workWithTemplate();
}
buildPage();