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
  app.grid[snakeheadRow][snakeheadCol] = "snake-head";
  for (let i = 1; i < SNAKESTARTLEN; i++) {
    app.grid[snakeheadRow][snakeheadCol - i] = "snake-body";
  }
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
  const snakehead = findItems(app.grid, "snake-head")[0];
  console.log(snakehead);
  //determine direction of travel (take as right for now)
  const nextTile = [snakehead[0], snakehead[1] + 1];

  //determine next block -> blank/wall/food/snakebody
  const nextTileValue = app.grid[nextTile[0]][nextTile[1]];

  if (nextTileValue === "blank") {
    //  move snakehead in direction of travel
    app.grid[nextTile[0]][nextTile[1]] = "snake-head";
    app.grid[snakehead[0]][snakehead[1]] = "snake-body";
    //  find snaketail position
    //  remove snaketail
    app.grid[2][2] = "blank";
  }
  //if next block is blank:
  //else if next block is food:
  //  move snakehead in direction of travel
  //  score += 1
  //else: game over
  renderTable();
};

initializeGrid();
initializeSnake();
generateFood();
renderTable();

setTimeout(moveSnake, app.speed);
