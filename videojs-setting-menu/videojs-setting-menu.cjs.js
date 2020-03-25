/*! @name videojs-setting-menu @version 1.0.0 @license MIT */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var videojs = _interopDefault(require('video.js'));

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var version = "1.0.0";

var TOGGLE_MAIN_MENU = 'showMainMenu';
var GO_TO_MAIN_MENU = 'goToMainMenu';
var TOGGLE_SPEED_MENU = 'toggleSpeedMenu';
var TOGGLE_QUALITY_MENU = 'toggleQualityMenu';
var CHANGE_PLAYBACK_RATE = 'changePlaybackRate';
var CHANGE_PLAYER_QUALITY = 'changePlayerQuality';

var Button = videojs.getComponent('Button'); // Default options for the plugin.

var defaults = {};

var SettingButton =
/*#__PURE__*/
function (_Button) {
  _inheritsLoose(SettingButton, _Button);

  function SettingButton(player, options) {
    var _this;

    _this = _Button.call(this, player, options) || this;
    _this.options = videojs.mergeOptions(defaults, options);
    return _this;
  }

  var _proto = SettingButton.prototype;

  _proto.buildCSSClass = function buildCSSClass() {
    return "vjs-setting-menu-button vjs-icon-cog " + _Button.prototype.buildCSSClass.call(this);
  };

  _proto.handleClick = function handleClick(event) {
    this.player_.trigger(TOGGLE_MAIN_MENU, {});

    if (event.target.classList.contains('vjs-setting-button-anim')) {
      event.target.classList.remove('vjs-setting-button-anim');
    } else {
      event.target.classList.add('vjs-setting-button-anim');
    }
  };

  return SettingButton;
}(Button); // Define default values for the plugin's `state` object here.


SettingButton.defaultState = {}; // Include the version number.

SettingButton.VERSION = version;
videojs.registerComponent('settingButton', SettingButton);

var ClickableComponent = videojs.getComponent('ClickableComponent'); // Default options for the plugin.

var defaults$1 = {};

