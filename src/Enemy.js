class Enemy extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, data) {
        super(scene, x, y, texture);

        this.setScale(3);

        this.play({ key: `${data.name}_idle`, repeat: -1 });
        this.enemyData = data;
        this.damage = 0;
        this.skills = this.enemyData.skills;

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
        let html = `
        <div class="enemy-tooltip">
            <img src = "assets/UI/qmark.svg"> 
                <span>
                    <span style= "user-select: none; color: GoldenRod;"> ${this.enemyData.name}</span> 
                    <br>
                    <span style= "user-select: none; color: gray; font-size: 10px;"> weakness: 
                        <span style= "user-select: none; color: ${colorMap.get(this.enemyData.weakness)};"> ${this.enemyData.weakness}</span> 
                    </span> 
                </span>
        </div>`;
        this.tooltip = this.scene.add.dom(pos.x,pos.y).createFromHTML(html);
        
        this.on("startTurn", () => {
            this.attack();
        });
    }

    #createHealthBar() {

        let range = this.enemyData.health.split('-');
        let health = Phaser.Math.Between(parseInt(range[0]), parseInt(range[1]));

        this.healthBar = new HealthBar(this.scene, this.x + 20, this.y + 60, health);
        this.healthBar.setWidth();

        this.on("damageEnemy", (damage) => {
            if (this.healthBar.currentHealth - damage <= 0) {
                this.scene.scene.get("CombatScene").events.emit("enemyDied", this);
            }
        });
        this.on("updateHealthBar", (damage) => {
            this.healthBar.onHit(damage);
            if (this.healthBar.currentHealth <= 0) {
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

    calculateDamage() {

        let range = this.enemyData.damage.split('-');
        this.damage = Phaser.Math.Between(parseInt(range[0]), parseInt(range[1]));
    }

    attack() {

        let emitter = this.scene.add.particles(this.x, this.y, this.enemyData.name);
    
        emitter.setConfig({
            quantity: 5,
            speed: { random: [50, 100] },
            lifespan: { random: [200, 400] },
            scale: { random: true, start: 1, end: 0 },
        });

        this.scene.add.tween({
            targets: emitter,
            particleX: 240 - this.x,
            particleY: 300 - this.y,
            duration: 500,
            ease: Phaser.Math.Easing.Cubic.InOut,
            onComplete: () => {
                emitter.explode(50);

               // SkillManager[this.skills[0]]();

                this.scene.events.emit("damagePlayer", this.damage);
                this.scene.time.delayedCall(2000, () => {
                    this.calculateDamage();
                    this.attackDOM.getChildByID("damage").innerHTML = this.damage;
                    emitter.destroy(true);
                    this.scene.events.emit("enemyTurnEnd");
                });
            }
        });
    }

}