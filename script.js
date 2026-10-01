const REACCIONES = [
    { id: "corazon", icono: "❤️" },
    { id: "pulgar-arriba", icono: "👍" },
    { id: "pulgar-abajo", icono: "👎" },
    { id: "jaja", icono: "😂" },
    { id: "exclamacion", icono: "‼️" },
    { id: "pregunta", icono: "❓" }
];

const TEXTO_ESTADO = {
    enviado: "Enviado",
    entregado: "Entregado",
    leido: "Leído"
};



const donationButton = document.getElementById("donationButton");
const donationModal = document.getElementById("donationModal");
const closeDonation = document.getElementById("closeDonation");
const donateButton = document.getElementById("donateButton");

const home = document.getElementById("home");
const imessageCreator = document.getElementById("imessageCreator");
const imessageButton = document.getElementById("imessage-btn");
const backButton = document.getElementById("backButton");

const addParticipant = document.getElementById("addParticipant");
const participantsList = document.getElementById("participantsList");
const addMessage = document.getElementById("addMessage");
const addImagen = document.getElementById("addImagen");
const addMessageImversationDate = document.getElementById("conversationDate");

const iphone = document.querySelector(".iphone");
const inputBar = document.getElementById("inputBar");
const unreadCount = document.getElementById("unreadCount");
const groupName = document.getElementById("groupName");

const themeSwitch = document.getElementById("themeSwitch");
const fontSwitch = document.getElementById("fontSwitch");
const statusSwitch = document.getElementById("statusSwitch");
const dateSwitch = document.getElementById("dateSwitch");
const inputSwitch = document.getElementById("inputSwitch");

const customDate = document.getElementById("customDate");
const customTime = document.getElementById("customTime");
const unreadInput = document.getElementById("unreadInput");

const saveScreenshot = document.getElementById("saveScreenshot");

let participanteMensaje = null;

const twitterButton = document.getElementById("twitter-btn");
const twitterCreator = document.getElementById("twitterCreator");

const profileTab = document.getElementById("profileTab");
const tweetsTab = document.getElementById("tweetsTab");

const profileInterface =
    document.getElementById("profileInterface");

const tweetsInterface =
    document.getElementById("tweetsInterface");


let participantes = [];
let mensajes = [];

let estadoEntrega = "entregado";
let modoFecha = "hoy";
let siguienteId = 1;



donationButton.addEventListener("click", function () {
    donationModal.style.display = "flex";
});

closeDonation.addEventListener("click", function () {
    donationModal.style.display = "none";
});

donateButton.addEventListener("click", function () {
    window.open("https://ko-fi.com/maghxs", "_blank");
});




imessageButton.addEventListener("click", function () {

    home.style.display = "none";
    imessageCreator.style.display = "block";

    backButton.style.display = "block";

});


twitterButton.addEventListener("click", function () {

    home.style.display = "none";
    twitterCreator.style.display = "block";

    backButton.style.display = "block";

});


backButton.addEventListener("click", function () {

    imessageCreator.style.display = "none";
    twitterCreator.style.display = "none";

    home.style.display = "block";

    backButton.style.display = "none";

});


function renderIcono(icono, elemento) {

    if (/\.(png|svg|webp|jpg|jpeg|gif)$/i.test(icono)) {

        const img = document.createElement("img");

        img.src = icono;
        img.alt = "";

        elemento.appendChild(img);

    } else {

        elemento.textContent = icono;

    }
}


function activarSwitch(switchElement, callback) {

    switchElement.querySelectorAll("button").forEach(function (boton) {

        boton.addEventListener("click", function () {

            switchElement
                .querySelectorAll("button")
                .forEach(b => b.classList.remove("active"));

            boton.classList.add("active");

            callback(boton.dataset.value);

        });

    });
}



function crearAvatar(participante) {

    const avatar = document.createElement("div");

    avatar.className = "avatar";

    if (participante && participante.foto) {

        const img = document.createElement("img");

        img.src = participante.foto;
        img.alt = "";

        avatar.appendChild(img);

    } else {

        avatar.textContent =
            participante && participante.nombre
                ? participante.nombre.charAt(0).toUpperCase()
                : "?";

    }

    return avatar;
}



activarSwitch(
    themeSwitch,
    function (valor) {

        iphone.classList.toggle(
            "dark",
            valor === "oscuro"
        );

    }
);


activarSwitch(
    fontSwitch,
    function (valor) {

        iphone.classList.toggle(
            "bold-text",
            valor === "bold"
        );

    }
);


activarSwitch(
    inputSwitch,
    function (valor) {

        inputBar.style.display =
            valor === "mostrar"
                ? "flex"
                : "none";

    }
);


activarSwitch(
    statusSwitch,
    function (valor) {

        estadoEntrega = valor;

        mostrarMensajes();

    }
);


activarSwitch(
    dateSwitch,
    function (valor) {

        modoFecha = valor;

        customDate.style.display =
            valor === "personalizada"
                ? "block"
                : "none";

        customTime.style.display =
            valor === "hoy"
                ? "block"
                : "none";

        actualizarFecha();

    }
);


customDate.addEventListener(
    "input",
    actualizarFecha
);


customTime.addEventListener(
    "input",
    actualizarFecha
);


groupName.addEventListener(
    "input",
    actualizarEncabezado
);


unreadInput.addEventListener(
    "input",
    function () {

        const n = parseInt(
            unreadInput.value,
            10
        );

        unreadCount.textContent =
            n > 0
                ? n
                : "";

    }
);



function actualizarFecha() {

    const hora = function (d) {

        return (
            String(d.getHours()).padStart(2, "0")
            + ":"
            + String(d.getMinutes()).padStart(2, "0")
        );

    };


    const ahora = new Date();

    let dia;
    let texto;


    if (modoFecha === "personalizada") {

        const f = customDate.value
            ? new Date(customDate.value)
            : ahora;

        dia = new Intl.DateTimeFormat(
            "es-PE",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        ).format(f);

        texto = hora(f);

    } else {

        dia = "Hoy";

        texto =
            customTime.value
            || hora(ahora);

    }


    conversationDate.innerHTML =
        "<strong>"
        + dia
        + "</strong> "
        + texto;
}


actualizarFecha();



