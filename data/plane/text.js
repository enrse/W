// 调整游戏界面在网页的高度
document.getElementById('stage').style.height = String(window.innerHeight - 5) + "px"
document.getElementById('canvas').height = window.innerHeight - 8


//飞机大战
/*
调整生命                112——112
控制生产对象         184——213  
发射子弹(hero) 366——383   
设置画板                10——11
画角色                    230——244
角色移动                216——227
创建角色                34——105                   
 */

// getContext() 方法返回一个用于在画布上绘图的环境。
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// 创建背景，图像对象名称 = new Image([宽度],[高度])
var background = new Image();
background.src = "images/background.png";

var sky = new Sky();
//导入小飞机和爆炸效果
var e1 = [];
e1[0] = new Image();
e1[0].src = "images/enemy1.png";
e1[1] = new Image();
e1[1].src = "images/enemy1_down1.png";
e1[2] = new Image();
e1[2].src = "images/enemy1_down2.png";
e1[3] = new Image();
e1[3].src = "images/enemy1_down3.png";
e1[4] = new Image();
e1[4].src = "images/enemy1_down4.png";
//导入中飞机和爆炸效果
var e2 = [];
e2[0] = new Image();
e2[0].src = "images/enemy2.png";
e2[1] = new Image();
e2[1].src = "images/enemy2_down1.png";
e2[2] = new Image();
e2[2].src = "images/enemy2_down2.png";
e2[3] = new Image();
e2[3].src = "images/enemy2_down3.png";
e2[4] = new Image();
e2[4].src = "images/enemy2_down4.png";
//导入大飞机和爆炸效果
var e3 = [];
e3[0] = new Image();
e3[0].src = "images/enemy3_n1.png";
e3[1] = new Image();
e3[1].src = "images/enemy3_n2.png";
e3[2] = new Image();
e3[2].src = "images/enemy3_down1.png";
e3[3] = new Image();
e3[3].src = "images/enemy3_down2.png";
e3[4] = new Image();
e3[4].src = "images/enemy3_down3.png";
e3[5] = new Image();
e3[5].src = "images/enemy3_down4.png";
e3[6] = new Image();
e3[6].src = "images/enemy3_down5.png";
e3[7] = new Image();
e3[7].src = "images/enemy3_down6.png";
//导入我方飞机和爆炸效果
var h = [];
h[0] = new Image();
h[0].src = "images/hero1.png";
h[1] = new Image();
h[1].src = "images/hero2.png";
h[2] = new Image();
h[2].src = "images/hero_blowup_n1.png";
h[3] = new Image();
h[3].src = "images/hero_blowup_n2.png";
h[4] = new Image();
h[4].src = "images/hero_blowup_n3.png";
h[5] = new Image();
h[5].src = "images/hero_blowup_n4.png";

// 创建开始页面上的飞机大战LOGO
var copyright = new Image();
copyright.src = "images/shoot_copyright.png";

// 暂停按钮
var pause = new Image();
pause.src = "images/game_pause_nor.png";

// 两种颜色的子弹
var b = [];
b[0] = new Image();
b[0].src = "images/bullet1.png";
b[1] = new Image();
b[1].src = "images/bullet2.png";

// 超级子弹道具
var u = []
u[0] = new Image();
u[0].src = "images/ufo1.png";

var enemies = [];
var hero = new Hero(0, 0, 99, 124, 1, h, 2);
var bullets = [];
var score = 0;
var ufo = [];

var heroes = 3;

var START = 1;
var RUNNING = 2;
var PAUSE = 3;
var GAME_OVER = 4;
var state = START;
var s_c = true

// 按指定的毫秒调用函数
setInterval(function () {
    controlState(ctx);
}, 10);

function controlState(ctx) {
    switch (state) {
        case START:
            sky.paint(ctx);
            sky.step();
            var x = 20;
            // var y = 130;  设置图像上下居中
            var y = (window.innerHeight - 50 - copyright.height) / 2
            ctx.drawImage(copyright, x, y);
            break;
        case RUNNING:
            paintComponent(ctx);
            sky.step();
            componentStep();
            componentEnter();
            hero.shoot();
            checkHit();
            deleteComponent();
            break;
        case PAUSE:
            paintComponent(ctx);
            sky.step();
            ctx.drawImage(pause, 0, 0);
            break;
        case GAME_OVER:
            paintComponent(ctx);
            sky.step();
            var x = (480 - 245) / 2;
            var y = 852 * (0.3);
            ctx.font = "40px 微软雅黑";
            ctx.fillText("GAME OVER", x, y);
            if (s_c) {
                // 不显示游戏结束对话框
                // alert("YOUSCORE:"+score);
                s_c = false;
            }
            break;
    }
}

