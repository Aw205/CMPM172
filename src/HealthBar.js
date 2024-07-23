class HealthBar extends Phaser.GameObjects.DOMElement {

    constructor(scene,x,y,maxHealth) {
        super(scene,x,y);
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;

        let html = `
         <div class="health-bar" id = "healthbar">
             <div class="bar" id = "playerBar"></div>
             <div class="health-num" id = "playerHealthNum"> ${this.currentHealth}/${this.maxHealth} </div>
         </div>`;

        this.createFromHTML(html);
        this.scene.add.existing(this);

    }

    onHit(damage) {
        this.currentHealth -= damage;
        this.getChildByID("playerBar").style.width = ((this.currentHealth) / this.maxHealth) * 100 + "%";
        this.getChildByID("playerHealthNum").innerText = this.currentHealth + "/" + this.maxHealth;
    }

    setWidth(){
        this.getChildByID("healthbar").style.width = "100px";
    }
}