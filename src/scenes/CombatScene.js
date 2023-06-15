

var playerState = {
    skills: [],
    leaderSkill: ""
}

var modifiers = {
    fireDamage: 1,
    waterDamage: 1,
    grassDamage: 1,
    lightDamage: 1,
    darkDamage: 1,
    universalDamage: 1,
};

var combatState = {

    comboCount: 0,
    typeCount: {}
}

var gameStats = {

    damageDealt: 0,
    combosMade: 0,
    turnsTaken: 0,

}

var SkillManager = null;

class CombatScene extends Phaser.Scene {

    constructor() {
        super("CombatScene");
    }

    create(numLevel) {

        this.events.off("comboMatched");
        this.events.off("damagePlayer");
        this.events.off("enemyDied");
        this.events.off("startEnemyTurn");
        this.events.off("enemyTurnEnd");
        this.events.off("solveComplete");
        this.events.off("solveBoard");
        this.events.off("startPlayerTurn");
        this.events.off("swapOrbs");


        this.level = numLevel.level;
        this.cameras.main.fadeIn(500);
        this.createBackground();
        this.battlePos = [[{ x: 320, y: 200 }], [{ x: 200, y: 200 }, { x: 440, y: 200 }], [{ x: 160, y: 170 }, { x: 320, y: 200 }, { x: 480, y: 170 }]];
        this.createAnims();
        this.createEnemies();
        this.damageColors = ["LightCoral", "LightSkyBlue", "LightGreen", "Plum", "Gold"];
        this.particleArray = ["fire_particle", "water_particle", "wood_particle", "dark_particle", "light_particle"];
        this.healthBar = new HealthBar(this, 345, 270, 100);
        this.createComboCounter();
        this.createMultiplier();
        this.board = new Board(this, 240, 300);
        this.createListeners();

        //leaderskill
        let ls = new LeaderSkills(this);

        SkillManager = new Skills(this, this.board);
        this.totalDamage = 0;

        this.createSkills();

        //this.createChangeOrbButton();


    }


    createSkills() {

        let s = `<div id="skill-container">`;
        for (let name of playerState.skills) {
            s += `<div class="skill-icon" data-skill="${name}">
                    <img src = "assets/UI/skills/${name}.png" class="pixelImg" style= "display: block; padding-right: 5px;">
                    <div class="skill-description">
                      <div style="position: absolute; border: 1px solid dimgray; border-radius: 10px; font-size: 8px; padding: 5px; background-color: rgb(20, 20, 20);"> 
                        <span style = "color:gold;">${name}</span> <br>
                       description idk
                      </div>
                    </div>
                </div>`;
        }
        s += `</div>`;
        let skill = this.add.dom(500, 300).createFromHTML(s);
        var children = skill.getChildByID("skill-container").children;
        for (var i = 0; i < children.length; i++) {
            let skill = children[i].dataset.skill;
            children[i].addEventListener("click", () => {
                SkillManager[skill]();
            });
        }

    }


    createBackground() {

        this.lights.enable().setAmbientColor(0x4d494f);
        this.lights.addLight(200, 200, 100, 0xaeecf4, 1);
        this.lights.addLight(440, 200, 200, 0xaeecf4, 1);

        this.add.image(320, 240, "stars").setScale(1.5).setPipeline("Light2D");
        this.add.image(320, 260, "star_cloud").setScale(1.3).setPipeline("Light2D");
    }

    createListeners() {
        this.enemyTurnIndex = 0;
        this.events.on("comboMatched", this.onComboMatched.bind(this));
        this.events.on("damagePlayer", (damage) => {
            this.healthBar.onHit(damage);
            if(this.healthBar.currentHealth <=0){
                this.scene.stop().stop("HudScene").run("DeathScene");
            }
        });
        this.events.on("enemyDied", (enemy) => {
            this.enemies.splice(this.enemies.indexOf(enemy), 1);
        });
        this.events.on("startEnemyTurn", () => {
            if (this.enemies.length == 0) {
                this.add.tween({
                    targets: this.cameras.main,
                    alpha: 0.5,
                    duration: 1000,
                    onComplete: () => {
                        if(this.level == 4){
                            return this.scene.stop().stop("HudScene").run("VictoryScene");
                        }
                        this.scene.run("RewardsScene");
                    }
                });
                return;
            }
            this.enemies[this.enemyTurnIndex++].emit("startTurn");
        });
        this.events.on("enemyTurnEnd", () => {
            if (this.enemyTurnIndex == this.enemies.length) {
                this.enemyTurnIndex = 0;
                return this.events.emit("startPlayerTurn");
            }
            this.events.emit("startEnemyTurn");
        });
    }

