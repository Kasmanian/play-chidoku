export default class Game {
    constructor() {
        this.listeners = { move: [], win: [], lose: [] };
        this.displaced = [];
        this.moved = ''
        this.x = 2;
        this.y = 2;
        this.x_old = 2;
        this.y_old = 2;
        // let map = [0, 0, 1, 0, 0, 0, 0, 5, 0, 0, 4, 8, 9, 6, 2, 0, 0, 7, 0, 0, 0, 0, 3, 0, 0];
        this.board = this.init();
        while(!this.boolean()) this.board = this.init();
        // console.log(this.boolean())
        this.shuffle();
    }
    init() {
        let board = new Array(25).fill(0);
        let map = remap();
        let value = [1, 2, 3, 4, 5];
        for (let i = 0; i < 25; i++) {
            let r = Math.floor(i / 5);
            let c = i % 5;
            value = unsort(value);
            for (let j in value) {
                let v = value[j];
                if (!map[r].includes(v)) if (v != map[0][c] & v != map[1][c] & v != map[2][c] & v != map[3][c] & v != map[4][c]) {
                    map[r][c] = v;
                    board[i] = v;
                    break;
                }
                if (j == value.length - 1) {
                    map = remap();
                    board = new Array(25).fill(0);
                    i = -1;
                }
            }
        }
        return board;
    }
    move(e, i) {
        if (i > 4 || i < 0)
            return;
        let x = this.x;
        let y = this.y;
        let b = this.board;
        switch (e) {
            case 0: // u<=>d
                if (i != x) {
                    this.displaced.length = 0;
                    for (let j = 0; j < 5; j++)
                        if (j != y) {
                            [b[j * 5 + i], b[j * 5 + x]] = [b[j * 5 + x], b[j * 5 + i]];
                            this.displaced.push(j * 5 + i);
                            this.moved = i-this.x>0? 'right' : 'left';
                        }
                    this.x_old = this.x;
                    this.x = i;
                }
                break;
            case 1: // l<=>r
                if (i != y) {
                    this.displaced.length = 0;
                    for (let j = 0; j < 5; j++)
                        if (j != x) {
                            [b[i * 5 + j], b[y * 5 + j]] = [b[y * 5 + j], b[i * 5 + j]];
                            this.displaced.push(i * 5 + j);
                            this.moved = i-this.y>0? 'down' : 'up';
                        }
                    this.y_old = this.y;
                    this.y = i;
                }
                break;
            case 2: // solve
                this.board = this.init();
                break;
        }
        if (this.boolean())
            this.update(this.listeners['win']);
        this.update(this.listeners['move']);
    }
    shuffle() {
        let x = [0, 1, 3, 4];
        let y = [0, 1, 3, 4];
        for (let i = 0; i < 999; i++) {
            let j = Math.floor(Math.random() * 4);
            if (i % 2 != 1) {
                this.move(0, y[j]);
                y[j] = this.y;
            } else {
                this.move(1, x[j]);
                x[j] = this.x;
            }
        }
        this.move(0, 2);
        this.move(1, 2);
        this.x_old = 2;
        this.y_old = 2;
    }
    boolean() {
        let col = [{}, {}, {}, {}, {}];
        let row = [{}, {}, {}, {}, {}];
        for (let i = 0; i < 25; i++) {
            let r = Math.floor(i/5);
            let c = i%5;
            let t = this.board[i];
            if (col[c][t]!=undefined) return false;
            col[c][t] = 1;
            if (row[r][t]!=undefined) return false;
            row[r][t] = 1;
        }
        return true;
    }
    onMove(callBack) {
        this.listeners['move'].push(callBack);
    }
    onWin(callBack) {
        this.listeners['win'].push(callBack);
    }
    onLose(callBack) {
        this.listeners['lose'].push(callBack);
    }
    update(event) {
        for (const listener of event) {
            listener(this.board);
        }
    }
    print() {
        console.log(this.board);
    }
}
function unsort(arr) {
    let i = arr.length,  r;
    while (i!=0) {
        r = Math.floor(Math.random()*i);
        i--;
        [arr[i], arr[r]] = [arr[r], arr[i]];
    }
    return arr;
}

function remap() {
    let arr = new Array(5);
    for (let i = 0; i < 5; i++) arr[i] = new Array().fill(0);
    return arr;
}