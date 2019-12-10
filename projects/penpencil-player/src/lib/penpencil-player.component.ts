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

declare const videojs;

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
    setTimeout(() => {
      console.log('Player: ', this.playerConfig);
    }, 5000);
  }

  ngOnInit() {
    this.playerConfigData = new PlayerConfig(this.playerConfig);
  }

  ngAfterContentInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.playerConfigData = new PlayerConfig(this.playerConfig);
    this.playerInit();
  }

  private playerInit() {
    this.player = videojs('rs_penpencil_player', {
      poster: this.playerConfigData.poster,
      fluid: true,
      fill: false,
      responsive: false,
      playbackRates: [0.5, 1, 1.5, 2],
      inactivityTimeout: 2000,
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

    this.hlsConfig();
  }

  private hlsConfig() {
    this.player.src({
      src: this.playerConfigData.src,
      type: this.playerConfigData.type,
      withCredentials: false,
      smoothQualityChange: (this.playerConfigData.type !== 'video/youtube'),
      enableLowInitialPlaylist: true
    });

    if ((this.playerConfigData.type !== 'video/youtube')) {
      this.player.hlsQualitySelector({
        displayCurrentQuality: true
      });
    }

    this.player.seekButtons({
      forward: 15,
      back: 15
    });

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
}

class PlayerConfig {
  poster: string;
  liveui: boolean;
  src: string;
  type: string;
  autoplay: boolean;
  startTime: number;
  fullScreenEnabled: boolean;

  constructor(config?) {
    const data = config || {};

    this.poster = data.poster || '';
    this.liveui = data.liveui || false;
    this.src = data.src || '';
    this.type = data.type || 'application/x-mpegURL';
    this.autoplay = data.autoplay || false;
    this.startTime = data.startTime || 0;
    this.fullScreenEnabled = data.fullScreenEnabled || false;
  }
}
