class PotionSlot extends Phaser.GameObjects.Image {


    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.#createDescription();
        this.#createListeners();

        this.currentPotion = null;
        this.descriptionLabel = this.emptyLabel;

        this.scene.add.existing(this);
    }

    addPotion(itemData,itemLabel){

        this.currentPotion = itemData.name;
        this.setTexture(itemData.name);
        this.descriptionLabel = itemLabel;

    }

    #createListeners() {

        this.setInteractive();
        this.on("pointerover", () => {
            this.preFX.addGlow(0xD2B48C, 1, 0);
            this.descriptionLabel.setVisible(true);
        });
        this.on("pointermove", (pointer, localX, localY, event) => {
            this.descriptionLabel.setPosition(pointer.worldX + 8, pointer.worldY + 60);
        });
        this.on("pointerout", () => {
            this.clearFX();
            this.descriptionLabel.setVisible(false);
        });
    }

    #createDescription() {
        let labelHTML = `<p id= "description" style= "padding: 10px; border-style: double; border-radius: 10px; background-color: rgb(20, 20, 20); font: 12px kreon; color: tan" >Potion Slot </p>`;
        this.emptyLabel = this.scene.add.dom(0, 0).createFromHTML(labelHTML).setVisible(false);
    }


}