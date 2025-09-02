const fs = require('fs');
const path = require('path');

// make sure dist folder exists
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// copy the main HTML file
fs.copyFileSync('src/index.html', 'dist/index.html');

// copy JS files
if (!fs.existsSync('dist/js')) {
    fs.mkdirSync('dist/js');
}
fs.copyFileSync('src/js/index.js', 'dist/js/index.js');

// copy assets if they exist
if (fs.existsSync('assets')) {
    fs.cpSync('assets', 'dist/assets', { recursive: true });
}

console.log('Build done! Check the dist/ folder.');
