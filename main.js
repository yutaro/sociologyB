
let app = new Vue({
    el : '#app',
    data : {
        players : []
    }
})


let players = [];

const FIRST_POINT  = 10,
      PLAYER_COUNT = 400,
      EARN_POINT   = 1,
      WIN_ACC  = 0.3,
      LOSE_ACC = 0,
      FRICTION = 0.95;

const outcome = {
    G : {
        G : "draw",
        C : "win",
        P : "lose"
    },
    C : {
        G : "lose",
        C : "draw",
        P : "win"
    },
    P : {
        G : "win",
        C : "lose",
        P : "draw"
    }
};

class Player{
    constructor(group){
        this.point = FIRST_POINT;
        this.x = random(width);
        this.y = random(height);

        this.speedX = 0;
        this.speedY = 0;

        this.strategy = {
            G : 100,
            C : 100,
            P : 100};
        this.group = group;
    }

    show(){
        let str = this.strategy;
        stroke(0,0,0,30)
        fill(color(str["G"], str["C"], str["P"], 100));
        ellipse(this.x,this.y, this.point, this.point);
        text(Math.round(this.point) + " : [" + this.group.indexOf(this) + "]", this.x, this.y);
        text("G " + str["G"] + ", C " + str["C"] + ", P " + str["P"] , this.x - 50, this.y + 20);
    }

    game(){
        let near = this.near;
        let tHand = this.rollHand;
        let nHand = near.rollHand;
        let result = outcome[tHand][nHand];

        stroke(0,0,0,30)
        line(this.x, this.y, near.x, near.y);

        switch(result){
            case "win":
                this.win(near, tHand);
                near.lose(this, nHand);
                break;
            case "lose":
                this.lose(near, tHand);
                near.win(this, nHand);
                break;
            case "draw":
                break;
        }

        if(this.point < 0){
            this.group.splice(this.group.indexOf(this), 1);
        }
    }

    move(){
        this.x += this.speedX;
        this.y += this.speedY;

        this.speedX *= FRICTION;
        this.speedY *= FRICTION;

        /*
        if(this.x < -this.point){
            this.x += width + this.point * 2;
        }else if(this.x > width + this.point){
            this.x -= width + this.point * 2;
        }

        if(this.y < -this.point){
            this.y += height + this.point * 2;
        }else if(this.y > height + this.point){
            this.y -= height + this.point * 2;
        }
        */

        if(this.x < 0){
            this.x += width;
        }else if(this.x > width) {
            this.x -= width;
        }

        if(this.y < 0){
            this.y += height;
        }else if(this.y > height){
            this.y -= height;
        }
    }


    get near(){
        return this.group.reduce((prev, cur) => {
            if(cur === this)return prev;
            if(prev === this)return cur;
            let pd = dist(prev.x, prev.y, this.x, this.y);
            let cd = dist(cur.x , cur.y , this.x, this.y);

            return (cd < pd)? cur : prev;
        });
    }

    get rollHand(){
        let total = 0;
        for(let hand in this.strategy){
            total += this.strategy[hand];
        }

        let r = random(total);
        for(let hand in this.strategy){
            r -= this.strategy[hand];
            if(r < 0){
                return hand;
            }
        }
    }

    win(near, hand){
        this.point += EARN_POINT;
        this.strategy[hand]++;

        let theta = atan2(near.x - this.x, near.y - this.y );
        this.speedX -= cos(theta) * WIN_ACC;
        this.speedY -= sin(theta) * WIN_ACC;


        switch(hand){
        case "G":
            fill(200,100,100,100);break;
        case "C":
            fill(100,200,100,100);break;
        case "P":
            fill(100,100,200,100);break;
        }
        ellipse(this.x, this.y, 5, 5);
    }

    lose(near, hand){
        this.point -= EARN_POINT;
        this.strategy[hand]--;

        let theta = atan2(near.x - this.x, near.y - this.y);
        this.speedX += cos(theta) * LOSE_ACC;
        this.speedY += sin(theta) * LOSE_ACC;
    }
}


function setup(){
    createCanvas(1000,1000);

    for(let i = 0; i < PLAYER_COUNT; i++){
        players.push(new Player(players));
    }

}

function draw(){
    background(255);

    players.forEach(player => {
        player.game();
        player.move();
        player.show();
    });

    app.players = players;
    console.log(app.players);
}
