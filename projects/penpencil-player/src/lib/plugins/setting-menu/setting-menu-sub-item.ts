import videojs from 'video.js';
import {CHANGE_PLAYBACK_RATE, CHANGE_PLAYER_QUALITY} from '../events';

const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');
const ClickableComponent = videojs.getComponent('ClickableComponent');


// Default options for the plugin.
const defaults = {};


// This is for creating multiple menu
class SettingMenuSubItem extends ClickableComponent {

  constructor(player, options) {
    super(player, options);

    this.options_ = videojs.mergeOptions(defaults, options);
  }

  createEl() {
    const el = videojs.dom.createEl('li', {
      className: `vjs-setting-item`,
      innerHTML: this.options_['innerHTML']
    });

    return el;
  }

  handleClick(event) {
    // console.log('Clicked Sub Menu', event);
    this.player_.trigger(this.options_['event'], this.options_['value']);
    switch (this.options_['event']) {
      case CHANGE_PLAYBACK_RATE:
        this.playbackRateDomMod(event, this.options_['value']);
        break;
      case CHANGE_PLAYER_QUALITY:
        this.qualityDomMod(event, this.options_['value']);
        break;
    }
  }

  playbackRateDomMod(data, value) {
    // update outer value
    document.getElementsByClassName('vjs-setting-speed')[0].innerHTML = (value === 1) ? 'Normal' : value + 'x';

    // update radio button
    document.getElementsByClassName('vjs-speed vjs-icon-circle-inner-circle')[0].classList.add('vjs-icon-circle-outline');
    document.getElementsByClassName('vjs-speed vjs-icon-circle-inner-circle')[0].classList.remove('vjs-icon-circle-inner-circle');
    if (data.target && data.target.children.length > 1) {
      data.target.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.target.children[1].classList.add('vjs-icon-circle-outline');
    } else {
      data.currentTarget.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.currentTarget.children[1].classList.add('vjs-icon-circle-outline');
    }

  }

  qualityDomMod(data, value) {
    // update outer value
    document.getElementsByClassName('vjs-setting-quality')[0].innerHTML = value.label + 'p';

    // update radio button
    document.getElementsByClassName('vjs-quality vjs-icon-circle-inner-circle')[0].classList.add('vjs-icon-circle-outline');
    document.getElementsByClassName('vjs-quality vjs-icon-circle-inner-circle')[0].classList.remove('vjs-icon-circle-inner-circle');
    if (data.target && data.target.children.length > 1) {
      data.target.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.target.children[1].classList.add('vjs-icon-circle-outline');
    } else {
      data.currentTarget.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.currentTarget.children[1].classList.add('vjs-icon-circle-outline');
    }
  }
}

Component.registerComponent('SettingMenuSubItem', SettingMenuSubItem);
export default SettingMenuSubItem;
