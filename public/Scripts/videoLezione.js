
const videoPlayer = document.querySelector("#videoPlayer");
const btnPlay = document.querySelector("#btnPlay");
const btnPause = document.querySelector("#btnPause");
const btnNext = document.querySelector("#btnNext");
const videoLezioni = Array.from(document.querySelectorAll(".videoLezione"));
const body = document.querySelector("body");
const messaggio = document.querySelector("#messaggio");
let linkVideoCorrente = "";
let videoLezioniLinks = [];
let videoInPlay = 0;
let timer = videoPlayer.currentTime;
let videoIsInPlay = false;
for (let i = 0; i < videoLezioni.length; i++) {
    videoLezioniLinks.push(videoLezioni[i].getAttribute("dataLink"));
}

messaggio.style.display = "none";
videoPlayer.setAttribute("controlsList", "nodownload");
btnPlay.addEventListener("click", videoControl);
btnPause.addEventListener("click", videoControl);
btnNext.addEventListener("click", videoControl);
videoPlayer.addEventListener("ended", nextVideo);
body.addEventListener('contextmenu', utentePremeTastoDestro, false);
body.addEventListener('click', nascondiMessaggio, false);
window.addEventListener('load', caricaUltimoVideo, false);
messaggio.addEventListener("mouseout", nascondiMessaggio, false);

///////////////////FUNZIONALITA' CONTROLLO VIDEO E PLAYLIST///////////////
const updateTimer = () => {
    if (videoIsInPlay) {
        timer = videoPlayer.currentTime;
        document.cookie = `video=${videoPlayer.getAttribute("src")}`;
        document.cookie = `timer=${timer}`;
    }

}
function caricaUltimoVideo() {
    if (document.cookie) {
        let ultimoVideo = document.cookie.split(" ")[0];
        let ultimoTimer = document.cookie.split(" ")[1];
        ultimoVideo = ultimoVideo.slice(6, ultimoVideo.length - 1);
        ultimoTimer = ultimoTimer.slice(6, ultimoTimer.length);
        videoPlayer.setAttribute("src", `${ultimoVideo}`);
        videoPlayer.currentTime = ultimoTimer;
        linkVideoCorrente = videoPlayer.getAttribute("src");
        videoInPlay = videoLezioniLinks.indexOf(linkVideoCorrente);
        cambiaClasseAlVideoCorrente();
    }
    cambiaClasseAlVideoCorrente();
};
function videoControl(event) {

    switch (event.target.id) {
        case "btnPlay":
            videoPlayer.play();
            btnPlay.innerText = " Play";
            videoIsInPlay = true;
            setInterval(updateTimer, 100);
            break
        case "btnPause":
            videoPlayer.pause();
            btnPlay.innerText = " Riprendi";
            clearInterval(updateTimer);
            videoIsInPlay = false;
            break
        case "btnNext":
            nextVideo(videoPlayer);
            videoIsInPlay = true;
            break;
    }
    (videoInPlay + 1) == videoLezioni.length ?
        btnNext.innerText = "Torna al primo video" :
        btnNext.innerText = "Prossimo Video";

}


function cambiaClasseAlVideoCorrente() {
    for (let i = 0; i < videoLezioni.length; i++) {
        videoLezioni[i].classList.remove("corrente");
    }
    videoLezioni[videoInPlay].classList.add("corrente");
}


function nextVideo() {
    linkVideoCorrente = videoPlayer.getAttribute("src");
    videoInPlay = videoLezioniLinks.indexOf(linkVideoCorrente);
    if (videoInPlay != -1) {

        if ((videoInPlay + 1) < videoLezioni.length) {
            let prossimoVideo = videoLezioniLinks[(videoInPlay + 1)];
            videoPlayer.setAttribute("src", prossimoVideo);
            linkVideoCorrente = videoPlayer.getAttribute("src");
            videoInPlay = videoLezioniLinks.indexOf(linkVideoCorrente);
            videoIsInPlay = true;
            videoPlayer.play();
            setInterval(updateTimer, 100)
        } else {

            videoPlayer.setAttribute("src", videoLezioniLinks[0]);
            linkVideoCorrente = videoPlayer.getAttribute("src");
            videoInPlay = videoLezioniLinks.indexOf(linkVideoCorrente);
            videoIsInPlay = true;
            videoPlayer.play();
            setInterval(updateTimer, 100)
        }
    }
    cambiaClasseAlVideoCorrente();

}

for (video of videoLezioni) {
    video.addEventListener("click", (e) => {
        const prossimoVideo = e.target.getAttribute("dataLink");
        if (prossimoVideo !== linkVideoCorrente) {
            setInterval(updateTimer, 100)
            nextVideo();
        }

    })
};



///////////////////FUNZIONALITA' BLOCCO TASTO DESTRO E DISPLAY MESSAGGIO ////////////////


function nascondiMessaggio() {
    if (messaggio.style.display == "") {
        messaggio.style.display = "none"
    };

};

function posizioneParent(element) {
    let xPosition = 0;
    let yPosition = 0;
    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    } return {
        x: xPosition,
        y: yPosition

    };

};

function messaggioSeguePuntatore(evento) {
    let xMouse = evento.clientX;
    let yMouse = evento.clientY;
    let parentPosition = posizioneParent(messaggio);
    let xPos = xMouse - parentPosition.x - (messaggio.offsetWidth) / 2;
    let yPos = yMouse - parentPosition.y - (messaggio.offsetHeight) / 2;
    messaggio.style.transform = `translate3d(${xPos}px,${yPos}px,0)`;
}

function utentePremeTastoDestro(evento) {
    let bloccare = false;
    evento.which == 3 ? bloccare = true : bloccare = false;
    if (bloccare) {
        messaggio.style.display = "";
        messaggioSeguePuntatore(evento);
        evento.preventDefault();
        bloccare = false;
    }
}



