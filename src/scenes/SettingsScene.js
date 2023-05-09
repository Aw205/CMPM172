class SettingsScene extends Phaser.Scene {

    constructor() {
        super("SettingsScene");
    }

    create() {
        
        let volumeHtml = `
        <input type="range" min="1" max="100" value="50" style=" -webkit-appearance: none; height: 5px;
                width: 300px; background: #555; border-radius: 15px;">`;
        this.add.dom(320,240).createFromHTML(volumeHtml);
     
    }

}