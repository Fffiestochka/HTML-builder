const fs = require('fs');
const path = require('path');
// const exit = require('process');
const { stdin, stdout } = process;

fs.writeFile(
  path.join(__dirname, 'new_file.txt'),
  '',
  (err) => {
    if (err) throw err;
    // console.log('Файл был создан');
  }
);
stdout.write('Hello!\n');
stdout.write('Please enter the data!\n');
stdin.on('data', (data) => {
  const newData = data.toString();

  if (newData.trim() === 'exit') {
    console.log('Good luck!');
    process.exit();
  }
  fs.appendFile(path.join(__dirname, 'new_file.txt'), newData, (err) => {
    if (err) throw err;
    // console.log('Файл был изменен');
  });
  process.on('SIGINT', () => {
    console.log('Good luck!');
    process.exit();
  });
});