canvas.onclick = function () {
    if (state == START) {
        state = RUNNING;
    }
}
canvas.onmouseout = function () {
    if (state == RUNNING) {
        state = PAUSE;
    }
}
canvas.onmouseover = function () {
    if (state == PAUSE) {
        state = RUNNING;
    }
}
function isActionTime(lastTime, interval) {
    if (lastTime == 0) {
        return true;
    }
    var currentTime = new Date().getTime();
    return currentTime - lastTime >= interval;
}

var lastTime = 0;
var interval = 400;
function componentEnter() {
    if (!isActionTime(lastTime, interval)) {
        return;
    }
    lastTime = new Date().getTime();
    var n = parseInt(Math.random() * 10);
    switch (n) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            enemies[enemies.length] = new Enemy(0, -51, 57, 51, 1, 1, 1, e1, 1);
            break;
        case 8:
            enemies[enemies.length] = new Enemy(0, -95, 69, 95, 2, 3, 5, e2, 1);
            break;
        case 9:
            if (enemies[0] == undefined || enemies[0].type != 3) {
                enemies.splice(0, 0, new Enemy(0, -258, 169, 258, 3, 20, 20, e3, 2));
            }
    }
    var random = parseInt(Math.random() * 15);
    if (random == 1) {
        ufo[ufo.length] = new Ufo(0, 0, 58, 88, 1, u, 1);
    }
}

function componentStep() {
    sky.step();
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].step();
    }
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].step();
    }
    hero.step();
    for (var i = 0; i < ufo.length; i++) {
        ufo[i].step();
    }
}

function paintComponent(ctx) {
    sky.paint(ctx);
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].paint(ctx);
    }
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].paint(ctx);
    }
    hero.paint(ctx);
    for (var i = 0; i < ufo.length; i++) {
        ufo[i].paint(ctx);
    }
    ctx.font = "20px 微软雅黑";
    ctx.fillText("SCORE:" + score, 10, 20);
    ctx.fillText("LIFE:" + heroes, 400, 20);
}

function Sky() {
    this.img = background;
    this.width = 480;
    this.height = 852;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = -this.height;
    this.interval = 400;
    this.lastTime = 0;
    this.paint = function (ctx) {
        ctx.drawImage(this.img, this.x1, this.y1);
        ctx.drawImage(this.img, this.x2, this.y2);
    }
    this.step = function () {
        if (!isActionTime(this.lastTime, this.interval)) {
            return;
        }
        this.lastTime = new Date().getTime();
        this.y1 = this.y1 + 1;
        this.y2 = this.y2 + 1;
        if (this.y1 > this.height) {
            this.y1 = -this.height;
        }
        if (this.y2 > this.height) {
            this.y2 = -this.height;
        }
    }
}

function getPointOnCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left,
        y: y - bbox.top
    };
}


canvas.onmousemove = function (e) {
    if (state == RUNNING) {
        var mpoint = getPointOnCanvas(e.x, e.y);
        hero.x = mpoint.x - hero.width / 2;
        hero.y = mpoint.y - hero.height / 2;
    }
}
/*飞行函数(x坐标,y坐标,宽度,长度,生命,图片帧,图片帧计数)*/
function FlyingObject(x, y, width, height, life, frames, baseFrameCount) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.life = life;
    this.interval = 10;
    this.lastTime = 0;
    this.down = false;
    this.canDelete = false;
    this.frames = frames;
    this.img = this.frames[0];
    this.frameIndex = 0;
    this.frameCount = baseFrameCount;
    this.paint = function (ctx) {
        ctx.drawImage(this.img, this.x, this.y);
    }
    this.step = function () {
        if (!isActionTime(this.lastTime, this.interval)) {
            return;
        }
        this.lastTime = new Date().getTime();
        if (this.down) {
            if (this.frameIndex == frames.length) {
                this.canDelete = true;
            } else {
                this.img = this.frames[this.frameIndex];
                this.frameIndex++;
            }
        } else {
            this.move();
            this.img = this.frames[this.frameIndex % this.frameCount];
            this.frameIndex++;
        }
    }
    this.move = function () {
        this.y++;
    }
    this.hit = function (component) {
        var c = component;
        return c.x > this.x - c.width && c.x < this.x + this.width && c.y > this.y - c.height && c.y < this.y + this.height;
    }
    this.bang = function () {
        this.life--;
        if (this.life == 0) {
            this.down = true;
            if (this.score) {
                score = score + this.score;
            }
            this.frameIndex = this.frameCount;
        }
    }
    this.outOfBounds = function () {
        return this.y >= 852;
    }
}

