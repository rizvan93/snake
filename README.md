# A Browser Based Game of Snake  
Built using: HTML, Javascript, CSS

## Description

This is a classic game of snake designed and implemented using HTML, CSS, and Javascript as a submission for the [Software Engineering Immersive Bootcamp](https://generalassemb.ly/education/software-engineering-immersive/singapore) run by General Assembly. 

### [Play the game here](https://rizvan93.github.io/snake/index.html).

I chose this game to demonstrate my understanding of the various features of HTML, CSS, and Javascript, such as:
* Model-View-Controller architectural approach
* DOM manipulation
* Array iterators & callback functions
* Flexbox & CSS Grid

## Tools and Technologies

* Github for repository and deployment
* Windows Powershell
* Visual Studio Code
  * Prettier extension for formatting
* Mocha and Chai for testing

## Timeframe

5 working days

## Game Rules

I built the rules of my memory of how this game works. The player has to control a snake using the four arrow keys on the keyboard, and guide it towards randomly generated food while avoiding the walls and its own body. The speed and length of the snake increases as more food is eaten, and the game ends if the snake hits its own body or the walls. 

## Wireframe & User Stories

#### Wireframe of Welcome Scren
![Wireframe of Welcome Screen](https://raw.githubusercontent.com/rizvan93/snake/main/resources/welcome_wireframe.jpeg)

#### Wireframe of Game Screen
![Wireframe of Snake Game](https://raw.githubusercontent.com/rizvan93/snake/main/resources/game_wireframe.jpeg)

#### User Stories
| **When a user...**              | **...this should happen**                               |
|--------------------             |-----------------------------                            |
| loads the page                  | sees a welcome screen                                   |
|                                 | sees a prompt to enter a name and start the game        |
| starts the game                 | snake appears on the board                              |
|                                 | food appears on the board                               |
|                                 | snake starts moving towards the right                   |
| sees the snake move             | the head of the snake advances in the current direction |
|                                 | the tail of the snake shortens                          |
| presses an arrow key            | snake changes direction to the arrow pressed            |
| sees the snake "eat" a food     | snake grows in length                                   |
|                                 | a new food is generated                                 |
|                                 | score increases by one                                  |
| sees the snake hit a wall       | game ends                                               |
| sees the snake hit its own body | game ends                                               |
| sees the game end               | sees the words "**GAME OVER**"                          |
|                                 | sees the leaderboard updated with their name and score  |
|                                 | sees options to restart or return to welcome screen     |
| restarts the game               | starts a new game                                       |
| returns to welcome screen       | sees a prompt to enter a name and start the game        |

## Development Approach and Details

The game is designed and implemented using a model-view-controller architectural approach as described below. My approach to developing this game was to:
1. Generate a grid, snake, and food model and render it into the view (1/2 day)
2. Add motion and user control for the snake (1/2 day)
3. Add game logic (1 day)
4. Add score, welcome screen, and leaderboard (1/2 day)
5. Style and add sound (1/2 day)
6. Test using mocha and chai (2 days)

### _Model_

The game stores its data within an "app" object, which has four categories of data: game state, grid, snake, and leaderboard

The game state, namely screen, speed, direction, input status, and score are stored as properties of the app object, and are initialized in the main script. These values are updated by the controller during play. 

```
const app = {  
  speed: 100,  
  direction: [0, 1],  
  inputTaken: false,  
  screen: "welcome",  
```

The grid, itself a two-dimensional array, is stored as a property of the app object. It is initialized when the game starts and contains one of three values: "blank", "snake", or "food". The grid is updated by the controller and is used to update the view seen by the user. The height and width of the grid are set as constants within the script. 

```
const gridMethods = {
  initialize () {
  const grid = [];  
    for (let i = 0; i < HEIGHT; i++) {  
      const row = [];  
      for (let j = 0; j < WIDTH; j++) {  
        row.push("blank");  
      }  
      grid.push(row);  
    }  
    app["grid"] = grid;
  },
}
```

The snake is a linked list where each link is an object containing (a) the position of each snake-body segment stored as an array of the row and column positions, and (b) the next snake-body segment. The starting link is stored as a property of the app object and is initialized when the game starts. The starting length of the snake is set as a constant within the script. 

To ensure no conflicts between the snake and grid models, the snake model is used to update the grid model. 

```
const snakeMethods = {
  initialize() {
    const snakeheadRow = Math.floor(HEIGHT / 2);
    const snakeheadCol = Math.ceil(WIDTH / 2);
    app.snake = this.create(snakeheadRow, snakeheadCol, SNAKESTARTLEN);
    this.placeOnGrid();
  },
    
  create(startRow, startCol, length) {
    const snake = { position: [startRow, startCol], next: 0 };
    if (length > 1) {
      snake.next = this.create(startRow, startCol - 1, length - 1);
    }
    return snake;
  },
  
  placeOnGrid(snake = app.snake) {
    app.grid[snake.position[0]][snake.position[1]] = "snake";
    if (snake.next) {
      this.placeOnGrid(snake.next);
    }
  },
}
```

### _View_

The view of the user is arranged into a header, main box, and side box using CSS Grid. Depending on the state of the app.screen property, the main box is rendered to show the welcome or game screens. 

```
const render = {
  mainBox() {
    document.querySelectorAll(".main-box").forEach((divBox) => {
      divBox.style.display = "none";
    });
    if (app.screen === "game") {
      document.querySelector("#game-box").style.display = "block";
      this.game();
    } else if (app.screen === "welcome") {
      document.querySelector("#welcome-box").style.display = "flex";
      this.welcome();
    }
  },
}
```

While the game screen is showing, the game is rendered to update to display the table based on the grid model, which itself is updated based on the snake model. To do this, the entire table is cleared and re-created each time the game is rendered. The class of each element is set to the value of the grid model ("blank", "food", "snake"), which is used to apply the repective CSS property to the element.

```
const render = {
  game() {
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
        row.append(this.addBoardBorders(box, i, j));
      });
      table.append(row);
    });
    this.score();
  },
}
```

The view is also updated to show the welcome screen, score, game-over message, and leaderboard. 

### _Controller_

The first controller to move the snake runs without the user's input. It takes the direction from the game state model and determines the appropriate action depending on the next tile the snake steps on. These are:  
1. If the next tile is blank: move the snake to the next tile (update snake model)
2. If the next tile is a food: grow the snake (update snake model), generate a new food (update grid model), and increase the score (update game state model)
3. Otherwise (the next tile is either a snake body or wall): the game ends (update game state model) 
The controller then calls itself at a fixed interval to continue moving the snake perpetually. 

```
const snakeMethods = {
  move() {
    snakeMethods.updateDirection();
    const nextTile = snakeMethods.nextTile();

    if (nextTile === "food") {
      snakeMethods.moveHeadTo(app.direction);
      if (!gridMethods.generateFood()) {
        gameMethods.endGame();
        return;
      }
      gameMethods.updateScore();
      gameMethods.updateSpeed();
    } else if (nextTile === "blank") {
      snakeMethods.moveHeadTo(app.direction);
      snakeMethods.removeTail();
    } else {
      return gameMethods.endGame();
    },
  
  moveHeadTo(direction) {
    const newSnakehead = {
      position: [
        app.snake.position[0] + direction[0],
        app.snake.position[1] + direction[1],
      ],
      next: app.snake,
    };
    app.grid[newSnakehead.position[0]][newSnakehead.position[1]] = "snake";
    app.snake = newSnakehead;
  },
  
  removeTail(snake = app.snake) {
    if (snake.next.next) {
      this.removeTail(snake.next);
    } else {
      app.grid[snake.next.position[0]][snake.next.position[1]] = "blank";
      snake.next = 0;
    }
  },
}
```

The controller also listens for a key down event via an event listener, which changes the game state model when triggered. To improve input responsiveness, for up to two user inputs can be stored before the game state model is changed. User inputs are also screened for validity (only 90$deg; turns are allowed) before being accepted to change the game state model. 

```
page.addEventListener("keydown", gameMethods.onKeyDownEvent);

gameMethods = {
  onKeyDownEvent(keyDownEvent) {
    if (app.screen === "game") {
      keyDownEvent.preventDefault();
      snakeMethods.addNextDirection(snakeMethods.keyToDir(keyDownEvent.code));
    }
  },
}

snakeMethods = {
  addNextDirection(nextDirection) {
    if (nextDirection) {
      if (app.inputQueue.length < 2) {
        let currentDirection;
        if (app.inputQueue.length > 0) {
          currentDirection = app.inputQueue[app.inputQueue.length - 1];
        } else {
          currentDirection = app.direction;
        }
        if (snakeMethods.isValidChange(nextDirection, currentDirection)) {
          app.direction = nextDirection;
          app.inputQueue.push(nextDirection);
        }
      }
    }
  },

  updateDirection() {
    if (app.inputQueue.length > 0) {
      app.direction = app.inputQueue[0];
      app.inputQueue.splice(0, 1);
    }
  },
}
```

The controller also includes several other functions, such as to check the validity of a directional change, generate food, speed up the snake, but these are excluded from this README for brevity. 

### _Testing_

A testing script was also implemented using Mocha and Chai libraries. This script tests and documents the expected input and outputs for the various functions used for this game. Functions manipulating the Document Object Model were not tested in this script. See the [test results here](https://rizvan93.github.io/snake/testing.html). 

## Future Developments & Improvements

Potential improvements for the future include: 
1. Allow an infinite board where the snake enters from the opposite side when hitting a wall (e.g. enter from the top when hitting the bottom)
2. Include animations for the snake movement
3. Download and upload the leaderboard score to a server

## Summary

This was my first attempt at creating a software product within a tight timeline. Nonetheless, by conscientiously applying the skills and knowledge I learnt in the first two weeks of General Assembly's Software Engineering Immersive, I was able to implement a workable game of snake which I must admit is rather fun to play. 
