import videojs from 'video.js';

const Plugin = videojs.getPlugin('plugin');
const Component = videojs.getComponent('Component');
const Button = videojs.getComponent('Button');

// Default options for the plugin.
const defaults = {
  direction: 'forward',
  seconds: 10
};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class SeekButtons extends Button {
  // options: any;


  constructor(player, options) {
    super(player, options);
    this.options = videojs.mergeOptions(defaults, options);
    // console.log('options: ', player);
    // console.log(this.el().classList.addClass('vjs-icon-replay'));
    // const ele = this.el();
    // if (ele && ele.children && ele.children.length) {
    //   const classList = ele.children[0].classList;
    //   classList.addClass('vjs-icon-replay');
    // }
  }

  // createEl() {
  //   const el = videojs.dom.createEl('div', {
  //     className: 'vjs-seek-buttons',
  //     innerHTML: ``
  //   });

  // const frowardButton = videojs.dom.createEl('button', {
  //   className: 'vjs-seek-forward'
  // });
  // el.appendChild(frowardButton);
  //
  // const backwardButton = videojs.dom.createEl('button', {
  //   className: 'vjs-seek-backward'
  // });
  // el.appendChild(backwardButton);

  //   return el;
  // }

  buildCSSClass() {
    /* Each button will have the classes:
       `vjs-seek-button`
       `skip-forward` or `skip-back`
       `skip-n` where `n` is the number of seconds
       So you could have a generic icon for "skip back" and a more
       specific one for "skip back 30 seconds"
    */
    return `vjs-seek-button vjs-skip-${this.options_['direction']} vjs-icon-replay ` +
      `vjs-skip-${this.options_['seconds']} ${super.buildCSSClass()}`;
  }

  handleClick(event) {
    const direction = this.options_['direction'];
    const seconds = this.options_['seconds'];
    switch (direction) {
      case 'forward':
        event.target.classList.add('vjs-skip-forward-anim');
        setTimeout(() => {
          event.target.classList.remove('vjs-skip-forward-anim');
        }, 100);
        this.player_.currentTime(this.player_.currentTime() + seconds);
        break;
      case 'backward':
        event.target.classList.add('vjs-skip-backward-anim');
        setTimeout(() => {
          event.target.classList.remove('vjs-skip-backward-anim');
        }, 100);
        this.player_.currentTime(this.player_.currentTime() - seconds);
        break;
    }
  }
}


// Define default values for the plugin's `state` object here.
// SeekButtons.defaultState = {};
// Register the plugin with video.js.
// videojs.registerPlugin('seekButtons', SeekButtons);
Component.registerComponent('SeekButtons', SeekButtons);
export default SeekButtons;
