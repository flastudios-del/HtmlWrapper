/*
SND
Personalization Update
*/

/* =========================
SOUNDS
========================= */

const sounds = [
  "romanceeeeee.mp3",
  "20-20-20-7.wav",
  "summer_of_2007.mp3",
  "New-Beginnings.mp3",
  "rave.mp3",
  "solar-eclipse.wav"
];

/* =========================
ELEMENTS
========================= */

const soundGrid = document.getElementById("soundGrid");
const soundCount = document.getElementById("soundCount");

const customizeBtn = document.getElementById("customizeBtn");
const closeCustomizer = document.getElementById("closeCustomizer");
const customizer = document.getElementById("customizer");

const backgroundColor = document.getElementById("backgroundColor");
const buttonColor = document.getElementById("buttonColor");
const textColor = document.getElementById("textColor");

const backgroundImage = document.getElementById("backgroundImage");
const removeBackground = document.getElementById("removeBackground");

const buttonSize = document.getElementById("buttonSize");
const buttonSizeValue = document.getElementById("buttonSizeValue");

const buttonRadius = document.getElementById("buttonRadius");
const buttonRadiusValue = document.getElementById("buttonRadiusValue");

const nameExample = document.getElementById("nameExample");

/* =========================
NAME CLEANER
========================= */

function cleanSoundName(filename) {

  let name = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // romanceeeeee → romance
  name = name.replace(
    /([a-zA-Z])\1{3,}/g,
    "$1"
  );

  // Primera letra en mayúscula
  name = name.replace(
    /\b\w/g,
    letter => letter.toUpperCase()
  );

  return name;
}

/* =========================
RENDER SOUNDS
========================= */

function renderSounds() {

  soundGrid.innerHTML = "";

  sounds.forEach(filename => {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "sound-button";

    const displayName = cleanSoundName(filename);

    button.innerHTML = `
      <span>${displayName}</span>
      <span class="file-name">${filename}</span>
    `;

    button.addEventListener("click", () => {

      console.log("Playing:", filename);

    });

    soundGrid.appendChild(button);

  });

  soundCount.textContent =
    `${sounds.length} sounds`;
}

/* =========================
CUSTOMIZER
========================= */

customizeBtn.addEventListener("click", () => {

  customizer.classList.add("open");

});

closeCustomizer.addEventListener("click", () => {

  customizer.classList.remove("open");

});

/* =========================
APPLY COLORS
========================= */

function updateColors() {

  document.documentElement.style.setProperty(
    "--background",
    backgroundColor.value
  );

  document.documentElement.style.setProperty(
    "--button",
    buttonColor.value
  );

  document.documentElement.style.setProperty(
    "--text",
    textColor.value
  );

}

/* =========================
COLOR EVENTS
========================= */

backgroundColor.addEventListener(
  "input",
  updateColors
);

buttonColor.addEventListener(
  "input",
  updateColors
);

textColor.addEventListener(
  "input",
  updateColors
);

/* =========================
BUTTON SIZE
========================= */

buttonSize.addEventListener("input", () => {

  const value = buttonSize.value;

  document.documentElement.style.setProperty(
    "--button-scale",
    value / 100
  );

  buttonSizeValue.textContent =
    `${value}%`;

});

/* =========================
BUTTON RADIUS
========================= */

buttonRadius.addEventListener("input", () => {

  const value = buttonRadius.value;

  document.documentElement.style.setProperty(
    "--button-radius",
    `${value}px`
  );

  buttonRadiusValue.textContent =
    `${value}px`;

});

/* =========================
THEMES
========================= */

const themes =
  document.querySelectorAll(".theme-card");

themes.forEach(theme => {

  theme.addEventListener("click", () => {

    const selectedTheme =
      theme.dataset.theme;

    if (selectedTheme === "white") {

      backgroundColor.value = "#f4f4f4";
      buttonColor.value = "#111111";
      textColor.value = "#111111";

    }

    if (selectedTheme === "black") {

      backgroundColor.value = "#111111";
      buttonColor.value = "#f4f4f4";
      textColor.value = "#f4f4f4";

    }

    if (selectedTheme === "color") {

      backgroundColor.value = "#eaf5ff";
      buttonColor.value = "#2589d8";
      textColor.value = "#102030";

    }

    updateColors();

  });

});

/* =========================
BACKGROUND IMAGE
========================= */

backgroundImage.addEventListener(
  "change",
  event => {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = event => {

      document.body.style.backgroundImage =
        `url("${event.target.result}")`;

      document.body.style.backgroundSize =
        "cover";

      document.body.style.backgroundPosition =
        "center";

      document.body.style.backgroundAttachment =
        "fixed";

    };

    reader.readAsDataURL(file);

  }
);

/* =========================
REMOVE BACKGROUND
========================= */

removeBackground.addEventListener(
  "click",
  () => {

    document.body.style.backgroundImage =
      "none";

  }
);

/* =========================
NAME EXAMPLE
========================= */

nameExample.textContent =
  cleanSoundName("romanceeeeee.mp3");

/* =========================
START
========================= */

renderSounds();
updateColors();
