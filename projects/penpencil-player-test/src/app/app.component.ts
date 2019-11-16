import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'penpencil-player-test';

  playerConfig = {
    poster: 'https://i.vimeocdn.com/video/831407393_1280x720.jpg?r=pad',
    liveui: false,
    src: 'https://player.vimeo.com/external/373322685.m3u8?s=c170d13b884a4993c097d56072719a980c2435f4',
    type: 'application/x-mpegURL',
    autoplay: true,
    startTime: 0
  };

  constructor() {
    setTimeout( () => {
      console.log('Heyyy');
      this.playerConfig = {
        poster: 'https://i.vimeocdn.com/video/831407393_1280x720.jpg?r=pad',
        liveui: false,
        src: 'http://www.youtube.com/embed/xjS6SftYQaQ',
        type: 'video/youtube',
        autoplay: true,
        startTime: 0
      };
    }, 5000);
  }

  play(data) {
    console.log('Playing', data);
  }

}
