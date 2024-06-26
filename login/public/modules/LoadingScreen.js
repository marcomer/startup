
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function stepAnimation(description) {
  const text = document.getElementsByClassName("loading-screen")[0].children[0];
  if (text.innerHTML.length === description.length + 3) {
    text.innerHTML = description;
  } else {
    text.innerHTML = text.innerHTML + ".";
  }
}

export async function loadingScreen(action, description, delay = 0) {
  const text = document.getElementsByClassName("loading-screen")[0].children[0];
  text.innerHTML = description;


  // start loading animation
  let animationInterval = setInterval(() => { stepAnimation(description) }, 500);

  await action();

  // clear loading screen
  if (delay > 0) {
    await sleep(delay);
  }

  // stop loading animation
  clearInterval(animationInterval);
  text.innerHTML = "";

  const loadingScreen = document.getElementsByClassName("loading-screen")[0];
  loadingScreen.classList.add("disabled-loading-screen");


}
