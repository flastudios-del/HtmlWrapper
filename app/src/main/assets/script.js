/* =========================================================
   SND
   Sistema de sonidos
========================================================= */


/* =========================================================
   SONIDOS NUEVOS
   Los nombres se corresponden con los archivos .mp3
========================================================= */

const newSounds = [

    "RunVine.mp3",
    "adrianasalte.mp3",
    "galaxy-meme.mp3",
    "puerta.mp3",
    "ack.mp3",
    "verity-edit.mp3",
    "999-social-credit.mp3",
    "outro.mp3",
    "oof.mp3",
    "yarayara.mp3",
    "boca-sho-te-amo.mp3",
    "prowler-sound-effect.mp3",
    "latigo.mp3",
    "pou-no.mp3",
    "fnaffoxy.mp3",
    "lego-breaking.mp3",
    "sacame-del-bolsillo.mp3",
    "martincirioboca.mp3",
    "minecrafteat.mp3",
    "plankton-augh.mp3",
    "wait-wait-wait-what-the-hell.mp3",
    "brain-fart-slowed.mp3",
    "oi-oi-oe-oi-a-eye-eye.mp3",
    "levelup.mp3",
    "heaven.mp3",
    "fortnite-default-dancesaturado.mp3",
    "loading-lost-connection.mp3",
    "metalgearsolidalerta.mp3",
    "huh.mp3",
    "20-20-20-7.mp3",
    "pop.mp3",
    "maro-jump.mp3",
    "monte-everest.mp3",
    "camera-flash.mp3",
    "counter-strike-ok-lets-go.mp3",
    "moment.mp3",
    "noo-la-policia.mp3",
    "ahhhh.mp3",
    "musica-thegrefg-epica.mp3",
    "cave.mp3",
    "bye-bye.mp3",
    "que-paso-te-asustaste.mp3",
    "spiderman-meme.mp3",
    "tension-showmatch.mp3",
    "bielsa-dale-de-una-vez.mp3",
    "winxpshutdown.mp3",
    "clash-royale.mp3",
    "netflixintro.mp3",
    "fnaf-2-scream.mp3",
    "fnaf-1-music-box.mp3",
    "subway-surfers.mp3",
    "creeper-explosion.mp3",
    "minecraft-drinking.mp3",
    "samsung-notification-boosted.mp3",
    "samsung-alarma-saturado.mp3",
    "samsung-spaceline-notification.mp3",
    "samsung-whistle.mp3",
    "samsung-galaxy-morning-flower.mp3"

];


/* =========================================================
   IMPORTANTE
   Acá podés conservar/agregar tus sonidos ANTERIORES.

   NO borres los que ya tenías en tu SND.
   Pegalos acá si tu versión actual los tenía definidos
   mediante JavaScript.
========================================================= */

const oldSounds = [
    // Tus sonidos anteriores van acá.
    // Ejemplo:
    // "sonido-que-ya-tenias.mp3",
    // "otro-sonido.mp3",
];


/* =========================================================
   COMBINACIÓN
========================================================= */

const sounds = [
    ...oldSounds,
    ...newSounds
];


/* =========================================================
   ELEMENTOS
========================================================= */

const soundGrid = document.getElementById("soundGrid");
const searchInput = document.getElementById("search");

const favoritesToggle =
    document.getElementById("favoritesToggle");

const overlayToggle =
    document.getElementById("overlayToggle");

const themeToggle =
    document.getElementById("themeToggle");

const stopButton =
    document.getElementById("stopButton");


/* =========================================================
   ESTADO
========================================================= */

let overlayMode = true;
let favoritesOnly = false;

let playingAudios = [];

let favorites =
    JSON.parse(localStorage.getItem("snd-favorites") || "[]");


/* =========================================================
   NOMBRE BONITO
========================================================= */

