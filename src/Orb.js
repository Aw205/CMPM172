

const OrbType = Object.freeze({
	Fire: Symbol("0"),
	Water: Symbol("1"),
	Grass: Symbol("2"),
	Light: Symbol("3"),
    Dark: Symbol("4"),
    None: Symbol("none"),
});


class Orb extends Phaser.GameObjects.Image {

    static HEIGHT = 32;
    static WIDTH = 32;

    constructor(scene, x, y, row, col, texture) {
        super(scene, x, y, texture);

        this.setDisplaySize(32, 32);
       
        this.type = OrbType.None;

        this.row = row;
        this.col = col;
        this.isVisited = false;
        this.startPos = new Phaser.Math.Vector2(x, y);
        this.currentSlot = null;
        this.shadow = this.scene.add.image(x, y, texture).setAlpha(0.4).setDisplaySize(32, 32).setVisible(false);
        this.hasSwapped = false;

        this.setInteractive({ draggable: true, useHandCursor: true });
        this.addFirstSwapListener();
        this.#createListeners();

        this.scene.add.existing(this);

    }

    #createListeners() {

        this.on("pointerdown", (pointer, localX, localY) => {
            Board.timeLabel.setVisible(true).setPosition(pointer.x, pointer.y - 30);
            this.shadow.setPosition(this.x, this.y).setVisible(true);
            this.setAlpha(0.8);
            this.setOrigin((8 - (localX - 8)) / 16, (8 - (localY - 8)) / 16);
        });
        this.on("drag", (pointer, dragX, dragY) => {
            this.setPosition(dragX, dragY);
            Board.timer.setPosition(pointer.x, pointer.y - 30);
            Board.timeLabel.setPosition(pointer.x, pointer.y - 30);
        });
        this.on("dragenter", (pointer, target) => {
            this.#swapLocations(target);
        });
        this.on("drop", (pointer, target) => {
            this.onOrbRelease();
        });
        this.on("pointerup", () => {
            this.onOrbRelease();
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

        this.shadow.setPosition(this.startPos.x, this.startPos.y);
    }


    addFirstSwapListener() {
        this.once("dragleave", (pointer, target) => {
            Board.timeLabel.setVisible(false);
            this.hasSwapped = true;

            this.timeIndicatorEvent = this.scene.time.delayedCall(5000, () => {

                let e = Board.timer.getChildByID("timer");
                e.style.visibility = "visible";
                e.style.animationName = "none";
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        e.style.animationName = ""
                    }, 0);
                });
                e.addEventListener("animationend", this.onTimerEnd.bind(this),{ once: true });
            });
        });
    }

    onOrbRelease() {

        Board.timeLabel.setVisible(false);
        this.scene.time.removeEvent(this.timeIndicatorEvent);
        Board.timer.getChildByID("timer").removeEventListener("animationend",this.onTimerEnd);
        Board.timer.getChildByID("timer").style.visibility = "hidden";
        this.shadow.setVisible(false);
        this.setPosition(this.startPos.x, this.startPos.y);
        this.setOrigin(0.5);
        this.setAlpha(1);
        if (this.hasSwapped) {
            this.hasSwapped = false;
            this.addFirstSwapListener();
            this.scene.events.emit("solveBoard");
        }
    }

    onTimerEnd(){
        Board.timer.getChildByID("timer").style.visibility = "hidden";
        this.emit("drop");
    }

}