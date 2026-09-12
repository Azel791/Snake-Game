
const snakeHead = document.getElementById("snakeHead");
const food = document.getElementById("food");
const gameover = document.getElementById("gameover");
const gameoverbg = document.getElementById("gameoverbg");
const scoreNum = document.getElementById("score");
const score = document.getElementById("scoreBoard");
const game = document.getElementById("game");
const mainMenu = document.getElementById("mainMenu");

let posX = snakeHead.style.left;
let posY = snakeHead.style.top;

let snakeBodyPos = [[300,300],[280,300],[260,300],[240,300]];

let gamespeed = 500;
let moveVal = [20,0];
let gameoverState = false;
let speedup = false;

let prevMove = 'd';

const startButton = document.getElementById("start");
const restartButton = document.querySelector(".gameOverRestart");


// Main Menu game start button event listener
startButton.addEventListener("click",() =>{
    mainMenu.style.display = "none";
    game.style.display = "flex";
    score.style.display = "flex";
    scoreNum.style.display = "flex";
    gameover.style.display = "none";

    gameLoop();
});



// Controls
document.addEventListener("keydown", (e) => {
    switch(e.key){
        case 'w':
            if (prevMove === 's'){ 
                break;
            }
            else {
                moveVal = [0,-20];
                prevMove = 'w';
            }
            
            break;
        case 's':
            if (prevMove === 'w'){ 
                break;
            }
            else {
                moveVal = [0,20];
                prevMove = 's';
            }
            break;
        case 'a':
            if (prevMove === 'd'){ 
                break;
            }
            else {
                moveVal = [-20,0];
                prevMove = 'a';
            }
            break;
        case 'd':
            if (prevMove === 'a'){ 
                break;
            }
            else {
                moveVal = [20,0];
                prevMove = 'd';
            }
            break;
    }
});


//food position randomizer
function foodRand() {
    const randPos = Math.floor(Math.random() * 27 + 2) * 20;

    snakeBodyPos.forEach(([x, y]) => {
        if (x === randPos && y === randPos) {
            foodRand();
            return;
        }
    });

    food.style.left = randPos + 'px';
    food.style.top = randPos + 'px';

    console.log("Food generated");

}

foodRand();

// body creation
function createBody() {
    const tail = snakeBodyPos[snakeBodyPos.length - 1];
    snakeBodyPos.push([...tail]);

    console.log("created body");
    return renderSnakeBody();
}


//initial snake position
snakeHead.style.left = snakeBodyPos[0][0] + 'px';
snakeHead.style.top = snakeBodyPos[0][1] + 'px';

function renderSnakeBody() {
    const game = document.getElementById("game");
    document.querySelectorAll(".snakeBody").forEach((segment) => segment.remove());
    
    
    const tail = snakeBodyPos[snakeBodyPos.length - 1];
    const tailPrev = snakeBodyPos[snakeBodyPos.length - 2];
    const taildirection = [tailPrev[0] - tail[0], tailPrev[1] - tail[1]];
    
    const snakeSegment = document.querySelectorAll(".snake");
    
    
    // Render each body segment
    snakeBodyPos.slice(1).forEach(([x, y]) => {
        const body = document.createElement("div");
        body.classList.add("snakeBody");
        body.classList.add("snake");
        body.style.left = x + 'px';
        body.style.top = y + 'px';
        game.appendChild(body);
        
        if(x === tail[0] && y === tail[1]){
            body.classList.add("snakeTail");
        }else{
            body.classList.remove("snakeTail");
        }
        


    });

    const snakeTail = document.querySelector("div.snakeTail");
    
    // for tne tail direction
    switch (taildirection.toString()) {
        case "20,0":
            console.log("tail direction right");
            snakeTail.style.borderRadius = "50% 0 0% 50%";
            break;
        case "-20,0":
            console.log("tail direction left");
            snakeTail.style.borderRadius = "0 50% 50% 0";
            break;
        case "0,20":
            console.log("tail direction down");
            snakeTail.style.borderRadius = "50% 50% 0 0";
            break;
        case "0,-20":
            console.log("tail direction up");
            snakeTail.style.borderRadius = "0 0 50% 50%";
            break;
    }
    
    

    const head = document.getElementById("snakeHead");
    game.appendChild(head);

    switch (moveVal.toString()) {

        case "20,0":
            snakeHead.style.borderRadius = "0% 50% 50% 0%";
            break;
        case "-20,0":
            snakeHead.style.borderRadius = "50% 0% 0% 50%";
            break;
        case "0,20":
            snakeHead.style.borderRadius = "0% 0% 50% 50%";
            break;
        case "0,-20":
            snakeHead.style.borderRadius = "50% 50% 0% 0%";
            break;

    }



    console.log("Rendered snake body");

}

renderSnakeBody();


function gameLoop() {

    
    snakeHead.style.left = snakeHead.offsetLeft + moveVal[0] + 'px';
    snakeHead.style.top = snakeHead.offsetTop + moveVal[1] + 'px';
    
    console.log(snakeHead.offsetLeft, snakeHead.offsetTop);
    
    for (let i = snakeBodyPos.length - 1; i > 0; i--) {
        snakeBodyPos[i] = [...snakeBodyPos[i - 1]];
    }
    snakeBodyPos[0] = [snakeHead.offsetLeft, snakeHead.offsetTop];
    
    renderSnakeBody();
    
    // Check for food collision
    if (snakeHead.offsetLeft === food.offsetLeft && snakeHead.offsetTop === food.offsetTop) {
        createBody();
        foodRand();
        renderSnakeBody();
        scoreNum.textContent = parseInt(scoreNum.textContent) + 100;
        speedup = false;
    }
    

    if(scoreNum.textContent > 0 && scoreNum.textContent % 500 === 0 && !speedup){
        // clearInterval(gameLoop);
        gamespeed /= 1.5;
        speedup = true;
        // speedup = true;
    
    }
    
    snakeBodyPos.slice(1).forEach(([x, y], index) => {
        if (snakeHead.offsetLeft === x && snakeHead.offsetTop === y) {
            
            console.log(snakeHead.offsetLeft, x);
            console.log(snakeHead.offsetTop, y);
            console.log(index);
            gameover.style.display = "flex";
            gameoverbg.style.display = "flex";
            console.log("collided with body");
            console.log("Game Over body");
            gameoverState = true;
            clearInterval(gameLoop);
        }
    });
    
    if (snakeHead.offsetLeft >= 620 || snakeHead.offsetTop >= 620) {
        
        console.log("Game Over body");
        gameover.style.display = "flex";
        gameoverbg.style.display = "flex";
        console.log("offset lower right");
        gameoverState = true;
        clearInterval(gameLoop);
    }
    if (snakeHead.offsetLeft <= 0 || snakeHead.offsetTop <= 0) {

        gameover.style.display = "flex";
        gameoverbg.style.display = "flex";
        gameoverState = true;
        clearInterval(gameLoop);
    }
    if (!gameoverState) {
        setTimeout(gameLoop, gamespeed);
    }
}

// const frames = setInterval(() => {
// }, gamespeed);
