
class ArtifactSlot extends Phaser.GameObjects.Image {

    constructor(scene, x, y, element) {
        super(scene, x, y);
        this.ele = element;
        this.currentArtifact = null;

        this.scene.add.existing(this);
    }

    addArtifact(itemData, itemLabel) {

        this.currentArtifact = itemData.name;
        this.setTexture(itemData.name);
        this.ele.style.borderBottomColor = itemData.rarity;
        this.ele.innerHTML = itemLabel;
    }

}