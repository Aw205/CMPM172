class Enemy extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, data) {
        super(scene, x, y, texture);

        this.setScale(3);
        this.play({ key: "Idle", frameRate: 4, repeat: -1 });
        this.enemyData = data;

        this.damage = 0;

        this.#createListeners();
        this.#createAttackIcon();
        this.#createHealthBar();

        this.scene.add.existing(this);
    }

    #createListeners() {

        let colorMap = new Map();
        colorMap.set("Grass", "Green");
        colorMap.set("Fire", "Red");
        colorMap.set("Water", "Blue");
        colorMap.set("None", "Gray");

        let pos = this.getRightCenter();
        this.tooltip = this.scene.add.image(pos.x, pos.y, "questionMark").setScale(0.5);
        let labelHTML = `<p style= "padding: 10px; border-style: solid; border-radius: 10px; background-color: rgb(20, 20, 20); font: 12px kreon; border-color: DarkCyan; color: wheat;" >
        <span style= "color: Gold; "> ${this.enemyData.name} </span> <br> Weakness: 
        <span style= "color: ${colorMap.get(this.enemyData.weakness)};">${this.enemyData.weakness}</span> </p>`;
        this.descriptionLabel = this.scene.add.dom(0, 0).createFromHTML(labelHTML).setVisible(false);

        this.tooltip.setInteractive();
        this.tooltip.on("pointerover", () => {
            this.tooltip.setTint(0xFFFF00);
            this.descriptionLabel.setPosition(this.tooltip.x + 70, this.tooltip.y).setVisible(true);
        });
        this.tooltip.on("pointerout", () => {
            this.tooltip.clearTint();
            this.descriptionLabel.setVisible(false);
        });

        this.scene.events.on("startEnemyTurn", () => {
            console.log("starting enemy turn");
            this.scene.time.delayedCall(1000, () => {
                this.attack();
            })
        });
    }

    #createHealthBar() {
        this.healthBar = new HealthBar(this.scene, this.x + 20, this.y + 60,this.enemyData.health);
        this.healthBar.setWidth();

        this.on("damageEnemy",(damage)=>{
            if(this.healthBar.currentHealth - damage <= 0){
                this.scene.scene.get("CombatScene").events.emit("enemyDied",this);
            }
        });


        this.on("updateHealthBar", (damage) => {
            this.healthBar.onHit(damage);

            if(this.healthBar.currentHealth <= 0){
                
                this.tooltip.setVisible(false);
                this.attackDOM.setVisible(false);
                this.healthBar.setVisible(false);
                this.setVisible(false);
                
            }
        });
    }

    #createAttackIcon() {

        this.calculateDamage();
        let pos2 = this.getTopCenter();
        let attackHTML = `<p id = "damage" style= "float: left; font: 16px kreon; color: DarkSalmon">${this.damage}</p>
                          <img src="assets/UI/swicon.svg" style = "transform: translateX(-20%);" > `;
        this.attackDOM = this.scene.add.dom(pos2.x - 20, pos2.y).createFromHTML(attackHTML);
        this.scene.add.tween({
            targets: [this.attackDOM],
            y: pos2.y - 8,
            duration: 800,
            ease: "Circular.InOut",
            yoyo: true,
            loop: -1
        });

    }

    calculateDamage(){

        let range = this.enemyData.damage.split('-');
        this.damage = Phaser.Math.Between(parseInt(range[0]),parseInt(range[1]));
    }

    attack() {

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
                this.scene.events.emit("damagePlayer", this.damage);
                this.scene.time.delayedCall(1000, () => {
                    this.calculateDamage();
                    this.attackDOM.getChildByID("damage").innerHTML = this.damage;
                    emitter.destroy(true);
                    this.scene.events.emit("startPlayerTurn");
                });
            }
        });
    }

}