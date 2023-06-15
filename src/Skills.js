class Skills extends Phaser.GameObjects.GameObject {


    constructor(scene, board) {
        super(scene);
        this.board = board;

        this.createSkills();
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }


    createSkills() {

        let skillData = this.scene.cache.json.get("skills");
        for (let i = 0; i < skillData.length; i++) {

            switch (skillData[i].type) {

                case "Orb Convert":

                    this[skillData[i].name] = () => {

                        for (let arr of this.board.orbArray) {
                            for (let orb of arr) {

                                if (orb.type == OrbType[skillData[i].from]) {

                                    let temp = this.scene.add.image(orb.x, orb.y, this.board.orbImages[orb.type.description]).setScale(0);
                                    orb.setTexture(this.board.orbImages[OrbType[skillData[i].to].description]);
                                    orb.type = OrbType[skillData[i].to];
                                    this.scene.tweens.add({
                                        targets: temp,
                                        scale: 1.5,
                                        duration: 500,
                                        yoyo: true,
                                        onComplete: () => {
                                            temp.destroy(true);
                                        }
                                    });
                                }
                            }
                        }
                    };
                    break;
                case "Random Orb Spawn":

                    this[skillData[i].name] = () => {

                        let coords = [];
                        while (coords.length != skillData[i].amount) {
                            let col = Phaser.Math.Between(0, 5);
                            let row = Phaser.Math.Between(0, 4);
                            let coord = row + "," + col;
                            if (!coords.includes(coord)) {
                                coords.push(coord);
                            }
                        }

                        for (let coord of coords) {

                            let orb = this.board.orbArray[coord[0]][coord[2]];
                            let temp = this.scene.add.image(orb.x, orb.y, this.board.orbImages[orb.type.description]).setScale(0);
                            orb.setTexture(this.board.orbImages[OrbType[skillData[i].to].description]);
                            orb.type = OrbType[skillData[i].to];
                            this.scene.tweens.add({
                                targets: temp,
                                scale: 1.5,
                                duration: 500,
                                yoyo: true,
                                onComplete: () => {
                                    temp.destroy(true);
                                }
                            });
                        }
                    };
                    break;

                case "Rainbow Board Change":

                    this[skillData[i].name] = () => {

                        let orbTypes = [];
                        for (let type of Object.values(OrbType)) {
                            for (let i = 0; i < 3; i++) {
                                orbTypes.push(type);
                            }
                        }
                        let keys = Object.keys(OrbType);
                        for (let i = 0; i < 15; i++) {
                            orbTypes.push(OrbType[keys[keys.length * Math.random() << 0]]);
                        }

                        this.shuffle(orbTypes);

                        for (let arr of this.board.orbArray) {
                            for (let orb of arr) {

                                let temp = this.scene.add.image(orb.x, orb.y, this.board.orbImages[orb.type.description]).setScale(0);

                                orb.type = orbTypes.pop();
                                orb.setTexture(this.board.orbImages[orb.type.description]);
                                
                                this.scene.tweens.add({
                                    targets: temp,
                                    scale: 1.5,
                                    duration: 500,
                                    yoyo: true,
                                    onComplete: () => {
                                        temp.destroy(true);
                                    }
                                });

                            }
                        }
                    };
                    break;
            }


        }


    }







}