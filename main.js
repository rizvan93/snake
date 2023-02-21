const HEIGHT = 20;
const WIDTH = 30;
const SNAKE_START_LEN = 4;
const GRID_SIZE = 10;
const SCORE_INTERVAL_FOR_SPEED_INCREASE = 5;
const SPEED_DECREMENT = 15;
const SPEED_COMPOUND_FACTOR = 1.05;
const LOG = false;
const app = {
  speed: 150,
  direction: [0, 1],
  inputQueue: [],
  screen: "welcome",
  playerName: "",
  leaderboard: [
    { name: "Rizvan", score: 10 },
    { name: "Faizal", score: 100 },
    { name: "Ida", score: 50 },
  ],
};

//cached elements
const table = document.querySelector("table");
const page = document.querySelector("body");
const score = document.querySelector("#score");
const start = document.querySelector("#start");
const leaderboard = document.querySelector("#leaderboard");
const restart = document.querySelector("#restart");
const returnHome = document.querySelector("#return-home");

//functions

const render = {
  all() {
    this.mainBox();
    this.leaderboard();
  },
  mainBox() {
    document.querySelectorAll(".main-box").forEach((divBox) => {
      divBox.style.display = "none";
    });
    if (LOG) console.log("model screen: ", app.screen);
    if (app.screen === "game") {
      document.querySelector("#game-box").style.display = "block";
      this.game();
    } else if (app.screen === "welcome") {
      document.querySelector("#welcome-box").style.display = "flex";
      this.welcome();
    } else if (app.screen === "game-over") {
      document.querySelector("#game-box").style.display = "block";
      document.querySelector("#game-over").style.display = "grid";
    }
  },
  leaderboard() {
    if (app.leaderboard.length > 0) {
      document.querySelector("#leaderboard-title").innerText = "LEADERBOARD";
      while (leaderboard.firstChild) {
        leaderboard.firstChild.remove();
      }
      app.leaderboard.forEach((entry, i) => {
        if (i < 10) {
          const scoreSN = document.createElement("p");
          scoreSN.innerText = `${i + 1}.`;
          leaderboard.append(scoreSN);
          const name = document.createElement("p");
          name.innerText = entry.name;
          leaderboard.append(name);
          const score = document.createElement("p");
          score.innerText = entry.score;
          leaderboard.append(score);
        }
      });
    }
  },
  welcome() {
    document.querySelector("#player-name").value = "";
    if (LOG) console.log("welcome");
  },
  game() {
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }
    app.grid.forEach((modelRow, i) => {
      const row = document.createElement("tr");
      modelRow.forEach((value, j) => {
        const box = document.createElement("td");
        box.setAttribute("class", value);
        box.style.height = `${GRID_SIZE}px`;
        box.style.width = `${GRID_SIZE}px`;
        row.append(this.addBoardBorders(box, i, j));
      });
      table.append(row);
    });
    this.score();
  },
  score() {
    const scoreLog = document.querySelector("#score");
    if (!app.score) app.score = 0;
    scoreLog.innerText = `Score: ${app.score}`;
  },
  addBoardBorders(box, x, y) {
    x = parseInt(x);
    if (x === 0) {
      box.style.borderTopColor = "black";
    } else if (x === HEIGHT - 1) {
      box.style.borderBottomColor = "black";
    }
    y = parseInt(y);
    if (y === 0) {
      box.style.borderLeftColor = "black";
    } else if (y === WIDTH - 1) {
      box.style.borderRightColor = "black";
    }
    return box;
  },
};

const snakeMethods = {
  initialize() {
    const snakeheadRow = Math.floor(HEIGHT / 2);
    const snakeheadCol = Math.ceil(WIDTH / 2);
    app.snake = this.create(snakeheadRow, snakeheadCol, SNAKE_START_LEN);
    this.placeOnGrid();
  },
  placeOnGrid(snake = app.snake) {
    app.grid[snake.position[0]][snake.position[1]] = "snake";
    if (snake.next) {
      this.placeOnGrid(snake.next);
    }
  },
  create(startRow, startCol, length) {
    const snake = { position: [startRow, startCol], next: 0 };
    if (length > 1) {
      snake.next = this.create(startRow, startCol - 1, length - 1);
    }
    return snake;
  },
  moveHeadTo(direction) {
    const newSnakehead = {
      position: [
        app.snake.position[0] + direction[0],
        app.snake.position[1] + direction[1],
      ],
      next: app.snake,
    };
    app.grid[newSnakehead.position[0]][newSnakehead.position[1]] = "snake";
    app.snake = newSnakehead;
  },
  removeTail(snake = app.snake) {
    if (snake.next.next) {
      this.removeTail(snake.next);
    } else {
      app.grid[snake.next.position[0]][snake.next.position[1]] = "blank";
      snake.next = 0;
    }
  },
  length(thisBody = app.snake) {
    if (thisBody.next) {
      return 1 + snakeMethods.length(thisBody.next);
    } else return 1;
  },
  nextTile() {
    const nextRow = app.snake.position[0] + app.direction[0];
    const nextCol = app.snake.position[1] + app.direction[1];

    if (LOG) console.log(`Next tile: ${nextRow}, ${nextCol}`);

    if (nextRow < 0 || nextRow >= HEIGHT || nextCol < 0 || nextCol >= WIDTH) {
      if (LOG) console.log("wall hit");
      return false;
    }
    return app.grid[nextRow][nextCol];
  },
  move() {
    snakeMethods.updateDirection();
    const nextTile = snakeMethods.nextTile();

    if (nextTile === "food") {
      snakeMethods.moveHeadTo(app.direction);
      if (!gridMethods.generateFood()) {
        gameMethods.endGame();
        if (LOG) console.log("win condition");
        return;
      }
      gameMethods.updateScore();
      gameMethods.updateSpeed();
    } else if (nextTile === "blank") {
      snakeMethods.moveHeadTo(app.direction);
      snakeMethods.removeTail();
    } else {
      return gameMethods.endGame();
    }

    render.game();
    setTimeout(snakeMethods.move, app.speed);
  },
  updateDirection() {
    if (app.inputQueue.length > 0) {
      app.direction = app.inputQueue[0];
      app.inputQueue.splice(0, 1);
      if (LOG)
        console.log(
          "input removed from queue. Current queue: ",
          app.inputQueue
        );
    }
  },
  addNextDirection(nextDirection) {
    if (nextDirection) {
      if (app.inputQueue.length < 2) {
        let currentDirection;
        if (app.inputQueue.length > 0) {
          currentDirection = app.inputQueue[app.inputQueue.length - 1];
        } else {
          currentDirection = app.direction;
        }
        if (snakeMethods.isValidChange(nextDirection, currentDirection)) {
          app.direction = nextDirection;
          app.inputQueue.push(nextDirection);
          if (LOG)
            console.log(
              "input added to queue. current queue: ",
              app.inputQueue
            );
        }
      }
    }
  },

  isValidChange(dir1, dir2) {
    if (Math.abs(dir1[0]) - Math.abs(dir2[0])) {
      if (Math.abs(dir1[1]) - Math.abs(dir2[1])) {
        return true;
      }
    }
    return false;
  },
  keyToDir(code) {
    switch (code) {
      case "ArrowUp":
        return [-1, 0];
      case "ArrowRight":
        return [0, 1];
      case "ArrowDown":
        return [1, 0];
      case "ArrowLeft":
        return [0, -1];
      default:
        return false;
    }
  },
};

