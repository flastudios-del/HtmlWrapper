/* =====================================================
   SOUND LIST
===================================================== */

const builtInSounds = [

    /* =========================
       SONIDOS VIEJOS
    ========================= */

    {
        name: "Auraa",
        file: "sounds/auraa.mp3"
    },

    {
        name: "Crónica TV",
        file: "sounds/cronicatv.mp3"
    },

    {
        name: "Cucurella",
        file: "sounds/cucurella.mp3"
    },

    {
        name: "Dexter meme",
        file: "sounds/dextermeme.mp3"
    },

    {
        name: "Discord Notification",
        file: "sounds/discordnotification.mp3"
    },

    {
        name: "Empanadas Dross",
        file: "sounds/empanadasdross.mp3"
    },

    {
        name: "Enrique",
        file: "sounds/enrique.mp3"
    },

    {
        name: "Fah",
        file: "sounds/fah.mp3"
    },

    {
        name: "Fart",
        file: "sounds/fart.mp3"
    },

    {
        name: "Grito de pollo",
        file: "sounds/Gritodepollo.mp3"
    },

    {
        name: "Hay morrones, ajo y perejil",
        file: "sounds/Haymorronesajoperejil.mp3"
    },

    {
        name: "iPhone Notification",
        file: "sounds/iphonenotification.mp3"
    },

    {
        name: "Long Brain Fart",
        file: "sounds/longbrainfart.mp3"
    },

    {
        name: "Meow",
        file: "sounds/meow.mp3"
    },

    {
        name: "Mercado Pago",
        file: "sounds/Mercadopago.mp3"
    },

    {
        name: "Metal Pipe Clang",
        file: "sounds/metalpipeclang.mp3"
    },

    {
        name: "Papoi",
        file: "sounds/papoi.mp3"
    },

    {
        name: "Piuw",
        file: "sounds/piuw.mp3"
    },

    {
        name: "Rizz",
        file: "sounds/rizz.mp3"
    },

    {
        name: "Tienes un mensaje",
        file: "sounds/tienesunmensajeee.mp3"
    },

    {
        name: "Tiki Tiki Boosted",
        file: "sounds/tikitikiboosted.mp3"
    },

    {
        name: "Vine Boom",
        file: "sounds/vineboom.mp3"
    },


    /* =========================
       NUEVOS SONIDOS
    ========================= */

    {
        name: "Du bist gut genug",
        file: "sounds/dubistgutgenug.mp3"
    },

    {
        name: "PO Saturado",
        file: "sounds/pousaturado.mp3"
    },

    {
        name: "Among Us Role Reveal",
        file: "sounds/amongusrolerevealsound.mp3"
    },

    {
        name: "67",
        file: "sounds/67.mp3"
    },

    {
        name: "Anime Wow",
        file: "sounds/animewow.mp3"
    },

    {
        name: "Mi Bombo",
        file: "sounds/mibombo.mp3"
    },

    {
        name: "Win XP Error",
        file: "sounds/winxperror.mp3"
    },

    {
        name: "Web WhatsApp",
        file: "sounds/webwhatsapp.mp3"
    },

    {
        name: "WhatsApp Notificación Saturado",
        file: "sounds/whatsappnotificacionsaturado.mp3"
    },

    {
        name: "WhatsApp Notificación Silbido",
        file: "sounds/whatsappnotificacionsilbido.mp3"
    },

    {
        name: "Apple Pay",
        file: "sounds/applepay.mp3"
    },

    {
        name: "iPhone Alarm Radar",
        file: "sounds/iphonealarmradar.mp3"
    }

];


/* =====================================================
   DOM
===================================================== */

