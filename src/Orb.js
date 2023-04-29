class Orb extends Phaser.GameObjects.Image {

    static HEIGHT = 32;
    static WIDTH = 32;

    constructor(scene, x, y, row, col, texture) {
        super(scene, x, y, texture);

        this.setDisplaySize(32, 32);

        this.type = 1;
        this.row = row;
        this.col = col;
        this.isVisited = false;
        this.startPos = new Phaser.Math.Vector2(x, y);
        this.currentSlot = null;
        this.shadow = this.scene.add.image(x,y,texture).setAlpha(0.4).setDisplaySize(32,32).setVisible(false);

        this.setInteractive({ draggable: true, useHandCursor: true });
        this.#createListeners();

        this.scene.add.existing(this);

    }

    #createListeners() {

        let hasSwapped = false;

        this.on("pointerdown", (pointer, localX, localY) => {

            Board.timeLabel.setVisible(true).setPosition(pointer.x,pointer.y - 30);
            this.shadow.setPosition(this.x,this.y).setVisible(true);
            this.setAlpha(0.8);
            this.setOrigin((8 - (localX - 8)) / 16, (8 - (localY - 8)) / 16);
        });
        this.on("drag", (pointer, dragX, dragY) => {
            
            this.setPosition(dragX, dragY);
            Board.timeLabel.setPosition(pointer.x,pointer.y - 30);
        });
        this.on("dragenter", (pointer, target) => {
            if(target!= this.currentSlot){
                Board.timeLabel.setVisible(false);
                hasSwapped = true;
                this.#swapLocations(target);
            }
        });
        this.on("drop", (pointer, target) => {
    
            Board.timeLabel.setVisible(false);
            this.shadow.setVisible(false);
            this.setPosition(this.startPos.x, this.startPos.y);
            this.setOrigin(0.5, 0.5);
            this.setAlpha(1);
            if(hasSwapped){
                this.scene.events.emit("solveBoard");
            }
        });

        this.on("pointerup",()=>{

            Board.timeLabel.setVisible(false);
            this.shadow.setVisible(false);
            this.setPosition(this.startPos.x, this.startPos.y);
            this.setOrigin(0.5, 0.5);
            this.setAlpha(1);
        });
    }

    #swapLocations(target) {

        [this.row, target.orb.row] = [target.orb.row, this.row];
        [this.col, target.orb.col] = [target.orb.col, this.col];
        [Board.orbArray[this.row][this.col], Board.orbArray[target.orb.row][target.orb.col]] = [Board.orbArray[target.orb.row][target.orb.col], Board.orbArray[this.row][this.col]];

        [this.startPos, target.orb.startPos] = [target.orb.startPos, this.startPos];
        target.orb.setPosition(target.orb.startPos.x, target.orb.startPos.y);

        let tempTargetOrb = target.orb;
        [target.orb, this.currentSlot.orb] = [this.currentSlot.orb, target.orb];
        [this.currentSlot, tempTargetOrb.currentSlot] = [tempTargetOrb.currentSlot, this.currentSlot];

        this.shadow.setPosition(this.startPos.x,this.startPos.y);

    }

}