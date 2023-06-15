
class Menu extends Phaser.Scene {

    constructor() {
        super("Menu");
    }

    create() {

        this.input.setDefaultCursor('url(assets/UI/SAxCursor.png), auto');
        this.sound.play("menu_music",{loop: true});

        this.createMenuButtons();
        this.createLights();
        this.createBackground();

        let titleHTML = `<p style = "color: Wheat; font: 36px kreon;" > Squish the Slime </p>`;
        this.title = this.add.dom(320, 50).createFromHTML(titleHTML);

        this.anims.create({ key: "campfireAnim", frames: "campfire", frameRate: 12, repeat: -1 });
        this.anims.create({ key: "campfireEndAnim", frames: "campfireEnd", frameRate: 10 });
        this.campfire = this.add.sprite(320, 330, "campfire").play("campfireAnim").setPipeline("Light2D");
    }

    createBackground() {

        let textures = ["sky", "far_mountains", "grassy_mountains", "clouds_mid_t", "hill", "clouds_front"];
        this.parallaxLayers = [];
        let speed = 0.2;

        for (let t of textures) {
            let layer = this.add.image(320, 240, t).setScale(2).setPipeline("Light2D");
            if (t == "clouds_mid_t" || t == "clouds_front") {
                this.parallaxLayers.push(layer);
                let clone = this.add.image(1088, 240, t).setScale(2).setPipeline("Light2D");
                this.parallaxLayers.push(clone);
                layer.speed = speed;
                clone.speed = speed;
                speed += 0.2;
            }
        }
    }

    createLights() {

        this.lights.enable();
        this.lights.setAmbientColor(0x031213);
        this.campfireLight = this.lights.addLight(320, 330, 170, 0xd19b2e, 0.7);
        this.campfireTween = this.add.tween({
            targets: this.campfireLight,
            intensity: 0.8,
            ease: "Bounce.easeInOut",
            yoyo: true,
            repeat: -1
        });
    }

    update() {

        for (let l of this.parallaxLayers) {
            l.x -= l.speed;
            if (Math.floor(l.x) == -384) {
                l.setPosition(1152, 240);
            }
        }
    }

    createMenuButtons() {

        let html = `
                    <link rel="stylesheet" type= "text/css" href="./src/MenuButton.css">
                     <div id = "menuContainer">
                        <button class = "menu" id = "start"  >Start</button>
                        <button class = "menu" id = "tutorial"  >Tutorial</button>
                        <button class = "menu" id = "credits"  >Credits</button>
                    </div>`;
        this.selection = this.add.dom(100, 300).createFromHTML(html);
        this.selection.getChildByID("start").addEventListener("pointerup", () => {
            this.campfireTween.stop();
            this.add.tween({
                targets: [this.selection,this.title],
                alpha: 0
            });
            this.time.delayedCall(200, () => {
                this.campfire.play('campfireEndAnim');
            });
            this.add.tween({
                targets: this.sound.get("menu_music"),
                volume: 0,
                duration: 2000
            });
            this.add.tween({
                targets: this.campfireLight,
                radius: 0,
                intensity: 0,
                duration: 2000,
                ease: "Linear",
                onComplete: () => {
                    this.cameras.main.fadeOut(500);
                    this.sound.get("menu_music").pause();
                    this.cameras.main.once("camerafadeoutcomplete", () => {
                        //this.scene.start("VictoryScene");
                        this.scene.start("AffinitySelectionScene");
                    });
                }
            });
        });
        this.selection.getChildByID("tutorial").addEventListener("pointerup", () => {
            this.scene.sleep().run("TutorialScene");
        });
        this.selection.getChildByID("credits").addEventListener("pointerup", () => {
            this.scene.sleep().run("CreditsScene");
        });
    }
}