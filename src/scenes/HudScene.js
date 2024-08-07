class HudScene extends Phaser.Scene {

    constructor() {
        super("HudScene");

    }

    create() {
        this.createUI();
    }

    createUI() {

        this.createMoneyUI();
        this.createPotionSlotUI();
        this.createArtifactSlotUI();
       
        // let backpackHtml = `
        //                 <div id= "backpack-ui" style = "cursor: pointer; scale: 0.5;">
        //                     <img src="assets/UI/encyclopedia.png" class = "pixelImg">
        //                 </div>`;
        // let backpackDom = this.add.dom(580, 170).createFromHTML(backpackHtml);
        // backpackDom.getChildByID("backpack-ui").addEventListener("pointerdown", () => {
        //     if(this.scene.isActive("InventoryScene")){
        //         return this.scene.get("InventoryScene").sleepTransition();
        //     }
        //     this.scene.run("InventoryScene",{artifactSlots: this.slots});
        // });
    }

    createMoneyUI() {

        let moneyHtml = `  
                    <div id= "money-ui">
                        <span class="tooltiptext">Gold</span> 
                        <img src="assets/images/monies.png" style="user-select:none;image-rendering:pixelated;">
                        <p id = "money-count" data-money = "500" > 500 </p>
                    </div>`;
        let moneyDom = this.add.dom(40, 25).createFromHTML(moneyHtml);
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
        this.events.on("incrementGold", (num) => {
            let newVal = parseInt(playerMoney.dataset.money) + num;
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
        let potionDom = this.add.dom(570, 80).createFromHTML(potionHtml);

        let pslots = [];
        pslots.push(new PotionSlot(this,potionDom.getChildByID("p1")));
        pslots.push(new PotionSlot(this,potionDom.getChildByID("p2")));
        pslots.push(new PotionSlot(this,potionDom.getChildByID("p3")));

        this.events.on("itemPurchased", (itemData) => {
            if (itemData.type == "potion") {
                for (let slot of pslots) {
                    if (slot.currentPotion == null) {
                        slot.addPotion(itemData);
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
        let artifactDom = this.add.dom(570, 30).createFromHTML(artifactHtml);

        this.slots = [];
        this.slots.push(new ArtifactSlot(this,artifactDom.getChildByID("a1")));
        this.slots.push(new ArtifactSlot(this,artifactDom.getChildByID("a2")));
        this.slots.push(new ArtifactSlot(this,artifactDom.getChildByID("a3")));

        this.slots.items = [];
        this.slots.canEquip = (name) =>{
            return !(this.slots.items.length == 3 || this.slots.items.includes(name));
        }

        this.events.on("equipItem", (artifactData) => {
            for (let slot of this.slots) {
                if (slot.currentArtifact == null) {
                    this.slots.items.push(artifactData.name);
                    return slot.addArtifact(artifactData);
                }
            }
        });

        this.events.on("unequipItem", (name) => {
            for (let slot of this.slots) {
                if (slot.currentArtifact == name) {
                    this.slots.items.splice(this.slots.indexOf(name),1);
                    return slot.removeArtifact();
                }
            }
        });
    }
}