function actualizarEncabezado() {

    const photo =
        document.getElementById("conversationPhoto");

    const name =
        document.getElementById("conversationName");

    const total =
        participantes.length;


    photo.className =
        "conversation-photo";

    photo.removeAttribute("data-count");

    photo.innerHTML = "";


    if (total === 0) {

        name.textContent =
            "Nuevo mensaje";

        photo.textContent =
            "👤";

        return;
    }


    if (total === 1) {

        name.textContent =
            participantes[0].nombre;

        photo.appendChild(
            crearAvatar(participantes[0])
        );

        return;
    }


    const nombreGrupo =
        groupName.value.trim();


    if (nombreGrupo) {

        name.textContent =
            nombreGrupo;

    } else {

        name.textContent =
            participantes
                .map(p => p.nombre)
                .join(", ");

    }


    photo.classList.add("group");

    photo.dataset.count =
        Math.min(total, 3);


    participantes
        .slice(0, 3)
        .forEach(function (p) {

            photo.appendChild(
                crearAvatar(p)
            );

        });

}



addParticipant.addEventListener(
    "click",
    function () {

        const nombre =
            prompt(
                "¿Cómo se llama el participante?"
            );


        if (!nombre || !nombre.trim()) {
            return;
        }


        participantes.push({

            id: siguienteId++,

            nombre: nombre.trim(),

            foto: null

        });


        mostrarParticipantes();

        actualizarEncabezado();

        mostrarMensajes();

        comprobarGrupo();

    }
);



function elegirFoto(participante) {

    const input =
        document.createElement("input");

    input.type = "file";

    input.accept = "image/*";


    input.addEventListener(
        "change",
        function () {

            const archivo =
                input.files[0];


            if (!archivo) {
                return;
            }


            const lector =
                new FileReader();


            lector.addEventListener(
                "load",
                function () {

                    participante.foto =
                        lector.result;


                    mostrarParticipantes();

                    actualizarEncabezado();

                    mostrarMensajes();

                }
            );


            lector.readAsDataURL(
                archivo
            );

        }
    );


    input.click();
}



function mostrarParticipantes() {

    participantsList.innerHTML = "";


    participantes.forEach(
        function (participante, indice) {

            const fila =
                document.createElement("div");



            const avatar =
                crearAvatar(participante);

            avatar.title =
                "Cambiar foto";


            avatar.addEventListener(
                "click",
                function () {

                    elegirFoto(
                        participante
                    );

                }
            );



            const nombre =
                document.createElement("span");

            nombre.textContent =
                participante.nombre;



            const messageButton =
                document.createElement("button");

            messageButton.textContent =
                "💬";


            messageButton.title =
                "Enviar mensaje";


            messageButton.addEventListener(
                "click",
                function () {

                    const texto =
                        prompt(
                            `¿Qué quieres que diga ${participante.nombre}?`
                        );


                    if (
                        !texto
                        || !texto.trim()
                    ) {

                        return;

                    }


                    mensajes.push({

                        texto:
                            texto.trim(),

                        remitenteId:
                            participante.id,

                        tipo:
                            "received",

                        tipoContenido:
                            "texto",

                        contenido:
                            null,

                        reaccion:
                            null

                    });


                    mostrarMensajes();

                }
            );



            const photoButton =
                document.createElement("button");

            photoButton.textContent =
                "🖼️";


            photoButton.title =
                "Enviar foto";


            photoButton.addEventListener(
                "click",
                function () {

                    elegirFotoMensaje(
                        participante
                    );

                }
            );



            const editButton =
                document.createElement("button");


            const editIcon =
                document.createElement("img");


            editIcon.src =
                "images/editar.png";

            editIcon.alt =
                "Editar";


            editButton.appendChild(
                editIcon
            );


            editButton.title =
                "Editar nombre";


            editButton.addEventListener(
                "click",
                function () {

                    const nuevoNombre =
                        prompt(
                            "¿Cuál será el nuevo nombre?",
                            participante.nombre
                        );


                    if (
                        !nuevoNombre
                        || !nuevoNombre.trim()
                    ) {

                        return;

                    }


                    participante.nombre =
                        nuevoNombre.trim();


                    mostrarParticipantes();

                    actualizarEncabezado();

                    mostrarMensajes();

                }
            );



            const deleteButton =
                document.createElement("button");


            deleteButton.textContent =
                "×";


            deleteButton.title =
                "Eliminar participante";


            deleteButton.addEventListener(
                "click",
                function () {

                    participantes.splice(
                        indice,
                        1
                    );


                    mostrarParticipantes();

                    actualizarEncabezado();

                    mostrarMensajes();

                    comprobarGrupo();

                }
            );



            fila.appendChild(
                avatar
            );

            fila.appendChild(
                nombre
            );

            fila.appendChild(
                messageButton
            );

            fila.appendChild(
                photoButton
            );

            fila.appendChild(
                editButton
            );

            fila.appendChild(
                deleteButton
            );


            participantsList.appendChild(
                fila
            );

        }
    );

}


addMessage.addEventListener(
    "click",
    function () {

        const texto = prompt(
            "¿Qué mensaje quieres enviar?"
        );

        if (
            !texto
            || !texto.trim()
        ) {
            return;
        }

        mensajes.push({

            texto:
                texto.trim(),

            remitenteId:
                0,

            tipo:
                "sent",

            tipoContenido:
                "texto",

            contenido:
                null,

            reaccion:
                null

        });

        mostrarMensajes();

    }
);


addImagen.addEventListener(
    "click",
    function () {

        elegirFotoMensaje();

    }
);



function elegirFotoMensaje(
    participante = null
) {

    const input =
        document.createElement("input");


    input.type = "file";

    input.accept =
        "image/*";


    input.addEventListener(
        "change",
        function () {

            const archivo =
                input.files[0];


            if (!archivo) {
                return;
            }


            const lector =
                new FileReader();


            lector.addEventListener(
                "load",
                function () {

                    mensajes.push({

                        texto: "",

                        remitenteId:
                            participante
                                ? participante.id
                                : 0,

                        tipo:
                            participante
                                ? "received"
                                : "sent",

                        tipoContenido:
                            "foto",

                        contenido:
                            lector.result,

                        reaccion:
                            null

                    });


                    cerrarTipoMensaje();

                    mostrarMensajes();

                }
            );


            lector.readAsDataURL(
                archivo
            );

        }
    );


    input.click();

}



