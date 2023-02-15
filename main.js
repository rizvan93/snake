const HEIGHT = 15;
const WIDTH = 20;
const SNAKESTARTLEN = 3;
const GRIDSIZE = 20;
const app = {
  speed: 1000,
  direction: [0, 1],
};

//cached elements
const table = document.querySelector("table");

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

const renderTable = () => {
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

const initializeSnake = () => {
  const snakeheadRow = Math.floor(HEIGHT / 2);
  const snakeheadCol = Math.ceil(WIDTH / 2);
  app.snake = createSnake(snakeheadRow, snakeheadCol, SNAKESTARTLEN);
  placeSnakeOnGrid(app.snake);
};

const refreshSnake = () => {
  app.grid.forEach((row, i) => {
    row.forEach((tile, j) => {
      if (tile === "snake") {
        app.grid[i][j] = "blank";
      }
    });
  });
  placeSnakeOnGrid(app.snake);
};

const placeSnakeOnGrid = (snake) => {
  app.grid[snake.position[0]][snake.position[1]] = "snake";
  if (snake.next) {
    placeSnakeOnGrid(snake.next);
  }
};

const createSnake = (startRow, startCol, length) => {
  const snake = { position: [startRow, startCol], next: 0 };
  if (length > 0) {
    snake.next = createSnake(startRow, startCol - 1, length - 1);
  }
  return snake;
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
  } else {
    console.log("win condition");
  }
};

const removeTail = (snake) => {
  if (snake.next.next) {
    removeTail(snake.next);
  } else {
    snake.next = 0;
  }
};

const moveHeadTo = (direction) => {
  //create new snake head item
  const newSnakehead = {
    position: [
      app.snake.position[0] + direction[0],
      app.snake.position[1] + direction[1],
    ],
    next: app.snake,
  };
  //link previous snake to new snake head
  app.snake = newSnakehead;
};

const moveSnake = () => {
  //determine direction of travel (assume right for now)
  const direction = [0, 1];

  //determine next tile
  const nextTile =
    app.grid[app.snake.position[0] + app.direction[0]][
      app.snake.position[1] + app.direction[1]
    ];

  //if food
  if (nextTile === "food") {
    // -> create new snake head item
    moveHeadTo(app.direction);

    // -> generate new food
    generateFood();
  } else if (nextTile === "blank") {
    moveHeadTo(app.direction);
    removeTail(app.snake);
    setTimeout(moveSnake, app.speed);
  } else {
    console.log("game over");
  }
  // -> game over
  refreshSnake();
  renderTable();
};

initializeGrid();
initializeSnake();
generateFood();
renderTable();
setTimeout(moveSnake, app.speed);