    createEnemies() {

        this.enemies = [];
        this.enemyMap = new Map();
        let enemyData = this.cache.json.get("enemies");
        for (let i = 0; i < enemyData.length; i++) {
            this.enemyMap.set(enemyData[i].name, enemyData[i]);
        }

        let data = this.cache.json.get("levels");
        let level = this.level;
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

        let damage = Math.round(numOrbs * modifiers.universalDamage * this.getDamageMult(orbType));
        gameStats.damageDealt += damage;
        this.totalDamage += damage;
        this.comboCounter.increment();
        this.multiplier.increase(1 - numOrbs / 100 * 3);

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

        let html = `<p style = "display: inline; font: 8px kreon; color: DarkCyan; border-bottom: 1px solid; user-select: none; pointer-events: none;" >combos</p>
                    <p id= "comboCounter" data-counter= "0" style= "display: inline; font: 12px kreon; color: CadetBlue; user-select: none; pointer-events: none; " >0</p>`;
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
            gameStats.combosMade += 1;
            this.comboCounter.dataset.counter++;
            this.comboCounter.innerText = this.comboCounter.dataset.counter;
        }

        this.createMultiplierDamageAnimation();
    }


    createMultiplier() {


        let html = `<p style = "display: inline; font: 8px kreon; color: DarkCyan; border-bottom: 1px solid; user-select: none; pointer-events: none;" >multiplier</p>
                    <p id= "multiplier" data-num= "0" class= "multiplier" >0.00x</p>`;
        let multiplierText = this.add.dom(64, 100).createFromHTML(html);
        this.multiplier = multiplierText.getChildByID("multiplier");

        this.multiplier.tweenTo = (val) => {
            this.tweens.addCounter({
                from: parseFloat(this.multiplier.innerText),
                to: val,
                duration: 500,
                onUpdate: tween => {
                    this.multiplier.innerText = tween.getValue().toFixed(2) + "x";
                }
            });
        };
        this.multiplier.changeTo = (newVal) => {
            this.multiplier.dataset.num = newVal;
            this.multiplier.tweenTo(newVal);
        };
        this.multiplier.increase = (num) => {
            let newVal = (num + parseFloat(this.multiplier.dataset.num)).toFixed(2);
            this.multiplier.dataset.num = newVal;
            this.multiplier.tweenTo(newVal);
        };
        this.multiplier.multiply = (num) => {
            let newVal = (num * parseFloat(this.multiplier.dataset.num)).toFixed(2);
            this.multiplier.dataset.num = newVal;
            this.multiplier.tweenTo(newVal);
        };
        this.multiplier.glow = () => {
            this.multiplier.classList.add("multiplier-glow");
        }
    }

    createChangeOrbButton() {

        let html = `<button id = "orb-change" style = "color: wheat; border-radius: 2px; background-color: Black;" >orb change</button>`;
        let but = this.add.dom(300, 120).createFromHTML(html);
        but.getChildByID("orb-change").addEventListener("click", () => {
            SkillManager["Fire Orb Spawn"]();
        });
    }

    createMultiplierDamageAnimation() {

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
            gameStats.turnsTaken+=1;
            let enemy = this.enemies[Phaser.Math.Between(0, this.enemies.length - 1)];
            this.time.delayedCall(2000, () => {
                if (!enemy) {
                    this.add.tween({
                        targets: this.cameras.main,
                        alpha: 0.5,
                        duration: 1000,
                        onComplete: () => {
                            if(this.level == 4){
                                return this.scene.stop().stop("HudScene").run("VictoryScene");
                            }
                            this.scene.run("RewardsScene");
                        }
                    });
                    return;
                }
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

                        let damage = Math.round(this.totalDamage * this.multiplier.dataset.num * 0.25);
                        gameStats.damageDealt+= damage;

                        enemy.emit("damageEnemy", damage);
                        enemy.emit("updateHealthBar", damage);

                        this.displayDamageText("gold", damage, enemy.x, enemy.y);
                        this.comboCounter.changeTo(0);
                        this.multiplier.changeTo(0);
                        this.multiplier.classList.remove("multiplier-glow");

                        this.totalDamage = 0;
                        this.events.emit("startEnemyTurn");

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
        this.anims.createFromAseprite("Forest Slime");
        this.anims.createFromAseprite("Aqua Slime");
        this.anims.createFromAseprite("Ember Slime");
    }
}