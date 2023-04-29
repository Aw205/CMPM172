class ArtifactSlot extends Phaser.GameObjects.NineSlice {


    constructor(scene, x, y, texture) {
        super(scene, x, y, texture,null,32,32,7,7,7,7);

        this.#createDescription();
        this.#createListeners();

        this.currentArtifact = null;
        this.descriptionLabel = this.emptyLabel;

        this.scene.add.existing(this);
    }

    addArtifact(itemData,itemLabel){

        this.currentArtifact = itemData.name;
        this.scene.add.image(this.x,this.y,itemData.name);
        //this.descriptionLabel = itemLabel;

    }

    #createListeners() {

        this.setInteractive();
        this.on("pointerover", () => {
            this.setTint(0xFFFF00);
            this.descriptionLabel.setVisible(true);
        });
        this.on("pointermove", (pointer, localX, localY, event) => {
            this.descriptionLabel.setPosition(pointer.worldX + 8, pointer.worldY + 60);
        });
        this.on("pointerout", () => {
            this.clearTint();
            this.descriptionLabel.setVisible(false);
        });
    }

    #createDescription() {
        let labelHTML = `<p style= "padding: 10px; border-style: double; border-radius: 10px; background-color: rgb(20, 20, 20); font: 12px kreon; color: tan" >Artifact Slot</p>`;
        this.emptyLabel = this.scene.add.dom(0, 0).createFromHTML(labelHTML).setVisible(false);
    }


}