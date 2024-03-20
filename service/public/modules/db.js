
export class Database {

  static setGlobalSolved(n) {
    localStorage.setItem("globalSolved", `${n}`);
  }
  
  static setGlobalGenerated(n) {
    localStorage.setItem("globalGenerated", `${n}`);
  }
  
  static getGlobalSolved() {
    let r = localStorage.getItem("globalSolved");
    if (r === null) {
      return null;
    }
    return parseInt(r);
  }
  
  static getGlobalGenerated() {
    let r = localStorage.getItem("globalGenerated");
    if (r === null) {
      return null;
    }
    return parseInt(r);
  }
  
  static setTotalPlayers(n) {
    localStorage.setItem("totalPlayers", `${n}`)
  }
  
  static getTotalPlayers() {
    let r = localStorage.getItem("totalPlayers");
    if (r === null) {
      return null;
    }
    return parseInt(r);
  }
  
  
  
  
  static setUserGenerated(n) {
    localStorage.setItem("userGenerated", `${n}`);
  }
  
  static getUserGenerated() {
    let r = localStorage.getItem("userGenerated");
    if (r === null) {
      return null;
    }
    return parseInt(r);
  }
  
  static setUserSolved(n) {
    localStorage.setItem("userSolved", `${n}`);
  }
  
  static getUserSolved() {
    let r = localStorage.getItem("userSolved");
    if (r === null) {
      return null;
    }
    return parseInt(r);
  }
  
  static setUserScoreboard(n) {
    localStorage.setItem("userScoreboard", `${n}`);
  }
  
  static getUserScoreboard() {
    let r = localStorage.getItem("userScoreboard");
    if (r === null) {
      return null;
    }
    return parseInt(r);
  }
}




let globalPuzzlesGenerated = Math.floor(Math.random() * 100 + 1000);
let globalPuzzlesSolved = Math.floor(Math.random() * 100 + 500);
let globalTotalPlayers = Math.floor(Math.random() * 100 + 500);


let userPuzzlesGenerated = Math.floor(Math.random() * 100);
let userPuzzlesSolved = userPuzzlesGenerated - Math.floor(Math.random() * userPuzzlesGenerated);
let userScoreboardPosition = Math.floor(Math.random() * 9 + 1);




export async function getScoreboard() {
  let s = [];
  for (let i = 0; i < 10; i++) {
    s.push(Math.floor(Math.random() * 100));
  }
  s.sort((a,b) => b - a);

  return {
    scores: s
  };
}



export async function getStats(user) {
  // TODO: get user's stats from database
  // currently there is only one set of user stats

  return {
    globalStats: {
      puzzlesGenerated: globalPuzzlesGenerated,
      puzzlesSolved: globalPuzzlesSolved,
      totalPlayers: globalTotalPlayers
    }, 
    userStats: {
      puzzlesGenerated: userPuzzlesGenerated,
      puzzlesSolved: userPuzzlesSolved,
      scoreboardPosition: userScoreboardPosition
    }
  };
}


export async function setUserStats(userStats) {
  userPuzzlesGenerated = (userStats.puzzlesGenerated === null) ? userPuzzlesGenerated : userStats.puzzlesGenerated;
  userPuzzlesSolved = (userStats.puzzlesSolved === null) ? userPuzzlesSolved : userStats.puzzlesSolved;
  // scoreboardPosition cannot be set from here
  // TODO: determine scoreboard position based on user's number of puzzles solved
  // TODO: update scoreboard position

  return true;
}