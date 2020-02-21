import {
  Component,
  OnInit,
  AfterContentInit,
  ViewEncapsulation,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {SettingButton} from './helper/SettingButton';
import {SettingButtonHome} from './helper/SettingButtonHome';

declare const videojs;
const VideoJSComponent = videojs.getComponent('Component');

@Component({
  selector: 'rs-penpencil-player',
  templateUrl: 'penpencil-player.component.html',
  styleUrls: ['./penpencil-player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PenpencilPlayerComponent implements OnInit, AfterContentInit, OnDestroy, OnChanges {

  @Input() playerConfig: PlayerConfig;
  @Output() onPlay: EventEmitter<any> = new EventEmitter();
  @Output() onPause: EventEmitter<any> = new EventEmitter();
  @Output() onEnded: EventEmitter<any> = new EventEmitter();
  @Output() onFullscreenchange: EventEmitter<any> = new EventEmitter();

  private player: any;
  private playerConfigData: PlayerConfig;
  private playerInfo: PlayerInfo;

  constructor() {
  }


  // children: [
  // 'playToggle',
  // 'volumePanel',
  // 'currentTimeDisplay',
  // 'timeDivider',
  // 'durationDisplay',
  // 'progressControl',
  // 'liveDisplay',
  // 'seekToLive',
  // 'remainingTimeDisplay',
  // 'customControlSpacer',
  // 'playbackRateMenuButton',
  // 'chaptersButton',
  // 'descriptionsButton',
  // 'subsCapsButton',
  // 'audioTrackButton',
  // 'fullscreenToggle'
  // ]

  ngOnInit() {
    this.playerConfigData = new PlayerConfig(this.playerConfig);
    this.playerInit();

    if (this.playerConfigData.forwardBackward) {
      this.player.seekButtons({
        forward: 15,
        back: 15
      });
    }

    this.hlsConfig();
  }

  ngAfterContentInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.playerConfigData = new PlayerConfig(this.playerConfig);
    if (this.player) {
      this.player.src(this.playerConfigData.src);
      this.player.poster(this.playerConfigData.poster);
    }
  }

  private playerInit() {
    this.player = videojs('rs_penpencil_player', {
      // children: {
      //   controlBar: {
      //     children: {
      //       progressControl: true
      //     }
      //   }
      // },
      poster: this.playerConfigData.poster,
      fill: this.playerConfigData.fill,
      fluid: this.playerConfigData.fluid,
      responsive: this.playerConfigData.responsive,
      playbackRates: [0.5, 1, 1.25, 1.5, 1.75, 2],
      inactivityTimeout: 50000,
      preload: 'auto',
      controls: true,
      liveui: this.playerConfigData.liveui,
      autoplay: this.playerConfigData.autoplay,
      currentTimeDisplay: true,
      html5: {
        hls: {
          overrideNative: true,
          enableLowInitialPlaylist: true
        }
      }
    });

    this.addSeekButtons();
    this.addSettingButton();
    // this.addComponent();

    // const captionsToggle = new ToggleCaptionsButton(this.player);
    const addWaterMark = new AddWaterMark(this.player);
    // this.player.controlBar.addChild(captionsToggle);
    this.player.addChild(addWaterMark, {text: 'The Title of The Video!'});
    // Add the TitleBar as a child of the player and provide it some text
    // in its options.
    // this.player.addChild('TitleBar', {text: 'The Title of The Video!'});
  }

  private addSeekButtons() {
    const backward = this.player.controlBar.addChild('button');
    backward.addClass('vjs-icon-replay');
    // Getting html DOM
    const backwardDom = backward.el();
    backwardDom.classList.add('vjs-backward-control');
    backwardDom.onclick = () => {
      console.log('backward 15s');
    };

    const forward = this.player.controlBar.addChild('button');
    forward.addClass('vjs-icon-replay');
    // Getting html DOM
    const forwardDom = forward.el();
    forwardDom.classList.add('vjs-forward-control');
    forwardDom.onclick = () => {
      console.log('forward 15s');
    };
  }

  addSettingButton() {
    const settingButton = new SettingButton(this.player);
    this.player.addChild(settingButton);
    const settingButtonHome = new SettingButtonHome(this.player);
    this.player.addChild(settingButtonHome);
    // const setting = this.player.controlBar.addChild('button');
    // setting.addClass('vjs-icon-cog');
    // // Getting html DOM
    // const settingDom = setting.el();
    // settingDom.classList.add('vjs-setting-control');
    // // backwardDom.classList.add('vjs-icon-cog');
    //
    // settingDom.onclick = () => {
    //   console.log('show setting menu');
    // };

  }

  addComponent() {
    // const VideoJSComponent = videojs.getComponent('Component');
    const TitleBar = videojs.extend(VideoJSComponent, {
      constructor: function (player, options) {
        VideoJSComponent.apply(this, arguments);
        console.log('options: ', options);

        this.updateTextContent('This is some text');
      },
      createEl: function () {
        return videojs.createEl('div', {
          className: 'vjs-title-bar'
        });
      },
      updateTextContent: function (text) {

        if (typeof text !== 'string') {
          text = 'Title Unknown';
        }

        videojs.emptyEl(this.el());
        videojs.appendContent(this.el(), text);
      }
    });
    videojs.registerComponent('TitleBar', TitleBar);

    // const myComponent = new VideoJSComponent(this.player);
    // videojs.registerComponent('MyButton', myComponent);

    const myButton = this.player.addChild('TitleBar', {
      text: 'Press Me'
    });
  }

  addSeetingButtonHome() {
    const VideoJsComponent = videojs.getComponent('Component');
  }

  private hlsConfig() {
    this.player.src({
      src: this.playerConfigData.src,
      type: this.playerConfigData.type,
      withCredentials: false,
      smoothQualityChange: (this.playerConfigData.type !== 'video/youtube'),
      enableLowInitialPlaylist: true
    });

    // if ((this.playerConfigData.type !== 'video/youtube')) {
    //   setTimeout(() => {
    //     this.player.hlsQualitySelector({
    //       displayCurrentQuality: true
    //     });
    //   }, 500);
    // }

    this.callBacks();
  }

  private callBacks() {

    this.player.on('ready', () => {
      if (this.playerConfigData.fullScreenEnabled) {
        this.player.requestFullscreen();
      }
    });

    this.player.on('play', () => {
      if (this.playerConfigData.startTime > 0) {
        this.setCurrentTime(this.playerConfigData.startTime);
      }
      this.onPlay.emit(this.getPlayerInfo());
    });

    this.player.on('pause', () => {
      this.onPause.emit(this.getPlayerInfo());
    });

    this.player.on('ended', () => {
      this.onEnded.emit(this.getPlayerInfo());
    });

    this.player.on('fullscreenchange', () => {
      this.onFullscreenchange.emit(this.getPlayerInfo());
    });
  }

  ngOnDestroy() {
    // call this method in ngDestroy - basically this method will remove the player
    this.player.dispose();
  }

  // set current time in seconds
  private setCurrentTime(time) {
    this.player.currentTime(time);
  }

  private getPlayerInfo() {
    this.playerInfo = new PlayerInfo();

    this.playerInfo.play = !this.player.paused();
    this.playerInfo.pause = this.player.paused();
    this.playerInfo.ended = this.player.ended();
    this.playerInfo.poster = this.player.poster();
    this.playerInfo.src = this.playerConfig.src;
    this.playerInfo.type = this.playerConfig.type;
    this.playerInfo.duration = this.player.duration();
    this.playerInfo.volume = this.player.volume();
    this.playerInfo.playTime = this.player.currentTime();
    this.playerInfo.remainingTime = this.player.remainingTime();
    this.playerInfo.muted = this.player.muted();
    this.playerInfo.fullScreen = this.player.isFullscreen();
    return this.playerInfo;
  }
}

// addSeetingHomeComponent() {
//   // Get the Component base class from Video.js
//   const VideoJsComponent = videojs.getComponent('Component');
//
//   // The videojs.extend function is used to assist with inheritance. In
//   // an ES6 environment, `class TitleBar extends Component` would work
//   // identically.
//   const TitleBar = videojs.extend(VideoJsComponent, {
//
//     // The constructor of a component receives two arguments: the
//     // player it will be associated with and an object of options.
//     constructor(player, options) {
//
//       // It is important to invoke the superclass before anything else,
//       // to get all the features of components out of the box!
//       VideoJsComponent.apply(this, arguments);
//
//       // If a `text` option was passed in, update the text content of
//       // the component.
//       if (options.text) {
//         this.updateTextContent(options.text);
//       }
//     },
//
//     // The `createEl` function of a component creates its DOM element.
//     createEl() {
//       return videojs.createEl('div', {
//
//         // Prefixing classes of elements within a player with "vjs-"
//         // is a convention used in Video.js.
//         className: 'vjs-title-bar'
//       });
//     },
//
//     // This function could be called at any time to update the text
//     // contents of the component.
//     updateTextContent(text) {
//
//       // If no text was provided, default to "Title Unknown"
//       if (typeof text !== 'string') {
//         text = 'Title Unknown';
//       }
//
//       // Use Video.js utility DOM methods to manipulate the content
//       // of the component's element.
//       videojs.emptyEl(this.el());
//       videojs.appendContent(this.el(), text);
//     }
//   });
//
//   // Register the component with Video.js, so it can be used in players.
//   videojs.registerComponent('TitleBar', TitleBar);
// }

// class AddWaterMark extends videojs.getComponent('Component', {
//   className: 'vjs-watermark'
// }) {
//   player: any;
//
//   constructor(player, options = {}) {
//     super(player, options);
//     this.player = player;
//     console.log('options: ',options);
//     if (options['text']) {
//       this.updateTextContent(options['text']);
//     }
//   }
//
//   /**
//    * Toggle the subtitle track on and off upon click
//    */
//   public handleClick(ele) {
//     console.log('clieked', ele);
//   }
//
//   // This function could be called at any time to update the text
//   // contents of the component.
//   public updateTextContent(text) {
//
//     // If no text was provided, default to "Title Unknown"
//     if (typeof text !== 'string') {
//       text = 'Title Unknown';
//     }
//     console.log('text: ', text);
//     // Use Video.js utility DOM methods to manipulate the content
//     // of the component's element.
//     // videojs.emptyEl(this.el());
//     // videojs.appendContent(this.el(), text);
//   }
// }
//

class ToggleCaptionsButton extends videojs.getComponent('Button', {
  className: 'vjs-captions-toggle vjs-captions-on'
}) {
  player: any;

  constructor(player, options = {}) {
    super(player, options);
    this.player = player;
    // this.addClass('');

    // captions are "on" by default
    // this.addClass('vjs-captions-on');
  }

  /**
   * Toggle the subtitle track on and off upon click
   */
  public handleClick(ele) {
    console.log('ele: ', ele);
    // const textTracks = this.player.textTracks();
    //
    // for (let i = 0; i < textTracks.length; i++) {
    //   if (textTracks[i].kind !== 'subtitles') {
    //     continue;
    //   }
    //
    //   // toggle showing the captions
    //   if (textTracks[i].mode === 'showing') {
    //     textTracks[i].mode = 'hidden';
    //     ele.removeClass('vjs-captions-on');
    //   } else {
    //     textTracks[i].mode = 'showing';
    //     ele.addClass('vjs-captions-on');
    //   }
    // }
  }
}
class AddWaterMark extends videojs.getComponent('Component', {}) {
  player: any;

  constructor(player, options = {}) {
    super(player, options);
    console.log('options: ', options);

    this.updateTextContent('This is some text');
  }

  createEl() {
    const el = super.createEl();
    el.appendChild(videojs.createEl('div', {
      className: 'vjs-title-bar',
      innerHtml: 'This is title bar..!!'
    }));
    return el;
  }

  dispose() {
    super.dispose();
  }

  buildCSSClass() {
    return `vjs-playback-rate ${super.buildCSSClass()}`;
  }

  buildWrapperCSSClass() {
    return `vjs-playback-rate ${super.buildWrapperCSSClass()}`;
  }

  handleClick(event) {
    console.log('clicked');
    // // select next rate option
    // const currentRate = this.player().playbackRate();
    // const rates = this.player.playbackRates();
    //
    // // this will select first one if the last one currently selected
    // let newRate = rates[0];
    //
    // for (let i = 0; i < rates.length; i++) {
    //   if (rates[i] > currentRate) {
    //     newRate = rates[i];
    //     break;
    //   }
    // }
    // this.player().playbackRate(newRate);
  }

  updateTextContent(text) {

    if (typeof text !== 'string') {
      text = 'Title Unknown';
    }

    videojs.emptyEl(this.el());
    videojs.appendContent(this.el(), text);
  }
}

interface PlayerInfo {
  play: boolean;
  pause: boolean;
  ended: boolean;
  duration: number;
  poster: string;
  src: string;
  type: string;
  volume: number;
  playTime: number;
  remainingTime: number;
  muted: boolean;
  fullScreen: boolean;
}

class PlayerInfo {
  play: boolean;
  pause: boolean;
  ended: boolean;
  duration: number;
  poster: string;
  src: string;
  type: string;
  volume: number;
  playTime: number;
  remainingTime: number;
  muted: boolean;
  fullScreen: boolean;

  constructor(info?) {
    const data = info || {};
    this.play = data.play || false;
    this.pause = data.pause || false;
    this.ended = data.ended || false;
    this.duration = data.duration || 0;
    this.poster = data.poster || '';
    this.src = data.src || '';
    this.type = data.type || '';
    this.volume = data.volume || 0;
    this.playTime = data.playTime || 0;
    this.remainingTime = data.remainingTime || 0;
    this.muted = data.muted || false;
    this.fullScreen = data.fullScreen || false;
  }
}

interface PlayerConfig {
  poster: string;
  liveui: boolean;
  src: string;
  type: string;
  autoplay: boolean;
  startTime: number;
  fullScreenEnabled: boolean;
  fluid: boolean;
  fill: boolean;
  responsive: boolean;
  forwardBackward: boolean;
}

class PlayerConfig {
  poster: string;
  liveui: boolean;
  src: string;
  type: string;
  autoplay: boolean;
  startTime: number;
  fullScreenEnabled: boolean;
  fluid: boolean;
  fill: boolean;
  responsive: boolean;
  forwardBackward: boolean;

  constructor(config?) {
    const data = config || {};

    this.poster = data.poster || '';
    this.liveui = data.liveui || false;
    this.src = data.src || '';
    this.type = data.type || 'application/x-mpegURL';
    this.autoplay = data.autoplay || false;
    this.startTime = data.startTime || 0;
    this.fullScreenEnabled = data.fullScreenEnabled || false;
    this.fluid = data.fluid || false;
    this.fill = data.fill || false;
    this.responsive = data.responsive || false;
    this.forwardBackward = data.forwardBackward || false;
  }
}