function prettyName(filename) {

    return filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


/* =========================================================
   ID PARA FAVORITOS
========================================================= */

function favoriteId(filename) {
    return filename;
}


/* =========================================================
   GUARDAR FAVORITOS
========================================================= */

function saveFavorites() {

    localStorage.setItem(
        "snd-favorites",
        JSON.stringify(favorites)
    );

}


/* =========================================================
   CREAR BOTÓN
========================================================= */

function createSoundButton(filename, index) {

    const button =
        document.createElement("button");

    button.className = "glass sound-button";

    button.dataset.sound =
        filename.toLowerCase();

    const isFavorite =
        favorites.includes(favoriteId(filename));

    button.innerHTML = `
        <span class="sound-icon">♪</span>

        <span class="sound-name">
            ${escapeHTML(prettyName(filename))}
        </span>

        <span class="favorite">
            ${isFavorite ? "★" : "☆"}
        </span>
    `;


    /* ---------------------------------------------
       CLICK PRINCIPAL
    --------------------------------------------- */

    button.addEventListener("click", () => {

        playSound(filename, button);

    });


    /* ---------------------------------------------
       FAVORITO
    --------------------------------------------- */

    const favoriteButton =
        button.querySelector(".favorite");

    favoriteButton.addEventListener("click", (event) => {

        event.stopPropagation();

        toggleFavorite(filename, button);

    });


    return button;

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   RENDER
========================================================= */

function renderSounds() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();

    soundGrid.innerHTML = "";

    const filtered =
        sounds.filter(filename => {

            const matchesSearch =
                prettyName(filename)
                    .toLowerCase()
                    .includes(query);

            const matchesFavorites =
                !favoritesOnly ||
                favorites.includes(
                    favoriteId(filename)
                );

            return matchesSearch && matchesFavorites;

        });


    if (!filtered.length) {

        soundGrid.innerHTML = `
            <div class="empty">
                No encontré ningún sonido 👀
            </div>
        `;

        return;
    }


    filtered.forEach((filename, index) => {

        soundGrid.appendChild(
            createSoundButton(filename, index)
        );

    });

}


/* =========================================================
   REPRODUCIR
========================================================= */

function playSound(filename, button) {

    const src =
        `sounds/${encodeURIComponent(filename)}`;


    /*
       SUPERPONER ACTIVADO
    */

    if (overlayMode) {

        const audio = new Audio(src);

        audio.volume = 1;

        playingAudios.push(audio);

        button.classList.add("playing");

        audio.addEventListener("ended", () => {

            playingAudios =
                playingAudios.filter(
                    item => item !== audio
                );

            button.classList.remove("playing");

        });

        audio.play().catch(error => {

            console.error(
                "No se pudo reproducir:",
                filename,
                error
            );

        });

        return;
    }


    /*
       SUPERPONER DESACTIVADO:
       detiene el sonido anterior.
    */

    stopAllSounds();

    const audio =
        new Audio(src);

    audio.volume = 1;

    playingAudios.push(audio);

    button.classList.add("playing");

    audio.addEventListener("ended", () => {

        playingAudios =
            playingAudios.filter(
                item => item !== audio
            );

        button.classList.remove("playing");

    });

    audio.play().catch(error => {

        console.error(
            "No se pudo reproducir:",
            filename,
            error
        );

    });

}


/* =========================================================
   DETENER TODO
========================================================= */

function stopAllSounds() {

    playingAudios.forEach(audio => {

        audio.pause();
        audio.currentTime = 0;

    });

    playingAudios = [];

    document
        .querySelectorAll(".sound-button.playing")
        .forEach(button => {

            button.classList.remove("playing");

        });

}


/* =========================================================
   FAVORITOS
========================================================= */

function toggleFavorite(filename, button) {

    const id =
        favoriteId(filename);

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                item => item !== id
            );

    } else {

        favorites.push(id);

    }

    saveFavorites();

    renderSounds();

}


/* =========================================================
   BÚSQUEDA
========================================================= */

searchInput.addEventListener(
    "input",
    renderSounds
);


/* =========================================================
   FILTRO FAVORITOS
========================================================= */

favoritesToggle.addEventListener("click", () => {

    favoritesOnly =
        !favoritesOnly;

    favoritesToggle.classList.toggle(
        "active",
        favoritesOnly
    );

    favoritesToggle.innerHTML =
        favoritesOnly
            ? "★ <span>favoritos</span>"
            : "☆ <span>favoritos</span>";

    renderSounds();

});


/* =========================================================
   SUPERPONER
========================================================= */

overlayToggle.addEventListener("click", () => {

    overlayMode =
        !overlayMode;

    overlayToggle.classList.toggle(
        "active",
        overlayMode
    );

    overlayToggle.innerHTML =
        overlayMode
            ? "◉ <span>superponer</span>"
            : "○ <span>superponer</span>";

});


/* =========================================================
   STOP
========================================================= */

stopButton.addEventListener(
    "click",
    stopAllSounds
);


/* =========================================================
   DARK / WHITE
========================================================= */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "snd-theme",
        isDark ? "dark" : "light"
    );

});


/* =========================================================
   CARGAR TEMA
========================================================= */

if (
    localStorage.getItem("snd-theme") === "dark"
) {

    document.body.classList.add("dark");

}


/* =========================================================
   INICIO
========================================================= */

renderSounds();
