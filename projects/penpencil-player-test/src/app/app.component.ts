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
  KEY = '896d6551be07e29f111e3de7443e77ce';
  // KEY = '06ca4d2cf39b2008faf65093d452c6a0';
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

  sourcesDash = [{
    src: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
    type: 'application/dash+xml'
  }];

  // enrcyptedSources getLicense function will only work in localhost and secured url (https)
  enrcyptedSources = [{
    // src: 'https://penpencil.pc.cdn.bitgravity.com/5e1e6c97-0b5d-40a3-b40c-504aecc80372_1/dash/master.mpd',
    // src: 'https://penpencil.pc.cdn.bitgravity.com/5e1e6c97-0b5d-40a3-b40c-504aecc80372/dash/master.mpd',
    src: 'https://penpencil.pc.cdn.bitgravity.com/5e1e6c97-0b5d-40a3-b40c-504aecc80372/master.mpd',
    // src: 'https://penpencil-vdo.sgp1.cdn.digitaloceanspaces.com/38211443-5fff-4e1f-9f78-0c71bacbdc3a/master.mpd',
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
          // console.log('request', request);
          // console.log('key_id:', this.base64ToHex(request.kids[0]));
          let keyObj = {
            kty: 'oct',
            kid: request.kids[0],
            k: this.hexToBase64(this.KEY) // This key sould be come from server
          };

          console.log('keys', JSON.stringify(keyObj), this.base64ToHex(request.kids[0]), this.KEY);
          callback(null, new TextEncoder().encode(JSON.stringify({
            keys: [keyObj]
          })));
        }
      }
    }
  }];

  sourcesHls = [
    {
      src: 'https://player.vimeo.com/external/387243170.m3u8?s=5d29eaaa77b4e3a1fcf6b1edaaee22cb5d75b825',
      type: 'application/x-mpegURL',
      withCredentials: false
    }
  ];

  sourcesYoutube = [
    {
      type: 'video/youtube',
      src: 'https://www.youtube.com/embed/yZZFobQNdug'
    }
  ];

  playerConfig: any;

  constructor() {
    // setTimeout(() => {
      this.playerConfig = {
        poster: 'https://i.vimeocdn.com/video/850159740_1280x720.jpg?r=pad',
        liveui: false,
        sources: this.enrcyptedSources,
        autoplay: false,
        startTime: 0,
        fluid: true, // fluid, fill, responsive
        fullScreenEnabled: false,
        seekButtons: true,
        seekSeconds: 30,
        // defaultQuality: '360', // auto|240|360...
        watermark: {
          url: '',
          image: '',
          text: '8888888888'
        }
      };
    // }, 5000);

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
    // console.log('data', dataa);
    this.player = dataa;
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
