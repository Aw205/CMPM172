class ShopScene extends Phaser.Scene {

    constructor() {
        super("ShopScene");

    }

    create() {

        this.offsetX = 100;
        this.offsetY = 150;
        this.items = [];

        this.add.nineslice(320,250,'shopFrame',null,520,400,6,6,6,6);
        let artifactWindow = this.add.nineslice(240, 380, 'goldFrame', null, 300, 100, 7, 7, 7, 7);

        let potionLabel = `<p style= "user-select: none; pointer-events: none; font: 28px kreon; color: tan;" > Potions </p>`;
        this.add.dom(130, 100).createFromHTML(potionLabel);

        let artifactLabel = `<p style= "user-select: none; pointer-events: none; font: 28px kreon; color: GoldenRod;" > Artifacts </p>`;
        this.add.dom(130, 300).createFromHTML(artifactLabel);

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

                let rand = Math.floor(Math.random() * 6);
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