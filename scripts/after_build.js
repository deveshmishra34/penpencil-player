#!/usr/bin/env node
const fs = require('fs');

moveFiles();

async function moveFiles() {
  try {
    const BASE_DIR = 'dist/penpencil-player/';
    const repoFiles = [
      'videojs-contrib-eme/videojs-contrib-eme.min.js',
      'videojs-liveui/videojs-liveui.min.js',
      'videojs-seek-buttons/videojs-seek-buttons.css',
      'videojs-seek-buttons/videojs-seek-buttons.min.js',
      'videojs-setting-menu/videojs-setting-menu.css',
      'videojs-setting-menu/videojs-setting-menu.min.js',
      'videojs-watermark/videojs-watermark.css',
      'videojs-watermark/videojs-watermark.js',
      'videojs-youtube/videojs-youtube.min.js'
    ];

    repoFiles.forEach((item) => {
      moveFile(BASE_DIR, item);
    });

  } catch (e) {
    console.log('moveFiles:', e);
  }
}

async function moveFile(BASE_DIR, file) {
  try {
    const dir = file.split('/')[0];
    await exists(BASE_DIR, dir);
    await fs.copyFileSync(file, BASE_DIR + file);
  } catch (e) {
    console.log('moveFile: ', e);
  }
}

async function exists(baseDir, file) {
  try {
    const fileExists = fs.existsSync(baseDir + file);
    if (!fileExists) {
      await fs.mkdirSync(baseDir + file);
    }
    return new Promise( (resolve) => {
      resolve();
    });
  } catch (e) {
    console.log('exists: ', e);
  }
}
