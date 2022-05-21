const fs = require('fs');
const path = require('path');
// const { stdout } = process;
// const folder = process.argv.slice(2);
const pathToFile = path.join(__dirname, 'text.txt');
// const pathToFile = path.join(__dirname, folder, 'text.txt');
const readableStream = fs.createReadStream(pathToFile, 'utf-8');
let data = '';
readableStream.on('data', (chunk) => (data += chunk));
readableStream.on('end', () => console.log(data));
readableStream.on('error', (error) => console.log('Error', error.message));
// stdout.write(readableStream);
// process.exit();

// const fs = require('fs');
// const { Transform, pipeline } = require('stream');
// const readableStream = fs.createReadStream('text.txt', 'utf-8');
// const transformedStream = new Transform({
//   transform(chunk, enc, cb){

//   }
// })