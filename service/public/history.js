import { Puzzle } from "./modules/puzzle.js";
import { loadingScreen } from "./modules/LoadingScreen.js"

let puzzleIDs = [];

function getValueAsString(row, col, puzzle) {
  const val = puzzle.getValueAt(row, col).toString();
  if (val === "0") {
    return "&nbsp;";
  }
  return val;
}

function createTableElement(puzzle, puzzleIndex) {
  const table = document.createElement("table");
  table.id = `puzzle${puzzleIndex}`;
  for (let row = 0; row < 9; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 9; col++) {
      const td = document.createElement("td");
      td.innerHTML = getValueAsString(row, col, puzzle);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

function createMenuElement(puzzle, className) {
  // create menu
  const menu = document.createElement("div");
  menu.className = className;

  // append generated date
  const genDateEl = document.createElement("p");
  const genDate = puzzle.getDateGenerated();
  genDateEl.textContent = `Generated ${genDate.getUTCMonth() + 1}/${genDate.getUTCDate()}/${genDate.getUTCFullYear()}`;
  menu.appendChild(genDateEl);

  if (className === "solved-menu") {
    // append solve date
    const solveDateEl = document.createElement("p");
    const solveDate = puzzle.getDateSolved();
    solveDateEl.textContent = `Solved ${solveDate.getUTCMonth() + 1}/${solveDate.getUTCDate()}/${solveDate.getUTCFullYear()}`;
    menu.appendChild(solveDateEl);
  }

  if (className === "unsolved-menu") {
    // append continue button form
    const form = document.createElement("form");
    form.setAttribute("method", "get");
    form.setAttribute("action", `javascript:goToSolvePage(\"${puzzle.id}\")`);

    const button = document.createElement("button");
    button.setAttribute("type", "submit");
    button.classList.add("btn", "continue-btn");
    button.textContent = "Continue";

    form.appendChild(button);
    menu.appendChild(form);
  }

  return menu;
}

/**
 * Creates and returns a "unsolved-puzzle" element.
 */
function createUnsolvedPuzzleElement(puzzle, puzzleIndex) {
  const parent = document.createElement("div");
  parent.className = "unsolved-puzzle";
  
  // append table
  const table = createTableElement(puzzle, puzzleIndex);
  parent.appendChild(table);

  // append menu
  const menu = createMenuElement(puzzle, "unsolved-menu");
  parent.appendChild(menu);

  return parent;
}

/**
 * Creates and returns a "solved-puzzle" element.
 */
function createSolvedPuzzleElement(puzzle, puzzleIndex) {
  const parent = document.createElement("div");
  parent.className = "solved-puzzle";
  
  // append table
  const table = createTableElement(puzzle, puzzleIndex);
  parent.appendChild(table);

  // append menu
  const menu = createMenuElement(puzzle, "unsolved-menu");
  parent.appendChild(menu);

  return parent;
}

async function getMostRecentPuzzles() {
  const user = localStorage.getItem("username");
  if (user === null) {
    throw Error("LocalStorage is missing \"username\" item");
  }
  let response = await fetch(`/api/puzzle/${user}/recent`);
  puzzleIDs = await response.json();

  const puzzles = [];
  for (let i = 0 ; i < puzzleIDs.length; i++) {
    //get puzzle
    response = await fetch(`/api/puzzle/${user}/${puzzleIDs[i]}`);
    const {solution, table, id, genDate, solveDate } = await response.json();
    puzzles[i] = new Puzzle(solution, table, id, genDate, solveDate);
  }
  //TODO: should it sort by date and if solved? or should api do that?
  return puzzles;
}


/**
 * Display the user's most recent puzzles on the page.
 */
async function displayPuzzles() {

  try {
    const puzzles = await getMostRecentPuzzles(); 

    const grid = document.getElementsByClassName("puzzle-grid")[0];

    // display puzzles
    for (let i = 0; i < puzzles.length; i++) {
      let puzzleEl;
      if (puzzles[i].solved()) {
        puzzleEl = createSolvedPuzzleElement(puzzles[i], i);
      } else {
        puzzleEl = createUnsolvedPuzzleElement(puzzles[i], i);
      }

      grid.appendChild(puzzleEl);
      puzzleIDs.push(puzzles[i].id);
    }
  } catch(error) {
    console.log(`An error occurred: ${error.message}`);
  }
}

await loadingScreen(displayPuzzles, "Retrieving history");