const menu =
    document.createElement("div");

menu.id =
    "messageMenu";

document.body.appendChild(
    menu
);


function cerrarMenu() {

    menu.style.display =
        "none";

}


document.addEventListener(
    "click",
    cerrarMenu
);


menu.addEventListener(
    "click",
    function (e) {

        e.stopPropagation();

    }
);


function abrirMenu(
    indice,
    burbuja
) {

    const m =
        mensajes[indice];


    menu.innerHTML = "";



    const fila =
        document.createElement("div");

    fila.className =
        "menu-reactions";


    REACCIONES.forEach(
        function (r) {

            const boton =
                document.createElement("button");

            boton.className =
                "reaction-option";


            if (m.reaccion === r.id) {

                boton.classList.add(
                    "selected"
                );

            }


            renderIcono(
                r.icono,
                boton
            );


            boton.addEventListener(
                "click",
                function () {

                    m.reaccion =
                        m.reaccion === r.id
                            ? null
                            : r.id;


                    cerrarMenu();

                    mostrarMensajes();

                }
            );


            fila.appendChild(
                boton
            );

        }
    );


    menu.appendChild(
        fila
    );



    const editar =
        document.createElement("button");


    editar.className =
        "menu-action";


    editar.textContent =
        "Editar mensaje";


    editar.addEventListener(
        "click",
        function () {

            const nuevoTexto =
                prompt(
                    "Editar mensaje:",
                    m.texto
                );


            cerrarMenu();


            if (!nuevoTexto) {
                return;
            }


            m.texto =
                nuevoTexto;


            mostrarMensajes();

        }
    );


    menu.appendChild(
        editar
    );



    const eliminar =
        document.createElement("button");


    eliminar.className =
        "menu-action danger";


    eliminar.textContent =
        "Eliminar mensaje";


    eliminar.addEventListener(
        "click",
        function () {

            mensajes.splice(
                indice,
                1
            );


            cerrarMenu();

            mostrarMensajes();

        }
    );


    menu.appendChild(
        eliminar
    );



    menu.style.display =
        "block";


    const rect =
        burbuja.getBoundingClientRect();


    let top =
        rect.top
        - menu.offsetHeight
        - 10;


    if (top < 10) {

        top =
            rect.bottom + 10;

    }


    let left =
        rect.left
        + rect.width / 2
        - menu.offsetWidth / 2;


    left =
        Math.max(
            10,
            Math.min(
                left,
                window.innerWidth
                - menu.offsetWidth
                - 10
            )
        );


    menu.style.top =
        top + "px";


    menu.style.left =
        left + "px";

}


function mismoGrupo(a, b) {

    return (
        a
        && b
        && a.tipo === b.tipo
        && a.remitenteId === b.remitenteId
    );

}


function mostrarMensajes() {

    const container =
        document.querySelector(
            ".messages"
        );


    const status =
        document.getElementById(
            "messageStatus"
        );


    const esGrupo =
        participantes.length > 1;



    container
        .querySelectorAll(".message")
        .forEach(
            m => m.remove()
        );



    let ultimoEnviado = -1;


    mensajes.forEach(
        function (m, i) {

            if (m.tipo === "sent") {

                ultimoEnviado =
                    i;

            }

        }
    );


    status.style.display =
        "none";


    let ultimaBurbuja =
        null;



    mensajes.forEach(
        function (m, i) {

            const anterior =
                mensajes[i - 1];


            const siguiente =
                mensajes[i + 1];


            const el =
                document.createElement("div");


            el.classList.add(
                "message",
                m.tipo
            );



            if (
                m.tipoContenido === "foto"
            ) {

                const imagen =
                    document.createElement("img");


                imagen.src =
                    m.contenido;


                imagen.alt =
                    "Foto enviada";


                imagen.className =
                    "message-photo";


                el.appendChild(
                    imagen
                );

            } else {

                el.textContent =
                    m.texto;

            }



            if (
                mismoGrupo(
                    anterior,
                    m
                )
            ) {

                el.classList.add(
                    "grouped"
                );

            }


            const esUltimoDelGrupo =
                !mismoGrupo(
                    m,
                    siguiente
                );


            if (esUltimoDelGrupo) {

                el.classList.add(
                    "tail"
                );

            }



            if (
                esGrupo
                && m.tipo === "received"
            ) {

                el.classList.add(
                    "in-group"
                );


                if (esUltimoDelGrupo) {

                    const remitente =
                        participantes.find(
                            p =>
                                p.id ===
                                m.remitenteId
                        );


                    const avatar =
                        crearAvatar(
                            remitente
                        );


                    avatar.classList.add(
                        "bubble-avatar"
                    );


                    el.appendChild(
                        avatar
                    );

                }

            }



            if (m.reaccion) {

                const reaccion =
                    REACCIONES.find(
                        r =>
                            r.id ===
                            m.reaccion
                    );


                if (reaccion) {

                    el.classList.add(
                        "with-reaction"
                    );


                    const badge =
                        document.createElement(
                            "span"
                        );


                    badge.className =
                        "reaction-badge";


                    renderIcono(
                        reaccion.icono,
                        badge
                    );


                    el.appendChild(
                        badge
                    );

                }

            }



            el.addEventListener(
                "click",
                function (e) {

                    e.stopPropagation();

                    abrirMenu(
                        i,
                        el
                    );

                }
            );


            container.insertBefore(
                el,
                status
            );


            if (
                i === ultimoEnviado
            ) {

                ultimaBurbuja =
                    el;

            }

        }
    );



    if (ultimaBurbuja) {

        status.textContent =
            TEXTO_ESTADO[
            estadoEntrega
            ];


        status.style.display =
            "block";


        container.insertBefore(
            status,
            ultimaBurbuja.nextSibling
        );

    }



    container.scrollTop =
        container.scrollHeight;

}



function comprobarGrupo() {

    if (
        participantes.length > 1
    ) {

        groupName.parentElement.style.display =
            "block";

    } else {

        groupName.parentElement.style.display =
            "none";

    }

}



