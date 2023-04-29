class CombatScene extends Phaser.Scene {

    constructor() {
        super("CombatScene");

    }

    create(data) {
        this.data = data;
        this.cameras.main.setBackgroundColor(0x181e1e);
        this.createAnims();
        this.enemy = new Enemy(this, 340, 160, "slime");

        this.colors = ["#FF0000", "#0096FF", "#50C878", "#702963", "#FFBF00"];
        this.particleArray = ["fire_particle", "water_particle", "wood_particle", "dark_particle", "light_particle"];

        this.events.on("comboMatched", this.onComboMatched.bind(this));
        this.healthBar = new HealthBar(this, 345, 270);
        this.events.on("damagePlayer", (damage) => {
            this.healthBar.onHit(damage);
        });
        this.createComboCounter();
        this.board = new Board(this, 240, 300);
    }

    onComboMatched(color, numOrbs, startPos) {

        let damage = numOrbs;
        this.comboCounter.increment();
        this.playDamageAnimation(color, damage, startPos);
    }

    playDamageAnimation(color, damage, startPos) {

        let particleEmitter = this.add.particles(startPos.x, startPos.y, this.particleArray[color]);

        particleEmitter.setConfig({
            quantity: 5,
            speed: { random: [50, 100] },
            lifespan: { random: [200, 400] },
            scale: { random: true, start: 1, end: 0 }
        });

        this.add.tween({
            targets: particleEmitter,
            particleX: this.enemy.x - startPos.x,
            particleY: this.enemy.y - startPos.y,
            duration: 500,
            onComplete: () => {
                particleEmitter.explode(50);
                this.displayDamageText(color, damage, this.enemy.x, this.enemy.y);
                this.events.emit("damagedEnemy", damage);
                this.time.delayedCall(1000, () => {
                    particleEmitter.destroy(true);
                });
            }
        });
    }

    displayDamageText(color, damage, posX, posY) {

        let html = `<p style= "font: 16px kreon; color: white" >${damage}</p>`;
        let damageText = this.add.dom(posX, posY).createFromHTML(html);
        this.tweens.add({
            targets: damageText,
            x: posX + Phaser.Math.Between(-50, 50),
            y: posY - Phaser.Math.Between(50, 70),
            alpha: 0,
            duration: 1000,
            ease: "Sine.InOut",
            onComplete: () => {
                damageText.destroy(true);
            }
        });
    }


    createComboCounter() {

        let html = `<p style = "display: inline-block; font: 16px kreon; color: white" >Combos: </p>
                    <p id= "comboCounter" data-counter= "0" style= " display: inline-block; font: 16px kreon; color: white" >0</p>`;
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

        createBonusDamageAnimation(){

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
                this.time.delayedCall(2000, () => {
                    this.comboCounter.changeTo(0);
                    particleEmitter.stopFollow();
                    this.add.tween({
                        targets: particleEmitter,
                        particleX: this.enemy.x - particleEmitter.x,
                        particleY: this.enemy.y - particleEmitter.y,
                        duration: 500,
                        onComplete: () => {
                            particleEmitter.explode(50);
                            particleEmitter.particleX = 0;
                            particleEmitter.particleY = 0;
                            particleEmitter.startFollow(block,-block.pathOffset.x,-block.pathOffset.y);
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
            particleEmitter.startFollow(block,-block.pathOffset.x,-block.pathOffset.y);
             this.events.on("comboMatched",()=>{
                particleEmitter.frequency = 0;
                particleEmitter.start();
             });

        }

        createAnims(){
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
        }


        
}