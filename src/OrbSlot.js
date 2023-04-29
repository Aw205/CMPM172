class OrbSlot extends Phaser.GameObjects.Zone{


    constructor(scene, x, y) {
        super(scene, x, y);

        this.size = 32;
        this.setSize(this.size,this.size);
        this.setInteractive({dropZone: true });
        this.orb = null;
       
    }
}