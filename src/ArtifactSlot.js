
class ArtifactSlot extends Phaser.GameObjects.GameObject {

    constructor(scene, element) {
        super(scene);
        this.ele = element;
        this.currentArtifact = null;
        this.artifactData = null;

    }

    addArtifact(itemData) {

        this.currentArtifact = itemData.name;
        this.artifactData = itemData;

        this.img = document.createElement("img");
        this.img.src = `assets/images/artifacts/${itemData.name}.png`;
        this.img.classList.add("pixelImg");

        this.ele.style.borderBottomColor = itemData.rarity;
        this.ele.innerHTML = `<div class ="item-description"> <span style= "color: ${itemData.rarity}; "> ${itemData.name}</span> <br> ${itemData.description} </div>`;

        this.ele.appendChild(this.img);
        this.applyModifiers();
    }

    removeArtifact(){
        this.removeModifers();
        this.ele.removeChild(this.img);
        this.img = null;
        this.currentArtifact = null;
        this.ele.style.borderBottomColor = "gray";
    }


    applyModifiers() {

        if (this.artifactData.modifiers != null) {
            this.apply = () => {
                Object.keys(this.artifactData.modifiers).forEach((attribute) => {
                    let val = this.artifactData.modifiers[attribute];
                    modifiers[attribute] *= val;
                });
            };
            this.apply();
        }
    }

    removeModifers(){

        if (this.artifactData.modifiers != null) {
            this.reset = () => {
                Object.keys(this.artifactData.modifiers).forEach((attribute) => {
                    let val = this.artifactData.modifiers[attribute];
                    modifiers[attribute] /= val;
                });
            };
            this.reset();
        }



    }

}