
const videoPlayer = document.querySelector("#videoPlayer");
const btnPlay = document.querySelector("#btnPlay");
const btnPause = document.querySelector("#btnPause");
const btnNext = document.querySelector("#btnNext");
const videoLezioni = Array.from(document.querySelectorAll(".videoLezione"));
const body = document.querySelector("body");
const messaggio = document.querySelector("#messaggio");

messaggio.style.display = "none";
videoPlayer.setAttribute("controlsList", "nodownload");

btnPlay.addEventListener("click", videoControl);
btnPause.addEventListener("click", videoControl);
btnNext.addEventListener("click", videoControl);
videoPlayer.addEventListener("ended", nextVideo);
body.addEventListener('contextmenu', utentePremeTastoDestro, false);
body.addEventListener('click', nascondiMessaggio, false);
messaggio.addEventListener("mouseout", nascondiMessaggio, false);


function videoControl(event) {

    switch (event.target.id) {
        case "btnPlay":
            videoPlayer.play();
            btnPlay.innerText = " Play";
            break
        case "btnPause":
            videoPlayer.pause();
            btnPlay.innerText = " Riprendi";
            break
        case "btnNext":
            nextVideo();
            break;
    }
}

function nextVideo() {
    console.log("cliccato next");

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

for (video of videoLezioni) {
    video.addEventListener("click", (e) => {
        const linkVideo = e.target.parentElement.getAttribute("dataLink");
        const link = linkVideo.slice(1, linkVideo.length);
        const linkVideoCorrente = videoPlayer.currentSrc;


    })
}

