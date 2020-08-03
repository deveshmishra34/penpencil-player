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
import {NetworkDetectionService} from './services/network-detection.service';
import {Subscription} from 'rxjs';

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
  @Output() onPlay: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPause: EventEmitter<any> = new EventEmitter();
  @Output() onEnded: EventEmitter<any> = new EventEmitter();
  @Output() onFullscreenchange: EventEmitter<any> = new EventEmitter();

  private player: any;
  private playerConfigData: PlayerConfig;
  private playerInfo: PlayerInfo;
  private playerControls: any;
  private networkDetectionSubs: Subscription;
  private playerResetSubs: Subscription;

  constructor(
    private networkDetectionService: NetworkDetectionService
  ) {
  }

  ngOnInit() {
    this.playerConfigData = new PlayerConfig(this.playerConfig);
    this.callBacks();
    this.networkChange();
  }

  ngAfterContentInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.play(this.playerConfig);
  }

  private play(playerConfig) {
    this.playerConfigData = new PlayerConfig(playerConfig);
    this.playerInit();
    // if (this.player) {
    //   this.player.src(this.playerConfigData.sources);
    //   this.player.poster(this.playerConfigData.poster);
    // }
  }

  private playerInit() {

    if (!this.playerConfigData.sources || !this.playerConfigData.sources.length || !this.playerConfigData.sources[0].src) {
      return;
    }

    this.setupPlayerControls();
    this.setupPlayer();
    this.setupSrc();
    this.initializePlugins();
  }

  private setupPlayerControls() {

    if (this.playerConfigData.liveui) {
      this.playerControls = {
        playToggle: {},
        currentTimeDisplay: {},
        progressControl: {},
        liveui: {},
        fullscreenToggle: {},
      };
    } else {
      this.playerControls = {
        playToggle: {},
        currentTimeDisplay: {},
        progressControl: {},
        durationDisplay: {},
        fullscreenToggle: {}
      };
    }
  }

  private setupPlayer() {
    this.player = videojs('rs_penpencil_player', {
      html5: {
        hls: {
          overrideNative: true,
          enableLowInitialPlaylist: false
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false
      },
      plugins: {
        eme: {}
      },
      poster: this.playerConfigData.poster,
      fill: this.playerConfigData.fill,
      fluid: this.playerConfigData.fluid,
      responsive: this.playerConfigData.responsive,
      playbackRates: [0.5, 1, 1.25, 1.5, 1.75, 2],
      controlBar: {
        children: this.playerControls
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
  }

  private setupSrc() {
    this.player.src(this.playerConfig.sources);
    this.inIt.emit(this.player);
  }

  private initializePlugins() {

    this.player.settingMenu({
      menu: ['speed', 'quality'],
      defaultQuality: this.playerConfig.defaultQuality
    });

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

  private callBacks() {

    if (this.playerConfigData.fullScreenEnabled) {
      this.player.requestFullscreen();
    }

    // this.player.on('error', (_, error) => {
    //   console.log('error: ', _, error);
    // });

    this.player.on('error', (error) => {
      console.log('error: ', error);
    });

    this.player.on('changePlaybackRate', (_, speed) => {
      // console.log('speed: ', speed);
      if (this.networkDetectionService.resetPlayerTimer) {
        this.setResetPlayer(speed.item);
      }
    });



    this.player.on('play', () => {
      const networkState = this.player.networkState();
      const readyState = this.player.readyState();
      const seeking = this.player.seeking();
      const currentTime = Math.round(this.player.currentTime());

      if (this.playerConfigData.startTime > 0 && currentTime !== this.playerConfigData.startTime && this.playerConfigData.startTime > currentTime && !seeking) {
        this.setCurrentTime(this.playerConfigData.startTime);
      }

      this.setPlaybackRate(this.playerConfigData.lastPlaybackRate);
      this.onPlay.emit(this.getPlayerInfo());

      console.log('networkState: ', networkState);
      console.log('readyState: ', readyState);
      console.log('seeking: ', seeking);

      // console.log('this.networkDetectionService.resetPlayerTimer: ', this.networkDetectionService.resetPlayerTimer);
      if (seeking && this.networkDetectionService.resetPlayerTimer) {
        this.setResetPlayer();
      }
    });

    // this.player.on('timeupdate', (_, timeupdate) => {
    //   console.log('timeupdate: ', _, timeupdate);
    // });
    // videojs.on(this.player, 'timeupdate', (data) => {
    //   console.log('timeupdate: ', data);
    // });

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

  private setPlaybackRate(lastPlaybackrate) {
    this.player.playbackRate(lastPlaybackrate);
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

  networkChange() {
    if (this.networkDetectionSubs) {
      this.networkDetectionSubs.unsubscribe();
    }

    if (this.playerResetSubs) {
      this.playerResetSubs.unsubscribe();
    }

    this.networkDetectionSubs = this.networkDetectionService.monitor(false).subscribe(currentState => {
      const hasNetworkConnection = currentState.hasNetworkConnection;
      const hasInternetAccess = currentState.hasInternetAccess;
      if (hasNetworkConnection && hasInternetAccess) {
        this.setResetPlayer();
      }
      // else {
      // this.player.trigger('error', {});
      // const playerBuffered = this.player.bufferedEnd();
      //
      // const pauseAfter = (Math.round(playerBuffered) - currentPlayerInfo.playTime) * 1000 || 0;
      // // console.log('pauseAfter: ', playerBuffered, currentPlayerInfo.playTime, pauseAfter);
      // setTimeout( () => {
      //   this.player.pause();
      // }, pauseAfter);
      // }
    });


    this.playerResetSubs = this.networkDetectionService.resetPlayer().subscribe((value) => {
      if (value) {
        this.resetPlayer();
      }
    });
  }

  setResetPlayer(playbackRate?) {
    const lastPlaybackRate = playbackRate || this.player.playbackRate();
    const playerBuffered = Math.round(this.player.bufferedEnd());
    const currentTime = Math.round(this.player.currentTime());
    let resetAfter = (playerBuffered - currentTime) * 1000 || 0;
    console.log(currentTime, playerBuffered, resetAfter);
    if (!resetAfter) {
      resetAfter = 1000;
    }
    const data = {
      resetAfter,
      lastPlaybackRate: lastPlaybackRate * 1000
    };
    // console.log('data: ', data);
    this.networkDetectionService.setResetPlayer(data);
  }

  resetPlayer() {
    const lastPlaybackRate = this.player.playbackRate();
    const playerConfigTemp = {...this.playerConfig};
    playerConfigTemp.startTime = Math.round(this.player.currentTime());
    playerConfigTemp.lastPlaybackRate = lastPlaybackRate;
    this.playerConfigData = playerConfigTemp;
    // console.log('this.playerConfig: ', this.playerConfig.startTime);
    // this.player.reset();
    this.player.src(playerConfigTemp.sources);
    // this.play(playerConfigTemp);
    if (!playerConfigTemp.autoplay) {
      setTimeout(() => {
        this.player.play();
      }, 500);
    }
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
    this.duration = Math.round(data.duration) || 0;
    this.poster = data.poster || '';
    this.volume = data.volume || 0;
    this.playTime = Math.round(data.playTime) || 0;
    this.remainingTime = Math.round(data.remainingTime) || 0;
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
  defaultQuality: string;
  forwardBackward: boolean;
  lastPlaybackRate: number;
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
  defaultQuality: string;
  responsive: boolean;
  forwardBackward: boolean;
  watermark: { text: string, link: string, imageUrl: string };
  seekButtons: boolean;
  seekSeconds: number;
  lastPlaybackRate: number;

  constructor(config, playerCache?) {
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
    this.defaultQuality = data.defaultQuality || 'Auto';
    this.forwardBackward = data.forwardBackward || false;
    this.watermark = data.watermark || {};
    this.seekButtons = data.seekButtons || false;
    this.seekSeconds = data.seekSeconds || 10;
    this.lastPlaybackRate = data.lastPlaybackRate || 1;

  }
}
