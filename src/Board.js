class Board extends Phaser.GameObjects.GameObject {

    constructor(scene, x, y) {
        super(scene);

        this.orbImages = ["fire", "water", "wood", "dark", "light"];

        this.x = x;
        this.y = y;
        this.BOARD_HEIGHT = 5;
        this.BOARD_WIDTH = 6;

        this.orbArray = new Array(this.BOARD_HEIGHT);
        this.skyfallArray = new Array(this.BOARD_HEIGHT);
        this.orbSlotArray = new Array(this.BOARD_HEIGHT);

        this.comboList = [];
        this.generateBoard();

        this.scene.events.on("solveBoard", () => {
            this.solveBoard();
        });

        this.scene.events.on("startPlayerTurn", () => {

            for (let arr of this.orbArray) {
                this.scene.add.tween({
                    targets: arr,
                    alpha: 1,
                    duration: 500,
                })
                for (let orb of arr) {
                    orb.setInteractive();
                }
            }
        });

        this.scene.events.on("swapOrbs",(row,col,targetR,targetC)=>{
            this.scene.sound.play("orb_move_sfx",{volume: 0.2});
            [this.orbArray[row][col], this.orbArray[targetR][targetC]] = [this.orbArray[targetR][targetC], this.orbArray[row][col]];
        })

        let moveTimeHTML = `<p id = "time" style= "padding: 5px; border-style: solid; border-radius: 5px; background-color: rgb(20, 20, 20, 0.8); font: 8px kreon; color: white" >Move Time: 10s</p>`;
        Board.timeLabel = this.scene.add.dom(100, 140).createFromHTML(moveTimeHTML).setVisible(false);
        let timerHTML = `<div id ="timer"class="round-time-bar" data-style="smooth" style="--duration: 6;"> </div>`
        Board.timer = this.scene.add.dom(100, 100).createFromHTML(timerHTML);


        this.detuneComboSfx = [];
        for(let i = 0; i < 20; i++){
            this.detuneComboSfx.push(this.scene.sound.add("orb_combo_sfx",{detune: 600 - 100*i}));
        }

    }

    generateBoard() {

        for (let i = 0; i < this.BOARD_HEIGHT; i++) {
            this.orbArray[i] = new Array(this.BOARD_WIDTH);
            this.skyfallArray[i] = new Array(this.BOARD_WIDTH);
            this.orbSlotArray[i] = new Array(this.BOARD_WIDTH);
        }

        for (let row = 0; row < this.BOARD_HEIGHT; row++) {
            for (let col = 0; col < this.BOARD_WIDTH; col++) {

                let rand = Phaser.Math.Between(0, 4);
                let x = this.x + col * Orb.WIDTH;
                let y = this.y + row * Orb.HEIGHT;

                this.orbArray[row][col] = new Orb(this.scene, x, y, row, col, this.orbImages[rand]);
                this.orbArray[row][col].type = Object.values(OrbType)[rand];

                rand = Phaser.Math.Between(0, 4);

                this.skyfallArray[row][col] = new Orb(this.scene, x, y - this.BOARD_HEIGHT * Orb.HEIGHT, row, col, this.orbImages[rand]).setVisible(false);
                this.skyfallArray[row][col].type = Object.values(OrbType)[rand];

                let slot = new OrbSlot(this.scene, x, y);
                slot.orb = this.orbArray[row][col];
                this.orbSlotArray[row][col] = slot;

                this.orbArray[row][col].currentSlot = slot;
            }
        }
    }

    solveBoard() {

        for (let arr of this.orbArray) {
            for (let o of arr) {
                o.disableInteractive();
            }
        }

        this.resetBoardState();
        let numCombos = this.findCombos();
        if (numCombos > 0) {
            return this.fadeCombos();
        }
        else {
            this.scene.scene.get("CombatScene").events.emit("solveComplete");
            for (let arr of this.orbArray) {
                this.scene.add.tween({
                    targets: arr,
                    alpha: 0.3,
                    duration: 500,
                    delay: 500
                });
            }
            console.log("all combos have finished");
        }
    }

    resetBoardState() {

        for (let row = 0; row < this.BOARD_HEIGHT; row++) {
            for (let col = 0; col < this.BOARD_WIDTH; col++) {

                let x = this.x + col * Orb.WIDTH;
                let y = this.y + row * Orb.HEIGHT;
                this.orbArray[row][col].isVisited = false;

                if (this.skyfallArray[row][col] == null) {

                    let rand = Phaser.Math.Between(0, 4);
                    this.skyfallArray[row][col] = new Orb(this.scene, x, y - this.BOARD_HEIGHT * Orb.HEIGHT, row, col, this.orbImages[rand]).setVisible(false);
                    this.skyfallArray[row][col].type = Object.values(OrbType)[rand];;
                }
            }
        }
    }

    fadeCombos() {

        this.scene.time.addEvent({
            delay: 500,
            callback: this.fadeCombosEvent,
            callbackScope: this,
            repeat: this.comboList.length,
        });

    }

    fadeCombosEvent() {

        if (this.comboList.length == 0) {
            return this.skyfall();
        }
        this.detuneComboSfx[this.comboList.length].play();
      
        let set = this.comboList.pop();
        let arr = Array.from(set);
        this.scene.tweens.add({
            targets: arr,
            alpha: 0,
            ease: 'Sine.InOut',
            duration: 450,
            onComplete: () => {

                this.scene.events.emit("comboMatched", arr[1].type, set.size, { x: arr[1].startPos.x, y: arr[1].startPos.y });

                for (let orb of set) {
                    this.orbArray[orb.row][orb.col] = null;
                    this.orbSlotArray[orb.row][orb.col].orb = null;
                    orb.destroy();
                }
            }
        });

    }

    findCombos() {

        for (let arr of this.orbArray) {
            for (let orb of arr) {
                let comboSet = new Set();
                if (!orb.isVisited) {
                    orb.isVisited = true;
                    this.floodfill(orb.row, orb.col, orb.type, comboSet);
                }
                if (comboSet.size > 2) {
                    this.comboList.push(comboSet);
                }
            }
        }
        return this.comboList.length;
    }

    floodfill(row, col, type, comboSet) {

        let adj_arr = [];
        let matches = [[], []]; //horizontal and vertical matches

        for (let i = 0; i < 4; i++) {
            let x = (i - 1) % 2;     // -1 0 1 0
            let y = (3 - i - 1) % 2; // 0 1 0 -1
            if (this.isInBounds(row + x, col + y)) {
                let adj = this.orbArray[row + x][col + y];
                if (adj.type == type) {
                    (x == 0) ? matches[0].push(adj) : matches[1].push(adj);
                    if (!adj.isVisited) {
                        adj_arr.push(adj);
                    }
                }
            }
        }
        for (let orb of adj_arr) {
            orb.isVisited = true;
            this.floodfill(orb.row, orb.col, type, comboSet);
        }
        for (let arr of matches) {
            if (arr.length == 2) {
                comboSet.add(this.orbArray[row][col]);
                for (let orb of arr) {
                    comboSet.add(orb);
                }
            }
        }
    }

    skyfall() {

        let dropDist = 0;
        for (let col = 0; col < this.BOARD_WIDTH; col++) {
            for (let row = this.BOARD_HEIGHT - 1; row > -1; row--) {
                let current = this.orbArray[row][col];
                if (current == null) {
                    dropDist++;
                    continue;
                }
                this.scene.tweens.add({
                    targets: current,
                    y: current.y + dropDist * Orb.HEIGHT,
                    duration: 500,
                    ease: Phaser.Math.Easing.Linear,
                });

                current.row += dropDist;
                current.startPos.set(current.x, current.y + dropDist * Orb.HEIGHT);

                this.orbSlotArray[current.row][col].orb = current; // point slot to new orb
                current.currentSlot = this.orbSlotArray[current.row][col]; //point orb to correct orb slot
                [current, this.orbArray[row + dropDist][col]] = [this.orbArray[row + dropDist][col], current]; // setting new array location of orb

            }
            //skyfalling new orbs 

            for (let r = this.BOARD_HEIGHT - 1; r > this.BOARD_HEIGHT - dropDist - 1; r--) {

                let current = this.skyfallArray[r][col];
                let newRow = r - this.BOARD_HEIGHT + dropDist;
                current.setVisible(true);

                this.scene.tweens.add({
                    targets: current,
                    y: this.y + newRow * Orb.HEIGHT,
                    duration: 500,
                    ease: Phaser.Math.Easing.Linear
                });

                current.row = newRow;
                current.startPos.set(current.x, this.y + newRow * Orb.HEIGHT);

                this.orbSlotArray[newRow][col].orb = current;
                current.currentSlot = this.orbSlotArray[newRow][col];
                this.orbArray[newRow][col] = current;

                this.skyfallArray[r][col] = null;
            }
            dropDist = 0;
        }
        this.solveBoard();
    }

    isInBounds(row, col) {
        return (row > -1 && row < this.BOARD_HEIGHT && col > -1 && col < this.BOARD_WIDTH);
    }

}