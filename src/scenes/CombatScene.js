

var modifiers = {
    fireDamage: 1,
    waterDamage: 1,
    grassDamage: 1,
    lightDamage: 1,
    darkDamage: 1,
    universalDamage: 1,
};

class CombatScene extends Phaser.Scene {

    constructor() {
        super("CombatScene");
    }

    create(data) {

        this.data = data;
        this.cameras.main.setBackgroundColor(0x181e1e);

        this.add.image(320, 240, "stars").setScale(1.5).setPipeline("Light2D");
        this.add.image(320, 260, "star_cloud").setScale(1.3).setPipeline("Light2D");

        this.battlePos = [];
        this.battlePos.push([{ x: 320, y: 200 }]);
        this.battlePos.push([{ x: 200, y: 200 }, { x: 440, y: 200 }]);
        this.battlePos.push([{ x: 160, y: 170 }, { x: 320, y: 200 }, { x: 480, y: 170 }]);

        this.createAnims();

        this.enemies = [];
        this.createEnemies();

        this.damageColors = ["LightCoral", "LightSkyBlue", "LightGreen", "Plum", "Gold"];
        this.particleArray = ["fire_particle", "water_particle", "wood_particle", "dark_particle", "light_particle"];

        this.events.on("comboMatched", this.onComboMatched.bind(this));
        this.healthBar = new HealthBar(this, 345, 270, 100);
        this.events.on("damagePlayer", (damage) => {
            this.healthBar.onHit(damage);
        });




        this.createComboCounter();
        this.createMultiplier();

        this.board = new Board(this, 240, 300);

        this.createLights();

        this.events.on("enemyDied", (enemy) => {
            this.enemies.splice(this.enemies.indexOf(enemy), 1);
        });


        //this.createChangeOrbButton();

    }


    createLights() {

        this.lights.enable();
        this.lights.setAmbientColor(0x4d494f);
        this.lights.addLight(200, 200, 100, 0xaeecf4, 1);
        this.lights.addLight(440, 200, 200, 0xaeecf4, 1);
    }


    createEnemies() {

        this.enemyMap = new Map();
        let enemyData = this.cache.json.get("enemies");
        for (let i = 0; i < enemyData.length; i++) {
            this.enemyMap.set(enemyData[i].name, enemyData[i]);
        }

        let data = this.cache.json.get("levels");
        let level = 1;

        let positions = this.battlePos[data[level].enemies.length - 1];

        for (let i = 0; i < data[level].enemies.length; i++) {
            let pos = positions[i];
            this.add.image(pos.x, pos.y, "battleCircle").setScale(2);
            this.enemies.push(new Enemy(this, pos.x, pos.y - 40, data[level].enemies[i], this.enemyMap.get(data[level].enemies[i])));
        }

    }

    getDamageMult(orbType) {
        switch (orbType) {
            case OrbType.Fire:
                return modifiers.fireDamage;
            case OrbType.Water:
                return modifiers.waterDamage;
            case OrbType.Grass:
                return modifiers.grassDamage;
            case OrbType.Dark:
                return modifiers.darkDamage;
            case OrbType.Light:
                return modifiers.lightDamage;
        }
    }

    onComboMatched(orbType, numOrbs, startPos) {

        let damage = Math.round((2 + numOrbs * modifiers.universalDamage) * this.getDamageMult(orbType));
        this.comboCounter.increment();
        this.multiplier.increase(damage * 0.35);
        if (this.enemies.length != 0) {
            this.playDamageAnimation(orbType, damage, startPos);
        }

    }

    playDamageAnimation(orbType, damage, startPos) {

        let particleEmitter = this.add.particles(startPos.x, startPos.y, this.particleArray[orbType.description]);

        particleEmitter.setConfig({
            quantity: 5,
            speed: { random: [50, 100] },
            lifespan: { random: [200, 400] },
            scale: { random: true, start: 1, end: 0 }
        });

        let enemy = this.enemies[Phaser.Math.Between(0, this.enemies.length - 1)];
        enemy.emit("damageEnemy", damage);

        this.add.tween({
            targets: particleEmitter,
            particleX: enemy.x - startPos.x,
            particleY: enemy.y - startPos.y,
            duration: 500,
            onComplete: () => {
                particleEmitter.explode(50);
                this.displayDamageText(this.damageColors[orbType.description], damage, enemy.x, enemy.y);
                enemy.emit("updateHealthBar", damage);
                this.time.delayedCall(1000, () => {
                    particleEmitter.destroy(true);
                });
            }
        });
    }

    displayDamageText(color, damage, posX, posY) {

        let html = `<p style= "font: 28px kreon; color: ${color}" >${damage}</p>`;
        let damageText = this.add.dom(posX, posY).createFromHTML(html);
        this.tweens.add({
            targets: damageText,
            x: posX + Phaser.Math.Between(-50, 50),
            y: posY - Phaser.Math.Between(50, 70),
            alpha: 0.4,
            duration: 1000,
            ease: "Sine.InOut",
            onComplete: () => {
                damageText.destroy(true);
            }
        });
    }


