class Enemy extends Phaser.GameObjects.Image {

    constructor(scene, x, y, texture,) {
        super(scene, x, y, texture);

        this.scene.add.image(340, 200, "battleCircle").setScale(2);

        this.setScale(0.3);
        let pos = this.getRightCenter();
        let pos2 = this.getTopCenter();
        this.tooltip = this.scene.add.image(pos.x, pos.y, "questionMark").setScale(0.5);
       
        this.#createListeners();

        this.healthBar = new HealthBar(scene,x+20,y+60);
        this.healthBar.setWidth();
        this.scene.events.on("damagedEnemy",(damage)=>{
            this.healthBar.onHit(damage);
        });
        this.createAttackIcon();

        // let data = this.scene.cache.json.get("levels");
        // for (let i = 0; i < data.length; i++) {
        //       console.log(data[i].enemies);

        // }

        this.scene.add.existing(this);
    }

    #createListeners() {

        let labelHTML = `<p style= "width: 100px; padding: 10px; border-style: double; border-radius: 10px; background-color: rgb(20, 20, 20); font: 12px kreon; color: white" >
        <span style= "color: Gold; "> Slime </span> <br> squishy </p>`;
        this.descriptionLabel = this.scene.add.dom(0,0).createFromHTML(labelHTML).setVisible(false);

        this.tooltip.setInteractive();
        this.tooltip.on("pointerover", () => {
            this.tooltip.setTint(0xFFFF00);
           this.descriptionLabel.setPosition(this.tooltip.x + 100, this.tooltip.y).setVisible(true);
        });
        this.tooltip.on("pointerout",()=>{
            this.tooltip.clearTint();
            this.descriptionLabel.setVisible(false);
        });

        this.scene.events.on("startEnemyTurn",()=>{
            console.log("starting enemy turn");
            this.scene.time.delayedCall(1000,()=>{
                this.attack();
            })
        });

    }

    createAttackIcon(){


        let pos2 = this.getTopCenter();
        let attackHTML = `<p style= "float: left; font: 16px kreon; color: DarkSalmon">16</p>
                          <img src="assets/UI/attackIcon.png" style = "transform: scale(0.7,0.7) translateY(25%);" > `;
        this.attackDOM = this.scene.add.dom(pos2.x-20,pos2.y).createFromHTML(attackHTML);
        this.scene.add.tween({
            targets: [this.attackDOM],
            y:pos2.y - 8,
            duration: 800,
            ease: "Circular.InOut",
            yoyo: true,
            loop: -1
        });
        
    }

    attack(){

        let emitter = this.scene.add.particles(this.x, this.y, "fire_particle");

        emitter.setConfig({
            quantity: 5,
            speed: { random: [50, 100] },
            lifespan: { random: [200, 400] },
            scale: { random: true, start: 1, end: 0 }
        });

        this.scene.add.tween({
            targets: emitter,
            particleX: 240 - this.x,
            particleY: 300 - this.y,
            duration: 500,
            onComplete: () => {
                emitter.explode(50);
                //this.displayDamageText(color, damage, this.enemy.x, this.enemy.y);
                this.scene.events.emit("damagePlayer",16);
                this.scene.time.delayedCall(1000,()=>{
                    emitter.destroy(true);
                    this.scene.events.emit("startPlayerTurn");
                });
            }
        });
    }

}