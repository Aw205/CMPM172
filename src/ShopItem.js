class ShopItem extends Phaser.GameObjects.Image {


    constructor(scene, x, y, texture, itemData) {
        super(scene, x, y, texture);

        this.itemData = itemData;
        this.setTexture(itemData.name);

        let priceHTML = ` <img src="assets/images/coin.png" width = "8" height = "8"> 
                          <p id = "price" style= "user-select: none; pointer-events: none; font: 12px kreon; color: white; display: inline" > ${itemData.price} </p>`;
        this.price = this.scene.add.dom(x, y + 30,).createFromHTML(priceHTML).setDepth(-1);

        this.labelHTML = `<p id = "item" style= "width: 100px; padding: 10px; border-style: double; border-radius: 10px; background-color: rgb(20, 20, 20); font: 12px kreon; color: white" >
        <span style= "color: ${itemData.rarity}; "> ${itemData.name}</span> <br> ${itemData.description} </p>`;

        this.descriptionLabel = this.scene.add.dom(0, 0).createFromHTML(this.labelHTML).setVisible(false);

        this.labelHTML = `<div class ="item-description">
                            <span style= "color: ${itemData.rarity}; "> ${itemData.name}</span> <br> ${itemData.description} 
                         </div>`
        this.setInteractive({ useHandCursor: true });
        this.#createListeners();

        this.scene.add.existing(this);
    }

    #createListeners() {
        this.on("pointerover", (pointer, localX, localY, event) => {
            this.setScale(1.5);
            this.descriptionLabel.setVisible(true);
        });
        this.on("pointermove", (pointer, localX, localY, event) => {
            this.descriptionLabel.setPosition(pointer.worldX + 8, pointer.worldY + 60);
        });
        this.on("pointerout", (pointer, event) => {
            this.setScale(1);
            this.descriptionLabel.setVisible(false);
        });
        this.scene.input.on("gameout", () => {
            this.setScale(1);
            this.descriptionLabel.setVisible(false);
        });
        this.on("pointerdown", (pointer, localX, localY) => {
            if (document.getElementById("money-count").dataset.money >= parseInt(this.itemData.price)) {
                if (this.itemData.type == "potion") {
                    let numOpen = document.getElementById("potion-slots").dataset.openslots;
                    if (numOpen == "0") {
                        return;
                    }
                    document.getElementById("potion-slots").dataset.openslots = numOpen - 1;
                }
                this.setVisible(false);
                this.price.setVisible(false);
                this.scene.scene.get("HudScene").events.emit("itemPurchased", this.itemData, this.labelHTML);
            }
        });
    }
}