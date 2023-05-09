class HudScene extends Phaser.Scene {

    constructor() {
        super("HudScene");

    }

    create() {
        this.createUI();
    }

    createUI() {
        // let backgroundHTML = `<div style= "height: 30px; width: 100px; background-image: linear-gradient(to right, black,80%,transparent);"> </div>`;
        // let background = this.add.dom(50, 25).createFromHTML(backgroundHTML);

        this.createHeartUI();
        this.createMoneyUI();
        this.createPotionSlotUI();
        this.createArtifactSlotUI();
       

        let backpackHtml = `
                        <div id= "backpack-ui" style = "cursor: pointer">
                            <img src="assets/UI/backpack.png" class = "pixelImg">
                        </div>`;
        let backpackDom = this.add.dom(590, 170).createFromHTML(backpackHtml);
        backpackDom.getChildByID("backpack-ui").addEventListener("pointerdown", () => {
            this.scene.run("InventoryScene");
            this.scene.get("CampfireScene").events.emit("setInvisible");
        });
    }

    createHeartUI() {

        let healthHtml = `
                        <link rel = "stylesheet" href= "./src/hud.css">
                        <div id= "healthui">
                            <span class="tooltiptext" >yo health</span> 
                            <img src="assets/images/heart.png" class = "pixelImg">
                            <p id = "healthpoints"> 100 </p>
                        </div>`;
        let healthDom = this.add.dom(100, 45).createFromHTML(healthHtml);
    }

    createMoneyUI() {

        let moneyHtml = `  
                    <div id= "money-ui">
                        <span class="tooltiptext" >yo monies</span> 
                        <img src="assets/images/monies.png" class = "pixelImg">
                        <p id = "money-count" data-money = "500" > 500 </p>
                    </div>`;
        let moneyDom = this.add.dom(160, 45).createFromHTML(moneyHtml);
        let playerMoney = moneyDom.getChildByID("money-count");

        playerMoney.changeTo = (newVal) => {
            playerMoney.dataset.money = newVal;
            this.tweens.addCounter({
                from: parseInt(playerMoney.innerText),
                to: newVal,
                duration: 500,
                onUpdate: tween => {
                    playerMoney.innerText = Math.floor(tween.getValue());
                }
            });
            this.events.emit("playerMoneyChanged", newVal);
        };
        this.events.on("itemPurchased", (itemData) => {
            let newVal = parseInt(playerMoney.dataset.money) - itemData.price;
            playerMoney.changeTo(newVal);
        });

    }

    createPotionSlotUI() {

        let potionHtml = `
        <div id = "potion-slots" data-openslots = "3" style = "border-style: solid; border-radius: 10px; border-color: rgb(30, 30, 30); display: flex;">
            <div class = "potion-slot" id ="p1">
                <span class="tooltiptext" >Potion Slot</span>  
            </div>
            <div class = "potion-slot" id ="p2" >
                <span class="tooltiptext" >Potion Slot</span>  
            </div>
            <div class = "potion-slot" id ="p3">
                <span class="tooltiptext" >Potion Slot</span>  
            </div>
        </div>`;
        let potionDom = this.add.dom(610, 80).createFromHTML(potionHtml);

        let pslots = [];
        pslots.push(new PotionSlot(this, 510 + 13, 90, potionDom.getChildByID("p1")));
        pslots.push(new PotionSlot(this, 548 + 13, 90,potionDom.getChildByID("p2")));
        pslots.push(new PotionSlot(this, 586 + 13, 90 ,potionDom.getChildByID("p3")));

        this.events.on("itemPurchased", (itemData, itemLabel) => {
            if (itemData.type == "potion") {
                for (let slot of pslots) {
                    if (slot.currentPotion == null) {
                        slot.addPotion(itemData, itemLabel);
                        break;
                    }
                }
            }
        });

    }

    createArtifactSlotUI() {

        let artifactHtml = `
        <div style = "border-style: solid; border-radius: 10px; border-color: rgb(30, 30, 30); display: flex;">
            <div class = "artifact-slot" id ="a1">
                <span class="tooltiptext" >Artifact Slot</span>  
            </div>
            <div class = "artifact-slot" id ="a2" >
                <span class="tooltiptext" >Artifact Slot</span>  
            </div>
            <div class = "artifact-slot" id ="a3">
                <span class="tooltiptext" >Artifact Slot</span>  
            </div>
        </div>`;
        let artifactDom = this.add.dom(620, 30).createFromHTML(artifactHtml);

        let slots = [];
        slots.push(new ArtifactSlot(this, 510 + 10, 40, artifactDom.getChildByID("a1")));
        slots.push(new ArtifactSlot(this, 548 + 10, 40, artifactDom.getChildByID("a2")));
        slots.push(new ArtifactSlot(this, 586 + 10, 40, artifactDom.getChildByID("a3")));

        this.events.on("equipItem", (artifactData,itemLabel) => {
            for (let slot of slots) {
                if(slot.currentArtifact == artifactData.name){
                    break;
                }
                if (slot.currentArtifact == null) {
                    let itemLabel = `<div class ="item-description"> <span style= "color: ${artifactData.rarity}; "> ${artifactData.name}</span> <br> ${artifactData.description} 
                                     </div>`
                    slot.addArtifact(artifactData,itemLabel);
                    break;
                }
            }
        });
    }
}