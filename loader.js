const fs = require('fs');
const spawn = require('child_process').spawn;
const pathSource = 'src'; // путь к серверной части
const mainFilename = 'App.js'; // стартовый файл серверной части, который будет добавлен в самый конец
const serverFilename = 'dogsserver.js'; // финальное название серверной части, все файлы серверной части будут добавлены в этот файл


function runServer(){
console.log('Запуск сервера...');
var proc = spawn('node', [serverFilename]);
var cb = (s)=>{process.stdout.write(''+s)}
proc.on('exit', (status)=>{
if(status != '0')process.exit(1);
});
proc.stdout.on('data', cb);
proc.stderr.on('data', cb);
}

function init(){
if(fs.existsSync(serverFilename))fs.unlinkSync(serverFilename);

if(!fs.existsSync(serverFilename)){ // если серверной части ещё нет, тогда сканируем папку где лежат все файлы сервера, и создаём главный файл для запуска

console.log('Идёт создание серверной части '+serverFilename);

var files = fs.readdirSync(pathSource);
var pos = files.indexOf(mainFilename);
if(pos>-1)files.splice(pos, 1);
files.push(mainFilename);

var code = '';

for (var i = 0; i < files.length; i++) {
var file = files[i];
console.log('Чтение файла '+file);
var cnt = fs.readFileSync(pathSource+'/'+file).toString();
code += cnt;
if(i != files.length-1)code += '\n\n';
}

console.log('Сохранение файла '+serverFilename);
fs.writeFileSync(serverFilename, code);
//console.log('ok');
}


if(fs.existsSync(serverFilename)){
runServer();
}

}

init();