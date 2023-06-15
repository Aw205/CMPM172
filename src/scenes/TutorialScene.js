class TutorialScene extends Phaser.Scene {

    constructor() {
        super("TutorialScene");
    }

    create() {

        let s = `   <link rel="stylesheet" type= "text/css" href="./src/hud.css">
                    <p class= "credits-text"> Comboing </p>
                    <p style = " font: 16px kreon; color: tan;" > Deal damage by making combos. </p>
                    <p style = " font: 16px kreon; color: tan;"> Match 3+ orbs horizontally or vertically to make a combo. </p>
                
                    <button class = "credits-return-button" id = "tutorial-return">Return</button> `;
        this.container = this.add.dom(200, 50).createFromHTML(s);

        this.container.getChildByID("tutorial-return").addEventListener("pointerup", () => {
            this.scene.stop().run("Menu");
        });
    }

}