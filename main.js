const HEIGHT = 20;
const WIDTH = 30;
const SNAKESTARTLEN = 4;
const GRIDSIZE = 5;
const SCOREINTERVALFORSPEEDINCREMENT = 5;
const SPEEDCOMPOUNDFACTOR = 1.2;
const app = {
  speed: 300,
  direction: [0, 1],
  inputTaken: false,
};

//cached elements
const table = document.querySelector("table");
const page = document.querySelector("body");
const score = document.querySelector("#score");

//functions
const addBoardBorders = (box, x, y) => {
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
};

const renderPage = () => {
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  app.grid.forEach((modelRow, i) => {
    const row = document.createElement("tr");
    modelRow.forEach((value, j) => {
      const box = document.createElement("td");
      box.setAttribute("class", value);
      box.style.height = `${GRIDSIZE}px`;
      box.style.width = `${GRIDSIZE}px`;
      row.append(addBoardBorders(box, i, j));
    });
    table.append(row);
  });
  if (app.score) {
    score.innerText = app.score;
  }
};

const initializeGrid = () => {
  const grid = [];
  for (let i = 0; i < HEIGHT; i++) {
    const row = [];
    for (let j = 0; j < WIDTH; j++) {
      row.push("blank");
    }
    grid.push(row);
  }
  app["grid"] = grid;
};

const snake = {
  initialize() {
    const snakeheadRow = Math.floor(HEIGHT / 2);
    const snakeheadCol = Math.ceil(WIDTH / 2);
    app.snake = this.create(snakeheadRow, snakeheadCol, SNAKESTARTLEN);
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
      return 1 + snake.length(thisBody.next);
    } else return 1;
  },

  move() {
    const nextTile =
      app.grid[app.snake.position[0] + app.direction[0]][
        app.snake.position[1] + app.direction[1]
      ];

    if (nextTile === "food") {
      snake.moveHeadTo(app.direction);
      if (!generateFood()) {
        console.log("win condition");
        return;
      }
      updateScore();
      updateSpeed();
    } else if (nextTile === "blank") {
      snake.moveHeadTo(app.direction);
      snake.removeTail();
    } else {
      console.log("game over");
      return;
    }

    app.inputTaken = false;
    renderPage();
    setTimeout(snake.move, app.speed);
  },
};

//returns an array of items [x-position, y-position] on an input grid
const findItems = (grid, item) => {
  return grid.reduce((accumulator, currentArray, row) => {
    const indexesInRow = currentArray.reduce((accumulator, value, index) => {
      if (value === item) accumulator.push(index);
      return accumulator;
    }, []);
    indexesInRow.forEach((index) => {
      accumulator.push([row, index]);
    });
    return accumulator;
  }, []);
};

const generateFood = () => {
  const blanks = findItems(app.grid, "blank");
  if (blanks[0]) {
    const newFoodIndex = Math.floor(Math.random() * blanks.length); //referenced from https://www.w3schools.com/js/js_random.asp

    const newFoodRow = blanks[newFoodIndex][0];
    const newFoodCol = blanks[newFoodIndex][1];
    app.grid[newFoodRow][newFoodCol] = "food";
    return true;
  } else {
    return false;
  }
};

const updateScore = () => {
  app.score = snake.length() - SNAKESTARTLEN;
};

const updateSpeed = () => {
  if (app.score % SCOREINTERVALFORSPEEDINCREMENT === 0) {
    app.speed /= SPEEDCOMPOUNDFACTOR;
  }
};

const changeDirection = (keyDownEvent) => {
  if (!app.inputTaken) {
    const newDirection = keyToDir(keyDownEvent.code);
    if (newDirection) {
      if (isValidChange(newDirection, app.direction)) {
        app.direction = newDirection;
        app.inputTaken = true;
      }
    }
  }
};

const isValidChange = (dir1, dir2) => {
  if (Math.abs(dir1[0]) - Math.abs(dir2[0])) {
    if (Math.abs(dir1[1]) - Math.abs(dir2[1])) {
      return true;
    }
  }
  return false;
};

const keyToDir = (code) => {
  //retrieved switch case syntax from https://www.w3schools.com/js/js_switch.asp
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
};

const initializeGame = () => {
  initializeGrid();
  snake.initialize();
  generateFood();
  renderPage();
};

//event listeners
page.addEventListener("keydown", changeDirection);

initializeGame();
setTimeout(snake.move, app.speed);
