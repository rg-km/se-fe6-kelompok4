const CELL_SIZE = 20;
const CANVAS_SIZE = 500;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{ x: head.x, y: head.y }];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        level: 1,
        speed: 300,
        life: 3
    }
}

function initLife(x, y) {
    return {
        x: x,
        y: y
    }
}

let snake1 = initSnake("green");

let apple = {
    position: initPosition()
}

let apple2 = {
    position: initPosition()
}

let life1 = initLife(0, 0);
let life2 = initLife(1, 0);
let life3 = initLife(2, 0);

const life = [life1, life2, life3];

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnake(ctx, x, y) {
    let img = document.getElementById("snakeHead");
    ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnakeBody(ctx, x, y) {
    let img = document.getElementById("snakeBody");
    ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawApple(ctx, x, y) {
    let img = document.getElementById("apple");
    ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawLife(ctx, x, y) {
    let img = document.getElementById("life");
    ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawLevel(snake) {
    let levelCanvas;
    levelCanvas = document.getElementById("levelBoard");
    let levelCtx = levelCanvas.getContext("2d");

    levelCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    levelCtx.font = "25px Arial";
    levelCtx.fillStyle = "black";
    levelCtx.fillText("Level " + snake.level, 10, 25);
}

function drawScore(snake) {
    let scoreCanvas;
    scoreCanvas = document.getElementById("scoreBoard");
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "25px Arial";
    scoreCtx.fillStyle = "black";
    scoreCtx.fillText("Score: " + snake.score, 10, 25);
}

function drawSpeed(snake) {
    let speedCanvas;
    speedCanvas = document.getElementById("speedBoard");
    let speedCtx = speedCanvas.getContext("2d");

    speedCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    speedCtx.font = "25px Arial";
    speedCtx.fillStyle = "black";
    speedCtx.fillText("Speed: " + snake.speed + ".ms", 10, 25);
}



function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        drawSnake(ctx, snake1.head.x, snake1.head.y, snake1.color);
        for (let i = 1; i < snake1.body.length; i++) {
            drawSnakeBody(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
        }

        drawLife(ctx, life1.x, life1.y);
        drawLife(ctx, life2.x, life2.y);
        drawLife(ctx, life3.x, life3.y);

        drawApple(ctx, apple.position.x, apple.position.y);
        drawApple(ctx, apple2.position.x, apple2.position.y);

        drawLevel(snake1);
        drawSpeed(snake1);
        drawScore(snake1);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apple) {
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
        apple.position = initPosition();
        snake.score++;
        snake.body.push({ x: snake.head.x, y: snake.head.y });

        if (snake.speed <= 50 && snake.level > 5) {
            snake.level = 1;
            snake.speed = 300;
            snake.score = 0;
            let audio = new Audio('game-over.wav');
            audio.play();
            setTimeout(() => {
                alert("Hore, kamu menang");
            }, )
        }

        if (snake.score % 5 === 0 && snake.speed > 50) {
            snake.level++;
            snake.speed -= 50;
            let audio = new Audio('level-up.wav');
            audio.play();
            setTimeout(() => {
                alert("Yey, level " + snake.level);
            }, )
        }

        //if (snake.life > 1) {
        //snake.level = 1;
        //snake.score = 0;
        //snake.life = 3;
        //let audio = new Audio('game-over.wav');
        //audio.play();
        //setTimeout(() => {
        //alert("Game Over");
        //}, )
        //}

    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
}

function checkCollision(snakes) {
    let isCollide = false;
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (isCollide) {
        alert("Game over");
        snake1 = initSnake("purple");
        MOVE_INTERVAL = 200;
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision(snake1)) {
        setTimeout(function() {
            move(snake);
        }, snake.speed);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }
})

function initGame() {
    move(snake1);

}

initGame();