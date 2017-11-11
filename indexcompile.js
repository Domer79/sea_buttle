var jade = require('jade');
var fs = require('fs');

const { spawn } = require('child_process');
const bat = spawn('cmd.exe', ['/c', '']);

bat.stdout.on('data', (data) => {
  console.log(data.toString());
});

bat.stderr.on('data', (data) => {
  console.log(data.toString());
});

bat.on('exit', (code) => {
  console.log(`Child exited with code ${code}`);
});

fs.readFile('index.jade', 'utf8', function(err, data){
    if (err) throw err;
    //console.log(data);

    var fn = jade.compile(data);
    var html = fn();
    fs.writeFile("index.html", html, (err) => {
        if (err) throw err;
        console.log("The file index.html has been generated");
    });
    //console.log(html);
});