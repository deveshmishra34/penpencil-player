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
  @Output() inIt: EventEmitter<any> = new EventEmitter();
  @Output() onPlay: EventEmitter<any> = new EventEmitter();
  @Output() onPause: EventEmitter<any> = new EventEmitter();
  @Output() onEnded: EventEmitter<any> = new EventEmitter();
  @Output() onFullscreenchange: EventEmitter<any> = new EventEmitter();

  private player: any;
  private playerConfigData: PlayerConfig;
  private playerInfo: PlayerInfo;

  constructor() {
  }

  ngOnInit() {
    this.playerConfigData = new PlayerConfig(this.playerConfig);
    this.playerInit();

    this.hlsConfig();
  }

  ngAfterContentInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.playerConfigData = new PlayerConfig(this.playerConfig);
    if (this.player) {
      this.player.src(this.playerConfigData.sources);
      this.player.poster(this.playerConfigData.poster);
    }
  }

  private playerInit() {

    if (!this.playerConfigData.sources || !this.playerConfigData.sources.length || !this.playerConfigData.sources[0].src) {
      return;
    }

    let controls = {};

    if (this.playerConfigData.liveui) {
      controls = {
        playToggle: {},
        currentTimeDisplay: {},
        progressControl: {},
        liveui: {},
        settingButton: {},
        settingMenuMain: {},
        fullscreenToggle: {},
      };
    } else {
      controls = {
        playToggle: {},
        currentTimeDisplay: {},
        progressControl: {},
        durationDisplay: {},
        settingButton: {},
        settingMenuMain: {},
        fullscreenToggle: {}
      };
    }

    this.player = videojs('rs_penpencil_player', {
      html5: {
        hls: {
          overrideNative: true,
          enableLowInitialPlaylist: true
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false
      },
      poster: this.playerConfigData.poster,
      fill: this.playerConfigData.fill,
      fluid: this.playerConfigData.fluid,
      responsive: this.playerConfigData.responsive,
      playbackRates: [0.5, 1, 1.25, 1.5, 1.75, 2],
      controlBar: {
        children: controls
      },
      inactivityTimeout: 3000,
      preload: 'auto',
      controls: true,
      autoplay: this.playerConfigData.autoplay,
      currentTimeDisplay: true,
      youtube: {
        ytControls: 0,
        enablePrivacyEnhancedMode: true
      }
    });

    this.player.src(this.playerConfigData.sources);
    this.inIt.emit(this.player);

    // this.player.settingMenu({
    //   menu: ['speed', 'quality']
    // });

    if (this.playerConfigData.seekButtons) {
      this.player.seekButtons({
        forward: {
          direction: 'forward',
          seconds: this.playerConfigData.seekSeconds
        },
        backward: {
          direction: 'backward',
          seconds: this.playerConfigData.seekSeconds
        }
      });
    }

    if (this.playerConfigData.watermark && (this.playerConfigData.watermark.text || this.playerConfigData.watermark.imageUrl)) {
      this.player.watermark(this.playerConfigData.watermark);
    }

  }

  private hlsConfig() {
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
    // this.playerInfo.sources = this.playerConfig.sources;
    // this.playerInfo.type = this.playerConfig.type;
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
  sources: Array<any>;
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
  sources: Array<any>;
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
  sources: Array<any>;
  type: string;
  autoplay: boolean;
  startTime: number;
  fullScreenEnabled: boolean;
  fluid: boolean;
  fill: boolean;
  responsive: boolean;
  forwardBackward: boolean;
  watermark: { text: string, link: string, imageUrl: string };
  seekButtons: boolean;
  seekSeconds: number;

  constructor(config?) {
    const data = config || {};

    this.poster = data.poster || '';
    this.liveui = data.liveui || false;
    this.sources = data.sources || [];
    this.type = data.type || 'application/x-mpegURL';
    this.autoplay = data.autoplay || false;
    this.startTime = data.startTime || 0;
    this.fullScreenEnabled = data.fullScreenEnabled || false;
    this.fluid = data.fluid || false;
    this.fill = data.fill || false;
    this.responsive = data.responsive || false;
    this.forwardBackward = data.forwardBackward || false;
    this.watermark = data.watermark || {};
    this.seekButtons = data.seekButtons || false;
    this.seekSeconds = data.seekSeconds || 10;

  }
}
