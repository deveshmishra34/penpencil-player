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
    src: 'https://player.vimeo.com/external/346819085.m3u8?s=64cf345bcd6e4bf034b3e2586a99b625f297e078&oauth2_token_id=1186381082',
    type: 'application/x-mpegURL',
    autoplay: true,
    startTime: 0,
    fullScreenEnabled: false
  };

  constructor() {
    // setTimeout( () => {
    //   console.log('Heyyy');
    //   this.playerConfig = {
    //     poster: 'https://i.vimeocdn.com/video/831407393_1280x720.jpg?r=pad',
    //     liveui: false,
    //     src: 'http://www.youtube.com/embed/xjS6SftYQaQ',
    //     type: 'video/youtube',
    //     autoplay: true,
    //     startTime: 0
    //   };
    // }, 5000);
  }

  play(data) {
    console.log('Playing', data);
  }

  fullScreen(data) {
    console.log('fullScreen', data);
  }

}
