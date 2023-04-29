class ShopItem extends Phaser.GameObjects.Image{


    constructor(scene, x, y, texture, itemData) {
        super(scene, x, y, texture);

        this.itemData = itemData;
        this.setTexture(itemData.name);

        this.coin = this.scene.add.image(x-5,y+30,"coin").setScale(0.5);
        let priceHTML = `<p id = "price" style= "user-select: none; pointer-events: none; font: 12px kreon; color: white" > ${itemData.price} </p>`;
        this.price = this.scene.add.dom(x+10,y+30,).createFromHTML(priceHTML);

        let labelHTML = `<p style= "width: 100px; padding: 10px; border-style: double; border-radius: 10px; background-color: rgb(20, 20, 20); font: 12px kreon; color: white" >
        <span style= "color: ${itemData.rarity}; "> ${itemData.name}</span> <br> ${itemData.description} </p>`;
        this.descriptionLabel= this.scene.add.dom(0,0).createFromHTML(labelHTML).setVisible(false);

        this.setInteractive({useHandCursor: true });
        this.#createListeners();

        this.scene.add.existing(this);
    }

    #createListeners(){
        this.on("pointerover",(pointer,localX,localY,event)=>{
            this.setScale(1.5);
            this.descriptionLabel.setVisible(true);
            this.descriptionLabel.setDepth(100);
        });
        this.on("pointermove", (pointer, localX, localY, event) => {
            this.descriptionLabel.setPosition(pointer.worldX + 8, pointer.worldY + 60);
        });
        this.on("pointerout", (pointer, event) => {
            this.setScale(1);
            this.descriptionLabel.setVisible(false);
        });
        this.on("pointerdown",(pointer,localX,localY)=>{

            if(document.getElementById("money").dataset.money >= parseInt(this.itemData.price)){

                this.setVisible(false);
                this.coin.setVisible(false);
                this.price.setVisible(false);
                this.scene.scene.get("HudScene").events.emit("itemPurchased",this.itemData,this.descriptionLabel);
            }
        });
    }
}