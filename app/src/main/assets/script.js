const SOUNDS = [
  "faaah.mp3",
  "enrique.mp3",
  "discord-notification.mp3",
  "gato-riendo.mp3",
  "vine-boom.mp3",
  "among-us-role-reveal-sound.mp3",
  "bombon-asesino.mp3",
  "king-nasir-saturado.mp3",
  "tiki-tiki-boosted.mp3",
  "mercadopago-transferencia.mp3",
  "cucu-cucurella-cucu.mp3",
  "tamo-chelo.mp3",
  "imprevisto.mp3",
  "metal-pipe-clang.mp3",
  "iphonenotification.mp3",
  "spiderman-meme-song.mp3",
  "van-a-sortear-el-chancho.mp3",
  "67.mp3",
  "bruh.mp3",
  "oh-estas-haciendo-magia.mp3",
  "spongebob-fail.mp3",
  "marcha-peronista.mp3",
  "hello-moto-saturado.mp3",
  "el-chiqui-tapia.mp3",
  "romanceeeeeeeeeeeeee.mp3",
  "winxperror.mp3",
  "ayyy-ayyy-ayyy-scream.mp3",
  "tono-celular-chino.mp3",
  "oye-gela-escuchate-esto-saturado.mp3",
  "peter-abuela.mp3",
  "formidable.mp3",
  "a-oliver-le-cayo-un-meteorito.mp3",
  "indian-song.mp3",
  "get-out.mp3",
  "applepay.mp3",
  "oh-my-god.mp3",
  "pianodross.mp3",
  "anda-a-lavar-los-platos-mayra.mp3",
  "°_°.mp3",
  "clash-brasil.mp3",
  "muertefornite.mp3",
  "yay.mp3",
  "musica-elevador.mp3",
  "mouse-click-sound.mp3",
  "bong.mp3",
  "homer-lets-the-barts-out.mp3",
  "discordjoin.mp3"
];

const grid = document.getElementById("soundGrid");
const search = document.getElementById("search");
const stopAllButton = document.getElementById("stopAll");

const overlayButton = document.getElementById("overlayBtn");
const overlayLabel = document.getElementById("overlayLabel");

const themeButton = document.getElementById("themeBtn");
const empty = document.getElementById("empty");

let overlay =
  localStorage.getItem("snd-overlay") === "true";

let favorites =
  JSON.parse(
    localStorage.getItem("snd-favorites") || "[]"
  );

let activeAudios = [];

let theme =
  localStorage.getItem("snd-theme") || "light";


/* =========================
   THEME
========================= */

document.documentElement.dataset.theme =
  theme;


/* =========================
   NOMBRE BONITO
========================= */

function getName(file) {

  return file
    .replace(".mp3", "")
    .replaceAll("-", " ");

}


/* =========================
   RENDER
========================= */

function renderSounds() {

  const query =
    search.value
      .trim()
      .toLowerCase();

  const filtered =
    SOUNDS.filter(sound =>
      getName(sound)
        .toLowerCase()
        .includes(query)
    );

  grid.innerHTML = "";

  empty.hidden =
    filtered.length !== 0;


  filtered.forEach((file) => {

    const button =
      document.createElement("button");

    button.className = "sound";

    const isFavorite =
      favorites.includes(file);


    button.innerHTML = `

      <span class="sound-name">
        ${getName(file)}
      </span>

      <span class="sound-number">
        #${String(
          SOUNDS.indexOf(file) + 1
        ).padStart(2, "0")}
      </span>

      <button
        class="star ${isFavorite ? "active" : ""}"
        title="Favorito"
      >
        ${isFavorite ? "★" : "☆"}
      </button>

    `;


    button.addEventListener(
      "click",
      event => {

        if (
          event.target.classList
            .contains("star")
        ) {
          return;
        }

        playSound(file, button);

      }
    );


    const star =
      button.querySelector(".star");


    star.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        toggleFavorite(file);

      }
    );


    grid.appendChild(button);

  });

}


/* =========================
   PLAY SOUND
========================= */

function playSound(file, button) {

  /*
   OFF:
   Solo puede sonar un sonido
   a la vez.

   ON:
   Los sonidos se superponen.
  */

  if (!overlay) {

    stopAllSounds();

  }


  const audio =
    new Audio(
      "sounds/" +
      encodeURIComponent(file)
    );


  activeAudios.push(audio);

  button.classList.add("playing");


  audio.addEventListener(
    "ended",
    () => {

      button.classList.remove(
        "playing"
      );

      activeAudios =
        activeAudios.filter(
          a => a !== audio
        );

    }
  );


  audio.addEventListener(
    "error",
    () => {

      button.classList.remove(
        "playing"
      );

    }
  );


  audio.play()
    .catch(() => {

      button.classList.remove(
        "playing"
      );

    });

}


/* =========================
   STOP ALL
========================= */

function stopAllSounds() {

  activeAudios.forEach(audio => {

    audio.pause();

    audio.currentTime = 0;

  });


  activeAudios = [];


  document
    .querySelectorAll(".sound.playing")
    .forEach(button => {

      button.classList.remove(
        "playing"
      );

    });

}


/* =========================
   FAVORITES
========================= */

function toggleFavorite(file) {

  if (
    favorites.includes(file)
  ) {

    favorites =
      favorites.filter(
        sound => sound !== file
      );

  } else {

    favorites.push(file);

  }


  localStorage.setItem(
    "snd-favorites",
    JSON.stringify(favorites)
  );


  renderSounds();

}


/* =========================
   SUPERPONER
========================= */

function updateOverlay() {

  overlayButton.classList.toggle(
    "on",
    overlay
  );


  overlayLabel.textContent =
    `Superponer: ${
      overlay ? "ON" : "OFF"
    }`;

}


overlayButton.addEventListener(
  "click",
  () => {

    overlay = !overlay;

    localStorage.setItem(
      "snd-overlay",
      overlay
    );

    updateOverlay();

  }
);


/* =========================
   STOP BUTTON
========================= */

stopAllButton.addEventListener(
  "click",
  stopAllSounds
);


/* =========================
   SEARCH
========================= */

search.addEventListener(
  "input",
  renderSounds
);


/* =========================
   THEME
========================= */

themeButton.addEventListener(
  "click",
  () => {

    theme =
      document.documentElement
        .dataset
        .theme === "dark"
        ? "light"
        : "dark";


    document.documentElement
      .dataset
      .theme = theme;


    localStorage.setItem(
      "snd-theme",
      theme
    );

  }
);


/* =========================
   START
========================= */

updateOverlay();

renderSounds();