    createComboCounter() {

        let html = `<p style = "display: inline-block; font: 8px kreon; color: DarkCyan; border-bottom: 1px solid; user-select: none; pointer-events: none;" >combos</p>
                    <p id= "comboCounter" data-counter= "0" style= "display: inline-block; font: 16px kreon; color: CadetBlue; user-select: none; pointer-events: none; " >0</p>`;
        let comboText = this.add.dom(50, 80).createFromHTML(html);
        this.comboCounter = comboText.getChildByID("comboCounter");

        this.comboCounter.changeTo = (newVal) => {
            this.comboCounter.dataset.counter = newVal;
            this.tweens.addCounter({
                from: parseInt(this.comboCounter.innerText),
                to: newVal,
                duration: 500,
                onUpdate: tween => {
                    this.comboCounter.innerText = Math.floor(tween.getValue());
                }
            });
        }

        this.comboCounter.increment = () => {
            this.comboCounter.dataset.counter++;
            this.comboCounter.innerText = this.comboCounter.dataset.counter;
        }

        this.createBonusDamageAnimation();
    }


    createMultiplier() {


        let html = `<p style = "display: inline-block; font: 8px kreon; color: DarkCyan; border-bottom: 1px solid; user-select: none; pointer-events: none;" >multiplier</p>
        <p id= "multiplier" data-num= "0" style= "display: inline-block; font: 16px kreon; color: CadetBlue; user-select: none; pointer-events: none;" >0.00x</p>`;
        let multiplierText = this.add.dom(50, 120).createFromHTML(html);
        this.multiplier = multiplierText.getChildByID("multiplier");

        this.multiplier.changeTo = (newVal) => {
            this.multiplier.dataset.num = newVal;
            this.tweens.addCounter({
                from: parseFloat(this.multiplier.innerText),
                to: newVal,
                duration: 500,
                onUpdate: tween => {
                    this.multiplier.innerText = tween.getValue();
                }
            });
        }

        this.multiplier.increase = (num) => {
            let newVal = (num + parseFloat(this.multiplier.dataset.num)).toFixed(2);
            this.multiplier.dataset.num = newVal;
            this.tweens.addCounter({
                from: parseFloat(this.multiplier.innerText),
                to: newVal,
                duration: 200,
                onUpdate: tween => {
                    this.multiplier.innerText = tween.getValue().toFixed(2) + "x";
                }
            });
        }

    }


    createChangeOrbButton(){

        let html = `<button id = "orb-change" style = "color: wheat; border-radius: 2px; background-color: Black;" >orb change</button>`;
        let but = this.add.dom(300, 120).createFromHTML(html);
        but.getChildByID("orb-change").addEventListener("click",()=>{
            this.board.changeOrb();
        });
    }





    createBonusDamageAnimation() {

        let particleEmitter = this.add.particles(100, 120, 'particles');
        particleEmitter.setConfig({
            anim: { anims: ['waterAnim', 'fireAnim', 'woodAnim', 'waterAnim'], cycle: true, quantity: 100 },
            quantity: 2,
            speed: 20,
            lifespan: { random: [200, 400] },
            scale: { random: true, start: 1, end: 0 },
        });
        particleEmitter.stop();

        let path = new Phaser.Curves.Path(0, 0).circleTo(25);
        let block = this.add.follower(path, 0, 0, null).setVisible(false);

        this.events.on("solveComplete", () => {


            let enemy = this.enemies[Phaser.Math.Between(0, this.enemies.length - 1)];
            this.time.delayedCall(2000, () => {

                if (!enemy) {
                    this.add.tween({
                        targets: this.cameras.main,
                        alpha: 0.5,
                        duration: 1000,
                        onComplete: () => {
                            this.scene.run("RewardsScene");
                        }
                    });
                    return;
                }

                this.comboCounter.changeTo(0);
                particleEmitter.stopFollow();

                this.add.tween({
                    targets: particleEmitter,
                    particleX: enemy.x - particleEmitter.x,
                    particleY: enemy.y - particleEmitter.y,
                    duration: 500,
                    onComplete: () => {
                        particleEmitter.explode(50);
                        particleEmitter.particleX = 0;
                        particleEmitter.particleY = 0;
                        particleEmitter.startFollow(block, -block.pathOffset.x, -block.pathOffset.y);
                        this.events.emit("startEnemyTurn");
                        //this.displayDamageText(color, damage, targetPos.x, targetPos.y);
                    }
                });

            });
        });
        block.startFollow({
            duration: 1000,
            from: 0,
            to: 1,
            loop: -1,
        });
        particleEmitter.startFollow(block, -block.pathOffset.x, -block.pathOffset.y);
        this.events.on("comboMatched", () => {
            particleEmitter.frequency = 0;
            particleEmitter.start();
        });

    }

    createAnims() {
        this.anims.create({
            key: "fireAnim",
            frames: [{ key: 'particles', frame: 0 }]
        });
        this.anims.create({
            key: "waterAnim",
            frames: [{ key: 'particles', frame: 1 }]
        });
        this.anims.create({
            key: "woodAnim",
            frames: [{ key: 'particles', frame: 2 }]
        });

        this.anims.createFromAseprite("blue_slime");
    }
}