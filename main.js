const HEIGHT = 20;
const WIDTH = 30;
const SNAKESTARTLEN = 3;
const GRIDSIZE = 7;
const app = {};

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
  app.grid[snakeheadRow][snakeheadCol] = "snake-head";
  for (let i = 1; i < SNAKESTARTLEN; i++) {
    app.grid[snakeheadRow][snakeheadCol - i] = "snake-body";
  }
};

//returns an array of blanks [x-position, y-position] on an input grid
const findBlanks = (grid) => {
  return grid.reduce((accumulator, currentArray, row) => {
    const indexesInRow = currentArray.reduce((accumulator, value, index) => {
      if (value === "blank") accumulator.push(index);
      return accumulator;
    }, []);
    indexesInRow.forEach((index) => {
      accumulator.push([row, index]);
    });
    return accumulator;
  }, []);
};

const generateFood = () => {
  const blanks = findBlanks(app.grid);

  const newFoodIndex = Math.floor(Math.random() * blanks.length); //referenced from https://www.w3schools.com/js/js_random.asp

  // figure out how to place the food at the right position
  const newFoodRow = blanks[newFoodIndex][0];
  const newFoodCol = blanks[newFoodIndex][1];
  app.grid[newFoodRow][newFoodCol] = "food";
};

initializeGrid();
initializeSnake();
generateFood();
renderTable();
