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


// create the game
// get the puzzle
let puzzle = await getPuzzle();
let game = new Game(puzzle);

// INITIALIZE PAGE

let tdElements = document.getElementsByTagName("td");
for (let td of tdElements) {
  let input = td.firstElementChild;
  if (input !== null) {
    const [row, col] = parseRowAndCol(input.id);    // get row, col
    input.value = game.getValueAsString(row, col);  // set input's value to puzzle's value

    if (game.editable(row, col)) {
      // input box can be edited
      // create focus event listener that changes the caret position to the end of the text box
      input.addEventListener("click", function(event) {
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
    }
    else {
      // input box cannot be edited
      input.setAttribute("disabled", "disabled"); // disable editing on box
    }
  }
}


