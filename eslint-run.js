/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const child = require('child_process');

const folder = './src/events';

const isFile = x => /.*\.(js|ts)$/.test(x);

const runEslint = dirFile => {
  child.exec(`yarn eslint --fix ${dirFile}`, (err, stdout, sterr) => {
    if (err) console.log(`error(${dirFile}):`, err);
    console.log(`stdout(${dirFile}):`, stdout);
    console.log(`sterr(${dirFile}):`, sterr);
    console.log(`--------------------------------------`);
  });
};

const readFiles = dir => {
  fs.readdirSync(dir).forEach(file => {
    const path = `${dir}/${file}`;
    if (isFile(file)) {
      runEslint(path);
    } else if (fs.statSync(path).isDirectory()) {
      // readFiles(path)
    }
  });
};

readFiles(folder);