const gridMethods = {
  initialize() {
    const grid = [];
    for (let i = 0; i < HEIGHT; i++) {
      const row = [];
      for (let j = 0; j < WIDTH; j++) {
        row.push("blank");
      }
      grid.push(row);
    }
    app["grid"] = grid;
  },
  findItems(item) {
    //returns an array of items [x-position, y-position] on the grid model
    return app.grid.reduce((accumulator, currentArray, row) => {
      const indexesInRow = currentArray.reduce((accumulator, value, index) => {
        if (value === item) accumulator.push(index);
        return accumulator;
      }, []);
      indexesInRow.forEach((index) => {
        accumulator.push([row, index]);
      });
      return accumulator;
    }, []);
  },
  generateFood() {
    const blanks = gridMethods.findItems("blank");
    if (blanks[0]) {
      const newFoodIndex = Math.floor(Math.random() * blanks.length); //referenced from https://www.w3schools.com/js/js_random.asp

      const newFoodRow = blanks[newFoodIndex][0];
      const newFoodCol = blanks[newFoodIndex][1];
      app.grid[newFoodRow][newFoodCol] = "food";
      return true;
    } else {
      return false;
    }
  },
};

const gameMethods = {
  trimLeaderboard() {
    app.leaderboard.sort((a, b) => b.score - a.score);
    app.leaderboard = app.leaderboard.map((entry, i) => {
      if (i < 10) return entry;
    });
    if (LOG) console.log(`update leaderboard: ${app.leaderboard}`);
  },
  endGame() {
    if (app.score > 0) {
      const entry = { name: app.playerName, score: app.score };
      app.leaderboard.push(entry);
      this.trimLeaderboard();
      render.leaderboard();
    }
    app.screen = "game-over";
    render.all();
    restart.addEventListener("click", gameMethods.initialize);
    returnHome.addEventListener("click", gameMethods.returnHome);
    if (LOG) console.log("game over");
  },
  updateScore() {
    app.score = snakeMethods.length() - SNAKE_START_LEN;
  },
  updateSpeed() {
    if (LOG) console.log("speed update function");
    if (app.score % SCORE_INTERVAL_FOR_SPEED_INCREASE === 0) {
      if (LOG) console.log("current speed: ", app.speed);
      if (app.speed > SPEED_DECREMENT + 1) {
        app.speed -= SPEED_DECREMENT;
      } else {
        app.speed /= SPEED_COMPOUND_FACTOR;
      }
      if (LOG) console.log("New speed: ", app.speed);
    }
  },
  initialize(event) {
    if (event) event.preventDefault();
    app.screen = "game";
    app.playerName = document.querySelector("#player-name").value || "Player 1";
    app.direction = [0, 1];
    app.score = 0;
    if (LOG) console.log(app.playerName);
    gridMethods.initialize();
    snakeMethods.initialize();
    gridMethods.generateFood();
    render.all();
    setTimeout(snakeMethods.move, app.speed);
  },
  returnHome(event) {
    if (event) event.preventDefault();
    app.screen = "welcome";
    app.playerName = "";
    render.all();
  },
  onKeyDownEvent(keyDownEvent) {
    if (app.screen === "game") {
      if (LOG) console.log("KEYDOWN NOW");
      keyDownEvent.preventDefault();
      snakeMethods.addNextDirection(snakeMethods.keyToDir(keyDownEvent.code));
    }
  },
};

//event listeners
page.addEventListener("keydown", gameMethods.onKeyDownEvent);
start.addEventListener("click", gameMethods.initialize);

if (app.screen !== "welcome") gameMethods.initialize();
gameMethods.trimLeaderboard();
render.all();
