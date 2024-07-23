class AffinitySelectionScene extends Phaser.Scene {

    constructor() {
        super("AffinitySelectionScene");
    }

    create() {
        //this.cameras.main.fadeIn(500);
        this.createSelectionButtons();
    }

    createSelectionButtons() {

        let skillData = this.cache.json.get("skills");
        this.skillMap = new Map();
        for (let i = 0; i < skillData.length; i++) {
            this.skillMap.set(skillData[i].name, skillData[i]);
        }


        let s = ` <link rel = "stylesheet" href= "./src/SelectionButton.css">
                  <link rel = "stylesheet" href= "./src/hud.css">
                  <div id= "choose-affinity"> Choose Affinity </div>`;
                  
        let affinityData = this.cache.json.get("affinities");
        for (let i = 0; i < affinityData.length; i++) {

            s += `<button id = "${affinityData[i].name}-affinity" >
                    <div style="display: block;"> 
                    <p class= "affinity-text"> ${affinityData[i].name} </p>
                    <p class= "affinity-property-text"> Passive </p>
                    <p style="font-size: 8px; color: goldenrod; max-width: 120px;"> ${affinityData[i].passive}</p>
                    <p class= "affinity-property-text"> Skills </p>`;

            for (let name of affinityData[i].skills) {
                s += `<div class="skill-icon">
                        <img src = "assets/UI/skills/${name}.png" class="pixelImg" style= "display: block; padding-right: 5px;">
                        <div class="skill-description">
                          <div style="position: absolute; border: 1px solid dimgray; border-radius: 10px; font-size: 8px; padding: 5px; background-color: rgb(20, 20, 20);"> 
                            <span style = "color:gold;">${name}</span> <br>
                            ${this.skillMap.get(name).description}
                          </div>
                        </div>
                    </div>`;
            }
            s += `</div> </button>`;
        }

        this.selection = this.add.dom(300, 200).createFromHTML(s);

        for (let data of affinityData){
            this.selection.getChildByID(`${data.name}-affinity`).addEventListener("click", () => {
                playerState.skills = data.skills;
                playerState.leaderSkill = data.passiveName;
                this.scene.stop().run("CampfireScene").run("HudScene");
            });
        }
    }
}