const grid =
    document.getElementById(
        "soundGrid"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const clearSearch =
    document.getElementById(
        "clearSearch"
    );

const soundCount =
    document.getElementById(
        "soundCount"
    );

const emptyMessage =
    document.getElementById(
        "emptyMessage"
    );

const stopButton =
    document.getElementById(
        "stopButton"
    );

const themeButton =
    document.getElementById(
        "themeButton"
    );

const themeSelectorButton =
    document.getElementById(
        "themeSelectorButton"
    );

const themeMenu =
    document.getElementById(
        "themeMenu"
    );

const overlayButton =
    document.getElementById(
        "overlayButton"
    );


/* =====================================================
   STATE
===================================================== */

let currentView = "all";

let overlayEnabled = false;

let activeAudios = [];


/* =====================================================
   ALL SOUNDS
===================================================== */

function getAllSounds() {

    return builtInSounds.map(
        sound => ({
            ...sound,
            builtIn: true
        })
    );

}


/* =====================================================
   FAVORITES
===================================================== */

function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "soundboardFavorites"
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveFavorites(
    favorites
) {

    localStorage.setItem(
        "soundboardFavorites",
        JSON.stringify(
            favorites
        )
    );

}


function favoriteKey(
    sound
) {

    return `built-${sound.file}`;

}


function isFavorite(
    sound
) {

    return getFavorites()
        .includes(
            favoriteKey(
                sound
            )
        );

}


function toggleFavorite(
    sound
) {

    let favorites =
        getFavorites();


    const key =
        favoriteKey(
            sound
        );


    if (
        favorites.includes(
            key
        )
    ) {

        favorites =
            favorites.filter(
                item =>
                    item !== key
            );

    } else {

        favorites.push(
            key
        );

    }


    saveFavorites(
        favorites
    );


    renderSounds();

}


/* =====================================================
   PLAY SOUND
===================================================== */

function playSound(
    sound,
    button
) {

    if (
        !overlayEnabled
    ) {

        stopAllSounds();

    }


    const audio =
        new Audio(
            sound.file
        );


    audio.volume = 1;


    activeAudios.push(
        {
            audio: audio,
            button: button
        }
    );


    button.classList.add(
        "playing"
    );


    audio.play()
        .catch(
            error => {

                console.error(
                    "Audio error:",
                    error
                );

                button.classList.remove(
                    "playing"
                );


                activeAudios =
                    activeAudios.filter(
                        item =>
                            item.audio !==
                            audio
                    );

            }
        );


    audio.addEventListener(
        "ended",
        () => {

            button.classList.remove(
                "playing"
            );


            activeAudios =
                activeAudios.filter(
                    item =>
                        item.audio !==
                        audio
                );

        }
    );

}


/* =====================================================
   STOP ALL
===================================================== */

function stopAllSounds() {

    activeAudios.forEach(
        item => {

            item.audio.pause();

            item.audio.currentTime =
                0;

            item.button.classList.remove(
                "playing"
            );

        }
    );


    activeAudios = [];

}


/* =====================================================
   CREATE SOUND BUTTON
===================================================== */

function createSoundButton(
    sound
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "sound-button";


    const favorite =
        isFavorite(
            sound
        );


    button.innerHTML = `

        <span>
            ${escapeHTML(
                sound.name
            )}
        </span>

        <span
            class="
                favorite-button
                ${favorite ? "favorite" : ""}
            "
            role="button"
            aria-label="Favorito"
        >
            ${favorite ? "★" : "☆"}
        </span>

    `;


    button.addEventListener(
        "click",
        event => {

            const favoriteButton =
                event.target.closest(
                    ".favorite-button"
                );


            if (
                favoriteButton
            ) {

                event.stopPropagation();

                toggleFavorite(
                    sound
                );

                return;

            }


            playSound(
                sound,
                button
            );

        }
    );


    return button;

}


/* =====================================================
   RENDER
===================================================== */

function renderSounds() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    const allSounds =
        getAllSounds();


    const filtered =
        allSounds.filter(
            sound => {

                const matchesSearch =
                    sound.name
                        .toLowerCase()
                        .includes(
                            query
                        );


                const matchesView =
                    currentView === "all"
                        ? true
                        : isFavorite(
                            sound
                        );


                return (
                    matchesSearch &&
                    matchesView
                );

            }
        );


    grid.innerHTML =
        "";


    soundCount.textContent =
        `${filtered.length} ${
            filtered.length === 1
                ? "sonido"
                : "sonidos"
        }`;


    if (
        filtered.length === 0
    ) {

        emptyMessage.classList.remove(
            "hidden"
        );

        return;

    }


    emptyMessage.classList.add(
        "hidden"
    );


    filtered.forEach(
        sound => {

            grid.appendChild(
                createSoundButton(
                    sound
                )
            );

        }
    );

}


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    () => {

        clearSearch.classList.toggle(
            "show",
            searchInput.value.length > 0
        );


        renderSounds();

    }
);


