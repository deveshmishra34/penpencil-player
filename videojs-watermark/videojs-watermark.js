/*! @name videojs-watermark @version 1.0.0 @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global = global || self, global.videojsWatermark = factory(global.videojs));
}(this, function (videojs) { 'use strict';

  videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var version = "1.0.0";

  var Plugin = videojs.getPlugin('plugin'); // Default options for the plugin.

  var defaults = {
    position: 'top-right',
    fadeIn: 2000,
    fadeOut: 5000,
    after: 10000,
    url: '',
    image: '',
    text: '',
    width: 0,
    height: 0
  };
  /**
   * An advanced Video.js plugin. For more information on the API
   *
   * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
   */

  var Watermark =
  /*#__PURE__*/
  function (_Plugin) {
    _inheritsLoose(Watermark, _Plugin);

    /**
     * Create a Watermark plugin instance.
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
    function Watermark(player, options) {
      var _this;

      // the parent class will add player under this.player
      _this = _Plugin.call(this, player) || this;
      _this.options = videojs.mergeOptions(defaults, options);

      _this.player.ready(function () {
        _this.player.addClass('vjs-watermark'); // if there is no image or text just exit


        if (!_this.options.image && !_this.options.text) {
          return;
        }

        _this.setupWatermark(player, _this.options);

        player.on('loadedmetadata', function () {
          // console.log(this.player.videoHeight(), this.player.videoWidth());
          if (_this.timeInterval) return;

          if (!_this.options.height) {
            _this.options.height = (_this.player.videoHeight() ? _this.player.videoHeight() : _this.player.el_.clientHeight) - 100;
          }

          if (!_this.options.width) {
            _this.options.width = (_this.player.videoWidth() ? _this.player.videoWidth() : _this.player.el_.clientWidth) - 100;
          }

          _this.timeInterval = setInterval(function () {
            var watermarkEle = document.getElementsByClassName('vjs-watermark-content');

            if (watermarkEle && watermarkEle[0]) {
              var top_bottom = _this.getRandomInt(_this.options.height);

              var left_right = _this.getRandomInt(_this.options.width); // console.log('top_bottom: ', top_bottom, 'left_right: ', left_right);


              watermarkEle[0].classList.remove('vjs-watermark-fade-out');
              watermarkEle[0].classList.add('vjs-watermark-fade-in');
              watermarkEle[0].style.top = top_bottom + 'px';
              watermarkEle[0].style.right = left_right + 'px';

              _this.fadeWatermark(_this.options);
            }
          }, _this.options.after);
        }); // player.on('pause', () => {
        //   // console.log('pause');
        //   clearInterval(timeInterval)
        // });

        player.on('ended', function () {
          // console.log('Finish');
          clearInterval(_this.timeInterval);
        });
      });

      return _this;
    }

    var _proto = Watermark.prototype;

    _proto.setupWatermark = function setupWatermark(player, options) {
      // console.log('setupWatermark');
      // Add a div and img tag
      var videoEl = player.el();
      var div = document.createElement('div');
      var p = document.createElement('p');
      var img = document.createElement('img');
      div.classList.add('vjs-watermark-content');
      div.classList.add("vjs-watermark-" + options.position);
      div.classList.add("vjs-watermark-fade-out");
      p.classList.add("vjs-watermark-text"); // if a url is provided make the image link to that URL.

      if (options.url) {
        var a = document.createElement('a');
        a.href = options.url; // if the user clicks the link pause and open a new window

        a.onclick = function (e) {
          e.preventDefault();
          player.pause();
          window.open(options.url);
        };

        if (options.image) {
          img.src = options.image;
          a.appendChild(img);
        }

        if (options.text) {
          p.innerHTML = options.text;
          a.appendChild(p);
        }

        div.appendChild(a);
      } else {
        if (options.image) {
          img.src = options.image;
          div.appendChild(img);
        }

        if (options.text) {
          p.innerText = options.text;
          div.appendChild(p);
        }
      }

      videoEl.appendChild(div); // this.options.width = div.clientWidth;
      // this.options.height = div.clientHeight;
      // console.log('div: ', div, div.clientWidth, div.clientHeight)
    };

    _proto.fadeWatermark = function fadeWatermark(options) {
      var _this2 = this;

      setTimeout(function () {
        // document.getElementsByClassName('vjs-watermark-content')[0].classList.add('vjs-watermark-fade-out');
        _this2.eleClassAction(document.getElementsByClassName('vjs-watermark-content'), 'vjs-watermark-fade-out');
      }, options.fadeOut);
    };

    _proto.getRandomInt = function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    };

    _proto.dispose = function dispose() {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }

      _Plugin.prototype.dispose.call(this);
    };

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

    return Watermark;
  }(Plugin); // Define default values for the plugin's `state` object here.


  Watermark.defaultState = {}; // Include the version number.

  Watermark.VERSION = version; // Register the plugin with video.js.

  videojs.registerPlugin('watermark', Watermark);

  return Watermark;

}));
