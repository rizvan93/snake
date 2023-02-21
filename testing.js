it("test statement, adds one and two", () => {
  const result = 1 + 2;

  chai.expect(result).to.equal(3);
});

describe("initialize game", () => {
  describe("initialize grid with blank values", () => {
    it("initializes grid with correct HEIGHT", () => {
      gridMethods.initialize();
      chai.expect(app.grid.length).to.equal(HEIGHT);
    });

    it("initializes grid with correct WIDTH", () => {
      gridMethods.initialize();
      let rowWidth = WIDTH;
      app.grid.forEach((row) => {
        if (row.length !== WIDTH) rowWidth = row.length;
      });
      chai.expect(rowWidth).to.equal(WIDTH);
    });

    it("initializes grid containing 'blank' values", () => {
      gridMethods.initialize();
      let allAreBlanks = true;
      app.grid.forEach((row) => {
        row.forEach((tile) => {
          if (tile !== "blank") allAreBlanks = false;
        });
      });

      chai.expect(allAreBlanks).to.equal(true);
    });
  });
  describe("initialize snake on grid", () => {
    it("snakeMethods.create(startRow, startCol, length) creates snake at correct starting position", () => {
      const startRow = 10;
      const startCol = 10;
      const length = 1;

      const newSnake = snakeMethods.create(startRow, startCol, length);

      chai.expect(newSnake.position).to.deep.equal([startRow, startCol]);
    });

    it("snakeMethods.create(startRow, startCol, length) creates snake of length 4", () => {
      const startRow = 10;
      const startCol = 10;
      const length = 4;

      let newSnake = snakeMethods.create(startRow, startCol, length);

      for (let i = 0; i < length; i++) {
        chai.expect(newSnake.position).to.deep.equal([startRow, startCol - i]);
        newSnake = newSnake.next;
      }
    });

    it("snakeMethods.placeOnGrid(snake) updates grid with snake of length 1 correctly", () => {
      const snake = {
        position: [10, 10],
        next: 0,
      };
      snakeMethods.placeOnGrid(snake);

      chai
        .expect(app.grid[snake.position[0]][snake.position[1]])
        .to.equal("snake");
    });
    it("snakeMethods.placeOnGrid(snake) updates grid with snake of length 4 correctly", () => {
      gridMethods.initialize();
      const startRow = 10;
      const startCol = 10;
      const snake = snakeMethods.create(startRow, startCol, 4);

      snakeMethods.placeOnGrid(snake);

      for (let i = 0; i < 4; i++) {
        chai.expect(app.grid[startRow][startCol - i]).to.equal("snake");
      }
    });
    it("snakeMethods.placeOnGrid(snake) maintains rest of grid as blanks", () => {
      gridMethods.initialize();
      const startRow = 10;
      const startCol = 10;
      const snake = snakeMethods.create(startRow, startCol, 4);

      snakeMethods.placeOnGrid(snake);

      for (let i = 0; i < HEIGHT; i++) {
        for (let j = 0; j < WIDTH; j++) {
          if (i !== startRow && j <= startCol && j >= startCol - 4) {
            chai.expect(app.grid[i][j]).to.equal("blank");
          }
        }
      }
    });

    it("snakeMethods.initialize() creates snake of length 4 and places on grid correctly, starting at midpoint of grid", () => {
      gridMethods.initialize();

      snakeMethods.initialize();

      for (let i = 0; i < 4; i++) {
        chai
          .expect(app.grid[Math.floor(HEIGHT / 2)][Math.floor(WIDTH) / 2 - i])
          .to.equal("snake");
      }
    });
  });

  describe("Generate a food on one of the blanks on the grid", () => {
    it("gridMethods.findItems('blank') finds correct number of blanks on the grid", () => {
      gridMethods.initialize();
      snakeMethods.initialize();

      const blankPositions = gridMethods.findItems("blank");

      chai
        .expect(blankPositions.length)
        .to.equal(HEIGHT * WIDTH - SNAKE_START_LEN);
    });

    it("gridMethods.findItems('blank) contains only and all locations of blanks on grid", () => {
      gridMethods.initialize();
      snakeMethods.initialize();

      const blankPositions = gridMethods.findItems("blank");
      app.grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
          if (tile === "blank") {
            chai.expect(blankPositions).to.deep.include([rowIndex, colIndex]);
          } else {
            chai.expect(blankPositions).to.not.include([rowIndex, colIndex]);
          }
        });
      });
    });

    it("gridMethods.generateFood generates 1 food on the grid", () => {
      gridMethods.initialize();
      snakeMethods.initialize();

      gridMethods.generateFood();

      let foodCount = 0;
      app.grid.forEach((row) => {
        row.forEach((tile) => {
          if (tile === "food") {
            foodCount += 1;
          }
        });
      });
      chai.expect(foodCount).to.equal(1);
    });
  });
});