/* =====================================================
   CLEAR SEARCH
===================================================== */

clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value =
            "";


        clearSearch.classList.remove(
            "show"
        );


        renderSounds();


        searchInput.focus();

    }
);


/* =====================================================
   TABS
===================================================== */

document
    .querySelectorAll(
        ".tab"
    )
    .forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".tab"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    tab.classList.add(
                        "active"
                    );


                    currentView =
                        tab.dataset.view;


                    renderSounds();

                }
            );

        }
    );


/* =====================================================
   OVERLAY
===================================================== */

overlayButton.addEventListener(
    "click",
    () => {

        overlayEnabled =
            !overlayEnabled;


        overlayButton.textContent =
            overlayEnabled
                ? "Superponer: ON"
                : "Superponer: OFF";


        overlayButton.classList.toggle(
            "active",
            overlayEnabled
        );

    }
);


/* =====================================================
   STOP
===================================================== */

stopButton.addEventListener(
    "click",
    stopAllSounds
);


/* =====================================================
   LIGHT / DARK MODE
===================================================== */

function loadDarkMode() {

    const saved =
        localStorage.getItem(
            "soundboardTheme"
        );


    if (
        saved === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

        themeButton.textContent =
            "☀";

    } else {

        document.body.classList.remove(
            "dark"
        );

        themeButton.textContent =
            "☾";

    }

}


themeButton.addEventListener(
    "click",
    () => {

        const dark =
            document.body.classList.toggle(
                "dark"
            );


        localStorage.setItem(
            "soundboardTheme",
            dark
                ? "dark"
                : "light"
        );


        themeButton.textContent =
            dark
                ? "☀"
                : "☾";

    }
);


/* =====================================================
   COLOR THEMES
===================================================== */

const availableThemes = [
    "default",
    "ocean",
    "lime",
    "purple"
];


function loadColorTheme() {

    const saved =
        localStorage.getItem(
            "soundboardColorTheme"
        ) || "default";


    applyColorTheme(
        saved
    );

}


function applyColorTheme(
    theme
) {

    availableThemes.forEach(
        item => {

            document.body.classList.remove(
                `theme-${item}`
            );

        }
    );


    if (
        theme !== "default"
    ) {

        document.body.classList.add(
            `theme-${theme}`
        );

    }


    localStorage.setItem(
        "soundboardColorTheme",
        theme
    );

}


function toggleThemeMenu() {

    themeMenu.classList.toggle(
        "hidden"
    );

}


themeSelectorButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        toggleThemeMenu();

    }
);


document
    .querySelectorAll(
        ".theme-option"
    )
    .forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    const theme =
                        option.dataset.theme;


                    applyColorTheme(
                        theme
                    );


                    themeMenu.classList.add(
                        "hidden"
                    );

                }
            );

        }
    );


document.addEventListener(
    "click",
    event => {

        if (
            !themeMenu.contains(
                event.target
            ) &&
            event.target !==
                themeSelectorButton
        ) {

            themeMenu.classList.add(
                "hidden"
            );

        }

    }
);


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    text
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        text;


    return element.innerHTML;

}


/* =====================================================
   START
===================================================== */

function startApp() {

    loadDarkMode();

    loadColorTheme();

    renderSounds();

}


startApp();
