class InventoryScene extends Phaser.Scene {


    constructor() {
        super("InventoryScene");
    }

    create(data) {

        this.selectedArtifactData = null;
        this.createInventory();
        this.slots = data.artifactSlots;

        this.inventoryTransition(true);
        this.events.on("wake", (sys, data) => {
            this.inventoryTransition(true);
        });
    }


    createInventory() {

        let artifacts = this.cache.json.get("artifacts");
        let artifactImg = this.add.image(410, 220).setScale(2).setVisible(false);
        artifactImg.preFX.addShine();

        let gridHTML = `<p style= "user-select: none; pointer-events: none; font: 28px kreon; color: GoldenRod; margin: 0px;" > Artifacts </p>
                        <div id = "artifact-grid" class="silhouette-container"></div>`;

        this.grid = this.add.dom(100, 180).createFromHTML(gridHTML).setAlpha(0);


        let windowHTML = `<div class="artifact-window">
                            <div id = "name" class= "artifact-name"> </div>
                            <div id = "descrip" class= "artifact-description"> </div>
                            <button id = "equip" class= "equip-button" >Equip</button>
                          </div>`;


        this.artifactWindow = this.add.dom(410, 250).createFromHTML(windowHTML).setAlpha(0);

        this.artifactWindow.getChildByID("equip").addEventListener("click", () => {

            if (this.slots.canEquip(this.selectedArtifactData.name)) {
                this.scene.get("HudScene").events.emit("equipItem", this.selectedArtifactData);
                this.artifactWindow.getChildByID("equip").innerText = "Unequip";
            }
            else if (this.slots.items.includes(this.selectedArtifactData.name)) {
                this.scene.get("HudScene").events.emit("unequipItem", this.selectedArtifactData.name);
                this.artifactWindow.getChildByID("equip").innerText = "Equip";
            }
        });

        for (let i = 0; i < artifacts.length; i++) {

            let img = document.createElement("img");
            img.id = `${artifacts[i].name}-img`;
            img.src = `assets/images/artifacts/${artifacts[i].name}.png`;
            img.classList.add("pixelImg");
            img.style.filter = "contrast(0%) brightness(0%)";

            img.isDiscovered = false;

            img.addEventListener("pointerdown", () => {

                if (img.isDiscovered) {

                    this.artifactWindow.getChildByID("name").innerText = artifacts[i].name;
                    this.artifactWindow.getChildByID("descrip").innerText = artifacts[i].description;
                    artifactImg.setTexture(artifacts[i].name).setVisible(true);
                    this.selectedArtifactData = artifacts[i];

                    let equipText = this.slots.items.includes(artifacts[i].name) ? "Unequip" : "Equip";
                    this.artifactWindow.getChildByID("equip").innerText = equipText;
                    this.artifactWindow.getChildByID("equip").style.visibility = "visible";
                }
            });
            this.grid.getChildByID("artifact-grid").appendChild(img);
        }

        this.events.on("itemPurchased",(itemData)=>{
            if(itemData.type = "artifact"){
                let imgElement =  this.grid.getChildByID(`${itemData.name}-img`);
                imgElement.style.filter = "";
                imgElement.isDiscovered = true;
               
            }
        });
    }


    inventoryTransition(isTransitionIn) {
        if (isTransitionIn) {
            return this.tweens.add({
                targets: [this.grid, this.artifactWindow],
                duration: 300,
                alpha: 1,
                ease: "Linear",
            });
        }

    }

    sleepTransition() {
        this.tweens.add({
            targets: [this.grid, this.artifactWindow],
            duration: 300,
            alpha: 0,
            ease: "Linear",
            onComplete: () => {
                this.scene.sleep();
                this.scene.get("CampfireScene").events.emit("setVisible");
            }
        });
    }
}