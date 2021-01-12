import { Corso } from "../../models/corsi";
import { User } from "../../models/users";

export const èLoggato = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Solo i membri possono accedervi, effettua il login !");
        return res.redirect("/login");
    }
    next();
}

export const corsoValido = async (req, res, next) => {
    try {
        const corsoId = req.params.id;
        let corso = await Corso.findById(corsoId);
        let lezioniEsistono = "";
        corso.lezioni.length >= 1 ? lezioniEsistono = true : lezioniEsistono = false;
        if (lezioniEsistono) {
            next()
        } else {
            req.flash("error", "Pagina Non disponibile al momento, riprovare più tardi o contattare gli amministratori");
            res.redirect("/corsi");
        }
    } catch {
        res.redirect("/paginaErrore");
    }
};

export const utenteVerificatoEmail = async (req, res, next) => {

    const utente = await User.findOne({ username: req.body.username });
    if (utente) {
        if (utente.confermatoEmail) {
            next();
        } else {
            req.flash("error", "Ti preghiamo di confermare il tuo indirizzo email prima di poter accedere");
            res.redirect("/altraEmailConvalida");
        }
    } else {
        req.flash("error", "Utente non trovato, effettua la registrazione");
        res.redirect("/register");
    }


};






