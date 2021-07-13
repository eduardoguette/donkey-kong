const btnStart = document.querySelector(".btn-start");
const entorno = document.querySelector(".entorno");

window.onresize = () => {
  if (window.innerWidth > 1024) {
  }
};
function UI() {}
btnStart.addEventListener("click", () => {
  btnStart.setAttribute("hidden", true);
  playGame();
});
let lives;

let contRight;
let puntuacion;
// funciones fundamentales
function start() {
  addLives();
  let key;
  lives = 1;
  puntuacion = 0;
  contRight = 0;
  let positions;
  let pressKey = {
    ArrowLeft: false,
    ArrowUp: false,
    ArrowRight: false,
  };
  entorno.classList.remove("game-over");
  const mario = document.querySelector(".mario");

  const containerMono = document.querySelector(".container-kong");

  // listeners
  document.addEventListener("keydown", (e) => {
    key = e.code;
    if (!mario.matches(".no-move")) {
      for (i in pressKey) {
        if (i === key) {
          pressKey[i] = true;
          handleM();
        } else {
          pressKey[i] = false;
        }
      }

      mario.setAttribute("style", `--contRight:${contRight}px`);
    }
  });
  document.addEventListener("keyup", () => {
    if (!mario.matches(".no-move")) {
      for (i in pressKey) {
        pressKey[i] = false;
        handleM();
      }
      mario.setAttribute("style", `--contRight:${contRight}px`);
      downFloor();
    }
  });

  function handleM() {
    for (i in pressKey) {
      if (i === "ArrowLeft") {
        moveLeft(pressKey[i]);
      } else if (i === "ArrowUp") {
        moveUp(pressKey[i]);
        getMartillo();
      } else if (i === "ArrowRight") {
        moveRight(pressKey[i]);
        // downFloor();
      }
    }
  }

  function moveRight(status) {
    if (status && !mario.matches(".no-move")) {
      contRight += 5;
      if (mario.classList.contains("martillo")) {
        mario.classList.remove("view-left");
        mario.classList.remove("martillo-left");
        mario.classList.add("martillo-right");
      } else {
        mario.classList.add("right");
        mario.classList.remove("view-left");
      }
    } else {
      mario.classList.remove("right");
    }
  }

  function moveLeft(status) {
    if (status && !mario.matches(".no-move")) {
      contRight -= 5;
      if (mario.classList.contains("martillo")) {
        mario.classList.remove("martillo-right");
        mario.classList.remove("view-right");
        mario.classList.add("martillo-left");
      } else {
        mario.classList.add("view-left");
        mario.classList.add("left");
      }
    } else {
      mario.classList.remove("left");
    }
  }
  function moveUp(status) {
    if (status && !mario.matches(".no-move")) {
      mario.style.transform = `translatex(${contRight}px)`;
      if (mario.classList.contains("view-left")) {
        mario.classList.add("up-left");
      } else {
        mario.classList.add("up");

        mario.classList.remove("up-left");
      }
    } else {
      mario.classList.remove("up");
      mario.classList.remove("up-left");
    }
  }

  function newBarril() {
    xyBarril();
    const div = document.createElement("div");
    div.className = "new-barril";
    if (!document.querySelector(".new-barril")) {
      containerMono.appendChild(div);
      setTimeout(() => {
        div.remove();
        clearInterval(positions);
      }, 3000);
    }
  }
  const newBarrilTime = setInterval(() => {
    newBarril();
  }, 2000);

  setTimeout(newBarril, 2100);

  function xyBarril() {
    positions = setInterval(() => {
      if (document.querySelector(".new-barril")) {
        const pBarril = document.querySelector(".new-barril");

        const mario = document.querySelector(".mario");
        // console.log(entorno.getBoundingClientRect().x)
        const pxM = Math.floor(mario.getBoundingClientRect().x);
        const prM = Math.floor(mario.getBoundingClientRect().right);
        const pyM = Math.floor(mario.getBoundingClientRect().y);
        const pxB = Math.floor(pBarril.getBoundingClientRect().x);
        const pyB = Math.floor(pBarril.getBoundingClientRect().y - 37);

        // explotar el barril
        if (mario.classList.contains("martillo-left")) {
          if (pxB - pxM <= 60 && pxB - pxM > 0 && pyB - pyM < 40) {
            mario.classList.add("blink");
            pBarril.remove();
            setTimeout(() => {
              lives--;
              deleteLives();
              mario.classList.remove("blink");
              clearInterval(positions);
            }, 1000);
          }
        } else if (mario.classList.contains("martillo")) {
          if (pxB - pxM <= 60 && pxB - pxM > 0 && pyB - pyM < 40) {
            score();
            pBarril.remove();
            clearInterval(positions);
          }
        } else if (pxB - pxM <= 60 && pxB - pxM > 0 && pyB - pyM < 40) {
          mario.classList.add("blink");
          pBarril.remove();
          setTimeout(() => {
            lives--;
            deleteLives();
            mario.classList.remove("blink");
            clearInterval(positions);
          }, 1000);
        }
        if (pxB < 0) {
          pBarril.remove();
          clearInterval(positions);
        }
        if (lives === 0) {
          gameOver();
          clearInterval(positions);
          clearInterval(newBarrilTime);
        }
      } else {
        clearInterval(positions);
      }
    });
  }
  function getMartillo() {
    if (document.querySelector(".img-martillo")) {
      const pMario = mario.getBoundingClientRect();
      const pMartillo = document
        .querySelector(".img-martillo")
        .getBoundingClientRect();
      const pMartx = Math.floor(pMartillo.x);
      const pMarty = Math.floor(pMartillo.y);
      const pMariox = Math.floor(pMario.x) + 35;
      const pMarioy = Math.floor(pMario.y);
      if (
        pMariox >= pMartx &&
        pMariox <= pMartx + 50 &&
        pMarioy - pMarty < 10
      ) {
        document.querySelector(".img-martillo").remove();
        mario.classList.add("martillo");
      }
    }
  }

  function deleteLives() {
    if (document.querySelector(".content-lives img")) {
      const divLives = document.querySelector(".content-lives img");
      divLives.remove();
    }
  }

  function score() {
    puntuacion += 500;
    const puntuacionP = document.querySelector(".puntuacion p");
    puntuacionP.textContent = puntuacion;
  }
  function hearts() {
    const peach = document.querySelector(".peach");
    const img = document.createElement("img");
    img.className = "hearts";
    img.src = "../images/hearts.png";
    img.height = 40;
    img.width = 40;
    setTimeout(() => {
      peach.appendChild(img);
    }, 2000);
  }
  function downFloor() {
    if (document.querySelector(".floor-right")) {
      const pMario = mario.getBoundingClientRect();
      const pFloor = document
        .querySelector(".floor-right")
        .getBoundingClientRect();
      const pxMario = Math.floor(pMario.x);
      const pxFloor = Math.floor(pFloor.x);

      if (pxFloor - pxMario < 90) {
        document
          .querySelector(".floor-right")
          .classList.add("animate__animated", "animate__fadeOutDownBig");
        document
          .querySelector(".container-kong")
          .classList.add("animate__animated", "animate__fadeOutDownBig");
        document.querySelector(".peach").classList.add("peach-down");
        mario.className = "mario no-move";
        puntuacion += 2500;
        contRight -= 20;
        mario.setAttribute("style", `--contRight:${contRight}px`);
        score();
        hearts();
        setTimeout(() => {
          reiniciarGame();
        }, 7000);
      }
    }
  }
}

