/*! @name videojs-seek-buttons @version 1.0.0 @license MIT */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var videojs = _interopDefault(require('video.js'));

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var version = "1.0.0";

var Button = videojs.getComponent('Button'); // Default options for the plugin.

var defaults = {
  direction: 'forward',
  seconds: 10
};

var SeekButton =
/*#__PURE__*/
function (_Button) {
  _inheritsLoose(SeekButton, _Button);

  function SeekButton(player, options) {
    var _this;

    _this = _Button.call(this, player, options) || this;
    _this.options = videojs.mergeOptions(defaults, options); // console.log('this.options: ', this.options);

    return _this;
  }

  var _proto = SeekButton.prototype;

  _proto.buildCSSClass = function buildCSSClass() {
    return "vjs-seek-button vjs-skip-" + this.options_['direction'] + " vjs-icon-replay " + ("vjs-skip-" + this.options_['seconds'] + " " + _Button.prototype.buildCSSClass.call(this));
  };

  _proto.handleClick = function handleClick(event) {
    var direction = this.options['direction'];
    var seconds = this.options['seconds'];
    var remainingTime = this.player().remainingTime(); // console.log('Button tap', direction, seconds, this.player);

    switch (direction) {
      case 'forward':
        event.target.classList.add('vjs-skip-forward-anim');
        setTimeout(function () {
          event.target.classList.remove('vjs-skip-forward-anim');
        }, 100);

        if (remainingTime < seconds) {
          return;
        }

        this.player_.currentTime(this.player_.currentTime() + seconds);
        break;

      case 'backward':
        event.target.classList.add('vjs-skip-backward-anim');
        setTimeout(function () {
          event.target.classList.remove('vjs-skip-backward-anim');
        }, 100);
        this.player_.currentTime(this.player_.currentTime() - seconds);
        break;
    }
  };

  return SeekButton;
}(Button); // Define default values for the plugin's `state` object here.


SeekButton.defaultState = {}; // Include the version number.

SeekButton.VERSION = version;
videojs.registerComponent('seekButton', SeekButton);

var Plugin = videojs.getPlugin('plugin'); // Default options for the plugin.

var defaults$1 = {
  forward: {
    direction: 'forward',
    seconds: 10
  },
  backward: {
    direction: 'backward',
    seconds: 10
  }
};
/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */

var SeekButtons =
/*#__PURE__*/
function (_Plugin) {
  _inheritsLoose(SeekButtons, _Plugin);

  /**
   * Create a SeekButtons plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  function SeekButtons(player, options) {
    var _this;

    // the parent class will add player under this.player
    _this = _Plugin.call(this, player) || this;
    _this.options = videojs.mergeOptions(defaults$1, options); // console.log('this.options: ', this.options);

    _this.player.ready(function () {
      _this.player.addClass('vjs-seek-buttons'); // console.log('Player is ready');


      if (_this.options && _this.options.forward) {
        _this.player.controlBar.seekForward = _this.player.controlBar.addChild('seekButton', _this.options.forward);

        _this.player.controlBar.el().insertBefore(_this.player.controlBar.seekForward.el(), _this.player.controlBar.el().firstChild.nextSibling);
      }

      if (_this.options && _this.options.backward) {
        _this.player.controlBar.seekBackward = _this.player.controlBar.addChild('seekButton', _this.options.backward);

        _this.player.controlBar.el().insertBefore(_this.player.controlBar.seekBackward.el(), _this.player.controlBar.el().firstChild.nextSibling);
      }
    });

    return _this;
  }

  return SeekButtons;
}(Plugin); // Define default values for the plugin's `state` object here.


SeekButtons.defaultState = {}; // Include the version number.

SeekButtons.VERSION = version; // Register the plugin with video.js.

videojs.registerPlugin('seekButtons', SeekButtons);

module.exports = SeekButtons;
