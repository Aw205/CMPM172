class InventoryScene extends Phaser.Scene {


    constructor() {
        super("InventoryScene");
    }


    create() {

        this.add.nineslice(320, 250, 'shopFrame', null, 520, 400, 6, 6, 6, 6);
        this.add.nineslice(420, 250, 'shopFrame', null, 250, 300, 6, 6, 6, 6);

        let artifactLabel = `<p style= "user-select: none; pointer-events: none; font: 28px kreon; color: GoldenRod; border-bottom: 2px solid BurlyWood;" > Artifacts </p>`;
        this.add.dom(130, 100).createFromHTML(artifactLabel);

        this.selectedArtifactData = null;

        this.createSilhouettes();
    }


    createSilhouettes() {

        let artifacts = this.cache.json.get("artifacts");

        let group = new Phaser.GameObjects.Group(this);

        let windowArtifact = this.add.image(410, 230,null, null).setScale(2).setVisible(false);
        windowArtifact.preFX.addShine();

        let nameHTML = `<p id = "name" style = "font: 18px kreon; color: Gold; border-style: double; border-radius: 5px; padding: 5px; border-color: DarkGoldenRod;" ></p>`;
        let nameLabel = this.add.dom(360, 130).createFromHTML(nameHTML).setVisible(false);

        let descriptionHTML = `<p id = "description" style = "font: 12px kreon; color: MistyRose;" ></p>`
        let descriptionLabel = this.add.dom(350, 280).createFromHTML(descriptionHTML).setVisible(false);

        let equipButtonHTML = `<button id = "button" style = "font: 12px kreon; color: black; border-radius: 2px; background-color: Gray;" >Equip</button>`;
        let equipButtonDOM = this.add.dom(420, 330).createFromHTML(equipButtonHTML).setVisible(false);
        equipButtonDOM.setInteractive();
        equipButtonDOM.getChildByID("button").addEventListener("pointerdown", () => {
            this.scene.get("HudScene").events.emit("equipItem",this.selectedArtifactData);
        });

        group.addMultiple([windowArtifact,nameLabel,descriptionLabel,equipButtonDOM]);

        for (let i = 0; i < artifacts.length; i++) {
            let silhouette = this.add.image(100 + i % 4 * 50, 150 + Math.floor(i / 4) * 50, artifacts[i].name, null).setTint(0);
            silhouette.setInteractive();
            silhouette.on("pointerdown", () => {
                group.setVisible(true);
                nameLabel.getChildByID("name").innerText = artifacts[i].name;
                windowArtifact.setTexture(artifacts[i].name);
                descriptionLabel.getChildByID("description").innerText = artifacts[i].description;
                this.selectedArtifactData = artifacts[i];
            });
            silhouette.on("pointerover", () => {
                silhouette.setScale(1.5);
            });
            silhouette.on("pointerout", () => {
                silhouette.setScale(1);
            });
        }
    }

}