function login() {
  const usernameEl = document.querySelector("#username");
  const passwordEl = document.querySelector("#password");
  if (usernameEl.value == "") {
    return; // TODO: do error checking later
  }
  localStorage.setItem("username", usernameEl.value);
  window.location.replace("/history");
}

window.addEventListener('keydown', (event) => {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }  
  
  switch (event.key) {
    case "Enter":
      login();
      break;
    default:
      return;
  }

  event.preventDefault();
});