class CampfireScene extends Phaser.Scene {

    constructor() {
        super("CampfireScene");
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
        this.createSelectionButtons();
        this.createListeners();

    }

    createSelectionButtons() {

        let html = ` 
                <link rel = "stylesheet" href= "./src/SelectionButton.css">
                <button class="select" id = "sleep" >Sleep</button>
                <button class="select" id = "fight" >
                <div style= "display: block;">
                    <div> Fight </div>
                    <div id="floor-num" style="font-size: 12px; color: BurlyWood"> Floor 1 </div>
                </div>
                </button>
                <button class="select" id = "shop"" >Shop</button> `;
        this.selection = this.add.dom(210, 240).createFromHTML(html);

        this.level = 0;

        this.selection.getChildByID("fight").addEventListener("click", () => {
            this.cameras.main.fadeOut();
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.sleep().run("CombatScene",{level: this.level});
                this.level++;
                this.selection.getChildByID("floor-num").innerText = `Floor ${this.level+1}`;

            });
            // this.add.tween({
            //     targets: this.selection,
            //     alpha: 0
            // });
        });
        this.selection.getChildByID("shop").addEventListener("click", () => {
            this.add.tween({
                targets: this.selection,
                alpha: 0,
                duration:200,
                onComplete:()=>{
                    this.scene.run("ShopScene");
                }
            });
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
            //this.selection.setVisible(false);
            this.add.tween({
                targets: this.selection,
                alpha: 0,
                duration:200,
            });
        });
        this.events.on("setVisible", () => {
            this.selection.setVisible(true);
            this.add.tween({
                targets: this.selection,
                alpha: 1,
                duration:200,
            });
        });
        this.events.on("wake",()=>{
            this.cameras.main.fadeIn(500);
        });
    }

}
