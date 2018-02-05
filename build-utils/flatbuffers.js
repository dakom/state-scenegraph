const { execFileSync } = require('child_process');
const chokidar = require("chokidar");
const path = require("path");
const cmd = process.argv[2];
const rimraf = require('rimraf');
const glob = require('glob');
const shell = require('shelljs');

const BASE_PATH = './src/';

const PATH_TO_CLEAN = path.resolve(BASE_PATH + '**/*_generated.*');
const PATH_TO_WATCH = path.resolve(BASE_PATH + '**/*.fbs');

//clean first
rimraf.sync(PATH_TO_CLEAN)

if(cmd === "--watch") {
    
    const watcher = chokidar.watch(PATH_TO_WATCH, {
        persistent: true
    });
 
    watcher
        .on('add', f => compileFile(f, `added`))
        .on('change', f => compileFile(f, `changed`))
        .on('unlink', f => compileFile(f, `removed`));
} else if(cmd === "--build") {
    
    glob
        .sync(PATH_TO_WATCH, {
            nodir: true,
        })
        .forEach(f => compileFile(f, 'build'));
}

function compileFile(f, action) {
    
    execFileSync("flatc", ["-o", path.dirname(f), "--no-includes", "--ts", f]);

    const target = f.replace(".fbs", "_generated.ts");

    shell.sed('-i', './flatbuffers', 'flatbuffers', target);

}
