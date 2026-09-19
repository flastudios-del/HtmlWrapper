const grid = document.getElementById("soundsGrid");
const searchInput = document.getElementById("searchInput");

const favoritesFilter =
    document.getElementById("favoritesFilter");

const overlayButton =
    document.getElementById("overlayButton");

const stopAllButton =
    document.getElementById("stopAll");

const themeButton =
    document.getElementById("themeButton");


/* =========================
   ESTADO
   ========================= */

let favorites =
    JSON.parse(
        localStorage.getItem("snd_favorites") || "[]"
    );

let overlay =
    localStorage.getItem("snd_overlay") === "true";

let dark =
    localStorage.getItem("snd_dark") === "true";

let showingFavorites = false;

let currentAudios = [];


/* =========================
   INICIO
   ========================= */

if (dark) {
    document.body.classList.add("dark");
    themeButton.textContent = "White";
}

updateOverlayButton();

renderSounds();


/* =========================
   NOMBRE BONITO
   ========================= */

function getSoundName(file) {

    let name = file
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]+/g, " ");

    return name;
}


/* =========================
   RENDER
   ========================= */

function renderSounds() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();

    grid.innerHTML = "";

    const filtered =
        SOUND_FILES.filter(file => {

            const name =
                getSoundName(file)
                    .toLowerCase();

            const matchesSearch =
                name.includes(query);

            const matchesFavorites =
                !showingFavorites ||
                favorites.includes(file);

            return (
                matchesSearch &&
                matchesFavorites
            );
        });


    if (filtered.length === 0) {

        const empty =
            document.createElement("div");

        empty.className = "empty";

        empty.textContent =
            showingFavorites
                ? "No hay favoritos"
                : "No se encontraron sonidos";

        grid.appendChild(empty);

        return;
    }


    filtered.forEach(file => {

        const item =
            document.createElement("div");

        item.className = "sound-item";

        item.dataset.file = file;


        /* NOMBRE */

        const name =
            document.createElement("div");

        name.className = "sound-name";

        name.textContent =
            getSoundName(file);


        /* ESTRELLA */

        const favorite =
            document.createElement("button");

        favorite.className = "favorite";

        favorite.type = "button";

        favorite.innerHTML =
            favorites.includes(file)
                ? "★"
                : "☆";

        if (favorites.includes(file)) {
            favorite.classList.add("starred");
        }


        favorite.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleFavorite(
                    file,
                    favorite
                );
            }
        );


        /* REPRODUCIR */

        item.addEventListener(
            "click",
            () => playSound(file, item)
        );


        item.appendChild(name);
        item.appendChild(favorite);

        grid.appendChild(item);

    });
}


/* =========================
   FAVORITOS
   ========================= */

function toggleFavorite(file, element) {

    if (favorites.includes(file)) {

        favorites =
            favorites.filter(
                item => item !== file
            );

        element.textContent = "☆";
        element.classList.remove("starred");

    } else {

        favorites.push(file);

        element.textContent = "★";
        element.classList.add("starred");
    }


    localStorage.setItem(
        "snd_favorites",
        JSON.stringify(favorites)
    );


    if (showingFavorites) {
        renderSounds();
    }
}


/* =========================
   REPRODUCIR
   ========================= */

function playSound(file, item) {

    /*
     * Si superponer está apagado,
     * detenemos lo que estaba sonando.
     */

    if (!overlay) {
        stopAll();
    }


    const audio =
        new Audio(
            "sounds/" +
            encodeURIComponent(file)
        );


    audio.volume = 1;

    currentAudios.push(audio);

    item.classList.add("playing");


    audio.play()
        .catch(error => {
            console.error(
                "No se pudo reproducir:",
                error
            );

            item.classList.remove("playing");
        });


    audio.addEventListener(
        "ended",
        () => {

            item.classList.remove("playing");

            currentAudios =
                currentAudios.filter(
                    a => a !== audio
                );
        }
    );
}


/* =========================
   STOP TODO
   ========================= */

function stopAll() {

    currentAudios.forEach(
        audio => {

            audio.pause();

            audio.currentTime = 0;
        }
    );

    currentAudios = [];


    document
        .querySelectorAll(".sound-item.playing")
        .forEach(item => {

            item.classList.remove("playing");
        });
}


stopAllButton.addEventListener(
    "click",
    stopAll
);


/* =========================
   BUSCAR
   ========================= */

searchInput.addEventListener(
    "input",
    renderSounds
);


/* =========================
   FAVORITOS FILTRO
   ========================= */

favoritesFilter.addEventListener(
    "click",
    () => {

        showingFavorites =
            !showingFavorites;

        favoritesFilter.classList.toggle(
            "active",
            showingFavorites
        );

        renderSounds();
    }
);


/* =========================
   SUPERPONER
   ========================= */

overlayButton.addEventListener(
    "click",
    () => {

        overlay = !overlay;

        localStorage.setItem(
            "snd_overlay",
            overlay
        );

        updateOverlayButton();
    }
);


function updateOverlayButton() {

    overlayButton.classList.toggle(
        "active",
        overlay
    );

    overlayButton.textContent =
        overlay
            ? "superponer ✓"
            : "superponer";
}


/* =========================
   TEMA
   ========================= */

themeButton.addEventListener(
    "click",
    () => {

        dark =
            !dark;

        document.body.classList.toggle(
            "dark",
            dark
        );

        localStorage.setItem(
            "snd_dark",
            dark
        );

        themeButton.textContent =
            dark
                ? "White"
                : "Dark";
    }
);
