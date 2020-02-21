declare const videojs;

export class SettingButton extends videojs.getComponent('Button', {}) {
  player: any;

  constructor(player, options = {}) {
    super(player, options);

    this.el().classList.add('vjs-setting-control');
    // this.el().on('click', () => {
    //   console.log('Click from constructor');
    // });
    // this.updateLabel();
  }

  createEl() {
    const el = super.createEl();
    el.appendChild(videojs.createEl('div', {
      className: 'vjs-icon-cog'
    }));
    // el.classList.addClass('vjs-setting-control');
    return el;
  }

  dispose() {
    super.dispose();
  }

  buildCSSClass() {
    console.log(`vjs-playback-rate ${super.buildCSSClass()}`);
    return `vjs-playback-rate ${super.buildCSSClass()}`;
  }

  buildWrapperCSSClass() {
    console.log('buildWrapperCSSClass');
    return `vjs-playback-rate ${super.buildWrapperCSSClass()}`;
  }

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
