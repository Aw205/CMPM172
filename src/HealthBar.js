class HealthBar extends Phaser.GameObjects.GameObject {

    constructor(scene,x,y) {
        super(scene);
        this.x = x;
        this.y = y;

        this.maxHealth = 100;
        this.currentHealth = 100;
        this.createBar();

    }

    createBar() {

        let html = `
        <link rel="stylesheet" type="text/css" href="idk.css">
         <div class="health-bar" id = "healthbar">
             <div class="bar" id = "playerBar">
             <div class="hit" id = "hitBar" ></div>
             </div>
             <div class="health-num" id = "playerHealthNum"> ${this.currentHealth}/100 </div>
         </div>`;
        this.healthBar = this.scene.add.dom(this.x, this.y).createFromHTML(html);

    }

    onHit(damage) {

        this.currentHealth -= damage;
        this.healthBar.getChildByID("playerBar").style.width = ((this.currentHealth) / this.maxHealth) * 100 + "%";
        this.healthBar.getChildByID("playerHealthNum").innerText = this.currentHealth + "/" + this.maxHealth;
    }

    setWidth(){

        this.healthBar.getChildByID("healthbar").style.width = "100px";


    }




}