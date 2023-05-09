class PotionSlot extends Phaser.GameObjects.Image {


    constructor(scene, x, y, element) {
        super(scene, x, y);
        this.ele = element;
        this.currentPotion = null;
        this.scene.add.existing(this);
    }

    addPotion(itemData, itemLabel) {

        this.currentPotion = itemData.name;
        this.setTexture(itemData.name);
        this.ele.style.borderBottomColor = itemData.rarity;
        this.ele.innerHTML = itemLabel;
    }
}