import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'penpencil-player-test';

  url1 = 'https://devnuevo.com/media/video/demo_360.mp4';
  url2 = 'https://devnuevo.com/media/video/demo_720.mp4';
  KEY = 'fabfc2c224eaa4f5883ea8d9e19eed55';
  player: any;

  sourcesMop4 = [
    {
      src: 'https://player.vimeo.com/external/388011956.sd.mp4?s=5eecbb23995a7eff553f49843e3dc131d2074212&profile_id=165&oauth2_token_id=1289522162',
      type: 'video/mp4',
      label: '540'
    },
    {
      src: 'https://player.vimeo.com/external/388011956.sd.mp4?s=5eecbb23995a7eff553f49843e3dc131d2074212&profile_id=139&oauth2_token_id=1289522162',
      type: 'video/mp4',
      label: '240'
    },
    {
      src: 'https://player.vimeo.com/external/388011956.sd.mp4?s=5eecbb23995a7eff553f49843e3dc131d2074212&profile_id=164&oauth2_token_id=1289522162',
      type: 'video/mp4',
      label: '360'
    }
  ];

  sources = [{
    src: 'https://penpencil.pc.cdn.bitgravity.com/14042020/dash/master.mpd',
    type: 'application/dash+xml'
  }];

  enrcyptedSources = [{
    src: 'https://penpencil-vdo.sgp1.cdn.digitaloceanspaces.com/1de0bf81-627d-483d-9aa1-be4e0cfded2c/master.mpd',
    type: 'application/dash+xml',
    keySystems: {
      'org.w3.clearkey': {
        videoContentType: 'video/mp4;codecs="avc1.42c01e"',
        audioContentType: 'audio/mp4;codecs="mp4a.40.2"',
        getLicense: (emeOptions, keyMessage, callback) => {
          console.log('emeOptions: ', emeOptions);
          console.log('keyMessage: ', keyMessage);
          // Parse the clearkey license request.
          let request = JSON.parse(new TextDecoder().decode(keyMessage));
          console.log('request', request);
          console.log('key_id:', this.base64ToHex(request.kids[0]));
          let keyObj = {
            kty: 'oct',
            kid: request.kids[0],
            k: this.hexToBase64(this.KEY) // This key sould be come from server
          };

          callback(null, new TextEncoder().encode(JSON.stringify({
            keys: [keyObj]
          })));
        }
      }
    }
  }];

  sourcesHls = [
    {
      src: 'https://antmediademo.s2sclasses.com/WebRTCAppEE/streams/968376665878992461415077_adaptive.m3u8',
      type: 'application/x-mpegURL',
      withCredentials: false
    }
  ];

  sourcesYoutube = [
    {
      type: 'video/youtube',
      src: 'https://www.youtube.com/embed/yOlK2McwDa0'
    }
  ];

  playerConfig: any;

  constructor() {
    setTimeout ( () => {
      this.playerConfig = {
        poster: '',
        liveui: false,
        sources: this.enrcyptedSources,
        autoplay: true,
        startTime: 0,
        fluid: true, // fluid, fill, responsive
        fullScreenEnabled: false,
        seekButtons: true,
        seekSeconds: 30,
        watermark: {
          url: '',
          image: '',
          text: '8888888888'
        }
      };
    }, 5000);

    // setTimeout(() => {
    //   console.log('Heyyy');
    //   this.playerConfig = {
    //     poster: 'https://i.vimeocdn.com/video/850159740_1280x720.jpg?r=pad',
    //     liveui: false,
    //     sources: [{
    //       src: 'https://player.vimeo.com/external/388011956.sd.mp4?s=5eecbb23995a7eff553f49843e3dc131d2074212&profile_id=139&oauth2_token_id=1289522162',
    //       type: 'video/mp4',
    //       label: '240'
    //     }],
    //     autoplay: true,
    //     startTime: 0,
    //     fluid: true, // fluid, fill, responsive
    //     fullScreenEnabled: false,
    //     seekButtons: true,
    //     seekSeconds: 2,
    //     watermark: {
    //       text: '8888888888'
    //     }
    //   };
    // }, 10000);
  }

  play(data) {
    console.log('Playing', data);
  }

  fullScreen(data) {
    console.log('fullScreen', data);
  }

  initializePlayer(dataa) {
    console.log('data', dataa);
    this.player = dataa;
    console.log(this.player.tech());
  }

  hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, '').replace(/([\da-fA-F]{2}) ?/g, '0x$1 ').replace(/ +$/, '').split(' '))
    ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=*$/, '');
  }

  base64ToHex(str) {
    str = str.replace(/\-/g, '+').replace(/\_/g, '/');
    for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, '')), hex = []; i < bin.length; ++i) {
      let tmp = bin.charCodeAt(i).toString(16);
      if (tmp.length === 1) tmp = '0' + tmp;
      hex[hex.length] = tmp;
    }
    return hex.join('');
  }

  base64ToHexOld(str) {
    for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, '')), hex = []; i < bin.length; ++i) {
      let tmp = bin.charCodeAt(i).toString(16);
      if (tmp.length === 1) tmp = '0' + tmp;
      hex[hex.length] = tmp;
    }
    return hex.join('');
  }

}
