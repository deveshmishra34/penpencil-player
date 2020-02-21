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

  playerConfig = {
    poster: 'https://i.vimeocdn.com/video/850158362_1280x720.jpg?r=pad',
    liveui: false,
    // src: this.url2,
    // type: 'video/mp4',
    src: 'https://player.vimeo.com/external/387243170.m3u8?s=5d29eaaa77b4e3a1fcf6b1edaaee22cb5d75b825&oauth2_token_id=1289522162',
    type: 'application/x-mpegURL',
    // src: 'http://www.youtube.com/embed/xjS6SftYQaQ',
    // type: 'video/youtube',
    autoplay: false,
    startTime: 0,
    fluid: true, // fluid, fill, responsive
    fullScreenEnabled: false,
    forwardBackward: false
  };

  constructor() {
    // setTimeout(() => {
    //   console.log('Heyyy');
    //   this.playerConfig = {
    //     poster: 'https://i.vimeocdn.com/video/850159740_1280x720.jpg?r=pad',
    //     liveui: false,
    //     src: 'https://player.vimeo.com/external/387262450.m3u8?s=5d87393b375d9a4ba9b5b00a44455c66352da41d',
    //     type: 'application/x-mpegURL',
    //     autoplay: true,
    //     startTime: 0,
    //     responsive: true, // fluid, fill, responsive
    //     fullScreenEnabled: false
    //   };
    // }, 10000);
    // while (true) {
    //   this.playerConfig.startTime = 500;
    // };
  }

  play(data) {
    console.log('Playing', data);
  }

  fullScreen(data) {
    console.log('fullScreen', data);
  }

}
