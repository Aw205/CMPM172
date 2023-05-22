class ShopScene extends Phaser.Scene {

    constructor() {
        super("ShopScene");
    }

    create() {

        this.items = [];
        let windowHTML = ` 
        <p style= "user-select: none; pointer-events: none; font: 28px kreon; color: tan; margin: 0px;" > Potions </p>
        <div id = "potion-grid" class="grid-container"></div>
        <p style= "user-select: none; pointer-events: none; font: 28px kreon; color: GoldenRod; margin: 0px;" > Artifacts </p>
        <div id = "artifact-grid" class="grid-container"></div>`;
        this.grid = this.add.dom(30, 180).createFromHTML(windowHTML).setAlpha(0);

        this.loadShopItems();
        this.displayPotions();
        this.displayArtifacts();

        this.shopWindowTransition(true);

        this.scene.get("HudScene").events.on("playerMoneyChanged", (newVal) => {
            for (let item of this.items) {
                if (item.itemData.price > newVal) {
                    item.price.style.color = "red";
                }
            }
        });

        let returnHTML = ` <button id = "return" style = "font: 12px kreon; color: black; border-radius: 2px; background-color: Gray; margin: 10px;" >Return</button>`;
        let returnButton = this.add.dom(530, 400).createFromHTML(returnHTML);
        returnButton.getChildByID("return").addEventListener("pointerup", () => {
            this.shopWindowTransition(false);
        });

        this.events.on("wake",(sys,data)=>{
            this.shopWindowTransition(true);
        });

    }

    loadShopItems() {
        this.potionsMap = new Map();
        let data = this.cache.json.get("potions");
        for (let i = 0; i < data.length; i++) {
            this.potionsMap.set(i, data[i]);
        }
        this.artifactsMap = new Map();
        let artifactData = this.cache.json.get("artifacts");
        for (let i = 0; i < artifactData.length; i++) {
            this.artifactsMap.set(i, artifactData[i]);
        }
    }

    displayPotions() {

        let arr = Array.from(Array(this.potionsMap.size).keys());
        this.shuffle(arr);

        for (let i = 0; i < 6; i++) {
            let itemData = this.potionsMap.get(arr[i]);
            itemData.type = "potion";
            let item = new ShopItem(this, 0, 0, itemData);
            this.items.push(item);
            this.grid.getChildByID("potion-grid").appendChild(item.getChildByID("cont"));
        }
    }

    displayArtifacts() {

        let arr = Array.from(Array(this.artifactsMap.size).keys());
        this.shuffle(arr);

        for (let i = 0; i < 3; i++) {
            let itemData = this.artifactsMap.get(arr[i]);
            itemData.type = "artifact";
            let artifactItem = new ShopItem(this, 0, 0, itemData);
            this.items.push(artifactItem);
            this.grid.getChildByID("artifact-grid").appendChild(artifactItem.getChildByID("cont"));
        }
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }


    shopWindowTransition(isTransitionIn) {
        if (isTransitionIn) {
            return this.tweens.add({
                targets: this.grid,
                x: 100,
                duration: 300,
                alpha: 1,
                ease: "Linear",
            });
        }
        this.tweens.add({
            targets: this.grid,
            x: 30,
            duration: 300,
            alpha: 0,
            ease: "Linear",
            onComplete: () => {
                this.scene.sleep();
                this.scene.get("CampfireScene").events.emit("setVisible");
            }
        });
    }
}