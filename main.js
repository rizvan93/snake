const HEIGHT = 3;
const WIDTH = 5;
const STARTLEN = 4;
const STARTLOC = [HEIGHT / 2];
const app = {};

//cached elements
const table = document.querySelector("table");

const addBoardBorders = (box, x, y) => {
  if (x === 0) {
    box.style.borderTopColor = "black";
  } else if (x === HEIGHT - 1) {
    box.style.borderBottomColor = "black";
  }
  if (y === 0) {
    box.style.borderLeftColor = "black";
  } else if (y === WIDTH - 1) {
    box.style.borderRightColor = "black";
  }
  return box;
};

const initializeTable = () => {
  for (i in app.grid) {
    const row = document.createElement("tr");
    row.setAttribute("data-row", i);
    for (j in app.grid[i]) {
      const box = document.createElement("td");
      box.setAttribute("data-col", j);
      row.append(addBoardBorders(box, parseInt(i), parseInt(j)));
    }
    table.append(row);
  }
};

const initialize = () => {
  const grid = [];
  for (i = 0; i < HEIGHT; i++) {
    const row = [];
    for (j = 0; j < WIDTH; j++) {
      row.push(0);
    }
    grid.push(row);
  }
  app["grid"] = grid;
  console.log(app.grid);
};

initialize();
initializeTable();
