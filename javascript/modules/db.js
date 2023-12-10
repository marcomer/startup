
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