var SettingMenuSubItem =
/*#__PURE__*/
function (_ClickableComponent) {
  _inheritsLoose(SettingMenuSubItem, _ClickableComponent);

  function SettingMenuSubItem(player, options) {
    var _this;

    _this = _ClickableComponent.call(this, player, options) || this;
    _this.options = videojs.mergeOptions(defaults$1, options);
    return _this;
  }

  var _proto = SettingMenuSubItem.prototype;

  _proto.createEl = function createEl() {
    var el = videojs.dom.createEl('div', {
      className: "vjs-setting-item",
      innerHTML: this.options_['innerHTML']
    });
    return el;
  };

  _proto.handleClick = function handleClick(event) {
    // console.log('Clicked Sub Menu', event);
    this.player().trigger(this.options_['event'], this.options_['value']);

    switch (this.options_['event']) {
      case CHANGE_PLAYBACK_RATE:
        this.playbackRateDomMod(event, this.options_['value']);
        break;

      case CHANGE_PLAYER_QUALITY:
        this.qualityDomMod(event, this.options_['value']);
        break;
    }
  };

  _proto.playbackRateDomMod = function playbackRateDomMod(data, value) {
    // update outer value
    document.getElementsByClassName('vjs-setting-speed')[0].innerHTML = value === 1 ? 'Normal' : value + 'x'; // update radio button

    document.getElementsByClassName('vjs-speed vjs-icon-circle-inner-circle')[0].classList.add('vjs-icon-circle-outline');
    document.getElementsByClassName('vjs-speed vjs-icon-circle-inner-circle')[0].classList.remove('vjs-icon-circle-inner-circle');

    if (data.target && data.target.children.length > 1) {
      data.target.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.target.children[1].classList.add('vjs-icon-circle-outline');
    } else {
      data.currentTarget.children[1].classList.add('vjs-icon-circle-inner-circle');
      data.currentTarget.children[1].classList.add('vjs-icon-circle-outline');
    }
  };

  _proto.qualityDomMod = function qualityDomMod(data, value) {
    // update outer value
    document.getElementsByClassName('vjs-setting-quality')[0].innerHTML = value.label + 'p'; // update radio button

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
  /**
   * Dispose of the `menu-button` and all child components.
   */
  ;

  _proto.dispose = function dispose() {
    _ClickableComponent.prototype.dispose.call(this);
  };

  return SettingMenuSubItem;
}(ClickableComponent); // Define default values for the plugin's `state` object here.


SettingMenuSubItem.defaultState = {}; // Include the version number.

SettingMenuSubItem.VERSION = version;
videojs.registerComponent('settingMenuSubItem', SettingMenuSubItem);

var Menu = videojs.getComponent('Menu');
var Component = videojs.getComponent('Component'); // Default options for the plugin.

var defaults$2 = {};

var SettingMenuItem =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(SettingMenuItem, _Component);

  function SettingMenuItem(player, options) {
    var _this;

    _this = _Component.call(this, player, options) || this;
    _this.options = videojs.mergeOptions(defaults$2, options);
    var subMenu = _this.options_['options'] || [];

    _this.update(subMenu);

    _this.el()['classList'].add('vjs-hidden'); // initial all the menu will be hidden


    return _this;
  }

  var _proto = SettingMenuItem.prototype;

  _proto.createEl = function createEl() {
    var el = videojs.dom.createEl('div', {
      className: "vjs-settings-menu-" + this.options_['name'] + " "
    });
    return el;
  }
  /**
   * Update the menu based on the current state of its items.
   */
  ;

  _proto.update = function update(subMenu) {
    var menu = this.createMenu(subMenu);

    if (this['menu']) {
      this['menu'].dispose();
      this.removeChild(this['menu']);
    }

    this['menu'] = menu;
    this.addChild(menu);
  };

  _proto.createMenu = function createMenu(subMenu) {
    var menu = new Menu(this.player(), {
      contentElType: 'div'
    });

    if (subMenu && subMenu.length) {
      for (var i = 0; i < subMenu.length; i++) {
        var subItem = new SettingMenuSubItem(this.player(), subMenu[i]);
        menu.addChild(subItem);
      }
    }

    return menu;
  }
  /**
   * Dispose of the `menu-button` and all child components.
   */
  ;

  _proto.dispose = function dispose() {
    _Component.prototype.dispose.call(this);
  };

  return SettingMenuItem;
}(Component); // Define default values for the plugin's `state` object here.


SettingMenuItem.defaultState = {}; // Include the version number.

SettingMenuItem.VERSION = version;
videojs.registerComponent('settingMenuItem', SettingMenuItem);

var Menu$1 = videojs.getComponent('Menu');
var Component$1 = videojs.getComponent('Component'); // Default options for the plugin.

var defaults$3 = {
  menu: ['speed', 'quality'],
  speed: [],
  sources: [],
  defaultQuality: 'default'
};

