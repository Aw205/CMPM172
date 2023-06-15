class VictoryScene extends Phaser.Scene {

    constructor() {
        super("VictoryScene");
    }

    create() {

        let s = `   <link rel="stylesheet" type= "text/css" href="./src/hud.css">
                    <div class="victory-text"> Victory </div>
                    <div class="victory-score" data-stat="${gameStats.turnsTaken}"> Turns Taken  
                        <span> 0 </span>
                    </div>
                    <div class="victory-score" data-stat="${gameStats.damageDealt}"> Damage Dealt
                        <span> 0 </span>
                    </div>
                    <div class="victory-score" data-stat="${gameStats.combosMade}"> Combos Made
                        <span> 0 </span>    
                    </div>
                    <div class="victory-score" data-stat="${(gameStats.combosMade/gameStats.turnsTaken).toFixed(1)}"> Average Combos
                        <span> 0 </span>
                    </div>`;
        this.add.dom(100,100).createFromHTML(s);

        let scores = document.getElementsByClassName("victory-score");
        for(let i =0;i<scores.length;i++){
            scores[i].classList.add("fade-in-text");
            scores[i].style.animationDelay = `${i}s`;
            scores[i].addEventListener("animationstart",()=>{
                this.tweens.addCounter({
                    from: 0,
                    to: scores[i].dataset.stat,
                    duration: 2000,
                    onUpdate: tween => {
                        scores[i].firstElementChild.innerText = Math.round(tween.getValue());
                    },
                    onComplete: () => {
                        scores[i].firstElementChild.innerText = scores[i].dataset.stat;
                    }
                });
            });
            
        }

    }
}
