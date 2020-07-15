/*! @name videojs-setting-menu @version 2.0.0 @license MIT */
import videojs from 'video.js';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var version = "2.0.0";

var TOGGLE_MAIN_MENU = 'showMainMenu';
var GO_TO_MAIN_MENU = 'goToMainMenu';
var TOGGLE_RATIO_MENU = 'toggleRatioMenu';
var TOGGLE_SPEED_MENU = 'toggleSpeedMenu';
var TOGGLE_QUALITY_MENU = 'toggleQualityMenu';
var CHANGE_PLAYBACK_RATE = 'changePlaybackRate';
var CHANGE_PLAYER_QUALITY = 'changePlayerQuality';
var CHANGE_ASPECT_RATIO = 'changeAspectRatio';

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
      className: "vjs-setting-item ",
      innerHTML: this.options_['innerHTML']
    });
    return el;
  };

  _proto.handleClick = function handleClick(event) {
    this.player().trigger(this.options_['event'], {
      item: this.options_['value'],
      element: event
    });
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
  aspectRatio: ['16:9', '4:3'],
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
    _this.options = videojs.mergeOptions(defaults$3, options); // console.log('options: ', options);
    // when player is ready setup basic option

    _this.el()['classList'].add('vjs-hidden');

    player.on('ready', function () {
      console.log('ready');

      _this.getSpeedList();

      _this.getRatioList();

      _this.getQualityList();
    }); // in case url type is not mp4 quality will be return after loadedmetadata event

    player.on('loadedmetadata', function () {
      console.log('loadedmetadata'); // console.log('cache: ', this.player.getCache());
      // if (!this.options_['sources'] || !this.options_['sources'].length) {

      _this.getSpeedList();

      _this.getRatioList();

      _this.getQualityList(); // }
      // setTimeout( () => {
      //   console.log('player', player.aspectRatio('4:3'));
      // }, 5000)

    });
    player.on('userinactive', function () {
      var eleMain = document.getElementsByClassName('vjs-setting-menu-main'); //.add('vjs-hidden');

      var eleDiv = document.getElementsByClassName('vjs-settings-menu-home'); //.add('vjs-hidden');

      var eleSpeed = document.getElementsByClassName('vjs-settings-menu-speed'); //.add('vjs-hidden');

      var eleQuality = document.getElementsByClassName('vjs-settings-menu-quality'); //.add('vjs-hidden');

      _this.eleClassAction(eleMain, 'vjs-hidden');

      _this.eleClassAction(eleDiv, 'vjs-hidden');

      _this.eleClassAction(eleSpeed, 'vjs-hidden');

      _this.eleClassAction(eleQuality, 'vjs-hidden');
    }); // Hide/Show Speed Menu

    player.on(TOGGLE_MAIN_MENU, function () {
      var eleMain = document.getElementsByClassName('vjs-setting-menu-main'); //.add('vjs-hidden');

      var eleDiv = document.getElementsByClassName('vjs-settings-menu-home'); //.add('vjs-hidden');

      var eleSpeed = document.getElementsByClassName('vjs-settings-menu-speed'); //.add('vjs-hidden');

      var eleQuality = document.getElementsByClassName('vjs-settings-menu-quality'); //.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.remove('vjs-hidden');

      if (eleDiv && eleDiv[0] && eleDiv[0].classList.contains('vjs-hidden')) {
        _this.eleClassAction(eleMain, 'vjs-hidden', 'remove');

        _this.eleClassAction(eleDiv, 'vjs-hidden', 'remove');

        _this.eleClassAction(eleSpeed, 'vjs-hidden');

        _this.eleClassAction(eleQuality, 'vjs-hidden');
      } else {
        _this.eleClassAction(eleMain, 'vjs-hidden');

        _this.eleClassAction(eleDiv, 'vjs-hidden');

        _this.eleClassAction(eleSpeed, 'vjs-hidden');

        _this.eleClassAction(eleQuality, 'vjs-hidden');
      }
    });
    player.on(TOGGLE_SPEED_MENU, function () {
      // document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.remove('vjs-hidden');
      _this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-home'), 'vjs-hidden');

      _this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-speed'), 'vjs-hidden', 'remove');
    });
    player.on(TOGGLE_RATIO_MENU, function () {
      // document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-ratio')[0].classList.remove('vjs-hidden');
      _this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-home'), 'vjs-hidden');

      _this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-ratio'), 'vjs-hidden', 'remove');
    }); // Hide/Show Quality Menu

    player.on(TOGGLE_QUALITY_MENU, function () {
      // document.getElementsByClassName('vjs-settings-menu-home')[0].classList.add('vjs-hidden');
      // document.getElementsByClassName('vjs-settings-menu-quality')[0].classList.remove('vjs-hidden');
      _this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-home'), 'vjs-hidden');

      _this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-quality'), 'vjs-hidden', 'remove');
    }); // Go back to main menu, hide everything accept main menu

    player.on(GO_TO_MAIN_MENU, function () {
      //   document.getElementsByClassName('vjs-settings-menu-home')[0].classList.remove('vjs-hidden');
      //   document.getElementsByClassName('vjs-settings-menu-speed')[0].classList.add('vjs-hidden');
      //   document.getElementsByClassName('vjs-settings-menu-quality')[0].classList.add('vjs-hidden');
      //   document.getElementsByClassName('vjs-settings-menu-ratio')[0].classList.add('vjs-hidden');
      _this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-home'), 'vjs-hidden', 'remove');

      _this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-speed'), 'vjs-hidden');

      _this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-quality'), 'vjs-hidden');

      _this.eleClassAction(document.getElementsByClassName('vjs-settings-menu-ratio'), 'vjs-hidden');
    }); // on playbackRate change

    player.on(CHANGE_PLAYBACK_RATE, function (_, data) {
      var item = data.item;
      var element = data.element;

      _this.player().playbackRate(item ? item : 1); // update outer value


      document.getElementsByClassName('vjs-setting-speed')[0].innerHTML = item === 1 ? 'Normal' : item + 'x'; // update radio button

      document.getElementsByClassName('vjs-speed vjs-icon-circle-inner-circle')[0].classList.add('vjs-icon-circle-outline');
      document.getElementsByClassName('vjs-speed vjs-icon-circle-inner-circle')[0].classList.remove('vjs-icon-circle-inner-circle');

      if (element.target && element.target.children.length > 1) {
        element.target.children[1].classList.add('vjs-icon-circle-inner-circle');
        element.target.children[1].classList.remove('vjs-icon-circle-outline');
      } else {
        element.currentTarget.children[1].classList.add('vjs-icon-circle-inner-circle');
        element.currentTarget.children[1].classList.remove('vjs-icon-circle-outline');
      }
    }); // on playbackRate change

    player.on(CHANGE_ASPECT_RATIO, function (_, data) {
      var item = data.item;
      var element = data.element; // console.log(CHANGE_ASPECT_RATIO, item);

      _this.player().aspectRatio(item ? item : '16:9'); // update outer value


      document.getElementsByClassName('vjs-setting-ratio')[0].innerHTML = item; // update radio button

      document.getElementsByClassName('vjs-ratio vjs-icon-circle-inner-circle')[0].classList.add('vjs-icon-circle-outline');
      document.getElementsByClassName('vjs-ratio vjs-icon-circle-inner-circle')[0].classList.remove('vjs-icon-circle-inner-circle');

      if (element.target && element.target.children.length > 1) {
        element.target.children[1].classList.add('vjs-icon-circle-inner-circle');
        element.target.children[1].classList.remove('vjs-icon-circle-outline');
      } else {
        element.currentTarget.children[1].classList.add('vjs-icon-circle-inner-circle');
        element.currentTarget.children[1].classList.remove('vjs-icon-circle-outline');
      }
    }); // on player quality change

    player.on(CHANGE_PLAYER_QUALITY, function (_, data) {
      var item = data.item;
      var element = data.element;

      var tech = _this.player().tech().hls;

      if (item && (item.type === 'application/x-mpegURL' || item.type === 'application/dash+xml') && tech) {
        var masterDetails = tech.playlists.master;
        var representations = masterDetails.playlists;
        var playLists = representations.filter(function (playlistInfo) {
          if (playlistInfo && playlistInfo.resolvedUri === item.src) {
            return playlistInfo;
          }
        });

        if (playLists.length) {
          tech.playlists.media(playLists[0]);

          tech.selectPlaylist = function () {
            return playLists[0];
          };
        }
      } else {
        var isPaused = _this.player().paused();

        var currentTime = _this.player().currentTime();

        _this.player().src(item);

        _this.player().ready(function () {
          if (!isPaused) {
            _this.player().play();
          }

          _this.player().currentTime(currentTime);
        });
      } // console.log(CHANGE_PLAYER_QUALITY, data, item);
      // update outer value


      document.getElementsByClassName('vjs-setting-quality')[0].innerHTML = item.label === 'Auto' ? 'Auto' : item.label + 'p'; // update radio button

      document.getElementsByClassName('vjs-quality vjs-icon-circle-inner-circle')[0].classList.add('vjs-icon-circle-outline');
      document.getElementsByClassName('vjs-quality vjs-icon-circle-inner-circle')[0].classList.remove('vjs-icon-circle-inner-circle');

      if (element.target && element.target.children.length > 1) {
        element.target.children[1].classList.add('vjs-icon-circle-inner-circle');
        element.target.children[1].classList.remove('vjs-icon-circle-outline');
      } else {
        element.currentTarget.children[1].classList.add('vjs-icon-circle-inner-circle');
        element.currentTarget.children[1].classList.remove('vjs-icon-circle-outline');
      }
    });
    return _this;
  }

  var _proto = SettingMenuMain.prototype;

  _proto.eleClassAction = function eleClassAction(ele, className, action) {
    if (action === void 0) {
      action = 'add';
    }

    if (ele && ele[0] && ele[0].classList && className && action === 'add') {
      ele[0].classList.add(className);
    } else if (ele && ele[0] && ele[0].classList && className && action === 'remove') {
      ele[0].classList.remove(className);
    }
  };

  _proto.createEl = function createEl() {
    var el = videojs.dom.createEl('div', {
      className: 'vjs-setting-menu-main'
    }); // el.classList.addClass('vjs-hidden');

    return el;
  }
  /**
   * Update the menu based on the current state of its items.
   */
  ;

  _proto.update = function update() {
    console.log('update');
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
      name: 'ratio',
      options: this.getRatioMenu()
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

  _proto.getRatioList = function getRatioList() {
    this.options_['aspectRatio'] = ['16:9', '4:3'];
    this.options_['currentRatio'] = '16:9';
  };

  _proto.getQualityList = function getQualityList() {
    var _this2 = this;

    var currentSource = this.player().currentSource(); // this.player()['hls']

    var tech = this.player().tech().hls;
    var defaultQuality = this.options_['defaultQuality'];

    if (defaultQuality && defaultQuality.includes('p')) {
      defaultQuality = defaultQuality.replace('p', '');
    } // console.log('tech: ', tech);


    if (currentSource && (currentSource.type === 'application/x-mpegURL' || currentSource.type === 'application/dash+xml') && tech && tech.playlists && tech.playlists.master) {
      var masterDetails = tech.playlists.master; // console.log('masterDetails: ', masterDetails);

      var representations = masterDetails.playlists;

      if (this.options_['sources'] && (currentSource.src === representations[0].resolvedUri || representations[0].resolvedUri.includes(currentSource.src))) {
        return;
      }

      var sources = {};
      representations.forEach(function (el) {
        var height = el.attributes && el.attributes.RESOLUTION && el.attributes.RESOLUTION.height ? el.attributes.RESOLUTION.height.toString() : '240';

        if (!sources.hasOwnProperty(height)) {
          sources[height] = {
            src: el.resolvedUri && (el.resolvedUri.split(':')[0].length === 5 || el.resolvedUri.split(':')[0].length === 4) ? el.resolvedUri : el.resolvedUri.substr(2, el.resolvedUri.length - 1),
            //: currentSources.src
            label: el.attributes && el.attributes.RESOLUTION && el.attributes.RESOLUTION.height ? el.attributes.RESOLUTION.height.toString() : '240',
            type: currentSource.type
          };
        }

        if (defaultQuality && defaultQuality === height) {
          tech.playlists.media(el);

          tech.selectPlaylist = function () {
            return el;
          };
        }
      }); // In lower end browsers Object.values will not work;
      // this.options_['sources'] = Object.values(sources);
      // this.options_['sources'] = [sources[144]];

      this.options_['sources'] = Object.keys(sources).map(function (e) {
        return sources[e];
      });
      this.options_['sources'].push({
        src: currentSource.src,
        label: 'Auto',
        type: currentSource.type
      });
      this.options_['defaultQuality'] = defaultQuality || 'Auto'; // console.log(this.options_['sources']);
    } else if (currentSource && currentSource.type === 'video/mp4') {
      // console.log('here');
      var currentSources = this.player().currentSources();
      var _sources = [];
      var filterSources = this.options_['sources'] ? this.options_['sources'].filter(function (el) {
        return el.src === currentSources[0].src;
      }) : [];

      if (this.options_['sources'] && currentSource.src === currentSources[0].src && filterSources.length && filterSources[0].src === currentSource.src) {
        return;
      }

      currentSources.forEach(function (el) {
        if (el && el.label) {
          _sources.push({
            src: el.src,
            label: el.label,
            type: el.type
          });
        }

        if (defaultQuality && defaultQuality === el.label) {
          currentSource = {
            src: el.src,
            label: el.label,
            type: el.type
          };

          _this2.player().src(currentSource);
        }
      }); // console.log('sources: ', sources, this.player().currentSources());

      this.options_['sources'] = _sources;
      this.options_['defaultQuality'] = currentSource.label ? currentSource.label + 'p' : 'Auto';
    }

    if (this.options_['sources'] && this.options_['sources'].length) {
      this.options_['sources'] = this.options_['sources'].sort(function (a, b) {
        return parseInt(b.label, 10) - parseInt(a.label, 10);
      }); // currentSources = (currentSources && currentSources.type === 'video/mp4') ? currentSources : this.options_['sources'][this.options_['sources'].length - 1];
      // const defaultQuality = this.options_['defaultQuality']? this.options_['defaultQuality'].toString() : 'default';
      // this.playDefaultQuality(this.options_['sources'], currentSources, defaultQuality);
    }

    this.update();
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
    var _this3 = this;

    var currentSource = this.player().currentSource();
    var sources = this.options_['sources'] || []; // console.log('sources: ', sources, 'currentSrc: ', currentSource, this.options_, this.player_.getCache());

    var qualityOptions = sources.map(function (el) {
      // console.log(el.label, currentSource['label'], this.options_['defaultQuality'], (el.label === currentSource['label'] || el.label === this.options_['defaultQuality']));
      return {
        name: el.label === 'Auto' ? 'Auto' : el.label + 'p',
        value: el,
        isSelected: el.label === currentSource['label'] || el.label === _this3.options_['defaultQuality'],
        className: el.label === currentSource['label'] || el.label === _this3.options_['defaultQuality'] ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline',
        event: CHANGE_PLAYER_QUALITY,
        innerHTML: "<span class=\"vjs-setting-title\">" + (el.label === 'Auto' ? 'Auto' : el.label + 'p') + "</span>\n<span class=\"vjs-setting-icon vjs-quality " + (el.label === currentSource['label'] || el.label === _this3.options_['defaultQuality'] ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline') + "\"></span>"
      };
    });
    qualityOptions.splice(0, 0, {
      name: 'Quality',
      value: 'Quality',
      isSelected: false,
      className: 'vjs-icon-play',
      event: GO_TO_MAIN_MENU,
      innerHTML: "<span style=\"transform: rotate(180deg);\" class=\"vjs-setting-icon vjs-icon-play\"></span>\n                    <span class=\"vjs-setting-title\">Quality</span>"
    });
    return qualityOptions;
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

  _proto.getRatioMenu = function getRatioMenu() {
    var aspectRatio = this.options_['aspectRatio'];
    var currentAspectRatio = this.options_['currentRatio'];

    if (!aspectRatio || !currentAspectRatio) {
      return;
    }

    var ratioOptions = aspectRatio.map(function (el) {
      return {
        name: el,
        value: el,
        isSelected: el === currentAspectRatio,
        className: el === currentAspectRatio ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline',
        event: CHANGE_ASPECT_RATIO,
        innerHTML: "<span class=\"vjs-setting-title\">" + (el === 1 ? 'Normal' : el + 'x') + "</span>\n<span class=\"vjs-setting-icon vjs-ratio " + (el === currentAspectRatio ? 'vjs-icon-circle-inner-circle' : 'vjs-icon-circle-outline') + "\"></span>"
      };
    });
    ratioOptions.splice(0, 0, {
      name: 'Ratio',
      value: 'Ratio',
      isSelected: false,
      className: 'vjs-icon-play',
      event: GO_TO_MAIN_MENU,
      innerHTML: "<span style=\"transform: rotate(180deg);\" class=\"vjs-setting-icon vjs-icon-play\"></span>\n                    <span class=\"vjs-setting-title\">Ratio</span>"
    });
    return ratioOptions;
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

    if (requiredMenu.indexOf('aspect-ratio') > -1 && this.options_['aspectRatio'] && this.options_['aspectRatio'].length) {
      menu.push({
        name: 'Ratio',
        class: '',
        value: '16:9',
        event: TOGGLE_RATIO_MENU,
        innerHTML: "<span class=\"vjs-setting-title text-left\">Ratio</span>\n<span class=\"vjs-setting-icon vjs-setting-ratio\">16:9</span>"
      });
    }

    if (requiredMenu.indexOf('speed') > -1 && this.options_['speed'] && this.options_['speed'].length) {
      menu.push({
        name: 'Speed',
        class: '',
        value: 'Normal',
        event: TOGGLE_SPEED_MENU,
        innerHTML: "<span class=\"vjs-setting-title text-left\">Speed</span>\n<span class=\"vjs-setting-icon vjs-setting-speed\">Normal</span>"
      });
    } // show quality menu only when there is more than two quality (including auto)


    if (requiredMenu.indexOf('quality') > -1 && this.options_['sources'] && this.options_['sources'].length > 2) {
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

      _this.player.controlBar.el().insertBefore(_this.player.controlBar.settingButton.el(), _this.player.controlBar.fullscreenToggle.el());

      _this.player.controlBar.settingButton = _this.player.controlBar.addChild('settingMenuMain', _this.options);
    });

    return _this;
  }

  return SettingMenu;
}(Plugin); // Define default values for the plugin's `state` object here.


SettingMenu.defaultState = {}; // Include the version number.

SettingMenu.VERSION = version; // Register the plugin with video.js.

videojs.registerPlugin('settingMenu', SettingMenu);

export default SettingMenu;
