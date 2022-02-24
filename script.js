import Game from "./engine/game.js";
var theme = 'c';
var game = new Game();
var time = 0;
var keydir = { 87: 1, 65: 0, 83: 1, 68: 0, 38: 1, 37: 0, 40: 1, 39: 0, 'w': 1, 'a': 0, 's': 1, 'd': 0 };
//              w      a      s      d      ^      <      v      >
// 32: 2

timer();

var keyfun = { 
    87: ()=> {return game.y-1}, 
    65: ()=> {return game.x-1}, 
    83: ()=> {return game.y+1},
    68: ()=> {return game.x+1},
    38: ()=> {return game.y-1}, 
    37: ()=> {return game.x-1}, 
    40: ()=> {return game.y+1},
    39: ()=> {return game.x+1},
    'w': ()=> {return game.y-1}, 
    'a': ()=> {return game.x-1}, 
    's': ()=> {return game.y+1},
    'd': ()=> {return game.x+1}
};
// 32: ()=> {return game.x}

const renderBoardState = function(board) {
    let state = game.boolean();
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let tiles = ``;
    let color = theme!='c'? `` : `color: var(--primary-4);`
    for (let i=0; i<25; i++) {
        let tile = board[i];
        let popClass = state? `pop-all` : game.x_old==game.x&game.y_old==game.y? `` : !game.displaced.includes(i)? `` : `pop-${game.moved}`;
        let selClass = state? `style="${color} background: url('./assets/tile_blank_${theme}.png'); background-size: cover;"`
                     : i%5==game.x|Math.floor(i/5)==game.y? `style="${color} background: url('./assets/tile_blank_${theme}.png'); background-size: cover;"` 
                     : ``;
        tiles+=`<div class="grid-item ${popClass}" ${selClass}><div>${tile}</div></div>`;
    }
    let newb = `<div id="board" class="grid">` + tiles + `</div>`;
    let newd = state? `<div id="dialogue" class="dialogue"><p>You've won! Try a new game!</p></div>` 
             : game.x_old!=game.x|game.y_old!=game.y?  `<div id="dialogue" class="dialogue"><p>Move tiles to make the digits in every line <b>unique!</b></p></div>` 
             : isMobile? `<div id="dialogue" class="dialogue"><p>Use the pad to move the tiles!</p></div>` 
             : `<div id="dialogue" class="dialogue"><p>Use the WASD or arrow keys to move the tiles!</p></div>`;
    let oldb = document.getElementById("board");
    let oldd = document.getElementById("dialogue");
    $(newb).insertAfter(oldb);
    $(newd).insertAfter(oldd);
    oldb.remove();
    oldd.remove();
    if(isMobile) {
        let ctrl = `<div class="controller">
                        <div>
                            <button class="btn-w" type="button">W</button>
                        </div>
                        <div class="AD">
                            <button class="btn-a" type="button">A</button>
                            <button class="btn-d" type="button">D</button>
                        </div>
                        <div>
                            <button class="btn-s" type="button">S</button>
                        </div>
                    </div>`;
        $(ctrl).insertAfter(newd);
    }
}

const handleKeyPressed = function(event) {
   let key = event.keyCode;
   if (game!=undefined&keydir[key]!=undefined) {
       game.move(keydir[key], keyfun[key]());
   }
}

const handleButtonPressed = function(event) {
    let key = event.target.id[4];
    if (game!=undefined&keydir[key]!=undefined) {
        game.move(keydir[key], keyfun[key]());
    }
}

const handleResetBoard = function() {
    game = new Game();
    time = -1;
    onload();
    keyOn();
    renderBoardState(game.board);
}

const handleThemeChange = function() {
    let body = document.body;
    let root = document.getElementById("root");
    if (theme!='c') {
        root.style.setProperty("--primary-1", "#F3F7FF");
        root.style.setProperty("--primary-2", "#D1DBF1");
        root.style.setProperty("--primary-3", "#B1C2E5");
        root.style.setProperty("--primary-4", "#4F5CA8");
        body.style.setProperty("--primary-2", "#D1DBF1");
        body.style.setProperty("--primary-4", "#4F5CA8");
    } else {
        root.style.setProperty("--primary-1", "#C9A6DD");
        root.style.setProperty("--primary-2", "#513D5B");
        root.style.setProperty("--primary-3", "#3C2944");
        root.style.setProperty("--primary-4", "#211533");
        body.style.setProperty("--primary-2", "#0A0414");
        body.style.setProperty("--primary-4", "#C9A6DD");
    }
    theme = theme!='c'? 'c' : 'd';
    renderBoardState(game.board);
}

const onload = function() {
    game.onMove(board => {
        // console.log('moving')
        renderBoardState(board);
    });
    
    game.onWin(async board => {
        keyOff();
    });
    
    game.onLose(async board => {
    });
}

const keyOn = function() {
    keydir = { 87: 1, 65: 0, 83: 1, 68: 0, 32: 2 };
}

const keyOff = function() {
    keydir = {};
}

const loadBoardIntoDOM = function(board) {
    // Grab a jQuery reference to the root HTML element
    onload();
    const $root = $('#root');
    renderBoardState(board);
    $($root).on("click", ".reset", handleResetBoard);
    $($root).on("click", ".slider", handleThemeChange);
    $($root).on("click", ".btn-w", handleButtonPressed);
    $($root).on("click", ".btn-a", handleButtonPressed);
    $($root).on("click", ".btn-d", handleButtonPressed);
    $($root).on("click", ".btn-s", handleButtonPressed);
    document.onkeydown = function(e) {
        handleKeyPressed(e)
        e.preventDefault();
    };
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function timer() {
    while (true) {
        await sleep(10);
        if (Object.keys(keydir).length != 0) {
            let t0 = Math.floor(time/100);
            let t1 = Math.floor(t0/60);
            t1 = t1<10? `0${t1}` : `${t1}`;
            let t2 = (t0%60)<10? `:0${t0%60}` : `:${t0%60}`;
            document.getElementById("time").textContent = t1 + t2;
            time+=1;
        }
    }
}

$(function() {
    loadBoardIntoDOM(game.board);
});