# PenpencilPlayer
[![npm version](https://badge.fury.io/js/videojs-hls-quality-selector.svg)](https://www.npmjs.com/package/penpencil-player)


PenpencilPlayer currently supports MP4, Youtube, HLS (m3u8). you can install this via `npm i penpencil-player`

## Description
PenpencilPlayer is HTML5 video player based ob videjs library. It gathers all the neccessory plugins or library at single place to play videos like:- Vimeo, Youtube , hls (m3us).
PenpencilPlayer require angular v6 or above.

## How to use
Step 1: Install the penpencil-player using `npm i penpencil-player`

Step 2: Paste these Styles and Script urls in your `angular.json`

```
"styles": [...
              "node_modules/video.js/dist/video-js.min.css",
              "node_modules/videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css"
]

"scripts": [...
              "node_modules/video.js/dist/video.min.js",
              "node_modules/@videojs/http-streaming/dist/videojs-http-streaming.min.js",
              "node_modules/videojs-hls-quality-selector/dist/videojs-hls-quality-selector.min.js",
              "node_modules/videojs-contrib-quality-levels/dist/videojs-contrib-quality-levels.min.js",
              "node_modules/videojs-youtube/dist/Youtube.min.js"
]

```

Step 2: Add PenpencilPlayer component in your html.
```
<rs-penpencil-player [playerConfig]="playerConfig"></rs-penpencil-player>

```

Step 3: Provide player config: 

```
playerConfig = {
    poster: 'Poster Image Url',
    liveui: false,
    src: 'Video player source url',
    type: 'video type',
    autoplay: true,
    startTime: 0 
 };
  
 Currently supported video type
  1: video/mp4
  2: youtube
  3: application/x-mpegURL
```
## Credits (Using libraries and plugins)

[videojs](http://videojs.com/)
[http-streaming](https://github.com/videojs/http-streaming)
[videojs-hls-quality-selector](https://github.com/chrisboustead/videojs-hls-quality-selector)
[videojs-contrib-quality-levels](https://github.com/videojs/videojs-contrib-quality-levels)
[videojs-youtube](https://github.com/videojs/videojs-youtube)
  
  
  
