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

  // sources = [
  //   {
  //     src: 'https://player.vimeo.com/external/388011956.sd.mp4?s=5eecbb23995a7eff553f49843e3dc131d2074212&profile_id=165&oauth2_token_id=1289522162',
  //     type: 'video/mp4',
  //     label: '540'
  //   },
  //   {
  //     src: 'https://player.vimeo.com/external/388011956.sd.mp4?s=5eecbb23995a7eff553f49843e3dc131d2074212&profile_id=139&oauth2_token_id=1289522162',
  //     type: 'video/mp4',
  //     label: '240'
  //   },
  //   {
  //     src: 'https://player.vimeo.com/external/388011956.sd.mp4?s=5eecbb23995a7eff553f49843e3dc131d2074212&profile_id=164&oauth2_token_id=1289522162',
  //     type: 'video/mp4',
  //     label: '360'
  //   }
  // ];

  // sources = [
  //   {
  //     src: 'https://player.vimeo.com/external/388011956.m3u8?s=a0111243ef5ba67050c4dd4c9faee216593978a9&oauth2_token_id=1289522162',
  //     type: 'application/x-mpegURL',
  //     withCredentials: false
  //   }
  // ];

  sources = [
    {
      src: 'https://player.vimeo.com/external/399080525.m3u8?s=f2b03632cd0fdb902b3f4af9ee20124ada4b2fee',
      type: 'application/x-mpegURL',
      withCredentials: false
    }
  ];

  // sources = [
  //   {
  //     type: 'video/youtube',
  //     src: 'https://www.youtube.com/embed/_QNJA_wFn-o'
  //   }
  // ];

  playerConfig: any;

  constructor() {
    this.playerConfig = {
      poster: '',
      liveui: false,
      sources: this.sources,
      autoplay: false,
      startTime: 0,
      fluid: true, // fluid, fill, responsive
      fullScreenEnabled: false,
      seekButtons: true,
      seekSeconds: 30,
      watermark: {
        text: '8888888888'
      }
    };

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
  }

}
