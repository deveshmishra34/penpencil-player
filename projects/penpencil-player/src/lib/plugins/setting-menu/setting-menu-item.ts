import videojs from 'video.js';
import SettingMenuSubItem from './setting-menu-sub-item';

const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

// Default options for the plugin.
const defaults = {};


// This is for creating multiple menu
class SettingMenuItem extends Component {

  constructor(player, options) {
    super(player, options);

    this.options = videojs.mergeOptions(defaults, options);

    const subMenu = this.options_['options'] || [];
    this.update(subMenu);
    this.el()['classList'].add('vjs-hidden'); // initial all the menu will be hidden
  }

  createEl() {
    const el = videojs.dom.createEl('div', {
      className: `vjs-settings-menu-${this.options_['name']} `,
    });

    return el;
  }

  /**
   * Update the menu based on the current state of its items.
   */
  update(subMenu) {
    const menu = this.createMenu(subMenu);
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

  createMenu(subMenu) {
    const menu = new Menu(this.player_);
    if (subMenu && subMenu.length) {
      for (let i = 0; i < subMenu.length; i++) {
        const subItem = new SettingMenuSubItem(this.player_, subMenu[i]);
        menu.addChild(subItem);
      }
    }

    return menu;
  }
}

Component.registerComponent('SettingMenuItem', SettingMenuItem);
export default SettingMenuItem;
