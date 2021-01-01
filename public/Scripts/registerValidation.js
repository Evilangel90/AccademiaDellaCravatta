const errore = document.querySelector("#error");
const form = document.querySelector("#register");
let username = document.querySelector("#username");
const password1 = document.querySelector("#password");
const password2 = document.querySelector("#password2");
let isCorrect = "";
let passw1 = "";
let passw2 = "";

form.addEventListener("input", (e) => {
    customFormError(e);
})

const customFormError = (event) => {
    const input = event.target;
    input.setCustomValidity("");

    /////////se è il numero di telefono   
    if (input.type === "tel") {
        isCorrect = input.checkValidity();
        if (isCorrect == false) {
            sbagliato(input);
            input.setCustomValidity(`Rispettare esempio 331*****94, +39 o (0039) opzionale`);
        } else {
            giusto(input)
        }
    } else if (input.name === "password") {
        isCorrect = input.checkValidity();
        if (isCorrect == false) {
            sbagliato(input);
            input.setCustomValidity(`La password deve contenere almeno 8 caratteri, una lettera maiuscola, ed un carattere speciale`);
        } else {
            giusto(input);

        }
    } else if (input.name === "password2") {
        passw1 = traduciPassw(password1.value);
        passw2 = traduciPassw(password2.value);
        isCorrect = input.checkValidity();
        if (isCorrect == false) {
            input.setCustomValidity(`La password deve contenere almeno 8 caratteri, una lettera maiuscola, ed un carattere speciale`);
            sbagliato(input);

        } else if (isCorrect == true && ((passw1 === passw2))) {
            giusto(input);
        } else {
            input.setCustomValidity(`Le Password non coincidono`)
            sbagliato(input)

        }

    } else {
        isCorrect = input.checkValidity();
        if (isCorrect == false) {
            sbagliato(input);
        } else {
            giusto(input);
        }

    }
    errore.innerHTML = `${input.validationMessage}`;
}

const traduciPassw = (pass) => {
    const carattSpec = ["!", "£", "$", "%", "&", "?", "^", "*", "@", "#"];
    const passw = [...pass];
    let passwTradotta = [];

    for (let i = 0; i < passw.length; i++) {
        if (carattSpec.indexOf(passw[i]) == -1) {
            passwTradotta.push(passw[i]);
        } else {
            passwTradotta.push(`11${carattSpec.indexOf(passw[i])}`);
        }

    }

    return passwTradotta.join("");

}

const giusto = (input) => {
    input.setCustomValidity("");
    input.classList.remove("errato");
    input.classList.add("giusto");
    errore.innerHTML = ""

}
const sbagliato = (input) => {
    input.classList.remove("giusto");
    input.classList.add("errato");

}



