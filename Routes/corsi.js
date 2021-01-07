import express from "express";
const router = express.Router();
import { Corso } from "../models/corsi";
import { èLoggato, corsoValido } from "../public/Scripts/middleware";
import { Lesson } from "../models/lezioni";

router.get("/corsi", èLoggato, async (req, res) => {
    const utente = req.user;
    const idUtente = req.user.id;
    const corsi = await Corso.find({}).populate("User").find({ utentePuoVedere: idUtente });
    res.render("corsi", { utente, corsi });
});
router.get("/corsi/shop", èLoggato, async (req, res) => {
    const utente = req.user;
    const corsi = await Corso.find({});
    res.render("shop", { utente, corsi });
});
router.get("/corsi/:id", èLoggato, corsoValido, async (req, res) => {
    try {
        const utente = req.user;
        const corsoId = req.params.id;
        const corso = await Corso.findById(corsoId);
        res.render("infoCorso", { utente, corso });
    } catch {
        req.flash("error", "Corso non trovato");
        res.redirect("/corsi/shop")
    }
});
router.get("/:id/videoLezione", èLoggato, corsoValido, async (req, res) => {
    try {
        const utente = req.user;
        const corsoId = req.params.id;
        const corso = await Corso.findById(corsoId);
        const videoLezioni = await Lesson.find({ appartieneCorso: corsoId });
        if (videoLezioni.length >= 1) {
            res.render("videoLezione", { utente, corso, videoLezioni })
        } else {
            req.flash("error", "Corso non trovato, se il problema persiste contattare l' assistenza");
            res.redirect("/corsi");
        }

    } catch {
        req.flash("error", "Corso non trovato");
        res.redirect("/corsi");
    }
});


module.exports = router;