var SettingMenuMain =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(SettingMenuMain, _Component);

  function SettingMenuMain(player, options) {
    var _this;

    _this = _Component.call(this, player, options) || this;
    _this.options = videojs.mergeOptions(defaults$3, options); // console.log('options: ', this.options, this.options_);
    // when player is ready setup basic option

    player.on('ready', function () {
      _this.getQualityList(); // this.getQualityList();


      _this.update();
    }); // in case url type is not mp4 quality will be return after loadedmetadata event

    player.on('loadedmetadata', function () {
      if (!_this.options_['sources'] || !_this.options_['sources'].length) {
        _this.getSpeedList();

        _this.getQualityList();

        _this.update();
      }
    });
    player.on('userinactive', function () {
      var eleDiv = document.getElementsByClassName('vjs-settings-menu-home')[0]; //.add('vjs-hidden');

      var eleSpeed = document.getElementsByClassName('vjs-settings-menu-speed')[0]; //.add('vjs-hidden');

      var eleQuality = document.getElementsByClassName('vjs-settings-menu-quality')[0]; //.add('vjs-hidden');

      eleDiv.classList.add('vjs-hidden');
      eleSpeed.classList.add('vjs-hidden');
      eleQuality.classList.add('vjs-hidden');
    }); // Hide/Show Speed Menu

    player.on(TOGGLE_MAIN_MENU, function () {
      var eleDiv = document.getElementsByClassName('vjs-settings-menu-home')[0]; //.add('vjs-hidden');

      var eleSpeed = document.getElementsByClassName('vjs-settings-menu-speed')[0]; //.add('vjs-hidden');

      var eleQuality = document.getElementsByClassName('vjs-settings-menu-quality')[0]; //.add('vjs-hidden');
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
    player.on(TOGGLE_SPEED_MENU, function () {
      document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.remove('vjs-hidden');
    }); // Hide/Show Quality Menu

    player.on(TOGGLE_QUALITY_MENU, function () {
      document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-quality')[0].classList.remove('vjs-hidden');
    }); // Go back to main menu, hide everything accept main menu

    player.on(GO_TO_MAIN_MENU, function () {
      document.getElementsByClassName('vjs-settings-menu-home')[0].classList.remove('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.add('vjs-hidden');
      document.getElementsByClassName('vjs-settings-menu-quality')[0].classList.add('vjs-hidden');
    }); // on playbackRate change

    player.on(CHANGE_PLAYBACK_RATE, function (data, item) {
      _this.player().playbackRate(item ? item : 1);
    }); // on player quality change

    player.on(CHANGE_PLAYER_QUALITY, function (data, item) {
      var isPaused = _this.player().paused();

      var currentTime = _this.player().currentTime();

      _this.player().src(item); // this.player_.play();


      _this.player().ready(function () {
        // console.log('Player is ready toh play');
        if (!isPaused) {
          _this.player().play();
        }

        _this.player().currentTime(currentTime);
      });
    });
    return _this;
  }

  var _proto = SettingMenuMain.prototype;

  _proto.createEl = function createEl() {
    var el = videojs.dom.createEl('div', {
      className: 'vjs-setting-menu-main'
    });
    return el;
  }
  /**
   * Update the menu based on the current state of its items.
   */
  ;

  _proto.update = function update() {
    var menu = this.createMenu();

    if (this['menu']) {
      this['menu'].dispose();
      this.removeChild(this['menu']);
    }

    this['menu'] = menu;
    this.addChild(menu); // if (this.items && this.items.length <= this.hideThreshold_) {
    //   this.hide();
    // } else {
    //   this.show();
    // }
  };

  _proto.createMenu = function createMenu() {
    var menu = new Menu$1(this.player(), {
      contentElType: 'div'
    });
    var mainMenu = [{
      name: 'home',
      options: this.getHomeMenu()
    }, {
      name: 'speed',
      options: this.getSpeedMenu()
    }, {
      name: 'quality',
      options: this.getQualityMenu()
    }];

    if (mainMenu && mainMenu.length) {
      for (var i = 0; i < mainMenu.length; i++) {
        menu.addChild(new SettingMenuItem(this.player_, mainMenu[i]));
      }
    }

    return menu;
  };

  _proto.getSpeedList = function getSpeedList() {
    var playBackRates = this.player()['options_'].playerOptions.playbackRates;
    var playBackRate = this.player().playbackRate();
    this.options_['speed'] = playBackRates;
    this.options_['currentPlaybackSpeed'] = playBackRate;
  };

  _proto.getQualityList = function getQualityList() {
    var currentSources = this.player().currentSource(); // const tech = this.player_.tech();
    // console.log(tech['hls']);

    if (currentSources && currentSources.type === 'application/x-mpegURL' && this.player()['hls']) {
      var representations = this.player()['hls'].representations(); // console.log(representations);

      this.options_['sources'] = representations.map(function (el) {
        return {
          src: el.id && (el.id.split(':')[0].length === 5 || el.id.split(':')[0].length === 4) ? el.id : el.id.substr(2, el.id.length - 1),
          //: currentSources.src
          label: el.height.toString() || '240',
          type: 'application/x-mpegURL'
        };
      }); // console.log(this.options_['sources']);
    } else if (currentSources && currentSources.type === 'video/mp4') {
      var sources = [];
      this.player().currentSources().forEach(function (el) {
        if (el && el.label) {
          sources.push({
            src: el.src,
            label: el.label,
            type: el.type
          });
        }
      }); // console.log('sources: ', sources, this.player().currentSources());

      this.options_['sources'] = sources;
    }

    if (this.options_['sources'] && this.options_['sources'].length) {
      this.options_['sources'] = this.options_['sources'].sort(function (a, b) {
        return parseInt(b.label, 10) - parseInt(a.label, 10);
      });
      currentSources = currentSources && currentSources.type === 'video/mp4' ? currentSources : this.options_['sources'][this.options_['sources'].length - 1];
      var defaultQuality = this.options_['defaultQuality'] ? this.options_['defaultQuality'].toString() : 'default';
      this.playDefaultQuality(this.options_['sources'], currentSources, defaultQuality);
    }
  };

  _proto.playDefaultQuality = function playDefaultQuality(sources, currentSources, quality) {
    var defaultSource = [];

    if (quality !== 'default' && currentSources && currentSources.label !== quality) {
      defaultSource = sources.filter(function (el) {
        return el.label === quality;
      });
    } else {
      defaultSource = [sources[sources.length - 1]];
    }

    if (defaultSource.length) {
      this.player().trigger(CHANGE_PLAYER_QUALITY, defaultSource[0]);
    }
  };

  _proto.getQualityMenu = function getQualityMenu() {
    var currentSource = this.player().currentSource();
    var sources = this.options_['sources'] || []; // console.log('sources: ', sources, 'currentSrc: ', currentSource, this.options_, this.player_.getCache());

    var speedOptions = sources.map(function (el) {
      return {
        name: el.label + 'p',
        value: el,
        isSelected: el.label === currentSource['src'],
        className: el.label === currentSource['label'] ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline',
        event: CHANGE_PLAYER_QUALITY,
        innerHTML: "<span class=\"vjs-setting-title\">" + (el.label + 'p') + "</span>\n<span class=\"vjs-setting-icon vjs-quality " + (el.label === currentSource['label'] ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline') + "\"></span>"
      };
    });
    speedOptions.splice(0, 0, {
      name: 'Quality',
      value: 'Quality',
      isSelected: false,
      className: 'vjs-icon-play',
      event: GO_TO_MAIN_MENU,
      innerHTML: "<span style=\"transform: rotate(180deg);\" class=\"vjs-setting-icon vjs-icon-play\"></span>\n                    <span class=\"vjs-setting-title\">Quality</span>"
    });
    return speedOptions;
  };

  _proto.getSpeedMenu = function getSpeedMenu() {
    var playBackRates = this.options_['speed'];
    var playBackRate = this.options_['currentPlaybackSpeed'];

    if (!playBackRates || !playBackRate) {
      return;
    }

    var speedOptions = playBackRates.map(function (el) {
      return {
        name: el + 'x',
        value: el,
        isSelected: el === playBackRate,
        className: el === playBackRate ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline',
        event: CHANGE_PLAYBACK_RATE,
        innerHTML: "<span class=\"vjs-setting-title\">" + (el === 1 ? 'Normal' : el + 'x') + "</span>\n<span class=\"vjs-setting-icon vjs-speed " + (el === playBackRate ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline') + "\"></span>"
      };
    });
    speedOptions.splice(0, 0, {
      name: 'Speed',
      value: 'Speed',
      isSelected: false,
      className: 'vjs-icon-play',
      event: GO_TO_MAIN_MENU,
      innerHTML: "<span style=\"transform: rotate(180deg);\" class=\"vjs-setting-icon vjs-icon-play\"></span>\n                    <span class=\"vjs-setting-title\">Speed</span>"
    });
    return speedOptions;
  };

  _proto.getHomeMenu = function getHomeMenu() {
    if (!this.options['menu'] || !this.options['menu'].length) {
      return;
    }

    var menu = [];
    var requiredMenu = this.options['menu'].map(function (el) {
      return el.toString().toLowerCase();
    });

    if (requiredMenu.indexOf('share') > -1) {
      menu.push({
        name: 'Share',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: "<span class=\"vjs-setting-title\">Share</span>\n<span class=\"vjs-setting-icon vjs-icon-share\"></span>"
      });
    }

    if (requiredMenu.indexOf('zoom') > -1) {
      menu.push({
        name: 'Zoom',
        class: 'vjs-icon-spinner',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: "<span class=\"vjs-setting-title\">Zoom</span>\n<span class=\"vjs-setting-icon vjs-icon-spinner\"></span>"
      });
    }

    if (requiredMenu.indexOf('related') > -1) {
      menu.push({
        name: 'Related',
        class: 'vjs-icon-chapters',
        value: 0,
        event: TOGGLE_SPEED_MENU,
        innerHTML: "<span class=\"vjs-setting-title text-left\">Related</span>\n<span class=\"vjs-setting-icon vjs-icon-chapters\"></span>"
      });
    }

    if (requiredMenu.indexOf('speed') > -1) {
      menu.push({
        name: 'Speed',
        class: '',
        value: 'Normal',
        event: TOGGLE_SPEED_MENU,
        innerHTML: "<span class=\"vjs-setting-title text-left\">Speed</span>\n<span class=\"vjs-setting-icon vjs-setting-speed\">Normal</span>"
      });
    }

    if (requiredMenu.indexOf('quality') > -1) {
      menu.push({
        name: 'Quality',
        class: '',
        value: '250p',
        event: TOGGLE_QUALITY_MENU,
        innerHTML: "<span class=\"vjs-setting-title text-left\">Quality</span>\n<span class=\"vjs-setting-icon vjs-setting-quality\">" + (this.options_['defaultQuality'] || 'default') + "</span>"
      });
    }

    return menu;
  }
  /**
   * Dispose of the `menu-button` and all child components.
   */
  ;

  _proto.dispose = function dispose() {
    _Component.prototype.dispose.call(this);
  };

  return SettingMenuMain;
}(Component$1); // Define default values for the plugin's `state` object here.


SettingMenuMain.defaultState = {}; // Include the version number.

SettingMenuMain.VERSION = version;
videojs.registerComponent('settingMenuMain', SettingMenuMain);

var Plugin = videojs.getPlugin('plugin'); // Default options for the plugin.

var defaults$4 = {};
/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */

var SettingMenu =
/*#__PURE__*/
function (_Plugin) {
  _inheritsLoose(SettingMenu, _Plugin);

  /**
   * Create a SettingMenu plugin instance.
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
  function SettingMenu(player, options) {
    var _this;

    // the parent class will add player under this.player
    _this = _Plugin.call(this, player) || this;
    _this.options = videojs.mergeOptions(defaults$4, options);

    _this.player.ready(function () {
      _this.player.addClass('vjs-setting-menu');

      _this.player.controlBar.settingButton = _this.player.controlBar.addChild('settingButton');

      _this.player.controlBar.el().insertBefore(_this.player.controlBar.settingButton.el(), _this.player.controlBar.el().lastChild.nextSibling);

      _this.player.controlBar.settingButton = _this.player.controlBar.addChild('settingMenuMain');
    });

    return _this;
  }

  return SettingMenu;
}(Plugin); // Define default values for the plugin's `state` object here.


SettingMenu.defaultState = {}; // Include the version number.

SettingMenu.VERSION = version; // Register the plugin with video.js.

videojs.registerPlugin('settingMenu', SettingMenu);

module.exports = SettingMenu;
