import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'penpencil-player-test';

  playerConfig = {
    poster: 'https://i.vimeocdn.com/video/780332763_100x75.jpg?r=pad',
    liveui: false,
    src: 'https://player.vimeo.com/external/371076825.m3u8?s=ec6b6b8737df32257b30a89e176fa7f402e5fd3f',
    type: 'application/x-mpegURL',
    autoplay: true,
    startTime: 0
  };

  constructor() {

  }

  play(data) {
    console.log('Playing', data);
  }

}
