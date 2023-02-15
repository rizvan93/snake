const HEIGHT = 3;
const WIDTH = 5;
const STARTLEN = 4;
const STARTLOC = [HEIGHT / 2];
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

const initializeTable = () => {
  app.grid.forEach((modelRow, i) => {
    const row = document.createElement("tr");
    row.setAttribute("data-row", i);
    modelRow.forEach((value, j) => {
      const box = document.createElement("td");
      box.setAttribute("data-col", j);
      box.setAttribute("data-state", value);
      row.append(addBoardBorders(box, i, j));
    });
    table.append(row);
  });
};

const initializeGrid = () => {
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

initializeGrid();
initializeTable();
