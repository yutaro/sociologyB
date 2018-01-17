
let app = new Vue({
    el : '#app',
    data : {
        players : []
    },
    computed : {
        GPlayer : function(){
            return this.players.filter(player => {
                let str = player.strategy;
                return str.G > str.C && str.G > str.P;
            }).length;
        },
        PPlayer : function(){
            return this.players.filter(player => {
                let str = player.strategy;
                return str.P > str.G && str.P > str.C;
            }).length;
        },
        CPlayer : function(){
            return this.players.filter(player => {
                let str = player.strategy;
                return str.C > str.G && str.C > str.P;
            }).length;
        }
    }
})


let players = [];

const FIRST_POINT  = 10,
      PLAYER_COUNT = 400,
      EARN_POINT   = 1,
      WIN_ACC  = 0.5,
      LOSE_ACC = 0.5,
      FRICTION = 0.95,
      LOOP_COUNT = 10000;

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
        text(Math.round(this.point), this.x, this.y);
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
        this.speedX += sin(theta) * WIN_ACC;
        this.speedY += cos(theta) * WIN_ACC;


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
        this.speedX -= sin(theta) * LOSE_ACC;
        this.speedY -= cos(theta) * LOSE_ACC;
    }
}


function initialize(){
    players = [];
    for(let i = 0; i < PLAYER_COUNT; i++){
        players.push(new Player(players));
    }
}

function setup(){
    createCanvas(1000,1000);
    initialize();
}

function draw(){
    background(255);
    players.forEach(player => {
        player.game();
        player.move();
        player.show();
    });

    // let dataset = [["id", "G", "C", "P" ,"Player"]];

    // for(let j = 0; j < 20; j++){
    //     initialize();
    //     for(let i = 0; i < LOOP_COUNT; i++){
    //         players.forEach(player => {
    //             player.game();
    //             player.move();
    //             player.show();
    //         });
    //     }

    //     let GCount = 0;
    //     let CCount = 0;
    //     let PCount = 0;
    //     players.forEach( p => {
    //         let str = p.strategy;
    //         if(str.G > str.P && str.G > str.C) GCount++;
    //         else if(str.C > str.G && str.C > str.P) CCount++;
    //         else if(str.P > str.G && str.P > str.C) PCount++;
    //     })
    //     dataset.push(["" + j, "" + GCount, "" + CCount,"" + PCount, "" + players.length]);
    // }

    // downloadCsv(dataset, "" + WIN_ACC + "_" + LOSE_ACC + "_" + FRICTION + ".csv")

    // players.forEach(player => {
    //     player.show();
    // });

    
    app.players = players;

    fill(255,255,255,200);

    rect(5, 5, 150, 100);
    fill(10, 10, 10, 100);
    text("LOOP : " + LOOP_COUNT, 20, 20);
    text("G : " + app.GPlayer, 20, 40);
    text("C : " + app.CPlayer, 20, 60);
    text("P : " + app.PPlayer, 20, 80);
    text("Player : " + players.length, 20, 100);


    // saveCanvas("" + WIN_ACC + "_" + LOSE_ACC + "_" + FRICTION + ".png");
    // noLoop();
    
}

var downloadCsv = (function() {    
        var tableToCsvString = function(table) {
            var str = '\uFEFF';
            for (var i = 0, imax = table.length - 1; i <= imax; ++i) {
                var row = table[i];
                for (let j = 0, jmax = row.length - 1; j <= jmax; ++j) {
                    str += '"' + row[j].replace('"', '""') + '"';
                    if (j !== jmax) {
                        str += ',';
                    }
                }
                str += '\n';
            }
            return str;
        };
    
        var createDataUriFromString = function(str) {
            return 'data:text/csv,' + encodeURIComponent(str);
        }
    
        var downloadDataUri = function(uri, filename) {
            var link = document.createElement('a');
            link.download = filename;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    
        return function(table, filename) {
            if (!filename) {
                filename = 'output.csv';
            }
            var uri = createDataUriFromString(tableToCsvString(table));
            downloadDataUri(uri, filename);
        };
})();