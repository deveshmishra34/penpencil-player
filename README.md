# PenpencilPlayer
[![npm version](https://badge.fury.io/js/penpencil-player.svg)](https://www.npmjs.com/package/penpencil-player)

PenpencilPlayer is based on [videoJS library](http://videojs.com/). You can install this via `npm i penpencil-player`

## Description
PenpencilPlayer is HTML5 video player based on [videoJS library](http://videojs.com/). Basically, I build this player for my personal use, I just wanted a player which can play multiple video formats like: MP4, Youtube, HLS.  

####Feature:
i) Support Multiple video formats like: ``MP4, Youtube, HLS.``

ii) Multiple ``video quality support`` for both HLS and MP4 sources. 

iii) ``Dynamic watermarking`` including Text, Image and Link. (Combined or Individual)

iv) ``Forward and backward`` seek button compatibility.

v) ``Setting button`` with Quality and Speed options 

v) Live video ui.

Note:- Because this library is only for personal use, I made lots of stuff hardcoded, like: Adding Plugins. 

## How to use
Step 1: Install the penpencil-player using `npm i penpencil-player`

Step 2: Paste these Styles and Script urls in your `angular.json`

```
"styles": [...
              "node_modules/video.js/dist/video-js.min.css"
              ]

"scripts": [...
              "node_modules/video.js/dist/video.min.js",
              "node_modules/@videojs/http-streaming/dist/videojs-http-streaming.min.js"
              ]
```

Step 3: Add ``PenpencilPalyerModule`` In AppModule

```
import: [..
  PenpencilPlayerModule
..
]
```

Step 4: Add PenpencilPlayer component in your html.
```
<rs-penpencil-player [playerConfig]="playerConfig"></rs-penpencil-player>

```

Step 5: Provide player config: 

```
playerConfig = {
    poster: 'Poster Image Url',
    liveui: false,
    sources: [{
      src: 'Video source url',
      type: 'Video type' // video/mp4 (for mp4) ||application/x-mpegURL (for hls) || video/youtube (for youtube)
    }],
    autoplay: true,
    startTime: 0,
    fullScreenEnabled: false,
    fluid: boolean; // fluid || fill || responsive
    seekButtons: true, // Add plugin first
    seekSeconds: 2, // Add plugin first
    watermark: { // Add plugin first
      text: string, 
      link: string, 
      imageUrl: string
    }
 };
 
 Chnage listner is being detected on player config, 
 If you want to update player src try this.
 
 playerConfig = {...} // replace your new player config with new video source
 
 Currently supported video type
  1: video/mp4 (for mp4)
  2: video/youtube (for youtube)
  3: application/x-mpegURL (for hls)
```

Step 5: Adding Plugins: 

Download all the plugins and unzip it and paste all the plugins in project directory

i) Setting button for video quality and speed settings [videojs-setting-menu-plugin.](https://drive.google.com/open?id=1wwipcHEIvy_i-HFBYydX_9PirtruHRH6)

```
"styles": [...
              "videojs-setting-menu/videojs-setting-menu.css"
              ]

"scripts": [...
              "videojs-setting-menu/videojs-setting-menu.min.js"
              ]
```

ii) Seek button for forward and backward [videojs-seek-buttons-plugin.](https://drive.google.com/open?id=1wMkiwATKKF6aNVEbogV_xRM1w0h1GG_W)

```
"styles": [...
              "videojs-seek-buttons/videojs-seek-buttons.css"
              ]

"scripts": [...
              "videojs-seek-buttons/videojs-seek-buttons.min.js"
              ]
```

iii) Youtube video support [videojs-youtube-plugin.](https://drive.google.com/open?id=1smVRPMa-XUUdukbH0-5CnoYqHzWUslPI)

```
"scripts": [...
              "videojs-youtube/videojs-youtube.min.js"
              ]
```

iv) Dynamic watermarking [videojs-watermark-plugin.](https://drive.google.com/open?id=1FLOB0Yu9b75hPdBrTnCmhO6R6-OmxXin)

```
"styles": [...
              "videojs-watermark/videojs-watermark.css"
              ]

"scripts": [...
              "videojs-watermark/videojs-watermark.js"
              ]
```

v) Video live ui support  [videojs-liveui-plugin.](https://drive.google.com/open?id=19C6NTtHrXTGW0IoFh03hs62A2EtLa8FG)

```
"scripts": [...
              "videojs-liveui/videojs-liveui.min.js"
              ]
```

## Credits (Using libraries and plugins)

[videojs](http://videojs.com/)
[http-streaming](https://github.com/videojs/http-streaming)
[videojs-hls-quality-selector](https://github.com/chrisboustead/videojs-hls-quality-selector)
[videojs-contrib-quality-levels](https://github.com/videojs/videojs-contrib-quality-levels)
[videojs-youtube](https://github.com/videojs/videojs-youtube)
[videojs-seek-buttons](https://github.com/mister-ben/videojs-seek-buttons)
  
  
  
