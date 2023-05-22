class RewardsScene extends Phaser.Scene {

    constructor() {
        super("RewardsScene");
    }

    create() {

        let img = document.createElement("img");
        img.src = "assets/images/artifacts/Flower Katana.png";
        img.classList.add("reward-artifact");

        let html = `
                    <link rel = "stylesheet" href= "./src/rewards.css">
                    <div class="reward-window">
                        <div class="reward-text" >Rewards</div>
                        <div id = "gold" data-amount = "40" class = "reward" > 40 Gold </div>
                        <div id = "item" class ="reward" > 
                            ${img.outerHTML}
                            <p style=" padding-left: 40px; margin: 0px;">Flower Katana </p>
                           
                        </div>
                        <button id = "continue" class="reward-continue"> Continue </button>
                    </div>`;
        let rewardsWindow = this.add.dom(270, 480).createFromHTML(html).setAlpha(0);
       
        let goldReward = rewardsWindow.getChildByID("gold");
        goldReward.addEventListener("click", () => {
            this.scene.get("HudScene").events.emit("incrementGold", parseInt(goldReward.dataset.amount));
            rewardsWindow.getChildByID("gold").remove();
        });

        let itemReward = rewardsWindow.getChildByID("item");
        itemReward.addEventListener("click", () => {
            rewardsWindow.getChildByID("item").remove();
        });

        rewardsWindow.getChildByID("continue").addEventListener("click", () => {
            this.scene.stop().stop("CombatScene").run("CampfireScene");
        });

        this.add.tween({
            targets: rewardsWindow,
            y: 140,
            alpha: 1,
            duration: 500,
            ease:"Sine.InOut"
        });
    }
}