describe("Move Snake", () => {
  describe("update model with valid user input", () => {
    it("snakeMethods.isValidChange(dir1, dir2) correctly returns true only for 90deg changes", () => {
      [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ].forEach((currentDirection) => {
        [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ].forEach((nextDirection) => {
          if (currentDirection[0] === 0 && nextDirection[0] === 0) {
            chai
              .expect(
                snakeMethods.isValidChange(currentDirection, nextDirection)
              )
              .to.equal(false);
          } else if (currentDirection[1] === 0 && nextDirection[1] === 0) {
            chai
              .expect(
                snakeMethods.isValidChange(currentDirection, nextDirection)
              )
              .to.equal(false);
          } else {
            chai
              .expect(
                snakeMethods.isValidChange(currentDirection, nextDirection)
              )
              .to.equal(true);
          }
        });
      });
    });

    it("snakeMethods.updateDirection correctly changes to the next direction when inputQueue.length = 1", () => {
      [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ].forEach((currentDirection) => {
        [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ].forEach((nextDirection) => {
          app.direction = currentDirection;
          if (snakeMethods.isValidChange(currentDirection, nextDirection)) {
            app.inputQueue = [];
            app.inputQueue.push(nextDirection);

            snakeMethods.updateDirection();

            chai.expect(app.direction).to.deep.equal(nextDirection);
          }
        });
      });
    });

    it("snakeMethods.updateDirection correctly changes to the next directions in sequence when inputQueue.length = 2", () => {
      [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ].forEach((currentDirection) => {
        [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ].forEach((nextDirection) => {
          app.direction = currentDirection;
          if (snakeMethods.isValidChange(currentDirection, nextDirection)) {
            [
              [0, 1],
              [0, -1],
              [1, 0],
              [-1, 0],
            ].forEach((followingDirection) => {
              if (
                snakeMethods.isValidChange(nextDirection, followingDirection)
              ) {
                app.inputQueue = [];
                app.inputQueue.push(nextDirection);
                app.inputQueue.push(followingDirection);

                snakeMethods.updateDirection();

                chai.expect(app.direction).to.deep.equal(nextDirection);

                snakeMethods.updateDirection();

                chai.expect(app.direction).to.deep.equal(followingDirection);
              }
            });
          }
        });
      });
    });

    it("snakeMethods.updateDirection correctly removes the first item from inputQueue after changing direction", () => {
      [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ].forEach((firstDirection) => {
        [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ].forEach((secondDirection) => {
          if (
            firstDirection[0] !== secondDirection[0] ||
            firstDirection[1] !== secondDirection[1]
          ) {
            app.inputQueue = [];
            app.inputQueue.push(firstDirection);
            app.inputQueue.push(secondDirection);

            snakeMethods.updateDirection();
            chai.expect(app.inputQueue.length).to.equal(1);
            chai.expect(app.inputQueue[0]).to.deep.equal(secondDirection);

            snakeMethods.updateDirection();
            chai.expect(app.inputQueue.length).to.equal(0);
          }
        });
      });
    });
  });

  describe("move identify next tile snake moves into", () => {
    it("snakeMethods.nextTile correctly identifies next tile as food while moving right", () => {
      gridMethods.initialize();
      app.direction = [0, 1];
      app.grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
          gridMethods.initialize();
          if (colIndex <= WIDTH - 2) {
            app.snake = {
              position: [rowIndex, colIndex],
              next: 0,
            };
            snakeMethods.placeOnGrid();
            app.grid[rowIndex][colIndex + 1] = "food";

            chai.expect(snakeMethods.nextTile()).to.equal("food");
          }
        });
      });
    });

    it("snakeMethods.nextTile correctly identifies next tile as a snake while moving right", () => {
      gridMethods.initialize();
      app.direction = [0, 1];
      app.grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
          gridMethods.initialize();
          if (colIndex <= WIDTH - 2) {
            app.snake = {
              position: [rowIndex, colIndex],
              next: 0,
            };
            snakeMethods.placeOnGrid();
            app.grid[rowIndex][colIndex + 1] = "snake";

            chai.expect(snakeMethods.nextTile()).to.equal("snake");
          }
        });
      });
    });

    it("snakeMethods.nextTile correctly identifies next tile as a blank while moving right", () => {
      gridMethods.initialize();
      app.direction = [0, 1];
      app.grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
          gridMethods.initialize();
          if (colIndex <= WIDTH - 2) {
            app.snake = {
              position: [rowIndex, colIndex],
              next: 0,
            };
            snakeMethods.placeOnGrid();
            app.grid[rowIndex][colIndex + 1] = "blank";

            chai.expect(snakeMethods.nextTile()).to.equal("blank");
          }
        });
      });
    });

    it("snakeMethods.nextTile correctly identifies next tile as a wall while moving right", () => {
      app.grid.forEach((row, rowIndex) => {
        gridMethods.initialize();
        app.direction = [0, 1];
        app.snake = snakeMethods.create(rowIndex, WIDTH - 1, 4);
        snakeMethods.placeOnGrid(app.snake);

        chai.expect(snakeMethods.nextTile()).to.equal(false);
      });
    });

    it("snakeMethods.nextTile correctly identifies next tile while moving up", () => {
      gridMethods.initialize();
      app.direction = [-1, 0];
      app.grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
          gridMethods.initialize();
          if (rowIndex >= 1) {
            const nextValue = randomValue();
            app.snake = {
              position: [rowIndex, colIndex],
              next: 0,
            };
            snakeMethods.placeOnGrid();
            app.grid[rowIndex - 1][colIndex] = nextValue;

            chai.expect(snakeMethods.nextTile()).to.equal(nextValue);
          }
        });
      });
    });

    it("snakeMethods.nextTile correctly identifies next tile while moving down", () => {
      gridMethods.initialize();
      app.direction = [1, 0];
      app.grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
          gridMethods.initialize();
          if (rowIndex <= HEIGHT - 2) {
            const nextValue = randomValue();
            app.snake = {
              position: [rowIndex, colIndex],
              next: 0,
            };
            snakeMethods.placeOnGrid();
            app.grid[rowIndex + 1][colIndex] = nextValue;

            chai.expect(snakeMethods.nextTile()).to.equal(nextValue);
          }
        });
      });
    });

    it("snakeMethods.nextTile correctly identifies next tile while moving left", () => {
      gridMethods.initialize();
      app.direction = [0, -1];
      app.grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
          gridMethods.initialize();
          if (colIndex >= 1) {
            const nextValue = randomValue();
            app.snake = {
              position: [rowIndex, colIndex],
              next: 0,
            };
            snakeMethods.placeOnGrid();
            app.grid[rowIndex][colIndex - 1] = nextValue;

            chai.expect(snakeMethods.nextTile()).to.equal(nextValue);
          }
        });
      });
    });

    it("moveHeadTo correctly moves head one tile to the right", () => {
      app.grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
          gridMethods.initialize();

          if (colIndex <= WIDTH - 2) {
            app.snake = {
              position: [rowIndex, colIndex],
              next: 0,
            };

            snakeMethods.moveHeadTo([0, 1]);

            chai
              .expect(app.snake.position)
              .to.deep.equal([rowIndex, colIndex + 1]);
            chai.expect(app.grid[rowIndex][colIndex + 1]).to.equal("snake");
          }
        });
      });
    });
  });

  describe("move snake model", () => {
    it("moveHeadTo correctly moves head one tile up", () => {
      app.grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
          gridMethods.initialize();

          if (rowIndex >= 1) {
            app.snake = {
              position: [rowIndex, colIndex],
              next: 0,
            };

            snakeMethods.moveHeadTo([-1, 0]);

            chai
              .expect(app.snake.position)
              .to.deep.equal([rowIndex - 1, colIndex]);
            chai.expect(app.grid[rowIndex - 1][colIndex]).to.equal("snake");
          }
        });
      });
    });

    it("moveHeadTo correctly moves head one tile down", () => {
      app.grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
          gridMethods.initialize();

          if (rowIndex <= HEIGHT - 2) {
            app.snake = {
              position: [rowIndex, colIndex],
              next: 0,
            };

            snakeMethods.moveHeadTo([1, 0]);

            chai
              .expect(app.snake.position)
              .to.deep.equal([rowIndex + 1, colIndex]);
            chai.expect(app.grid[rowIndex + 1][colIndex]).to.equal("snake");
          }
        });
      });
    });

    it("moveHeadTo correctly moves head one tile to the left", () => {
      app.grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
          gridMethods.initialize();

          if (colIndex >= 1) {
            app.snake = {
              position: [rowIndex, colIndex],
              next: 0,
            };

            snakeMethods.moveHeadTo([0, -1]);

            chai
              .expect(app.snake.position)
              .to.deep.equal([rowIndex, colIndex - 1]);
            chai.expect(app.grid[rowIndex][colIndex - 1]).to.equal("snake");
          }
        });
      });
    });

    it("snakeMethods.removeTail removes last tail of snake", () => {
      gridMethods.initialize();
      app.grid.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (colIndex >= 3) {
            app.snake = snakeMethods.create(
              rowIndex,
              colIndex,
              SNAKE_START_LEN
            );
            snakeMethods.placeOnGrid(app.snake);

            snakeMethods.removeTail();

            chai.expect(app.grid[rowIndex][colIndex - 3]).to.equal("blank");
            chai.expect(app.snake.next.next.next).to.equal(0);
          }
        });
      });
    });
  });
});

const randomValue = () => {
  switch (Math.floor(Math.random() * 3)) {
    case 0:
      return "blank";
    case 1:
      return "snake";
    case 2:
      return "food";
  }
};