saveScreenshot.addEventListener(
    "click",
    async function () {

        const canvas =
            await html2canvas(
                iphone,
                {
                    backgroundColor: null,
                    scale: 2
                }
            );


        const link =
            document.createElement("a");


        link.download =
            "au-chat.png";


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        link.click();

    }
);







profileTab.addEventListener("click", function () {

    profileTab.classList.add("active");
    tweetsTab.classList.remove("active");

    profileInterface.style.display = "block";
    tweetsInterface.style.display = "none";

});


tweetsTab.addEventListener("click", function () {

    tweetsTab.classList.add("active");
    profileTab.classList.remove("active");

    profileInterface.style.display = "none";
    tweetsInterface.style.display = "block";

});



const xNameInput = document.getElementById("xNameInput");
const xHandleInput = document.getElementById("xHandleInput");
const xBioInput = document.getElementById("xBioInput");
const xLocationInput = document.getElementById("xLocationInput");
const xLinkInput = document.getElementById("xLinkInput");
const xJoinedInput = document.getElementById("xJoinedInput");
const xBirthdayInput = document.getElementById("xBirthdayInput");
const xFollowingInput = document.getElementById("xFollowingInput");
const xFollowersInput = document.getElementById("xFollowersInput");

const xAvatarInput = document.getElementById("xAvatarInput");
const xBannerInput = document.getElementById("xBannerInput");

const xDisplayName = document.getElementById("xDisplayName");
const xDisplayHeaderName = document.getElementById("xDisplayHeaderName");
const xDisplayHandle = document.getElementById("xDisplayHandle");
const xDisplayBio = document.getElementById("xDisplayBio");
const xDisplayLocation = document.getElementById("xDisplayLocation");
const xDisplayLink = document.getElementById("xDisplayLink");
const xDisplayJoined = document.getElementById("xDisplayJoined");
const xDisplayBirthday = document.getElementById("xDisplayBirthday");
const xDisplayFollowing = document.getElementById("xDisplayFollowing");
const xDisplayFollowers = document.getElementById("xDisplayFollowers");
const xAvatarPreview = document.getElementById("xAvatarPreview");
const xBannerPreview = document.getElementById("xBannerPreview");

function setupInputListener(input, element, defaultText = "", isOptional = false) {
    if (!input || !element) return;
    input.addEventListener("input", function () {
        const val = input.value.trim();
        if (isOptional) {
            if (val) {
                element.style.display = "inline";
                element.querySelector(".text").textContent = val;
            } else {
                element.style.display = "none";
            }
        } else {
            element.textContent = val || defaultText;
        }
    });
}

setupInputListener(xNameInput, xDisplayName, "Nombre del personaje");
setupInputListener(xNameInput, xDisplayHeaderName, "Nombre");
setupInputListener(xHandleInput, xDisplayHandle, "@usuario");
setupInputListener(xBioInput, xDisplayBio, "");
setupInputListener(xFollowingInput, xDisplayFollowing, "0");
setupInputListener(xFollowersInput, xDisplayFollowers, "0");

setupInputListener(xLocationInput, xDisplayLocation, "", true);
setupInputListener(xLinkInput, xDisplayLink, "", true);
setupInputListener(xJoinedInput, xDisplayJoined, "", true);
setupInputListener(xBirthdayInput, xDisplayBirthday, "", true);

const xFollowButtonSwitch = document.getElementById("xFollowButtonSwitch");
const xProfileActionButton = document.getElementById("xProfileActionButton");


const xTweetsCountInput = document.getElementById("xTweetsCountInput");
const xDisplayTweetsCount = document.getElementById("xDisplayTweetsCount");

xTweetsCountInput.addEventListener("input", function () {
    const val = xTweetsCountInput.value.trim();

    if (val) {
        xDisplayTweetsCount.textContent = isNaN(val) ? val : `${val} posts`;
    } else {
        xDisplayTweetsCount.textContent = "0 posts";
    }
});

activarSwitch(xFollowButtonSwitch, function (valor) {
    if (!xProfileActionButton) return;

    if (valor === "editar") {
        xProfileActionButton.textContent = "Editar perfil";
        xProfileActionButton.classList.add("edit-mode");
    } else {
        xProfileActionButton.textContent = "Seguir";
        xProfileActionButton.classList.remove("edit-mode");
    }
});

xHandleInput.addEventListener("input", function () {
    let val = xHandleInput.value.trim();
    if (val && !val.startsWith("@")) val = "@" + val;
    xDisplayHandle.textContent = val || "@usuario";
});

xAvatarInput.addEventListener("change", function () {
    const file = xAvatarInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            xAvatarPreview.innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
        };
        reader.readAsDataURL(file);
    }
});

xBannerInput.addEventListener("change", function () {
    const file = xBannerInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            xBannerPreview.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});

const saveXProfile =
    document.getElementById("saveXProfile");

saveXProfile.addEventListener(
    "click",
    async function () {

        const profile =
            document.querySelector(".x-profile-preview");

        const canvas =
            await html2canvas(
                profile,
                {
                    backgroundColor: "#000000",
                    scale: 2
                }
            );

        const link =
            document.createElement("a");

        link.download =
            "au-perfil-x.png";

        link.href =
            canvas.toDataURL("image/png");

        link.click();

    }
);


const xPrivateAccountSwitch = document.getElementById("xPrivateAccountSwitch");
const xHeaderLockIcon = document.getElementById("xHeaderLockIcon");
const xProfileLockIcon = document.getElementById("xProfileLockIcon");

activarSwitch(xPrivateAccountSwitch, function (valor) {
    if (valor === "privada") {
        xHeaderLockIcon.style.display = "inline-flex";
        xProfileLockIcon.style.display = "inline-flex";
    } else {
        xHeaderLockIcon.style.display = "none";
        xProfileLockIcon.style.display = "none";
    }
});

const xThemeSwitch = document.getElementById("xThemeSwitch");
const xProfilePreview = document.querySelector(".x-profile-preview");

xThemeSwitch.querySelectorAll("button").forEach(button => {

    button.addEventListener("click", function () {

        xThemeSwitch
            .querySelectorAll("button")
            .forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        if (this.dataset.value === "light") {
            xProfilePreview.classList.add("x-light");
        } else {
            xProfilePreview.classList.remove("x-light");
        }

        updateXLockIcons();
    });

});

