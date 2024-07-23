class CreditsScene extends Phaser.Scene {

    constructor() {
        super("CreditsScene");
    }

    create() {

        let s = `   <link rel="stylesheet" type= "text/css" href="./src/hud.css">
                    <p class= "credits-text"> Credits </p>
                    <p class= "credits-person"> Verboten <span class= "credits-asset"> - Potion Icons </span> </p>
                    <p class= "credits-person"> Brullov <span class= "credits-asset"> - Fire Animation </span> </p>
                    <p class= "credits-person"> Ok_lavender <span class= "credits-asset"> - Coin Icon </span> </p>
                    <p class= "credits-person"> PiiiXL <span class= "credits-asset"> - Backpack Icon </span> </p>
                    <p class= "credits-person"> TheWiseHedgeHog <span class= "credits-asset"> - Sword Artifact Icons </span> </p>
                    <p class= "credits-person"> Vnitti <span class= "credits-asset"> - Grassy Mountain Background </span> </p>
                    <p class= "credits-person"> Vmiinv <span class= "credits-asset"> - Tree Pixel Art </span> </p>
                    <p class= "credits-person"> CraftPix <span class= "credits-asset"> - Sky Background </span> </p>
                    <p class= "credits-person"> Icons8.org <span class= "credits-asset"> - Sword & Heart Icons </span> </p>
                    <p class= "credits-person"> Tienlev <span class= "credits-asset"> - Slimes </span> </p>
                    <p class= "credits-person"> Relaxation Harmony <span class= "credits-asset"> - Background Music </span> </p>
                    <p class= "credits-person"> ShapeForms Audio <span class= "credits-asset"> - Coin Sfx </span> </p>
                    <button class = "credits-return-button" id = "credits-return">Return</button> `;
        this.container = this.add.dom(200, 220).createFromHTML(s);

        this.container.getChildByID("credits-return").addEventListener("pointerup", () => {
            this.scene.stop().run("Menu");
        });
    }

}
