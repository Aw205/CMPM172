class PotionSlot extends Phaser.GameObjects.GameObject {


    constructor(scene,element) {
        super(scene);
        this.ele = element;
        this.currentPotion = null;
    }

    addPotion(itemData) {

        this.currentPotion = itemData.name;
        this.ele.style.borderBottomColor = itemData.rarity;
        this.ele.innerHTML = `<div class="item-description"> <span style= "color: ${itemData.rarity}; "> ${itemData.name}</span> <br> ${itemData.description} </div>`

        let img = this.scene.textures.get(itemData.name).getSourceImage(); // need to change this, create clone instead
        img.style.imageRendering = "pixelated";
        this.ele.appendChild(img);
    }
}