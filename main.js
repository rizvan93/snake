const HEIGHT = 20;
const WIDTH = 30;
const STARTLEN = 4;
const STARTLOC = [HEIGHT / 2];
const app = {};

//cached elements
const table = document.querySelector("table");

const addBoardBorders = (box, x, y) => {
  if (i === 0) box.style.borderTopColor = "black";
  else if (i === HEIGHT - 1) box.style.borderBottomColor = "black";
  if (j === 0) box.style.borderLeftColor = "black";
  if (j === WIDTH - 1) box.style.borderRightColor = "black";
  return box;
};

const createTable = () => {
  for (i = 0; i < HEIGHT; i++) {
    const row = document.createElement("tr");
    row.setAttribute("data-row", i);
    for (j = 0; j < WIDTH; j++) {
      const box = document.createElement("td");
      row.setAttribute("data-col", j);
      row.append(addBoardBorders(box));
    }
    table.append(row);
  }
};

createTable();
