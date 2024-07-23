class CampfireScene extends Phaser.Scene {

    constructor() {
        super("CampfireScene");
        this.level = 0;
    }

    create() {

        this.sound.play("campfire_music", { loop: true, volume: 0.2 });
        this.add.tween({
            targets: this.sound.get("campfire_music"),
            volume: 1,
            duration: 1000
        });

        this.scene.sendToBack();
        this.cameras.main.fadeIn(500);

        this.add.image(320, 240, "hillBackground").setPipeline("Light2D");
        this.campfire = this.add.sprite(320, 170, "campfire").play("campfireAnim").setScale(4).setPipeline("Light2D");

        this.createLights();
        this.createListeners();

        //this.scene.run("HudScene");
        this.scene.run("Typewriter",{dialogIndex: 0});


        this.shop = this.add.sprite(520, 120, "shop").setScale(1.8, 1.8).play("shop_anim").setPipeline("Light2D");
        this.shop.setInteractive({cursor: "pointer"});
        this.shop.on("pointerover", () => {
            this.shop.postFX.addGlow(0xC68E4C, 0.2);
        }).on("pointerout",()=>{
            this.shop.postFX.clear();
        }).on("pointerdown",()=>{
            this.merchant.emit("shop-open");
            this.scene.run("ShopScene");
        });


        this.sign = this.add.image(280, 270, "sign").setScale(2, 2).setPipeline("Light2D"); 
        this.sign.setInteractive({ cursor: "pointer" });
        this.sign.on("pointerover", () => {
            this.sign.postFX.addGlow(0xC68E4C, 0.2);
        }).on("pointerout", () => {
            this.sign.postFX.clear();
        }).on("pointerdown",()=>{
            this.cameras.main.fadeOut(1500);
            this.add.tween({
                targets: this.sound.get("campfire_music"),
                volume: 0,
                duration: 1500,
                onComplete: ()=>{
                    this.sound.get("campfire_music").stop();
                    this.scene.sleep().run("CombatScene", {level: this.level++});
                }
            });
        });

        this.add.image(320, 235, "rock_2").setPipeline("Light2D").setScale(1.1); 
        this.add.image(340, 230, "rock_1").setScale(0.8).setFlip(true).setPipeline("Light2D"); 
        this.add.image(300, 230, "rock_1").setPipeline("Light2D"); 

        this.merchant = this.add.sprite(420, 200, "merchant_idle").setFlipX(true).setScale(2).play("merchant_idle_anim").setPipeline("Light2D");

        this.merchant.on("shop-open", () => {
            this.merchant.play("merchant_shop_open_anim");
        });
        this.events.on("shop-close", () => {
            this.merchant.playReverse("merchant_shop_open_anim").chain("merchant_idle_anim");
        });
    }

    createLights() {

        this.lights.enable();
        this.lights.setAmbientColor(0x031213);
        this.campfireLight = this.lights.addLight(320, 230, 250, 0xd19b2e, 2);
        this.campfireTween = this.add.tween({
            targets: this.campfireLight,
            intensity: 1.5,
            ease: "Bounce.easeInOut",
            yoyo: true,
            repeat: -1
        });
        this.shopLight = this.lights.addLight(435,185,100,0xe5a25d,0.5);
        this.shopLight2 = this.lights.addLight(600,185,100,0xe5a25d,0.5);
    }

    createListeners() {
        this.events.on("wake", () => {
            this.cameras.main.fadeIn(500);
            this.sound.play("campfire_music", { loop: true, volume: 0.2 });
            this.add.tween({
                targets: this.sound.get("campfire_music"),
                volume: 1,
                duration: 500,
                onComplete: () =>{
                    this.scene.run("Typewriter",{dialogIndex: this.level});
                }
            });

           
        });
    }

}
