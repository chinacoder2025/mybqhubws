const chokidar = require('chokidar');
const { exec } = require('child_process');

const watcher = chokidar.watch('public', {
  ignored: /node_modules|\.git/,
  persistent: true
});

watcher.on('change', path => {
  console.log(`File ${path} has been changed. Deploying...`);
  exec('firebase deploy --only hosting', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
});

console.log('Watching for changes in public directory...');