function updateXLockIcons() {

    const lockIcons = document.querySelectorAll(
        "#xHeaderLockIcon img, #xProfileLockIcon img"
    );

    const isLight =
        xProfilePreview.classList.contains("x-light");

    lockIcons.forEach(icon => {
        icon.src = isLight
            ? "images/candado.png"
            : "images/candado-blacktheme.png";
    });
}


let savedCharacters = JSON.parse(
    localStorage.getItem("xCharacters")
) || [];

let editingCharacterIndex = null;

const charactersList = document.getElementById("charactersList");
const newCharacterButton = document.getElementById("newCharacterButton");

function loadCharacter(index) {
    const character = savedCharacters[index];

    if (!character) return;

    editingCharacterIndex = index;

    xNameInput.value = character.name || "";
    xHandleInput.value = character.handle || "";
    xBioInput.value = character.bio || "";
    xLocationInput.value = character.location || "";
    xLinkInput.value = character.link || "";
    xJoinedInput.value = character.joined || "";
    xBirthdayInput.value = character.birthday || "";
    xFollowingInput.value = character.following || "";
    xFollowersInput.value = character.followers || "";
    xTweetsCountInput.value = character.tweetsCount || "";

    xDisplayName.textContent = character.name || "Nombre del personaje";
    xDisplayHeaderName.textContent = character.name || "Nombre";

    let handle = character.handle || "@usuario";
    if (handle && !handle.startsWith("@")) {
        handle = "@" + handle;
    }

    xDisplayHandle.textContent = handle;
    xDisplayBio.textContent = character.bio || "Esta es la biografía del personaje...";
    xDisplayFollowing.textContent = character.following || "0";
    xDisplayFollowers.textContent = character.followers || "0";
    xDisplayTweetsCount.textContent =
        character.tweetsCount
            ? `${character.tweetsCount} posts`
            : "0 posts";

    if (character.location) {
        xDisplayLocation.style.display = "inline";
        xDisplayLocation.querySelector(".text").textContent = character.location;
    } else {
        xDisplayLocation.style.display = "none";
    }

    if (character.link) {
        xDisplayLink.style.display = "inline";
        xDisplayLink.querySelector(".text").textContent = character.link;
    } else {
        xDisplayLink.style.display = "none";
    }

    if (character.joined) {
        xDisplayJoined.style.display = "inline";
        xDisplayJoined.querySelector(".text").textContent = character.joined;
    } else {
        xDisplayJoined.style.display = "none";
    }

    if (character.birthday) {
        xDisplayBirthday.style.display = "inline";
        xDisplayBirthday.querySelector(".text").textContent = character.birthday;
    } else {
        xDisplayBirthday.style.display = "none";
    }

    if (character.avatar) {
        xAvatarPreview.innerHTML = `<img src="${character.avatar}" alt="Avatar">`;
    } else {
        xAvatarPreview.innerHTML = "👤";
    }

    if (character.banner) {
        xBannerPreview.style.backgroundImage = `url("${character.banner}")`;
    } else {
        xBannerPreview.style.backgroundImage = "";
    }

    xFollowButtonSwitch
        .querySelectorAll("button")
        .forEach(btn => btn.classList.remove("active"));

    xFollowButtonSwitch
        .querySelector(`[data-value="${character.profileAction || "seguir"}"]`)
        ?.classList.add("active");

    if (character.profileAction === "editar") {
        xProfileActionButton.textContent = "Editar perfil";
        xProfileActionButton.classList.add("edit-mode");
    } else {
        xProfileActionButton.textContent = "Seguir";
        xProfileActionButton.classList.remove("edit-mode");
    }

    xPrivateAccountSwitch
        .querySelectorAll("button")
        .forEach(btn => btn.classList.remove("active"));

    xPrivateAccountSwitch
        .querySelector(`[data-value="${character.privateAccount || "publica"}"]`)
        ?.classList.add("active");

    if (character.privateAccount === "privada") {
        xHeaderLockIcon.style.display = "inline-flex";
        xProfileLockIcon.style.display = "inline-flex";
    } else {
        xHeaderLockIcon.style.display = "none";
        xProfileLockIcon.style.display = "none";
    }

    xThemeSwitch
        .querySelectorAll("button")
        .forEach(btn => btn.classList.remove("active"));

    xThemeSwitch
        .querySelector(`[data-value="${character.theme || "dark"}"]`)
        ?.classList.add("active");

    if (character.theme === "light") {
        xProfilePreview.classList.add("x-light");
    } else {
        xProfilePreview.classList.remove("x-light");
    }

    updateXLockIcons();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function renderCharacters() {
    charactersList.innerHTML = "";

    savedCharacters.forEach((character, index) => {

        const card = document.createElement("div");
        card.className = "character-card";

        const avatar = document.createElement("img");
        avatar.className = "character-card-avatar";

        if (character.avatar) {
            avatar.src = character.avatar;
        } else {
            avatar.src = "";
            avatar.alt = "👤";
        }

        const info = document.createElement("div");
        info.className = "character-card-info";

        let handle = character.handle || "@usuario";

        if (handle && !handle.startsWith("@")) {
            handle = "@" + handle;
        }

        info.innerHTML = `
            <p class="character-card-name">${character.name || "Sin nombre"}</p>
            <p class="character-card-handle">${handle}</p>
        `;

        const buttons = document.createElement("div");
        buttons.className = "character-card-buttons";

        const editButton = document.createElement("button");
        editButton.className = "edit-character";
        editButton.textContent = "Editar";

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-character";
        deleteButton.textContent = "Eliminar";

        editButton.addEventListener("click", function () {
            loadCharacter(index);
        });

        deleteButton.addEventListener("click", function () {
            savedCharacters.splice(index, 1);

            localStorage.setItem(
                "xCharacters",
                JSON.stringify(savedCharacters)
            );

            renderCharacters();
            renderTweetAuthors();
        });

        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);

        card.appendChild(avatar);
        card.appendChild(info);
        card.appendChild(buttons);

        charactersList.appendChild(card);
    });
}


