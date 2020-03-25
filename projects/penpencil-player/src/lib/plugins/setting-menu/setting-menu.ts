import videojs from 'video.js';
import SettingMenuItem from './setting-menu-item';
import {
  CHANGE_PLAYBACK_RATE,
  CHANGE_PLAYER_QUALITY,
  GO_TO_MAIN_MENU,
  TOGGLE_MAIN_MENU,
  TOGGLE_QUALITY_MENU,
  TOGGLE_SPEED_MENU
} from '../events';

const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

// Default options for the plugin.
const defaults = {
  speed: [],
  sources: [],
  defaultQuality: 'default',
};

class SettingMenu extends Component {

  constructor(player, options) {
    super(player, options);

    // merge option
    this.options = videojs.mergeOptions(defaults, options);

    // when player is ready setup basic option
    player.on('ready', () => {
      this.getSpeedList();
      this.getQualityList();
      this.update();
    });

    // in case url type is not mp4 quality will be return after loadedmetadata event
    player.on('loadedmetadata', () => {
      if (!this.options_['sources'] || !this.options_['sources'].length) {
        this.getQualityList();
        this.update();
      }
    });

    player.on('userinactive', () => {
      const eleDiv = document.getElementsByClassName('vjs-settings-menu-home')[0]; //.add('vjs-hidden');
      const eleSpeed = document.getElementsByClassName('vjs-settings-menu-speed')[0]; //.add('vjs-hidden');
      const eleQuality = document.getElementsByClassName('vjs-settings-menu-quality')[0]; //.add('vjs-hidden');

      eleDiv.classList.add('vjs-hidden');
      eleSpeed.classList.add('vjs-hidden');
      eleQuality.classList.add('vjs-hidden');
    });

    // Hide/Show Speed Menu
    player.on(TOGGLE_MAIN_MENU, () => {
      const eleDiv = document.getElementsByClassName('vjs-settings-menu-home')[0]; //.add('vjs-hidden');
      const eleSpeed = document.getElementsByClassName('vjs-settings-menu-speed')[0]; //.add('vjs-hidden');
      const eleQuality = document.getElementsByClassName('vjs-settings-menu-quality')[0]; //.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.remove('vjs-hidden');
      if (eleDiv.classList.contains('vjs-hidden')) {
        eleDiv.classList.remove('vjs-hidden');
        eleSpeed.classList.add('vjs-hidden');
        eleQuality.classList.add('vjs-hidden');
      } else {
        eleDiv.classList.add('vjs-hidden');
        eleSpeed.classList.add('vjs-hidden');
        eleQuality.classList.add('vjs-hidden');
      }

    });

    player.on(TOGGLE_SPEED_MENU, () => {
      document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.remove('vjs-hidden');
    });

    // Hide/Show Quality Menu
    player.on(TOGGLE_QUALITY_MENU, () => {
      document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-quality')[0].classList.remove('vjs-hidden');
    });

    // Go back to main menu, hide everything accept main menu
    player.on(GO_TO_MAIN_MENU, () => {
      document.getElementsByClassName('vjs-settings-menu-home')[0].classList.remove('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.add('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-quality')[0].classList.add('vjs-hidden');
    });

    // on playbackRate change
    player.on(CHANGE_PLAYBACK_RATE, (data, item) => {
      this.player_.playbackRate(item ? item : 1);
    });

    // on player quality change
    player.on(CHANGE_PLAYER_QUALITY, (data, item) => {
      const isPaused = this.player_.paused();
      const currentTime = this.player_.currentTime();
      this.player_.src(item);
      // this.player_.play();

      this.player_.ready(() => {
        // console.log('Player is ready toh play');
        if (!isPaused) {
          this.player_.play();
        }
        this.player_.currentTime(currentTime);
      });
    });
  }

  createEl() {
    const el = videojs.dom.createEl('div', {
      className: 'vjs-setting-menu'
    });

    return el;
  }

  /**
   * Update the menu based on the current state of its items.
   */
  update() {
    const menu = this.createMenu();
    if (this['menu']) {
      this['menu'].dispose();
      this.removeChild(this['menu']);
    }

    this['menu'] = menu;
    this.addChild(menu);

    // if (this.items && this.items.length <= this.hideThreshold_) {
    //   this.hide();
    // } else {
    //   this.show();
    // }
  }

  createMenu() {
    const menu = new Menu(this.player_);

    const mainMenu = [
      {
        name: 'home',
        options: this.getHomeMenu()
      },
      {
        name: 'speed',
        options: this.getSpeedMenu()
      },
      {
        name: 'quality',
        options: this.getQualityMenu()
      }
    ];
    // console.log('rates: ', mainMenu);
    if (mainMenu && mainMenu.length) {
      for (let i = 0; i < mainMenu.length; i++) {
        menu.addChild(new SettingMenuItem(this.player_, mainMenu[i]));
      }
    }

    return menu;
  }

  getSpeedList() {
    const playBackRates = this.player_['options_'].playbackRates;
    const playBackRate = this.player_.playbackRate();
    this.options_['speed'] = playBackRates;
    this.options_['currentPlaybackSpeed'] = playBackRate;
  }

  getQualityList() {
    let currentSources = this.player_.currentSource();
    // const tech = this.player_.tech();
    // console.log(tech['hls']);
    if (currentSources && currentSources.type === 'application/x-mpegURL' && this.player_['hls']) {
      const representations = this.player_['hls'].representations();
      console.log(representations);
      this.options_['sources'] = representations.map(el => {
        return {
          src: (el) ? el.id.substr(2, el.id.length - 1) : currentSources.src,
          label: el.height.toString() || '240',
          type: 'application/x-mpegURL'
        };
      });
    } else if (currentSources && currentSources.type === 'video/mp4') {
      this.options_['sources'] = this.player_.currentSources();
    }

    if (this.options_['sources'] && this.options_['sources'].length) {
      this.options_['sources'] = this.options_['sources'].sort((a, b) => {
        return parseInt(b.label, 10) - parseInt(a.label, 10);
      });

      currentSources = (currentSources && currentSources.type === 'video/mp4') ? currentSources : this.options_['sources'][this.options_['sources'].length - 1];
      this.playDefaultQuality(this.options_['sources'], currentSources, this.options_['defaultQuality'].toString());
    }
  }

  playDefaultQuality(sources, currentSources, quality) {
    let defaultSource = [];

    if (quality !== 'default' && currentSources && currentSources.label !== quality) {
      defaultSource = sources.filter((el) => (el.label === quality));
    } else {
      defaultSource = [sources[sources.length - 1]];
    }
    if (defaultSource.length) {
      this.player_.trigger(CHANGE_PLAYER_QUALITY, defaultSource[0]);
      // this.player_.src(defaultSource[0]);
    }
  }

  getQualityMenu() {
    const currentSource = this.player_.currentSource();
    const sources = this.options_['sources'];

    // console.log('sources: ', sources, 'currentSrc: ', currentSource, this.options, this.player_.getCache());
    const speedOptions = sources.map(el => {
      return {
        name: el.label + 'p',
        value: el,
        isSelected: el.label === currentSource['src'],
        className: (el.label === currentSource['label']) ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline',
        event: CHANGE_PLAYER_QUALITY,
        innerHTML: `<span class="vjs-setting-title">${el.label + 'p'}</span>
<span class="vjs-setting-icon vjs-quality ${(el.label === currentSource['label']) ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline'}"></span>`
      };
    });
    speedOptions.splice(0, 0, {
      name: 'Quality',
      value: 'Quality',
      isSelected: false,
      className: 'vjs-icon-play',
      event: GO_TO_MAIN_MENU,
      innerHTML: `<span style="transform: rotate(180deg);" class="vjs-setting-icon vjs-icon-play"></span>
                    <span class="vjs-setting-title">Quality</span>`
    });

    return speedOptions;
  }

  getSpeedMenu() {
    const playBackRates = this.options_['speed'];
    const playBackRate = this.options_['currentPlaybackSpeed'];

    if (!playBackRates || !playBackRate) {
      return;
    }

    const speedOptions = playBackRates.map(el => {
      return {
        name: el + 'x',
        value: el,
        isSelected: el === playBackRate,
        className: (el === playBackRate) ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline',
        event: CHANGE_PLAYBACK_RATE,
        innerHTML: `<span class="vjs-setting-title">${el === 1 ? 'Normal' : el + 'x'}</span>
<span class="vjs-setting-icon vjs-speed ${(el === playBackRate) ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline'}"></span>`
      };
    });
    speedOptions.splice(0, 0, {
      name: 'Speed',
      value: 'Speed',
      isSelected: false,
      className: 'vjs-icon-play',
      event: GO_TO_MAIN_MENU,
      innerHTML: `<span style="transform: rotate(180deg);" class="vjs-setting-icon vjs-icon-play"></span>
                    <span class="vjs-setting-title">Speed</span>`
    });

    return speedOptions;
  }

  getHomeMenu() {
    return [
      {
        name: 'Share',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title">Share</span>
<span class="vjs-setting-icon vjs-icon-share"></span>`
      },
      {
        name: 'Zoom',
        class: 'vjs-icon-spinner',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title">Zoom</span>
<span class="vjs-setting-icon vjs-icon-spinner"></span>`
      },
      {
        name: 'Related',
        class: 'vjs-icon-chapters',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title text-left">Related</span>
<span class="vjs-setting-icon vjs-icon-chapters"></span>`
      },
      {
        name: 'Speed',
        class: '',
        value: 'Normal',
        event: TOGGLE_SPEED_MENU,
        innerHTML: `<span class="vjs-setting-title text-left">Speed</span>
<span class="vjs-setting-icon vjs-setting-speed">Normal</span>`
      },
      {
        name: 'Quality',
        class: '',
        value: '250p',
        event: TOGGLE_QUALITY_MENU,
        innerHTML: `<span class="vjs-setting-title text-left">Quality</span>
<span class="vjs-setting-icon vjs-setting-quality">${this.options_['defaultQuality'] || 'default'}</span>`
      }
    ];
  }

  /**
   * Create the list of menu items. Specific to each subclass.
   *
   * @abstract
   */
  createItems() {
  }

  /**
   * Dispose of the `menu-button` and all child components.
   */
  dispose() {
    super.dispose();
  }

}

Component.registerComponent('settingMenu', SettingMenu);
export default SettingMenu;
