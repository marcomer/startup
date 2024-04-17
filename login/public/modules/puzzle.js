import {Database} from "./db.js";

// module containing the Puzzle class and ways to generate and get puzzles

class Value {
  value;
  editable;

  /**
   * Construct a new Value object.
   * @param {number} value a number from 1-9
   * @param {boolean} editable whether or not the value can be edited/changed
   */
  constructor(value, editable = true) {
    this.value = value;
    this.editable = editable;
  }
}

export class Puzzle {
  #solution;
  #table;
  #id;
  #genDate;
  #solveDate;

  /**
   * Construct a new Puzzle object.
   * @param {Array<Array<number>>} solution 2D array (9x9) of numbers (1-9)
   * @param {Array<Array<Value>>} table 2D array (9x9) of Value objects
   * @param {string} id a unique identifer for the Puzzle
   */
  constructor(solution, table, id, genDate, solveDate = null) {
    //this.#solution = JSON.parse(JSON.stringify(solution));
    //this.#table = JSON.parse(JSON.stringify(table));
    this.#solution = solution;
    this.#table = table;
    this.#id = id;
    this.#genDate = genDate;
    this.#solveDate = solveDate;
  }

  /**
   * Get the uuid associated with the puzzle.
   * @returns {string} uuid
   */
  get id() {
    return this.#id;
  }

  getDateGenerated() {
    return new Date(this.#genDate);
  }

  getDateSolved() {
    return new Date(this.#solveDate);
  }

  setDateSolved(solveDate) {
    this.#solveDate = solveDate;
  }

  /**
   * Return a basic object of the puzzle, only containing what is needed for a constructor
   */
  basicObject() {
    return { 
      solution: this.#solution,
      table: this.#table, 
      id: this.#id, 
      genDate: this.#genDate, 
      solveDate: this.#solveDate
    };
  }

  /**
   * Get a value from the table (not the solution).
   * @param {number} row the table row
   * @param {number} col the table column
   * @returns {number} the value at table[`row`][`col`], or 0 if `row` or `col` are out-of-range
   */
  getValueAt(row, col) {
    if (row < 0 || col < 0 || row > 8 || col > 8) {
      return 0;
    }
    return this.#table[row][col].value;
  }

  /**
   * Attempts to insert a value in the table at [`row`][`col`]. If the `value`
   * violates any constraints then false will be returned along with an array
   * of table positions that the `value` violates. The `value` will not be inserted
   * unless it does not violate any constraints.
   * 
   * @param {number} row the table row
   * @param {number} col the table column
   * @param {number} value the value to be inserted
   * @returns {[boolean, [[number,number]]]} a boolean success var and an 
   * array of table positions that the value violates
   */
  insertValueAt(row, col, value) {
    if (value > 9 || value < 1 || row < 0 || col < 0 || row > 8 || col > 8) {
      return [false, []];
    }
    const [passed, violations] = this.checkConstraints(row, col, value);
    if (passed) {
      this.#table[row][col].value = value;
      return [true, violations];
    }
    return [false, violations];
  }

  /**
   * Remove a value from the puzzle, if the value is editable.
   * @param {number} row the table row
   * @param {number} col the table column
   * @returns true if the value was removed, false if it was not removed
   */
  removeValueAt(row, col) {
    if (row < 0 || col < 0 || row > 8 || col > 8) {
      return false;
    }
    if (!this.#table[row][col].editable) {
      return false;
    }

    this.#table[row][col].value = 0;
    return true;
  }


  /**
   * Checks a given `value` in the table at [`row`][`col`] against the puzzle constraints. 
   * If the `value` violates any constraints then false will be returned along with an array
   * of table positions that the `value` violates. Does not attempt to insert the value, only
   * checks it.
   * 
   * @param {number} row the table row
   * @param {number} col the table column
   * @param {number} value the value to be checked
   * @returns {[boolean, [[number,number]]]} a boolean success var and an 
   * array of table positions that the value violates
   */
  checkConstraints(row, col, value) {
    if (value > 9 || value < 1 || row < 0 || col < 0 || row > 8 || col > 8 ) {
      return [false, []];
    }
    if (this.#table[row][col] === value) {
      return [true, []];
    }

    let violations = [];
    
    // check against col and row
    for (let i = 0; i < 9; i++) {
      if (this.#table[i][col].value === value) {
        violations.push([i, col]);
      }
      if (this.#table[row][i].value === value) {
        violations.push([row, i]);
      }
    }

    // check against square unit
    let rmin = row;
    let cmin = col;
    while (rmin % 3 !== 0) {
      rmin--;
    }
    while (cmin % 3 !== 0) {
      cmin--;
    }
    for(let r = rmin; r < rmin + 3; r++) {
      for (let c = cmin; c < cmin + 3; c++) {
        if (this.#table[r][c].value === value) {
          const array = [r, c];
          if (violations.length === 0 || !violations.some(a => array.every((v, i) => v === a[i]))) {
            // violations does not contain the array
            violations.push([r, c]);
          }
        }
      }
    }

    if (violations.length === 0) {
      return [true, []];
    }
    return [false, violations];
  }

  /**
   * Determines if the puzzle has been solved. Compares the table with the solution.
   * @returns {boolean} true if the puzzle is solved, false if the puzzle is not yet solved
   */
  solved() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.#solution[r][c] !== this.#table[r][c].value) {
          return false;
        }
      }
    }
    return true;
  }

  editable(row, col) {
    if (row < 0 || col < 0 || row > 8 || col > 8) {
      return false;
    }
    return this.#table[row][col].editable;
  }
}




function numToValues(table) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (table[r][c] === 0) {
        table[r][c] = new Value(table[r][c], true);
      } else {
        table[r][c] = new Value(table[r][c], false);
      }
    }
  }
}


function generateID() {
  const list = crypto.randomUUID().split("-");
  return list[list.length - 1];
}



/**
 * Generate a new puzzle with a unique solution.
 */
export async function generatePuzzle() {
  /*if (Database.getGlobalGenerated() === null) {
    Database.setGlobalGenerated(1000);
  }
  Database.setGlobalGenerated(Database.getGlobalGenerated() + 1);
  if (Database.getUserGenerated() === null) {
    Database.setUserGenerated(50);
  }
  Database.setUserGenerated(Database.getUserGenerated() + 1);*/
  //const puzzleGen = new PuzzleGenerator();
  //return puzzleGen.generate(50);

  const response = await fetch("https://sudoku-api.vercel.app/api/dosuku");
  const data = await response.json();
  let table = data.newboard.grids[0].value;
  const solution = data.newboard.grids[0].solution;
  const genDate = new Date();

  numToValues(table);

  return new Puzzle(solution, table, generateID(), genDate);
} 


export async function generateSolvedPuzzle() {
  const response = await fetch("https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{solution}}}");
  const data = await response.json();
  const solution = data.newboard.grids[0].solution;
  let table = JSON.parse(JSON.stringify(solution));
  const genDate = new Date();
  const solveDate = new Date();

  numToValues(table);

  return new Puzzle(solution, table, generateID(), genDate, solveDate);
}

export async function getPuzzle(uuid = 0) {
  // TODO: in the future this should get a puzzle from the database by uuid

  return await generatePuzzle();
}