function Enemy(x, y, width, height, type, life, score, frames, baseFrameCount) {
    FlyingObject.call(this, x, y, width, height, life, frames, baseFrameCount);
    this.x = Math.random() * (480 - this.width);
    this.y = -this.height;
    this.score = score;
    this.type = type;
}

function Hero(x, y, width, height, life, frames, baseFrameCount) {
    FlyingObject.call(this, x, y, width, height, life, frames, baseFrameCount);
    this.x = 480 / 2 - this.width / 2;
    this.y = 650 - this.height - 30;
    this.shootInterval = 300;
    this.shootLastTime = 0;
    this.multipleFire = false;
    this.power = 0;
    this.shoot = function () {
        if (!isActionTime(this.shootLastTime, this.shootInterval)) {
            return;
        }
        this.shootLastTime = new Date().getTime();
        if (this.multipleFire && this.power != 0) {

            bullets[bullets.length] = new Bullet(this.x + 45, this.y, 9, 21, 1, b, 1, 1);
            bullets[bullets.length] = new Bullet(this.x + 45, this.y, 9, 21, 1, b, 1, 2);
            bullets[bullets.length] = new Bullet(this.x + 45, this.y, 9, 21, 1, b, 1, 3);
            bullets[bullets.length] = new Bullet(this.x + 45, this.y, 9, 21, 1, b, 1, 4);
            bullets[bullets.length] = new Bullet(this.x + 45, this.y, 9, 21, 1, b, 1, 5);
            this.power--;
        } else {
            bullets[bullets.length] = new Bullet(this.x + 45, this.y, 9, 21, 1, b, 1, 3);
        }

    }
    this.move = function () {

    }
}

function Bullet(x, y, width, height, life, frames, baseFrameCount, type) {
    FlyingObject.call(this, x, y, width, height, life, frames, baseFrameCount);
    this.move = function () {
                        /*子弹的发射速度(需要将减去的值+1才是真正的移动值)*/this.y -= 10;
                        /*判断子弹种类*/switch (type) {
            case 1:
                /*往左偏*/
                this.x -= 1;
                break;
            case 2:
                /*稍往左偏*/
                this.x -= 0.45;
                break;
            case 3:
                /*正中心*/
                break;
            case 4:
                /*稍往右偏*/
                this.x += 0.45;
                break;
            case 5:
                /*往右偏*/
                this.x += 1;
        }
    }
    this.outOfBounds = function () {
        return this.y < -this.height;
    }
}

function Ufo(x, y, width, height, life, frames, baseFrameCount) {
    FlyingObject.call(this, x, y, width, height, life, frames, baseFrameCount);
    this.x = Math.random() * (480 - this.width);
    this.y = -this.height;
}

function reload(number) {
    hero.power += number;
    if (hero.power > 0) {
        hero.multipleFire = true;
    }
}

function checkHit() {
    for (var i = 0; i < ufo.length; i++) {
        if (ufo[i].hit(hero)) {
            ufo[i].bang();
            reload(5);
        }
    }
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (enemy.canDelete || enemy.down) {
            continue;
        }
        for (var j = 0; j < bullets.length; j++) {
            var bullet = bullets[j];
            if (bullet.canDelete || bullet.down) {
                continue;
            }
            if (enemy.hit(bullet)) {
                enemy.bang();
                bullet.bang();
            }
        }
        if (enemy.hit(hero)) {
            enemy.bang();
            hero.bang();
        }
    }
}

function deleteComponent() {
    var ary = [];
    var idx = 0;
    for (var i = 0; i < enemies.length; i++) {
        if (!(enemies[i].canDelete || enemies[i].outOfBounds())) {
            ary[idx] = enemies[i];
            idx++;
        }
    }
    enemies = ary;
    ary = [];
    idx = 0;
    for (var i = 0; i < bullets.length; i++) {
        if (!(bullets[i].canDelete || bullets[i].outOfBounds())) {
            ary[idx] = bullets[i];
            idx++;
        }
    }
    bullets = ary;
    ary = [];
    idx = 0;
    for (var i = 0; i < ufo.length; i++) {
        if (!(ufo[i].canDelete || ufo[i].outOfBounds())) {
            ary[idx] = ufo[i];
            idx++;
        }
    }
    ufo = ary;
    if (hero.canDelete) {
        heroes--;
        if (heroes == 0) {
            state = GAME_OVER;
        } else {
            hero = new Hero(0, 0, 99, 124, 4, h, 2);
        }
    }
}