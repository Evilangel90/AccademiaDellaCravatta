import { Corso } from "../../models/corsi";
export const èLoggato = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Solo i membri possono accedervi, effettua il login !");
        return res.redirect("/login");
    }
    next();
}

export const corsoValido = async (req, res, next) => {

    const corsoId = req.params.id;
    let corso = await Corso.findById(corsoId)
    let lezioniEsistono = "";
    corso.lezioni.length >= 1 ? lezioniEsistono = true : lezioniEsistono = false;

    if (lezioniEsistono) {
        next()
    } else {
        req.flash("error", "Pagina Non disponibile al momento, riprovare più tardi o contattare gli amministratori");
        res.redirect("/corsi");
    }
}


