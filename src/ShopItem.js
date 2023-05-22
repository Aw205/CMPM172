class ShopItem extends Phaser.GameObjects.DOMElement {


    constructor(scene, x, y, itemData) {

        super(scene, x, y);

        this.itemData = itemData;
        let imgHtml = null;
        if (itemData.type == "potion") {
            imgHtml = `<img src="assets/images/potions/${itemData.name}.png" class="pixelImg">`;
        }
        else {
            imgHtml = `<img src="assets/images/artifacts/${itemData.name}.png" class="pixelImg">`;
        }

        let html = `
                    <div id = "cont">
                    <div id="container" class="shop-slot">
                        ${imgHtml}
                        <span class="item-description"> <span style= "color: ${itemData.rarity}; "> ${itemData.name}</span> <br> ${itemData.description} </span>
                    </div> 
                    <img src="assets/images/coin.png" id= "img" width = "8" height = "8" style = "user-select: none; image-rendering: pixelated;"> 
                    <p id = "price" style= "user-select: none; pointer-events: none; font: 12px kreon; color: white; display: inline" > ${itemData.price} </p>
                    </div>`;
        this.createFromHTML(html);

        //let img = this.scene.textures.get(itemData.name).getSourceImage();
        //img.className = "pixelImg";
        //this.getChildByID("container").appendChild(img);
        //let originalImage = this.scene.textures.get(itemData.name).getSourceImage();
        //let clonedImageContainer = document.getElementById('container');
        //let clonedImage = originalImage.cloneNode();
        //clonedImage.setAttribute("id","works");
        //this.getBlobFromURL(originalImage.src);

        this.#createListeners();
        this.ele = this.getChildByID("cont");
        this.price = this.getChildByID("price");
    }

    getBlobFromURL(url) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = (e) => {
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = URL.createObjectURL(xhr.response);
            document.querySelector("#works").src = imageUrl;
        };
        xhr.send();
    }

    #createListeners() {

        this.getChildByID("container").addEventListener("pointerdown",() => {   
            if (document.getElementById("money-count").dataset.money >= parseInt(this.itemData.price)) {
                if (this.itemData.type == "potion") {
                    let numOpen = document.getElementById("potion-slots").dataset.openslots;
                    if (numOpen == "0") {
                        return;
                    }
                    document.getElementById("potion-slots").dataset.openslots = numOpen - 1;
                }
                this.ele.style.visibility = "hidden";
                this.scene.sound.play("coin_purchase",{volume: 0.5});
                this.scene.scene.get("HudScene").events.emit("itemPurchased", this.itemData);
                this.scene.scene.get("InventoryScene").events.emit("itemPurchased", this.itemData);
            }
        });
    }
}