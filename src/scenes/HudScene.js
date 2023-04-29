class HudScene extends Phaser.Scene {

    constructor() {
        super("HudScene");

    }

    create() {

        this.createUI();
    }

    createUI() {

        //this.add.nineslice(320, 25, 'hudFrame', null, 640, 40, 11, 11, 11, 11).setTint(0xb66949);
        //this.add.nineslice(320, 25, 'bluegui', null, 640, 40, 2,2,2,2);

        this.add.nineslice(320,25,'shopFrame',null,640,40,6,6,6,6);

        this.createHeartUI();
        this.createMoneyUI();
        this.createArtifactSlotUI();
        this.createPotionSlotUI();
    }

    createHeartUI() {


        let heart = this.add.image(30, 25, "heart");
        let healthHtml = `<p id = "healthUI" style= "user-select: none; pointer-events: none; font: 14px kreon; color: #C34A2C; text-shadow: 1px 1px 1px black;" > 100 </p>`;
        let healthDom = this.add.dom(50, 25).createFromHTML(healthHtml);

        let description = "yo health."
        let labelHTML = `<p style= "padding: 10px; border-style: double; border-radius: 10px; background-color: rgb(20, 20, 20); font: 12px kreon; color: tan" > ${description} </p>`;
        let descriptionLabel = this.add.dom(0, 0).createFromHTML(labelHTML).setVisible(false);

        heart.setInteractive();
        heart.on("pointermove", (pointer, localX, localY, event) => {
            descriptionLabel.setPosition(pointer.worldX + 8, pointer.worldY + 40);
        });
        heart.on("pointerover", () => {
            heart.preFX.addGlow(0xff0000, 2);
            descriptionLabel.setVisible(true);
        });
        heart.on("pointerout", () => {
            heart.clearFX();
            descriptionLabel.setVisible(false);
        });

    }

    createPotionSlotUI() {

        let slots = [];
        slots.push(new PotionSlot(this, 200, 25, "potionSilhouette"));
        slots.push(new PotionSlot(this, 232, 25, "potionSilhouette"));
        slots.push(new PotionSlot(this, 264, 25, "potionSilhouette"));


        this.events.on("itemPurchased",(itemData,itemLabel)=>{

            if(itemData.type == "potion"){
                for(let slot of slots){
                    if(slot.currentPotion==null){
                        slot.addPotion(itemData,itemLabel);
                        break;
                    }
                }
            }  
        });

    }

    createArtifactSlotUI() {

        let slots = [];

        slots.push(new ArtifactSlot(this,340,25,"goldFrame"));
        slots.push(new ArtifactSlot(this,380,25,"goldFrame"));
        slots.push(new ArtifactSlot(this,420,25,"goldFrame"));
     
        this.events.on("equipItem",(artifactData)=>{
            for(let slot of slots){
                if(slot.currentArtifact==null){
                    slot.addArtifact(artifactData);
                    break;
                }
            }
        });

    }

    createMoneyUI() {


        let moneyBag = this.add.image(95, 25, "moneyBag");
        let playerMoneyHtml = `<p id = "money" data-money = "500" style= "user-select: none; pointer-events: none; font: 14px kreon; color: gold; text-shadow: 1px 1px 1px black;" > 500 </p>`;
        let dom = this.add.dom(125, 25).createFromHTML(playerMoneyHtml);
        let playerMoney = dom.getChildByID("money");


        let description = "yo monies"
        let labelHTML = `<p style= "padding: 10px; border-style: double; border-radius: 10px; background-color: rgb(20, 20, 20); font: 12px kreon; color: tan" > ${description} </p>`;
        let descriptionLabel = this.add.dom(0, 0).createFromHTML(labelHTML).setVisible(false);

        //unlock more potions slot, artifact slots

        moneyBag.setInteractive();
        moneyBag.on("pointerover", () => {
            moneyBag.preFX.addGlow(0xFFFF00, 1);
            descriptionLabel.setVisible(true);
        });
        moneyBag.on("pointermove", (pointer, localX, localY, event) => {
            descriptionLabel.setPosition(pointer.worldX + 8, pointer.worldY + 40);
        });
        moneyBag.on("pointerout", () => {
            moneyBag.clearFX();
            descriptionLabel.setVisible(false);
        });

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


}