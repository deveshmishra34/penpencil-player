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
    src: 'http://www.youtube.com/embed/xjS6SftYQaQ',
    type: 'video/youtube',
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
