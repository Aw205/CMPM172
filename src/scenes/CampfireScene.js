class CampfireScene extends Phaser.Scene {

    constructor() {
        super("CampfireScene");
    }

    create() {

        this.sound.play("campfire_music", { loop: true });
        this.scene.sendToBack();

        this.add.image(320, 240, "hillBackground").setPipeline("Light2D");
        this.campfire = this.add.sprite(320, 170, "campfire").play("campfireAnim").setScale(4).setPipeline("Light2D");

        this.createLights();
        this.createSelectionButtons();
        this.createListeners();

        let dayHTML = `<p style = "font: 16px kreon; color: wheat; user-select: none; pointer-events: none; border-bottom: solid wheat;">Night 1</p>`;
        let day = this.add.dom(30, 30).createFromHTML(dayHTML);

        
    }

    createSelectionButtons() {

        let html = ` 
                <link rel = "stylesheet" href= "./src/SelectionButton.css">
                <button class="select" id = "sleep" >Sleep</button>
                <button class="select" id = "fight" >Fight</button>
                <button class="select" id = "shop"" >Shop</button> `;
        this.selection = this.add.dom(210, 240).createFromHTML(html);

        this.selection.getChildByID("fight").addEventListener("click", () => {
            this.scene.sleep().run("CombatScene");
        });
        this.selection.getChildByID("shop").addEventListener("click", () => {
            this.selection.setVisible(false);
            this.scene.pause().run("ShopScene");
        });
        this.selection.getChildByID("sleep").addEventListener("click", () => {
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
    }

    createListeners(){
        this.events.on("setInvisible", () => {
            this.selection.setVisible(false);
        });
        this.events.on("setVisible", () => {
            this.selection.setVisible(true);
        });
    }

}
