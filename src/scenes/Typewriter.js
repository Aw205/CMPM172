
class Typewriter extends Phaser.Scene {

    constructor() {
        super("Typewriter");
    }

    init(data) {
        this.dialogDataIndex = data.dialogIndex;
    }

    create() {

        let dialogData = this.cache.json.get("dialogs");
        this.lineIndex = 0;
        this.speed = 25;
        this.sectionIndex = 0;
        this.currentTimeout = null;

        let html = `
        <div id="dialog-window">
            <span style="position:absolute; bottom:5%; right:2%;"> </span> 
            <img src="assets/images/merchant.png" style="position:absolute;bottom: 100%;left:0; width: 15%; image-rendering: pixelated;">
        </div>`;
        this.add.dom(325, 400).createFromHTML(html);

        this.dialogScene = dialogData[this.dialogDataIndex];
        this.line = this.dialogScene.dialog[this.sectionIndex];
        this.typewrite();

        this.input.on("pointerdown", () => {
            this.fastForward();
        });
        document.getElementById("dialog-window").addEventListener("pointerdown", () => {
            this.fastForward();
        });
    }

    typewrite() {

        if (this.lineIndex == this.line.length - 1 && this.sectionIndex != this.dialogScene.dialog.length - 1) {
            document.getElementById("dialog-window").querySelector('span').innerHTML = "&#9655;"
        }
        if (this.lineIndex < this.line.length) {
            document.getElementById("dialog-window").childNodes[0].textContent += this.line.charAt(this.lineIndex);
            this.lineIndex++;
            this.currentTimeout = setTimeout(this.typewrite.bind(this), this.speed);
        }
    }

    fastForward() {

        if (this.lineIndex == this.line.length) {
            if (this.sectionIndex == this.dialogScene.dialog.length - 1) {
                return this.scene.stop("Typewriter").run("HudScene");
            }
            document.getElementById("dialog-window").childNodes[0].textContent = "";
            document.getElementById("dialog-window").querySelector('span').innerHTML = "";
            this.line = this.dialogScene.dialog[++this.sectionIndex];
            this.lineIndex = 0;
            return this.typewrite();
        }
        this.lineIndex = this.line.length;
        document.getElementById("dialog-window").childNodes[0].textContent = this.line;
        if (this.sectionIndex != this.dialogScene.dialog.length - 1) {
            document.getElementById("dialog-window").querySelector('span').innerHTML = "&#9655;"
        }
        clearTimeout(this.currentTimeout);

    }

}