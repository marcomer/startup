import {Database} from "./modules/db.js";

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));


function resetScoreboard() {

}

function updateGlobalGenerated(n) {
  let span = document.getElementById("globalGenerated");
  if (Database.getGlobalGenerated() === null) {
    Database.setGlobalGenerated(1000);
  }
  Database.setGlobalGenerated(Database.getGlobalGenerated() + n);
  span.innerHTML = `${Database.getGlobalGenerated()}`;
}

function updateGlobalSolved(n) {
  let span = document.getElementById("globalSolved");
  if (Database.getGlobalSolved() === null) {
    Database.setGlobalSolved(500);
  }
  Database.setGlobalSolved(Database.getGlobalSolved() + n);
  span.innerHTML = `${Database.getGlobalSolved()}`;
}

function updateTotalPlayers(n) {
  let span = document.getElementById("totalPlayers");
  if (Database.getTotalPlayers() === null) {
    Database.setTotalPlayers(700);
  }
  Database.setTotalPlayers(Database.getTotalPlayers() + n);
  span.innerHTML = `${Database.getTotalPlayers() + n}`;
}

function updateUserGenerated(n) {
  let span = document.getElementById("userGenerated");
  if (Database.getUserGenerated() === null) {
    Database.setUserGenerated(50);
  }
  Database.setUserGenerated(Database.getUserGenerated() + n);
  span.innerHTML = `${Database.getUserGenerated() + n}`;
}

function updateUserSolved(n) {
  let span = document.getElementById("userSolved");
  if (Database.getUserSolved() === null) {
    Database.setUserSolved(25);
  }
  Database.setUserSolved(Database.getUserSolved() + n);
  span.innerHTML = `${Database.getUserSolved() + n}`;
}

function setUserScoreboard(n) {
  let span = document.getElementById("globalGenerated");
  if (Database.getUserScoreboard() === null) {
    Database.setUserScoreboard(100);
  }
  Database.setUserScoreboard(n);
  span.innerHTML = `${Database.getUserScoreboard()}`;
}

updateUserGenerated(0);
updateUserSolved(0);
setUserScoreboard(3);

while (true) {
  let n = Math.floor(Math.random() * 20);
  updateGlobalGenerated(n);
  n = Math.floor(Math.random() * 10);
  updateGlobalSolved(n);
  n = Math.floor(Math.random() * 3);
  updateTotalPlayers(n);
  await sleep(5000);
}