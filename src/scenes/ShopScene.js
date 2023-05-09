class ShopScene extends Phaser.Scene {

    constructor() {
        super("ShopScene");

    }

    create() {

        this.offsetX = 120;
        this.offsetY = 180;
        this.items = [];

        let win = this.add.nineslice(320,280,'shopFrame',null,520,330,6,6,6,6);
        let artifactWindow = this.add.nineslice(240, 380, 'goldFrame', null, 300, 100, 7, 7, 7, 7);

        let potionLabel = `<p style= "user-select: none; pointer-events: none; font: 28px kreon; color: tan;" > Potions </p>`;
        this.add.dom(130, 140).createFromHTML(potionLabel).setDepth(-1);

        let artifactLabel = `<p style= "user-select: none; pointer-events: none; font: 28px kreon; color: GoldenRod;" > Artifacts </p>`;
        this.add.dom(135, 310).createFromHTML(artifactLabel);

        this.loadShopItems();
        this.displayPotions();
        this.displayArtifacts();

        this.scene.get("HudScene").events.on("playerMoneyChanged", (newVal) => {
            for (let item of this.items) {
                if (item.itemData.price > newVal) {
                    item.price.getChildByID("price").style.color = "red";
                }
            }
        });

        let returnHTML = ` <button id = "return" style = "font: 12px kreon; color: black; border-radius: 2px; background-color: Gray; margin: 10px;" >Return</button>`;
        let returnButton = this.add.dom(530, 400).createFromHTML(returnHTML);
        returnButton.getChildByID("return").addEventListener("pointerup",()=>{
             this.scene.sleep();
             this.scene.get("CampfireScene").events.emit("setVisible");
             this.scene.run("CampfireScene");
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
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 3; col++) {
                let itemData = this.potionsMap.get(arr[row*3 + col]);
                itemData.type = "potion";
                let item = new ShopItem(this, this.offsetX + col * 70, this.offsetY + row * 70, null, itemData);
                this.items.push(item);
            }
        }
    }

    displayArtifacts() {

        let arr = Array.from(Array(this.artifactsMap.size).keys());
        this.shuffle(arr);

        for (let i = 0; i < 3; i++) {
            let itemData = this.artifactsMap.get(arr[i]);
            itemData.type = "artifact";
            let artifactItem = new ShopItem(this,120 + i * 100, 360, null, itemData);
            artifactItem.preFX.addShine();
            this.items.push(artifactItem);
        }
    }

    shuffle(array){
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}