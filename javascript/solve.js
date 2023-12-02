

class Puzzle {
  #solution;
  #table;
  #uuid;

  constructor(solution, table, uuid) {
    //this.#solution = JSON.parse(JSON.stringify(solution));
    //this.#table = JSON.parse(JSON.stringify(table));
    this.#solution = solution;
    this.#table = table;
    this.#uuid = uuid;
  }

  get getUUID() {
    return this.#uuid;
  }

  getValueAt(row, col) {
    if (row < 0 || col < 0 || row > 8 || col > 8) {
      return 0;
    }
    return this.#table[row][col];
  }

  insertValueAt(row, col, value) {
    if (value > 9 || value < 1 || row < 0 || col < 0 || row > 8 || col > 8 ) {
      return [false, []];
    }
    const [passed, violations] = this.checkConstraints(row, col, value);
    if (passed) {
      this.#table[row][col] = value;
      return [true, violations];
    }
    return [false, violations];
  }

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
      if (this.#table[i][col] === value) {
        violations.push([i, col]);
      }
      if (this.#table[row][i] === value) {
        violations.push([row, i]);
      }
    }

    // check against square unit
    const rmin = row;
    const cmin = col;
    while (rmin % 3 !== 0) {
      rmin--;
    }
    while (cmin % 3 !== 0) {
      cmin--;
    }
    for(let r = rmin; r < rmin + 3; r++) {
      for (let c = cmin; c < cmin + 3; c++) {
        if (this.#table[r][c] === value) {
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


  
}

/**
 * Generate a new puzzle with a unique solution.
 */
async function generatePuzzle() {
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

  // TODO:

  // generate the partially complete puzzle
  let partial = JSON.parse(JSON.stringify(solution));

  return new Puzzle(solution, partial, crypto.randomUUID());
}


async function getPuzzle(uuid = 0) {
  // TODO: in the future this should get a puzzle from the database by uuid

  return await generatePuzzle();
}

/**
 * Return 12 of the most recently worked on puzzles from the user's database profile.
 */
async function mostRecentPuzzles() {
  //TODO: in the future this should get a list of uuids/puzzles? from the database

  // 
}