function getCurrentCharacter() {

    const avatarImg =
        xAvatarPreview.querySelector("img");

    const avatar =
        avatarImg
            ? avatarImg.src
            : null;


    const banner =
        xBannerPreview.style.backgroundImage
            ? xBannerPreview.style.backgroundImage
                .replace(/^url\(["']?/, "")
                .replace(/["']?\)$/, "")
            : null;


    return {

        name: xNameInput.value,
        handle: xHandleInput.value,
        bio: xBioInput.value,

        location: xLocationInput.value,
        link: xLinkInput.value,
        joined: xJoinedInput.value,
        birthday: xBirthdayInput.value,

        following: xFollowingInput.value,
        followers: xFollowersInput.value,
        tweetsCount: xTweetsCountInput.value,

        avatar: avatar,
        banner: banner,

        privateAccount:
            xPrivateAccountSwitch.querySelector(
                "button.active"
            )?.dataset.value || "publica",

        theme:
            xProfilePreview.classList.contains("x-light")
                ? "light"
                : "dark",

        profileAction:
            xFollowButtonSwitch.querySelector(
                "button.active"
            )?.dataset.value || "seguir"
    };
}

function limpiarFormularioX() {

    xNameInput.value = "";
    xHandleInput.value = "";
    xBioInput.value = "";

    xLocationInput.value = "";
    xLinkInput.value = "";
    xJoinedInput.value = "";
    xBirthdayInput.value = "";

    xFollowingInput.value = "";
    xFollowersInput.value = "";
    xTweetsCountInput.value = "";

    xAvatarInput.value = "";
    xAvatarPreview.innerHTML = "👤";

    xBannerInput.value = "";
    xBannerPreview.style.backgroundImage = "";

    xDisplayName.textContent = "Nombre del personaje";
    xDisplayHeaderName.textContent = "Nombre";
    xDisplayHandle.textContent = "@usuario";

    xDisplayBio.textContent =
        "Esta es la biografía del personaje...";

    xDisplayFollowing.textContent = "0";
    xDisplayFollowers.textContent = "0";
    xDisplayTweetsCount.textContent = "0 posts";

    xDisplayLocation.style.display = "none";
    xDisplayLink.style.display = "none";
    xDisplayJoined.style.display = "none";
    xDisplayBirthday.style.display = "none";

    xProfileActionButton.textContent = "Seguir";
    xProfileActionButton.classList.remove("edit-mode");

    xPrivateAccountSwitch
        .querySelectorAll("button")
        .forEach(btn => btn.classList.remove("active"));

    xPrivateAccountSwitch
        .querySelector('[data-value="publica"]')
        ?.classList.add("active");

    xHeaderLockIcon.style.display = "none";
    xProfileLockIcon.style.display = "none";

    xThemeSwitch
        .querySelectorAll("button")
        .forEach(btn => btn.classList.remove("active"));

    xThemeSwitch
        .querySelector('[data-value="dark"]')
        ?.classList.add("active");

    xProfilePreview.classList.remove("x-light");

    updateXLockIcons();
}


const saveXCharacter = document.getElementById("saveXCharacter");

saveXCharacter.addEventListener("click", function () {
    const character = getCurrentCharacter();

    if (editingCharacterIndex !== null) {
        savedCharacters[editingCharacterIndex] = character;
        alert("Personaje actualizado");
    } else {
        savedCharacters.push(character);
        alert("Personaje guardado");
    }

    localStorage.setItem(
        "xCharacters",
        JSON.stringify(savedCharacters)
    );

    renderCharacters();
    renderTweetAuthors();

    editingCharacterIndex = null;

    limpiarFormularioX();
});

renderCharacters();


newCharacterButton.addEventListener("click", function () {
    editingCharacterIndex = null;
    limpiarFormularioX();
});


const tweetAuthorSelect = document.getElementById("tweetAuthorSelect");

function renderTweetAuthors() {
    tweetAuthorSelect.innerHTML = `
        <option value="">Selecciona un personaje</option>
    `;

    savedCharacters.forEach((character, index) => {
        const option = document.createElement("option");

        option.value = index;
        option.textContent =
            `${character.name || "Sin nombre"} ${character.handle ? "@" + character.handle.replace("@", "") : ""}`;

        tweetAuthorSelect.appendChild(option);
    });
}

renderTweetAuthors();

const tweetImageInput = document.getElementById("tweetImageInput");
const tweetImagePreview = document.getElementById("tweetImagePreview");

let tweetImage = null;

tweetImageInput.addEventListener("change", function () {

    const file = tweetImageInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        tweetImage = e.target.result;

        tweetImagePreview.innerHTML = `
            <img src="${tweetImage}" alt="Imagen del tweet">

            <button
                type="button"
                class="tweet-remove-image"
                id="removeTweetImage"
            >
                Quitar foto
            </button>
        `;

        document
            .getElementById("removeTweetImage")
            .addEventListener("click", function () {

                tweetImage = null;
                tweetImageInput.value = "";
                tweetImagePreview.innerHTML = "";

            });
    };

    reader.readAsDataURL(file);
});

const tweetTextInput = document.getElementById("tweetTextInput");
const tweetCharacterCount = document.getElementById("tweetCharacterCount");

tweetTextInput.addEventListener("input", function () {
    tweetCharacterCount.textContent =
        `${tweetTextInput.value.length} / 280`;
});

let savedTweets = JSON.parse(
    localStorage.getItem("xTweets")
) || [];


const tweetDateSwitch = document.getElementById("tweetDateSwitch");
const tweetDateInput = document.getElementById("tweetDateInput");
let tweetDateMode = "ahora";

tweetDateSwitch.querySelectorAll("button").forEach(function (boton) {
    boton.addEventListener("click", function () {
        tweetDateSwitch.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        boton.classList.add("active");

        tweetDateMode = boton.dataset.value;
        tweetDateInput.style.display =
            tweetDateMode === "personalizada" ? "block" : "none";
    });
});


const publishTweetButton = document.getElementById("publishTweetButton");

function guardarTweets() {
    localStorage.setItem("xTweets", JSON.stringify(savedTweets));
}

function esc(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

publishTweetButton.addEventListener("click", function () {

    const authorIndex = tweetAuthorSelect.value;
    const text = tweetTextInput.value.trim();

    if (authorIndex === "") {
        alert("Selecciona quién publicará el tweet.");
        return;
    }

    if (!text && !tweetImage) {
        alert("Escribe algo o añade una foto.");
        return;
    }

    let fecha = new Date();

    if (tweetDateMode === "personalizada" && tweetDateInput.value) {
        fecha = new Date(tweetDateInput.value);
    }

    savedTweets.push({
        authorIndex: Number(authorIndex),
        text: text,
        image: tweetImage,
        date: fecha.toISOString(),

        replies: "",
        retweets: "",
        likes: "",
        bookmarks: "",
        views: "",

        liked: false,
        retweeted: false,
        bookmarked: false
    });

    guardarTweets();
    renderTweets();

    tweetTextInput.value = "";
    tweetCharacterCount.textContent = "0 / 280";

    tweetImage = null;
    tweetImageInput.value = "";
    tweetImagePreview.innerHTML = "";
});


const XP_PATHS = {
    back: "M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z",
    reply: "M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z",
    repost: "M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z",
    likeOff: "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z",
    likeOn: "M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z",
    saveOff: "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z",
    saveOn: "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z",
    share: "M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"
};

function xpSvg(path, size) {
    return `<svg viewBox="0 0 24 24" width="${size || 20}" height="${size || 20}" fill="currentColor" aria-hidden="true"><path d="${path}"></path></svg>`;
}


function ajustarNumero(valor, delta) {
    const limpio = String(valor || "0").trim();

    if (/^\d[\d.,]*$/.test(limpio)) {
        const n = parseInt(limpio.replace(/[.,]/g, ""), 10) + delta;
        return String(Math.max(0, n));
    }

    return limpio;
}

function alternar(tweet, estado, numero) {
    tweet[estado] = !tweet[estado];
    tweet[numero] = ajustarNumero(tweet[numero], tweet[estado] ? 1 : -1);
    guardarTweets();
    renderTweets();
}


XP_PATHS.views = "M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z";

const formulariosAbiertos = new Set();


const xTweetThemeSwitch = document.getElementById("xTweetThemeSwitch");
let tweetTheme = localStorage.getItem("xTweetTheme") || "dark";

xTweetThemeSwitch.querySelectorAll("button").forEach(function (boton) {

    boton.classList.toggle("active", boton.dataset.value === tweetTheme);

    boton.addEventListener("click", function () {
        tweetTheme = boton.dataset.value;
        localStorage.setItem("xTweetTheme", tweetTheme);

        xTweetThemeSwitch.querySelectorAll("button").forEach(function (b) {
            b.classList.toggle("active", b === boton);
        });

        renderTweets();
    });
});

function formatoHandle(personaje) {
    const h = personaje.handle || "@usuario";
    return h.startsWith("@") ? h : "@" + h;
}

function ed(campo, valor, extra) {
    return `<span class="xp-count ${extra || ""}" contenteditable="true" spellcheck="false" data-campo="${campo}">${esc(valor)}</span>`;
}

function enlazarCampos(contenedor, obj) {

    contenedor.querySelectorAll(".xp-count").forEach(function (campo) {

        campo.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                campo.blur();
            }
        });

        campo.addEventListener("blur", function () {
            const vacio = campo.dataset.campo === "time" ? "1 h" : "0";
            const valor = campo.textContent.trim() || vacio;

            campo.textContent = valor;
            obj[campo.dataset.campo] = valor;
            guardarTweets();
        });
    });
}

const XP_STATUS_BAR = `
    <div class="xp-statusbar">
        <span>9:41</span>
        <span class="xp-status-icons">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="19" height="9" rx="2.2" fill="currentColor"/><path d="M24 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" fill="currentColor" opacity=".5"/></svg>
        </span>
    </div>
    <div class="xp-body"></div>
`;


function renderTweets() {

    const tweetsList = document.getElementById("tweetsList");

    tweetsList.innerHTML = "";

    savedTweets.forEach(function (tweet, index) {

        const character = savedCharacters[tweet.authorIndex];

        if (!character) return;

        tweet.thread = tweet.thread || [];

        const fecha = new Date(tweet.date);

        const hora = fecha.toLocaleTimeString("es-PE", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        const dia = fecha.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        const item = document.createElement("div");
        item.className = "xp-item";

        const phone = document.createElement("div");
        phone.className = "xp-phone" + (tweetTheme === "light" ? " xp-light" : "");
        phone.innerHTML = XP_STATUS_BAR;

        const body = phone.querySelector(".xp-body");

        const card = document.createElement("div");
        card.className = "xp-card";

        card.innerHTML = `
            <div class="xp-header">
                <span class="xp-back">${xpSvg(XP_PATHS.back, 22)}</span>
                <span class="xp-title">Post</span>
            </div>

            <div class="xp-author">
                <img class="xp-avatar" src="${character.avatar || ""}" alt="">

                <div class="xp-author-info">
                    <strong class="xp-name">${esc(character.name || "Sin nombre")}</strong>
                    <span class="xp-handle">${esc(formatoHandle(character))}</span>
                </div>

                <button type="button" class="xp-more" title="Eliminar post">···</button>
            </div>

            <div class="xp-text">${esc(tweet.text || "")}</div>

            ${tweet.image ? `<img class="xp-media" src="${tweet.image}" alt="">` : ""}

            <div class="xp-meta">
                <span>${hora}</span> · <span>${dia}</span> ·
                ${ed("views", tweet.views || "0", "xp-views")}
                Visualizaciones
            </div>

            <div class="xp-actions">

                <div class="xp-action xp-reply ${formulariosAbiertos.has(tweet) ? "active" : ""}">
                    <button type="button" class="xp-icon" data-accion="reply" title="Responder (crear hilo)">${xpSvg(XP_PATHS.reply)}</button>
                    ${ed("replies", tweet.replies || "0")}
                </div>

                <div class="xp-action xp-repost ${tweet.retweeted ? "active" : ""}">
                    <button type="button" class="xp-icon" data-accion="repost">${xpSvg(XP_PATHS.repost)}</button>
                    ${ed("retweets", tweet.retweets || "0")}
                </div>

                <div class="xp-action xp-like ${tweet.liked ? "active" : ""}">
                    <button type="button" class="xp-icon" data-accion="like">${xpSvg(tweet.liked ? XP_PATHS.likeOn : XP_PATHS.likeOff)}</button>
                    ${ed("likes", tweet.likes || "0")}
                </div>

                <div class="xp-action xp-save ${tweet.bookmarked ? "active" : ""}">
                    <button type="button" class="xp-icon" data-accion="save">${xpSvg(tweet.bookmarked ? XP_PATHS.saveOn : XP_PATHS.saveOff)}</button>
                    ${ed("bookmarks", tweet.bookmarks || "0")}
                </div>

                <div class="xp-action xp-share">
                    <span class="xp-icon">${xpSvg(XP_PATHS.share)}</span>
                </div>

            </div>
        `;

        enlazarCampos(card, tweet);

        card.querySelector('[data-accion="reply"]').addEventListener("click", function () {
            if (formulariosAbiertos.has(tweet)) {
                formulariosAbiertos.delete(tweet);
            } else {
                formulariosAbiertos.add(tweet);
            }
            renderTweets();
        });

        card.querySelector('[data-accion="repost"]').addEventListener("click", function () {
            alternar(tweet, "retweeted", "retweets");
        });

        card.querySelector('[data-accion="like"]').addEventListener("click", function () {
            alternar(tweet, "liked", "likes");
        });

        card.querySelector('[data-accion="save"]').addEventListener("click", function () {
            alternar(tweet, "bookmarked", "bookmarks");
        });

        card.querySelector(".xp-more").addEventListener("click", function () {
            if (confirm("¿Eliminar este post y su hilo?")) {
                formulariosAbiertos.delete(tweet);
                savedTweets.splice(index, 1);
                guardarTweets();
                renderTweets();
            }
        });

        body.appendChild(card);

        tweet.thread.forEach(function (r, rIndex) {

            const autor = savedCharacters[r.authorIndex];

            if (!autor) return;

            const el = document.createElement("div");
            el.className = "xp-reply-item";

            el.innerHTML = `
                <img class="xp-avatar" src="${autor.avatar || ""}" alt="">

                <div class="xp-reply-main">

                    <div class="xp-reply-top">
                        <strong class="xp-name">${esc(autor.name || "Sin nombre")}</strong>
                        <span class="xp-handle">${esc(formatoHandle(autor))}</span>
                        <span class="xp-handle">·</span>
                        ${ed("time", r.time || "1 h", "xp-handle")}
                        <button type="button" class="xp-more" title="Eliminar respuesta">···</button>
                    </div>

                    <div class="xp-reply-text">${esc(r.text)}</div>

                    <div class="xp-reply-actions">

                        <div class="xp-action xp-reply">
                            <span class="xp-icon">${xpSvg(XP_PATHS.reply, 18)}</span>
                            ${ed("replies", r.replies || "0")}
                        </div>

                        <div class="xp-action xp-repost ${r.retweeted ? "active" : ""}">
                            <button type="button" class="xp-icon" data-accion="repost">${xpSvg(XP_PATHS.repost, 18)}</button>
                            ${ed("retweets", r.retweets || "0")}
                        </div>

                        <div class="xp-action xp-like ${r.liked ? "active" : ""}">
                            <button type="button" class="xp-icon" data-accion="like">${xpSvg(r.liked ? XP_PATHS.likeOn : XP_PATHS.likeOff, 18)}</button>
                            ${ed("likes", r.likes || "0")}
                        </div>

                        <div class="xp-action xp-reply">
                            <span class="xp-icon">${xpSvg(XP_PATHS.views, 18)}</span>
                            ${ed("views", r.views || "0")}
                        </div>

                        <div class="xp-action xp-share">
                            <span class="xp-icon">${xpSvg(XP_PATHS.share, 18)}</span>
                        </div>

                    </div>

                </div>
            `;

            enlazarCampos(el, r);

            el.querySelector('[data-accion="repost"]').addEventListener("click", function () {
                alternar(r, "retweeted", "retweets");
            });

            el.querySelector('[data-accion="like"]').addEventListener("click", function () {
                alternar(r, "liked", "likes");
            });

            el.querySelector(".xp-more").addEventListener("click", function () {
                if (confirm("¿Eliminar esta respuesta?")) {
                    tweet.thread.splice(rIndex, 1);
                    tweet.replies = ajustarNumero(tweet.replies, -1);
                    guardarTweets();
                    renderTweets();
                }
            });

            body.appendChild(el);
        });

        item.appendChild(phone);

        const guardar = document.createElement("button");
        guardar.type = "button";
        guardar.className = "xp-save-png";
        guardar.textContent = "Guardar PNG";

        guardar.addEventListener("click", async function () {

            const canvas = await html2canvas(phone, {
                backgroundColor: null,
                scale: 2
            });

            const link = document.createElement("a");

            link.download = "au-post-x-" + (index + 1) + ".png";
            link.href = canvas.toDataURL("image/png");

            link.click();
        });

        item.appendChild(guardar);

        if (formulariosAbiertos.has(tweet)) {

            const form = document.createElement("div");
            form.className = "xp-reply-form";

            form.innerHTML = `
                <label class="x-option-label">Responder como</label>
                <select></select>
                <textarea maxlength="280" rows="3" placeholder="Escribe la respuesta del hilo"></textarea>
                <div class="xp-reply-buttons">
                    <button type="button" class="xp-cancel">Cerrar</button>
                    <button type="button" class="xp-send">Responder</button>
                </div>
            `;

            const select = form.querySelector("select");

            select.innerHTML = savedCharacters.map(function (c, i) {
                return `<option value="${i}" ${i === tweet.authorIndex ? "selected" : ""}>${esc(c.name || "Sin nombre")} ${esc(formatoHandle(c))}</option>`;
            }).join("");

            form.querySelector(".xp-cancel").addEventListener("click", function () {
                formulariosAbiertos.delete(tweet);
                renderTweets();
            });

            form.querySelector(".xp-send").addEventListener("click", function () {

                const texto = form.querySelector("textarea").value.trim();

                if (!texto) {
                    alert("Escribe una respuesta.");
                    return;
                }

                tweet.thread.push({
                    authorIndex: Number(select.value),
                    text: texto,
                    time: "1 h",
                    replies: "",
                    retweets: "",
                    likes: "",
                    views: "",
                    liked: false,
                    retweeted: false
                });

                tweet.replies = ajustarNumero(tweet.replies, 1);

                guardarTweets();
                renderTweets();
            });

            item.appendChild(form);
        }

        tweetsList.appendChild(item);
    });
}

renderTweets();