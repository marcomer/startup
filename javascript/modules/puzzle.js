// module containing the Puzzle class and ways to generate and get puzzles

// global timer

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
  #uuid;

  /**
   * Construct a new Puzzle object.
   * @param {Array<Array<number>>} solution 2D array (9x9) of numbers (1-9)
   * @param {Array<Array<Value>>} table 2D array (9x9) of Value objects
   * @param {string} uuid a unique identifer for the Puzzle
   */
  constructor(solution, table, uuid) {
    //this.#solution = JSON.parse(JSON.stringify(solution));
    //this.#table = JSON.parse(JSON.stringify(table));
    this.#solution = solution;
    this.#table = table;
    this.#uuid = uuid;
  }

  /**
   * Get the uuid associated with the puzzle.
   * @returns {string} uuid
   */
  get getUUID() {
    return this.#uuid;
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function squareContainsValue(row, col, value, table) {
  for (let r = row; r < row + 3; r++) {
    for (let c = col; c < col + 3; c++) {
      if (table[r][c] === value) {
        return true;
      }
    }
  }
  return false;
}

function rowContainsValue(row, value, table) {
  for (let c = 0; c < 9; c++) {
    if (table[row][c] === value) {
      return true;
    }
  }
  return false;
}

function colContainsValue(col, value, table) {
  for (let r = 0; r < 9; r++) {
    if (table[r][col] === value) {
      return true;
    }
  }
  return false;
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}



function isSafe(row, col, value, table) {
  let rmin = row;
  let cmin = col;
  while (rmin % 3 !== 0) {
    rmin--;
  }
  while (cmin % 3 !== 0) {
    cmin--;
  }
  return !squareContainsValue(rmin, cmin, value, table) 
      && !rowContainsValue(row, value, table) 
      && !colContainsValue(col, value, table)
}

function verifyBoard(table) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const backup = table[r][c];
      table[r][c] = 0; 
      if (!isSafe(r, c, backup, table)) {
        table[r][c] = backup;
        return false;
      }
      table[r][c] = backup;
    }
  }
  return true;
}

function getNextVal(r, c, table) {
  c++;
  if (c > 8) {
    c = 0;
    r++;
  }
  if (r > 8) {
    return -1;
  }
  return table[r][c];
}

function fillPuzzle(r, c, table) {
  if (c > 8) {
    c = 0;
    r++;
  }

  if (r === 8 && c === 8) {
    if (table[r][c] > 0) {
      return;
    }
    // last item
    for (let i = 1; i < 10; i++) {
      if (isSafe(r, c, i, table)) {
        table[r][c] = i;
        return; // success, return
      }
    }
    table[r][c] = 0;
    return; // failed, return
  } 

  if (table[r][c] !== 0) {
    fillPuzzle(r, c + 1, table);
    return;
  }

  // any item except last
  let tried = [];
  while (getNextVal(r, c, table) === 0) {
    // find a new num that hasn't been tried
    while (tried.length < 9) {
      let newTry = getRandomInt(1, 9);
      if (tried.includes(newTry)) {
        continue;
      }
      tried.push(newTry);
      if (isSafe(r, c, newTry, table)) {
        table[r][c] = newTry;
        break;
      }
    }
    if (table[r][c] === 0 || tried.length === 9) {
      table[r][c] = 0;
      return; // went through all tries, reset
    }
    fillPuzzle(r, c + 1, table);
    if (getNextVal(r, c, table) !== 0) {
      return; // success
    }
  }
  return;
}

function getEmptyBoxes(table) {
  let boxes = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (table[r][c] === 0) {
        boxes.push([r,c]);
      }
    }
  }
  return boxes;
}

class PuzzleSolver {
  table;

  constructor(table) {
    this.table = table;
  }

  hasUniqueSolution() {
    let solutions = this.solve(false);
    return solutions.length;
  }

  solve(findAll = true) {
    let solutions = [];
    let copy = JSON.parse(JSON.stringify(this.table));
    try {
      this.#rsolve(copy, solutions, findAll);
    } catch(error) {
      // found more than two solutions (do not find all)
      console.log("More than 1 solution found");
    }
    return solutions;
  }

  #rsolve(table, solutions, findAll) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (table[r][c] === 0) {
          // try possible values
          for (let i = 1; i < 10; i++) {
            if (isSafe(r, c, i, table)) {
              table[r][c] = i;
              this.#rsolve(table, solutions, findAll);
              if (!findAll && solutions.length > 1) {
                throw Error ("Solve timeout");
              }
              table[r][c] = 0;
            }
          }
          return;
        }
      }
    }
    if (getEmptyBoxes(table).length === 0) {
      solutions.push(JSON.parse(JSON.stringify(table)));
    }
    return;
  }
}

function removeBoxes(n, table, actual) {
  let count = n;
  let coords = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let arr = [r,c];
      coords.push(arr);
    }
  }
  shuffleArray(coords);
  let solver = new PuzzleSolver(table);

  let startTime = Date.now();
  while (count > 0 && coords.length > 0) {
    const [r,c] = coords.pop();
    const backup = table[r][c];
    table[r][c] = 0;
    if (solver.hasUniqueSolution() === 1) {
      count--;
    } else {
      table[r][c] = backup;
      coords.push([r,c]);
      shuffleArray(coords);
    }
  }
}

/**
 * Helper function for generatePuzzle(). Creates a puzzle with a unique solution.
 * Max number of boxes that can be removed is 57 (inclusive).
 */
function generatePuzzleHelper(rm) {
  if (rm > 57) {
    rm = 57;
  }
  try {
    // generate the complete puzzle
    let solution = [[0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]];

    fillPuzzle(0, 0, solution);
    console.log("Solution:");
    console.log(solution);
    console.log("Verifying constraints on solution...");
    console.log(verifyBoard(solution));
    if (!verifyBoard(solution)) {
      throw Error ("Solution did not fit constraints");
    }

    // create the partial version of the solution
    let partial = JSON.parse(JSON.stringify(solution));
    console.log("Removing boxes...");
    removeBoxes(rm, partial, solution);
    console.log("Partial board:");
    console.log(partial);
    console.log("Verifying that there is one, unique solution...");
    let solver = new PuzzleSolver(partial);
    console.log(solver.hasUniqueSolution() === 1);
    if (solver.hasUniqueSolution() !== 1) {
      throw Error ("Does not have unique solution");
    }

    console.log(`Removed ${getEmptyBoxes(partial).length} boxes`);
    if (getEmptyBoxes(partial).length !== rm) {
      throw Error ("Did not remove enough boxes");
    }

    let s = partial.join();
    s = s.replaceAll(",", "");
    s = s.replaceAll("0", ".");
    console.log(s);
    //turn everything in partial to a value
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (partial[r][c] === 0) {
          partial[r][c] = new Value(partial[r][c], true);
        } else {
          partial[r][c] = new Value(partial[r][c], false);
        }
      }
    }

    return new Puzzle(solution, partial, crypto.randomUUID());
  } catch (error) {
    console.log(error.message);
    return generatePuzzleHelper();
  }
}


/**
 * Generate a new puzzle with a unique solution.
 */
export async function generatePuzzle(rm = 55) {
  return generatePuzzleHelper(rm);
}


export async function getPuzzle(uuid = 0) {
  // TODO: in the future this should get a puzzle from the database by uuid

  return await generatePuzzle();
}
