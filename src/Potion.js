class Potion extends Phaser.GameObjects.Image{


    constructor(scene, x, y, texture, itemData) {
        super(scene, x, y, texture);

        this.scene.add.existing(this);
    }


   createPotionEffects(){

    this.restoreHealth = () =>{
        console.log("restoring health");
    };


   }

    
    

}