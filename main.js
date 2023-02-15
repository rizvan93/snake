const HEIGHT = 3;
const WIDTH = 5;
const SNAKESTARTLEN = 3;
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
    row.setAttribute("data-row", i);
    modelRow.forEach((value, j) => {
      const box = document.createElement("td");
      box.setAttribute("data-col", j);
      box.setAttribute("class", value);
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
  x = Math.floor(HEIGHT / 2);
  y = Math.ceil(WIDTH / 2);
  app.grid[x][y] = "snake-head";
  for (let i = 1; i < SNAKESTARTLEN; i++) {
    app.grid[x][y - i] = "snake-body";
  }
};

const countBlanks = (grid) => {
  const blanks = grid.reduce((accumulator, currentArray) => {
    accumulator += currentArray.reduce((accumulator, currentValue) => {
      if (currentValue === "blank") {
        accumulator += 1;
      }
      return accumulator;
    }, 0);
    return accumulator;
  }, 0);
  return blanks;
};

const generateFood = () => {
  //count number of empty spaces
  const blanks = countBlanks(app.grid);
  console.log(blanks);
  //randomly choose a number
  //place that as an empty space
};

initializeGrid();
initializeSnake();
renderTable();
generateFood();
