import {Puzzle, generatePuzzle, getPuzzle} from "./modules/puzzle.js"

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

    // insert all numbers
  }

  resetDisplay() {
    // reset any background colors
    
    // insert all numbers
  }

  displaySolvedAnimation() {

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
        this.displaySolvedAnimation();

        // increase solved counter
        
      }
    }
    else {
      if (violations.length > 0) {
        this.displayViolations(row, col, violations);
      }
    }
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
  const match = id.match(isNum);
  return [parseInt(match[0]), parseInt(match[1])];
}


// create the game
// get the puzzle
let game = new Game(getPuzzle());

// INITIALIZE PAGE

let tdElements = document.getElementsByTagName("td");
for (let td of tdElements) {
  let input = td.firstElementChild;
  if (input !== null) {
    const [row, col] = parseRowAndCol(input.id);    // get row, col
    input.value = game.getValueAsString(row, col);  // set input's value to puzzle's value

    if (game.editable(row, col)) {
      // input box can be edited

      // create input event listener that checks and inserts value into puzzle
      input.addEventListener("input", function(event) {
        if (event.target.value.length === 0) {
          return;
        }
        const [row, col] = parseRowAndCol(event.target.id);
        const puzzleVal = game.getValueAsString(row, col);
        const value = event.target.value[event.target.value.length - 1];
        game.resetDisplay();
  
        event.target.value = "";  //reset input value
        if (isNum.test(value)) {
          // is a single number from 1-9, insert the value
          event.target.value = value; 
          game.insertValue(row, col, parseInt(value));
        }
      });
    }
    else {
      // input box cannot be edited
      input.setAttribute("disabled", "disabled"); // disable editing on box
    }
  }
}


