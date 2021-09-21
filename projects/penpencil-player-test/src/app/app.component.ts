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
  KEY = '9f8cdd9acf834a98aa6f902adc020522';
  // KEY = '4ad6bce3b56a00a4476c8a05e518e4a3';
  // KEY = '06ca4d2cf39b2008faf65093d452c6a0';
  player: any;

  sourcesMp4 = [
    {
      src: 'https://player.vimeo.com/external/388013340.sd.mp4?s=6fa71b681fe5f23a872b84d3ca66955ef0b75828&profile_id=139&oauth2_token_id=1289522162',
      type: 'video/mp4',
      label: '240'
    },
    {
      src: 'https://player.vimeo.com/external/388013340.sd.mp4?s=6fa71b681fe5f23a872b84d3ca66955ef0b75828&profile_id=164&oauth2_token_id=1289522162',
      type: 'video/mp4',
      label: '360'
    },
    {
      src: 'https://player.vimeo.com/external/388013340.sd.mp4?s=6fa71b681fe5f23a872b84d3ca66955ef0b75828&profile_id=165&oauth2_token_id=1289522162',
      type: 'video/mp4',
      label: '540'
    },
    {
      src: 'https://player.vimeo.com/external/388013340.hd.mp4?s=25f13563db435ae827cf05b3d6cd6b94151889f3&profile_id=174&oauth2_token_id=1289522162',
      type: 'video/mp4',
      label: '720'
    },
    {
      src: 'https://player.vimeo.com/external/388013340.hd.mp4?s=25f13563db435ae827cf05b3d6cd6b94151889f3&profile_id=175&oauth2_token_id=1289522162',
      type: 'video/mp4',
      label: '1080'
    }
  ];

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
    src: 'https://penpencil.pc.cdn.bitgravity.com/7592bc9f-c9e1-46d7-9925-0ea7d375d6114/master.mpd',
    type: 'application/dash+xml'
  }];

  // enrcyptedSources getLicense function will only work in localhost and secured url (https)
  enrcyptedSources = [{
    src: 'https://penpencil.pc.cdn.bitgravity.com/c25250fc-d702-4f47-8199-d1efbecabe51/master.mpd',
    // src: 'http://localhost:9000/240/master_240.mpd',
    type: 'application/dash+xml',
    keySystems: {
      'org.w3.clearkey': {
        videoContentType: 'video/mp4;codecs="avc1.42c01e"',
        audioContentType: 'audio/mp4;codecs="mp4a.40.2"',
        getLicense: (emeOptions, keyMessage, callback) => {
          // console.log('emeOptions: ', emeOptions);
          // console.log('keyMessage: ', keyMessage);
          // Parse the clearkey license request.
          let request = JSON.parse(new TextDecoder().decode(keyMessage));
          // console.log('request', request);
          // console.log('key_id:', this.base64ToHex(request.kids[0]));
          let keyObj = {
            kty: 'oct',
            kid: request.kids[0],
            k: this.hexToBase64(this.KEY) // This key sould be come from server
          };

          // console.log('keys', JSON.stringify(keyObj), this.base64ToHex(request.kids[0]), this.KEY);
          callback(null, new TextEncoder().encode(JSON.stringify({
            keys: [keyObj]
          })));
        }
      }
    }
  }];

  sourcesHls = [
    {
      src: 'https://dp935alxc6mi4.cloudfront.net/e16779b8-35c0-4bfe-8765-98a3f3ab3341/master.m3u8?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kcDkzNWFseGM2bWk0LmNsb3VkZnJvbnQubmV0L2UxNjc3OWI4LTM1YzAtNGJmZS04NzY1LTk4YTNmM2FiMzM0MS8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNjMyMTU1ODQ2fX19XX0_&Key-Pair-Id=APKAJBP3D6S2IU5JK4LQ&Signature=UZKn0iItuVQfk2qVeObahTaSjZXtBuQExoJEkJjx218IEPyzr9yRCqvvl8EeK8ywF3UGDe3dJFp-3SjDO4y3VCk6FLw4frgcMCYF7pYn1EBMgltJtn8SNS-V~SoudXyPTQjpxU4bHtOnCVGFL3adNdiyxjhSMIpruYN5~v5NSBgRF3158XbMGy~Rszx3I9FBijsfK-bVUOCvr9t8iMplrJTJqealI-2KkyZBwq5nArfDDJ~wAjDd68lW0AgvnGmuV5W-uqivtyeNNz1IPffZpZacR4MIJjCsRmC~d~zKkHQhR4QTBbyUudE9zrL4GYRu-0WZPD8IO7AUBRmuvXCbug__',
      type: 'application/x-mpegURL',
      withCredentials: false,
      cacheEncryptionKeys: true
    }
  ];

  encryptedSourcesHls = [
    {
      src: 'http://localhost:9000/video/copy/playlist.m3u8',
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

// {
//   "CloudFront-": "",
//   "CloudFront-": "",
//   "CloudFront-": ""
// }
  constructor() {
    // setTimeout(() => {
    this.playerConfig = {
      poster: 'https://i.vimeocdn.com/video/850159740_1280x720.jpg?r=pad',
      liveui: false,
      sources: this.sourcesHls,
      encryptionUri: 'https://api-dev.penpencil.xyz/v1/videos/get-hls-key?videoId=5fc48f0fc94dc43a3bf96144',
      headers: [
        {
          authorization: 'Bearer f9cd6e1687d5168967454b1d9ef1b73a630deb7af0eef65b929fc030b6d541e4'
        }
      ],
      query: '?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kcDkzNWFseGM2bWk0LmNsb3VkZnJvbnQubmV0L2UxNjc3OWI4LTM1YzAtNGJmZS04NzY1LTk4YTNmM2FiMzM0MS8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNjMyMTU1ODQ2fX19XX0_&Key-Pair-Id=APKAJBP3D6S2IU5JK4LQ&Signature=UZKn0iItuVQfk2qVeObahTaSjZXtBuQExoJEkJjx218IEPyzr9yRCqvvl8EeK8ywF3UGDe3dJFp-3SjDO4y3VCk6FLw4frgcMCYF7pYn1EBMgltJtn8SNS-V~SoudXyPTQjpxU4bHtOnCVGFL3adNdiyxjhSMIpruYN5~v5NSBgRF3158XbMGy~Rszx3I9FBijsfK-bVUOCvr9t8iMplrJTJqealI-2KkyZBwq5nArfDDJ~wAjDd68lW0AgvnGmuV5W-uqivtyeNNz1IPffZpZacR4MIJjCsRmC~d~zKkHQhR4QTBbyUudE9zrL4GYRu-0WZPD8IO7AUBRmuvXCbug__',
      autoplay: false,
      startTime: 0,
      fluid: true,
      fill: false,
      responsive: false,
      fullScreenEnabled: false,
      seekButtons: true,
      seekSeconds: 30,
      defaultQuality: 'Auto', // auto|240|360...
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
    // console.log('Playing', data);
  }

  pause(data) {
    // console.log('Pause', data);
  }

  ended(data) {
    // console.log('Ended', data);
  }

  fullScreen(data) {
    // console.log('fullScreen', data);
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
