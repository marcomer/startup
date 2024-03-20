
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));


async function updateScoreboard() {
  const user = localStorage.getItem("username");
  if (user === null) {
    throw Error("LocalStorage is missing \"username\" item");
  }

  const response = await fetch(`/api/stats/scoreboard`);
  const { scores } = await response.json();
  console.log(scores);

  let tbody = document.getElementsByTagName("tbody")[0];
  for (let i = 0; i < 10; i++) {
    let tr = tbody.children.item(i);
    let td = tr.children.item(1);
    td.innerHTML = `${scores[i]}`;
  }
}

function updateGlobalGenerated(n) {
  let span = document.getElementById("globalGenerated");
  span.innerHTML = `${n}`;
}

function updateGlobalSolved(n) {
  let span = document.getElementById("globalSolved");
  span.innerHTML = `${n}`;
}

function updateTotalPlayers(n) {
  let span = document.getElementById("totalPlayers");
  span.innerHTML = `${n}`;
}

function updateUserGenerated(n) {
  let span = document.getElementById("userGenerated");
  span.innerHTML = `${n}`;
}

function updateUserSolved(n) {
  let span = document.getElementById("userSolved");
  span.innerHTML = `${n}`;
}

function setUserScoreboard(n) {
  let span = document.getElementById("userScoreboard");
  span.innerHTML = `#${n}`;
}


async function update() {
  const user = localStorage.getItem("username");
  if (user === null) {
    throw Error("LocalStorage is missing \"username\" item");
  }


  // get stats
  const response = await fetch(`/api/stats/${user}`);
  const { globalStats, userStats } = await response.json();
  console.log(globalStats);
  console.log(userStats);
  
  updateUserGenerated(userStats.puzzlesGenerated);
  updateUserSolved(userStats.puzzlesSolved);
  updateGlobalGenerated(globalStats.puzzlesGenerated);
  updateGlobalSolved(globalStats.puzzlesSolved);
  updateTotalPlayers(globalStats.totalPlayers);
  setUserScoreboard(userStats.scoreboardPosition);
}

updateScoreboard();

// update loop
while (true) {
  await update();
  await sleep(5000);
}