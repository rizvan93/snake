const HEIGHT = 5;
const WIDTH = 8;
const SNAKESTARTLEN = 3;
const GRIDSIZE = 20;
const app = {
  speed: 1000,
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

const placeSnakeOnGrid = (snake) => {
  console.log(snake);
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

  const newFoodIndex = Math.floor(Math.random() * blanks.length); //referenced from https://www.w3schools.com/js/js_random.asp

  const newFoodRow = blanks[newFoodIndex][0];
  const newFoodCol = blanks[newFoodIndex][1];
  app.grid[newFoodRow][newFoodCol] = "food";
};

const moveSnake = () => {
  renderTable();
};

initializeGrid();
initializeSnake();
generateFood();
renderTable();

setTimeout(moveSnake, app.speed);
