/* =====================================================
   SOUND LIST
===================================================== */

const builtInSounds = [

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

const addButton =
    document.getElementById(
        "addButton"
    );

const fileInput =
    document.getElementById(
        "fileInput"
    );

const overlayButton =
    document.getElementById(
        "overlayButton"
    );


/* =====================================================
   STATE
===================================================== */

let userSounds = [];

let currentView = "all";

let overlayEnabled = false;

let activeAudios = [];


/* =====================================================
   INDEXED DB
===================================================== */

const DB_NAME =
    "SoundboardDatabase";

const DB_VERSION = 1;

const STORE_NAME =
    "userSounds";

let db = null;


/* =====================================================
   OPEN DATABASE
===================================================== */

function openDatabase() {

    return new Promise(
        (resolve, reject) => {

            const request =
                indexedDB.open(
                    DB_NAME,
                    DB_VERSION
                );


            request.onupgradeneeded =
                event => {

                    const database =
                        event.target.result;


                    if (
                        !database.objectStoreNames
                            .contains(
                                STORE_NAME
                            )
                    ) {

                        database.createObjectStore(
                            STORE_NAME,
                            {
                                keyPath: "id",
                                autoIncrement: true
                            }
                        );

                    }

                };


            request.onsuccess =
                event => {

                    db =
                        event.target.result;

                    resolve(db);

                };


            request.onerror =
                () => {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/* =====================================================
   LOAD USER SOUNDS
===================================================== */

function loadUserSounds() {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    STORE_NAME,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            const request =
                store.getAll();


            request.onsuccess =
                () => {

                    userSounds =
                        request.result || [];

                    resolve(
                        userSounds
                    );

                };


            request.onerror =
                () => {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/* =====================================================
   SAVE USER SOUND
===================================================== */

function saveUserSound(
    sound
) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    STORE_NAME,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            const request =
                store.add(
                    sound
                );


            request.onsuccess =
                () => {

                    sound.id =
                        request.result;

                    resolve(
                        sound
                    );

                };


            request.onerror =
                () => {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/* =====================================================
   DELETE USER SOUND
===================================================== */

function deleteUserSound(
    id
) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    STORE_NAME,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            const request =
                store.delete(
                    id
                );


            request.onsuccess =
                () => {

                    resolve();

                };


            request.onerror =
                () => {

                    reject(
                        request.error
                    );

                };

        }
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

    return sound.id !== undefined
        ? `user-${sound.id}`
        : `built-${sound.file}`;

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
   ALL SOUNDS
===================================================== */

function getAllSounds() {

    return [
        ...builtInSounds.map(
            sound => ({
                ...sound,
                builtIn: true
            })
        ),

        ...userSounds.map(
            sound => ({
                ...sound,
                builtIn: false
            })
        )

    ];

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
            sound.file ||
            URL.createObjectURL(
                sound.blob
            )
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
                        item.audio !== audio
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
   CREATE BUTTON
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


    const deleteButton =
        !sound.builtIn
            ? `
                <span
                    class="delete-button"
                    role="button"
                    aria-label="Eliminar"
                >
                    ×
                </span>
              `
            : "";


    button.innerHTML = `

        <span>
            ${escapeHTML(
                sound.name
            )}
        </span>

        ${deleteButton}

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


            const deleteButton =
                event.target.closest(
                    ".delete-button"
                );


            if (
                deleteButton
            ) {

                event.stopPropagation();

                removeUserSound(
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
   DELETE USER SOUND
===================================================== */

async function removeUserSound(
    sound
) {

    const confirmed =
        confirm(
            `¿Eliminar "${sound.name}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteUserSound(
            sound.id
        );


        userSounds =
            userSounds.filter(
                item =>
                    item.id !==
                    sound.id
            );


        renderSounds();

    } catch (
        error
    ) {

        console.error(
            error
        );

        alert(
            "No se pudo eliminar el sonido."
        );

    }

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
   ADD SOUNDS
===================================================== */

addButton.addEventListener(
    "click",
    () => {

        fileInput.click();

    }
);


/* =====================================================
   FILE SELECTED
===================================================== */

fileInput.addEventListener(
    "change",
    async () => {

        const files =
            Array.from(
                fileInput.files
            );


        if (
            files.length === 0
        ) {

            return;

        }


        const allowedTypes = [
            "audio/mpeg",
            "audio/ogg",
            "audio/wav",
            "audio/x-wav",
            "audio/wave"
        ];


        for (
            const file of files
        ) {

            const extension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            const allowedExtensions =
                [
                    "mp3",
                    "ogg",
                    "wav"
                ];


            if (
                !allowedExtensions
                    .includes(
                        extension
                    )
            ) {

                continue;

            }


            const sound = {

                name:
                    file.name
                        .replace(
                            /\.[^/.]+$/,
                            ""
                        ),

                blob:
                    file,

                type:
                    file.type,

                size:
                    file.size,

                created:
                    Date.now()

            };


            try {

                const saved =
                    await saveUserSound(
                        sound
                    );


                userSounds.push(
                    saved
                );

            } catch (
                error
            ) {

                console.error(
                    error
                );

                alert(
                    "No se pudo guardar " +
                    file.name
                );

            }

        }


        fileInput.value =
            "";


        renderSounds();

    }
);


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
   THEME
===================================================== */

function loadTheme() {

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

async function startApp() {

    loadTheme();


    try {

        await openDatabase();

        await loadUserSounds();

    } catch (
        error
    ) {

        console.error(
            "IndexedDB error:",
            error
        );

        userSounds = [];

    }


    renderSounds();

}


startApp();