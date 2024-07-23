'use strict';

let config = {
  type: Phaser.WEBGL,
  parent: window,
  // width: 800, 
  // height: 450,
  width: 640,
  height: 480,
  resolution: window.devicePixelRatio,
  scene: [LoadingScreen,Menu,CombatScene,ShopScene,HudScene,InventoryScene,
    CampfireScene,SettingsScene,RewardsScene,AffinitySelectionScene,CreditsScene,
  Typewriter],
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