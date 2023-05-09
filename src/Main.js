'use strict';

let cursors;
let config = {
  type: Phaser.WEBGL,
  parent: window,
  width: 640,
  height: 480,
  resolution: window.devicePixelRatio,
  physics: {
    default: 'arcade',
    arcade: {
      //debug: true
    }
  },
  scene: [LoadingScreen,Menu,DialogModal,CombatScene,ShopScene,HudScene,InventoryScene,CampfireScene,SettingsScene],
  scale: {
    mode: Phaser.Scale.FIT,
  },
  dom: {
    createContainer: true
  },
  autoCenter: true,
  pixelArt: true,
  plugins: {
  }
};

let game = new Phaser.Game(config);