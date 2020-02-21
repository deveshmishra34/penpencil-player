declare const videojs;

export class SettingButtonHome extends videojs.getComponent('Component', {}) {
  player: any;

  constructor(player, options = {}) {
    super(player, options);

    // const text = ``
    // this.updateTextContent(text);
  }

  createEl() {
    const el = super.createEl();
    el.appendChild(videojs.createEl('div', {
      className: 'vjs-setting-home',
      innerHTML: `<div class="vjs-menu-settings"><div class="vjs-menu-div vjs-settings-div" style="width: 159px; height: 112px;"><div class="vjs-submenu vjs-settings-home"><ul class="vjs-menu-content vjs-settings-list"><li class="vjs-settings-item vjs-share-button">Share<span class="vjs-share-icon"></span></li><li class="vjs-settings-item vjs-related-button">Related<span class="vjs-related-icon"></span></li><li class="vjs-settings-item vjs-extend-zoom vjs-menu-forward">Zoom<span class="zoom-label">100%</span></li><li class="vjs-settings-item vjs-extend-speed vjs-menu-forward">Speed<span>Normal</span></li></ul></div><div class="vjs-submenu vjs-menu-speed vjs-hidden"><ul class="vjs-menu-content"><li class="vjs-settings-back">Speed</li><li class="vjs-speed">0.5x</li><li class="vjs-speed vjs-checked">1x</li><li class="vjs-speed">1.5x</li><li class="vjs-speed">2x</li></ul></div><div class="vjs-submenu vjs-zoom-menu vjs-hidden"><div class="vjs-settings-back vjs-zoom-return"><span>Zoom</span></div><div class="vjs-zoom-slider"><div class="vjs-zoom-back"></div><div class="vjs-zoom-level"></div></div><div class="vjs-zoom-reset">RESET</div></div></div></div>`
    }));
    return el;
  }

  dispose() {
    super.dispose();
  }

  // buildCSSClass() {
  //   console.log(`vjs-playback-rate ${super.buildCSSClass()}`);
  //   return `vjs-playback-rate ${super.buildCSSClass()}`;
  // }
  //
  // buildWrapperCSSClass() {
  //   console.log('buildWrapperCSSClass');
  //   return `vjs-playback-rate ${super.buildWrapperCSSClass()}`;
  // }

  public handleClick(event) {
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
    console.log('updateTextContent');
    if (typeof text !== 'string') {
      text = 'Title Unknown';
    }

    videojs.emptyEl(this.el());
    videojs.appendContent(this.el(), text);
  }

  updateLabel(event) {
    console.log('updateLabel');
  }

}
