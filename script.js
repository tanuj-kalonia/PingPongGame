const { log: print } = console;
print("hello world")

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const restart = document.getElementById('restart');
const message = document.getElementById('win_message');
const instruction = document.getElementById("instruction");
const start = document.getElementById("start");

const white = "WHITE";
const black = "BLACK";
let gameOver = false;
let gameStart = false;
let userWon = false;
// print(context);

// creating user paddle
const user = {
    x: 0,
    y: (canvas.height / 2) - (100 / 2),
    width: 10,
    height: 100,
    color: white,
    score: 0
}

// creating computer paddle
const computer = {
    x: canvas.width - 10,
    y: (canvas.height / 2) - (100 / 2),
    width: 10,
    height: 100,
    color: white,
    score: 0
}

// create the ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 2,
    velocityX: 2,
    velocityY: 2,
    color: white
}

// create the net
const net = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: white,
}
// draw net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 30) {
        drawRectangle(net.x, net.y + i, net.width, net.height, white);
    }
}

// draw rectange funtion
function drawRectangle(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// draw circular ball
function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    // arc(center, radius, angleOfArc, direction:false -> antiClockWise);
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// draw text
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "35px hack";
    context.fillText(text, x, y);
}


// drawRectangle(0, 0, canvas.width, canvas.height, black);
// drawCircle(100, 100, 20, "WHITE");
// drawText("Tanuj", 120, 120, "RED");


// render the game here 
function render() {
    // clear the canvas
    drawRectangle(0, 0, canvas.width, canvas.height, black);

    // draw the net
    drawNet();

    // draw user and computer Score
    drawText(user.score, canvas.width / 4, canvas.height / 5, white);
    drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, white);

    // draw user and computer paddle
    drawRectangle(user.x + 10, user.y, user.width, user.height, white);
    drawRectangle(computer.x - 10, computer.y, computer.width, computer.height, white);

    // draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// function to move the paddle

// for user
window.addEventListener('keydown', (event) => {
    const keyPressed = event.key;
    print(keyPressed);

    if (keyPressed == 'w' && user.y > 20) {
        user.y -= 15;
    }
    if (keyPressed == 's' && user.y + user.height < canvas.height - 20) {
        user.y += 15;
    }

});

// this can be clubbed in user controller
// for computer
// window.addEventListener('keydown', (event) => {
//     const keyPressed = event.key;
//     print(keyPressed);
//     if (keyPressed == 'ArrowUp' && computer.y > 20) {
//         computer.y -= 10;
//     }
//     if (keyPressed == 'ArrowDown' && computer.y + computer.height < canvas.height - 20) {
//         computer.y += 10;
//     }
// });



function collision(ball, player) {
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    // cntd for collision
    return ball.right > player.left &&
        ball.left < player.right &&
        ball.bottom > player.top &&
        ball.top < player.bottom;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// funtion to restart the game
function startGame() {
    gameStart = true;
    start.style.display = "none";
}
function restartGame() {
    gameOver = false;
    userWon = false;
    user.score = 0;
    computer.score = 0;
    resetBall();
}


// update function -> pos, valocity and sciore
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;


    // this controles the movement of computer paddle
    // Computer will always follow the y-coordinate of ball
    let computerLevel = 0.1;
    computer.y += (ball.y - (computer.y + computer.height / 2)) * computerLevel;

    // as the ball hits the top and bottom boundary, we need to reverse the velocity of the ball
    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;
    if (ballBottom > canvas.height || ballTop < 0) {
        // revert the velocity of the ball in y dir
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width / 2) ? user : computer;
    if (collision(ball, player)) {
        // find where the ball hits the player
        // point = ball center - player center
        let collidePoint = ball.y - (player.y + player.height / 2)
        collidePoint = collidePoint / (player.height / 2); // ranges from -1 to 1

        // fix the angle at 454 degree (pi / 4)
        let angle = collidePoint * Math.PI / 4;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        // change the velocity X and Y
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        // each time player hits the ball, increase the speed of ball
        ball.speed += 0.2;

    }

    // update the score
    if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
    if (user.score >= 5) {
        gameOver = true;
        userWon = true;
        message.innerHTML = "You Won 🔥❤️‍🔥"
    }
    else if (computer.score >= 5) {
        gameOver = true;
        userWon = false;
        message.innerHTML = "You Lose 🤧🤧"
    }

    if (gameOver) {
        restart.style.display = "inline"
    }
    else restart.style.display = "none"

}

// the main game funtion

function game() {
    render();
    if (gameStart && !gameOver) update();
}
// render the game at the rate 50fps
const fps = 50;
setInterval(game, 1000 / fps); 