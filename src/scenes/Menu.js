
class Menu extends Phaser.Scene {

    constructor() {
        super("Menu");
    }

    create() {
        
        //this.add.text(0,0, "",{fontFamily: "mono"});
        this.add.text(0,0, "",{fontFamily: "kreon"});
        this.input.setDefaultCursor('url(assets/UI/SAxCursor.png), auto');
        
        this.text = this.add.bitmapText(game.config.width/2,100,"peaberry","IDK").setFontSize(48).setOrigin(0.5,0).setAlpha(0);
        this.tweens.add({
            targets: this.text,
            alpha: 1,
            duration: 3500,
            ease: "Quad.easeIn",
        }); 
          
        this.startButton = new TextButton(this, game.config.width / 2, 500, "Start", {fontSize: 30 }, "button_background",() => {
            this.cameras.main.fadeOut(1500);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("CombatScene");
                this.scene.run("HudScene");
            });
        }).setOrigin(0.5);
        this.tutorialButton = new TextButton(this, game.config.width / 2, 550, "Options", { fontSize: 20 },"button_background",() => { }).setOrigin(0.5);
        this.creditsButton = new TextButton(this, game.config.width / 2, 600, "Credits", { fontSize: 22 },"button_background", () => {
            
         }).setOrigin(0.5);

        this.tweenButtons();
    }

    tweenButtons() {
        this.tweens.add({
            targets: [this.startButton, this.startButton.img],
            y: 250,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 1500
        });
        this.tweens.add({
            targets: [this.tutorialButton, this.tutorialButton.img],
            y: 320,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 1500
        });
        this.tweens.add({
            targets: [this.creditsButton, this.creditsButton.img],
            y: 390,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 1500
        });
    }
}