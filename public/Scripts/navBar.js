const areaUtente = document.querySelector("#areaUtente");
const bottoneUtente = document.querySelector("#iconaUtente");

const finestra = window;

bottoneUtente.addEventListener("click", () => {
    areaUtente.classList.toggle("nascosto");
    bottoneUtente.classList.toggle("selezionato")

});
finestra.addEventListener("click", (e) => {
    if (e.target != bottoneUtente) {
        if (bottoneUtente.classList.contains("selezionato")) {
            areaUtente.classList.add("nascosto")
            bottoneUtente.classList.remove("selezionato")
        }
    }

});

