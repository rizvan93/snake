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
  console.log(blanks);

  let foodPos = Math.floor(Math.random() * blanks); //referenced from https://www.w3schools.com/js/js_random.asp
  console.log(foodPos);

  // figure out how to place the food at the right position
};

initializeGrid();
initializeSnake();
generateFood();
renderTable();
