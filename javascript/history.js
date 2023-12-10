import {Puzzle, generatePuzzle, getPuzzle} from "./modules/puzzle.js";

function getValueAsString(row, col, puzzle) {
  const val = puzzle.getValueAt(row, col).toString();
  if (val === "0") {
    return " ";
  }
  return val;
}

/**
 * Return 12 of the most recently worked on puzzles from the user's database profile.
 */
async function mostRecentPuzzles() {
  //TODO: in the future this should get a list of uuids/puzzles? from the database

  // for each puzzle, 
  for (let p = 1; p < 13; p++) {
    let table = document.getElementById(`puzzle${p}`);
    if (table === null) {
      continue;
    }
    let puzzle = await generatePuzzle(50);
    let tbody = table.children.item(0);
    for (let r = 0; r < 9; r++) {
      let tr = tbody.children.item(r);
      for (let c = 0; c < 9; c++) {
        let td = tr.children.item(c);
        td.textContent = getValueAsString(r, c, puzzle);
      }
    }
  }

}

await mostRecentPuzzles();