function addLives() {
  const divLives = document.createElement("div");
  divLives.className = "content-lives";
  divLives.style = ` 
  position: absolute;
  top: 1em;
  right: 1em; 
`;
  for (let i = 1; i <= 1; i++) {
    const img = document.createElement("img");
    img.style = `
    margin-right: 5px;
  `;
    img.src = "./images/heart.png";
    img.height = "30";
    img.width = "30";
    divLives.appendChild(img);
  }
  entorno.appendChild(divLives);
}
function gameOver() {
  entorno.classList.add("game-over");
  while (entorno.firstChild) {
    entorno.removeChild(entorno.firstChild);
  }
  const btn = document.createElement("button");
  btn.className = "btn-start restart animate__animated animate__tada";
  btn.onclick = playGame;
  btn.textContent = "Restart";
  entorno.appendChild(btn);
}
function reiniciarGame() {
  entorno.className = "entorno";
  entorno.innerHTML = `
  <img class="donkey-kong-banner animate__animated animate__bounceInDown" src="./images/donkey-kong.png" alt="donkey donkey-kong" height="200px">
  `;
  const btn = document.createElement("button");
  btn.className = "btn-start restart animate__animated animate__tada";
  btn.onclick = playGame;
  btn.textContent = "Start";
  entorno.appendChild(btn);
}
function martillo() {
  const img = document.createElement("img");
  img.className = "img-martillo";
  img.style = ` 
    position: absolute;
    top: 60%;
    right: 80%;  
  `;
  img.src = "./images/martillo.png";
  img.height = "60";
  img.width = "60";
  entorno.appendChild(img);
}

function playGame() {
  entorno.className = "entorno play";
  entorno.innerHTML = `
      <div class="puntuacion">
        <h5>Score</h5>
        <p></p>
      </div>
      <div class="images">
        <div class="mario"></div>
        <div class="container-kong">
          <img
            class="mono"
            src="./images/mono.gif"
            alt="mono"
            height="160"
            width="160px"
          />
          <img
            class="barriles"
            src="./images/barriles.png"
            alt="barriles"
            height="140"
            width="140"
          />
        </div>
       
      </div>
      <div class="floor"></div>
      <div class="floor-right"></div> 
      <div class="peach"></div> 
`;
  martillo();
  start();
}
