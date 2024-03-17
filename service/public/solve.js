import {Puzzle, generatePuzzle, getPuzzle} from "./modules/puzzle.js";
import {Database} from "./modules/db.js";

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

class Game {
  #puzzle;

  /**
   * Construct a new Game object.
   * @param {Puzzle} puzzle a Puzzle
   */
  constructor(puzzle) {
    this.#puzzle = puzzle;
  }


  displayViolations(row, col, violations) {
    // reset any background colors
    let tdElements = document.getElementsByTagName("td");
    for (let td of tdElements) {
      let input = td.firstElementChild;
      if (input !== null) {
        input.style.background = "#1a1a1a";
      }
    }

    // change background to red for violations
    for (let i = 0; i < violations.length; i++) {
      const [r, c] = violations[i];
      let input = document.getElementById(`[${r}][${c}]`);
      if (input != null) {
        input.style.background = "#ff2a00";
      }
    }
  }

  resetDisplay() {
    // reset the values and background
    let tdElements = document.getElementsByTagName("td");
    for (let td of tdElements) {
      let input = td.firstElementChild;
      if (input !== null) {
        input.style.background = "#1a1a1a";
        const [row, col] = parseRowAndCol(input.id);
        input.value = this.getValueAsString(row, col);  // set input's value to puzzle's value
      }
    }
  }

  async displaySolvedAnimation() {
    // fill the display with green background row by row
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        let input = document.getElementById(`[${r}][${c}]`);
        input.style.background = "rgb(0,255,51)";
        input.style.color = "#1a1a1a";
        input.style.fontWeight = "bold";
        input.classList.remove("editableInput");
      }
      await sleep(75);
    }
  }

  /**
   * Insert a value into the puzzle. If there are violations, the value is not
   * inserted and the violations are displayed. If the value is inserted, a check
   * is made to see if the puzzle is solved.
   * @param {number} row the table row
   * @param {number} col the table column
   * @param {number} value the value to be inserted
   * @return {void}
   */
  insertValue(row, col, value) {
    const [success, violations] = this.#puzzle.insertValueAt(row, col, value);
    if (success) {
      // TODO: save the puzzle in the database

      if (this.#puzzle.solved()) {
        // puzzle has been solved
        this.resetDisplay();

        // TODO: increase solved counter
        if (Database.getUserSolved() === null) {
          Database.setUserSolved(0);
        }
        Database.setUserSolved(Database.getUserSolved() + 1);

        if (Database.getGlobalSolved() === null) {
          Database.setGlobalSolved(1000);
        }
        Database.setGlobalSolved(Database.getGlobalSolved() + 1);

        // disable all inputs
        let tdElements = document.getElementsByTagName("td");
        for (let td of tdElements) {
          let input = td.firstElementChild;
          if (input !== null) {
            input.setAttribute("disabled", "disabled");
          }
        }

        this.displaySolvedAnimation();




        // TODO: create pop up, show when generated and when solved, continue to history page button
      }
      return true;
    }
    else {
      if (violations.length > 0) {
        this.displayViolations(row, col, violations);
      }
      return false;
    }
  }


  removeValueAt(row, col) {
    this.#puzzle.removeValueAt(row, col);
  }


  getValueAsString(row, col) {
    const val = this.#puzzle.getValueAt(row, col).toString();
    if (val === "0") {
      return "";
    }
    return val;
  }

  editable(row, col) {
    return this.#puzzle.editable(row, col);
  }



}


const isNum = new RegExp("[1-9]{1}");

function parseRowAndCol(id) {
  const match = id.match(/\d/g);
  return [parseInt(match[0]), parseInt(match[1])];
}



// start program

// get username
const user = localStorage.getItem("username");
if (user === null) {
  throw Error("LocalStorage is missing \"username\" item");
}

let puzzle = null;

// get puzzleID
const url = new URL(window.location.href);
let puzzleID = url.searchParams.get("id");
if (puzzleID === null) {
  console.log("In get new puzzle");
  const response = await fetch(`/api/puzzle/${user}/new`);
  const {solution, table, id, genDate, solveDate } = await response.json();
  console.log("Got new puzzle");
  puzzle = new Puzzle(solution, table, id, genDate, solveDate);
  puzzleID = id;
  url.searchParams.append("id", puzzleID);
  window.history.replaceState({}, "SuperUserDoku", url.href);
}

// get puzzle
if (puzzle === null) {
  const response = await fetch(`/api/puzzle/${user}/${puzzleID}`);
  const {solution, table, id, genDate, solveDate } = await response.json();
  puzzle = new Puzzle(solution, table, id, genDate, solveDate);
}


// init game
const game = new Game(puzzle);
game.resetDisplay();

// INITIALIZE PAGE
let tdElements = document.getElementsByTagName("td");
for (let td of tdElements) {
  let input = td.firstElementChild;
  if (input !== null) {
    const [row, col] = parseRowAndCol(input.id);    // get row, col
    input.value = game.getValueAsString(row, col);  // set input's value to puzzle's value

    if (game.editable(row, col)) {
      // input box can be edited

      input.style.color = "#b8b8b8";

      // create focus event listener that changes the caret position to the end of the text box
      input.addEventListener("click", function(event) {
        game.resetDisplay();
        let target = event.target;
        let len = target.value.length;
             
        if (target.setSelectionRange) {
            target.focus();
            target.setSelectionRange(len, len);
        } else if (target.createTextRange) {
            let t = target.createTextRange();
            t.collapse(true);
            t.moveEnd('character', len);
            t.moveStart('character', len);
            t.select();
        }
      });


      // create input event listener that checks and inserts value into puzzle
      input.addEventListener("input", function(event) {
        const [row, col] = parseRowAndCol(event.target.id);
        if (event.target.value.length === 0) {
          // backspace was hit, remove value from puzzle
          game.removeValueAt(row, col);
          return;
        }
        
        const puzzleVal = game.getValueAsString(row, col);
        const value = event.target.value[event.target.value.length - 1];
        let backup = "";
        if (event.target.value.length > 1) {
          backup = event.target.value[0];
        }
        game.resetDisplay();

        event.target.value = "";
        if (isNum.test(value)) {
          // is a single number from 1-9, insert the value
          event.target.value = value; 
          game.insertValue(row, col, parseInt(value));
        } else {
          event.target.value = backup; // reset to original value
        }
      });
      input.classList.add("editableInput");
    }
    else {
      // input box cannot be edited
      input.setAttribute("disabled", "disabled"); // disable editing on box
      input.style.fontWeight = "bold";
    }
  }
}


