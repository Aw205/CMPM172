class LeaderSkills extends Phaser.GameObjects.GameObject {

    constructor(scene) {
        super(scene);

        this.comboCount = 0;
        this.typeCount = {};
        this.activated = false;
        this.createLeaderSkills();
    }

    createLeaderSkills() {

        this["Fire Leader Skill"] = () => {
            this.scene.events.on("comboMatched", (orbType, numOrbs, startPos) => {
                this.comboCount++;
                this.typeCount[orbType.toString()] = (this.typeCount[orbType.toString()] || 0) + 1;
                if (!this.activated && this.typeCount[OrbType.Fire.toString()] == 2) {
                    this.scene.multiplier.glow();
                    this.scene.multiplier.multiply(5);
                    this.activated = true;
                }
            });

        };

        this["Water Leader Skill"] = () => {
            this.scene.events.on("comboMatched", (orbType, numOrbs, startPos) => {
                this.comboCount++;
                this.typeCount[orbType.toString()] = (this.typeCount[orbType.toString()] || 0) + 1;
                if (!this.activated && this.typeCount[OrbType.Water.toString()] == 2) {
                    this.scene.multiplier.glow();
                    this.scene.multiplier.multiply(5);
                    this.activated = true;
                }
            });

        };
        this["Grass Leader Skill"] = () => {
            this.scene.events.on("comboMatched", (orbType, numOrbs, startPos) => {
                this.comboCount++;
                this.typeCount[orbType.toString()] = (this.typeCount[orbType.toString()] || 0) + 1;
                if (!this.activated && this.typeCount[OrbType.Grass.toString()] == 2) {
                    this.scene.multiplier.glow();
                    this.scene.multiplier.multiply(5);
                    this.activated = true;
                }
            });
        };
        this["Rainbow Leader Skill"] = () => {
            this.scene.events.on("comboMatched", (orbType, numOrbs, startPos) => {
                this.comboCount++;
                this.typeCount[orbType.toString()] = (this.typeCount[orbType.toString()] || 0) + 1;
                if (!this.activated &&
                    this.typeCount[OrbType.Fire.toString()] > 0 && this.typeCount[OrbType.Water.toString()] > 0 &&
                    this.typeCount[OrbType.Grass.toString()] > 0 && this.typeCount[OrbType.Light.toString()] > 0 && this.typeCount[OrbType.Dark.toString()] > 0) {
                    this.scene.multiplier.glow();
                    this.scene.multiplier.multiply(10);
                    this.activated = true;
                }
            });
        };

        this[playerState.leaderSkill]();

        this.scene.events.on("startPlayerTurn", () => {
            this.comboCount = 0;
            this.typeCount = {};
            this.activated = false;
        });
    }
}