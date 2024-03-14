function login() {
  const emailEl = document.querySelector("#email");
  const passwordEl = document.querySelector("#password");
  if (emailEl.value == "") {
    return; // do error checking later
  }
  localStorage.setItem("userEmail", email.value);
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