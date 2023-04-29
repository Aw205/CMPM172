class Tavern extends Phaser.Scene {

    constructor() {
        super("Tavern");
    }

    create() {


        this.createMap();
        this.player = new Player(this, 0, 0, "player");
        this.createGridEngine();
        this.createObjectLayers();

        //this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
        this.cameras.main.setZoom(2, 2);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // this.events.on("transitionwake", (sys, data) => {
        //     this.cameras.main.fadeIn(1500);
        //     this.sound.get("menu_music").resume();
        // });
        // this.events.on("sleep", () => {
        //     this.sound.get("menu_music").pause();
        // });
    }

    createMap() {
        this.map = this.make.tilemap({ key: "tavern" });
        for (let ts of this.map.tilesets) {
            this.map.addTilesetImage(ts.name);
        }
        for (let layer of this.map.layers) {
            this.map.createLayer(layer.name, this.map.tilesets);
        }
    }

    createObjectLayers() {

        let layerOrder = [];
        let layerDepth = - 1;
        let objectDepth = 0.0;
        for (let layer of this.map.objects) {
            layerOrder.push([layer.name, "objectLayer"]);
        }
        for (let layer of this.map.layers) {
            layerOrder.push([layer.name, "tileLayer"]);
        }
        layerOrder.sort((a, b) => {
            return a[0] - b[0];
        });
        for (let i = 0; i < layerOrder.length; i++) {
            if (layerOrder[i][1] == "tileLayer") {
                layerDepth++;
                objectDepth = layerDepth;
                continue;
            }
            let arr = this.map.createFromObjects(layerOrder[i][0]);
            for (let obj of arr) {
                obj.setDepth(objectDepth);
                objectDepth += 0.01;
            }
        }
    }

    createGridEngine() {
        const gridEngineConfig = {
            characters: [
                {
                    id: "player",
                    sprite: this.player,
                    walkingAnimationMapping: 6,
                    startPosition: { x: 3, y: 2 },
                    speed: 4,
                },
            ],
        };
        this.gridEngine.create(this.map, gridEngineConfig);
    }
}    