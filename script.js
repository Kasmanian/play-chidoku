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

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

const renderBoardState = function(board) {
    let state = game.boolean();
    let isMobile = window.mobileCheck();
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
             : game.x_old!=game.x|game.y_old!=game.y?  `<div id="dialogue" class="dialogue"><p>Make the digits in every line <b>unique!</b></p></div>` 
             : isMobile? `<div id="dialogue" class="dialogue"><p>Use the pad to move the tiles!</p></div>` 
             : `<div id="dialogue" class="dialogue"><p>Use the WASD or arrow keys to move the tiles!</p></div>`;
    let oldb = document.getElementById("board");
    let oldd = document.getElementById("dialogue");
    $(newb).insertAfter(oldb);
    $(newd).insertAfter(oldd);
    oldb.remove();
    oldd.remove();
    newd = document.getElementById("dialogue");
    if(isMobile&document.getElementById("controller")==undefined) {
        let ctrl = `<div id="controller" class="controller">
                        <div>
                            <button id="btn-w" class="btn-w" type="button">W</button>
                        </div>
                        <div class="AD">
                            <button id="btn-a" class="btn-a" type="button">A</button>
                            <button id="btn-d" class="btn-d" type="button">D</button>
                        </div>
                        <div>
                            <button id="btn-s" class="btn-s" type="button">S</button>
                        </div>
                    </div>`;
        $(ctrl).insertAfter(newd);
        const $root = $('#root');
        $($root).on("click", ".btn-w", handleButtonPressed);
        $($root).on("click", ".btn-a", handleButtonPressed);
        $($root).on("click", ".btn-d", handleButtonPressed);
        $($root).on("click", ".btn-s", handleButtonPressed);
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
        root.style.setProperty("--primary-2", "#0A0414");
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
