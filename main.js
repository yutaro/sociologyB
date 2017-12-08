let players = [];
const PLAYER_COUNT = 100;

class Player{
    constructor(group){
        this.point = random(100);
        this.x = random(width);
        this.y = random(height);
        this.c = color(random(255), random(255), random(255), 100);
        this.state = Boolean(Math.round(Math.random()));

        this.group = group;
    }

    show(){
        fill(this.c);
        ellipse(this.x,this.y, this.point, this.point);
        text(Math.round(this.point), this.x, this.y);
    }

    game(){
        let near = this.near;

        line(near.x, near.y, this.x, this.y);

        if(this.point < 0){
            this.group.splice(this.group.indexOf(this), 1);
        }
    }

    get near(){
        return this.group.reduce((prev, cur) => {
            if(cur === this)return prev;
            let pd = dist(prev.x, prev.y, this.x, this.y);
            let cd = dist(cur.x , cur.y , this.x, this.y);

            return (cd < pd)? cur : prev;
        });
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
        player.show();
    });
}
