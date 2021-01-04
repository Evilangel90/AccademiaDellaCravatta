import express from "express";
const router = express.Router();
import { User } from "../models/users.js";
import passport from "passport";
import { èLoggato } from "../public/Scripts/middleware";
const AuthImpost = { failureFlash: "Username o Password non corretti", failureRedirect: "/login" }


router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", passport.authenticate("local", AuthImpost), async (req, res) => {

    try {
        const { username } = req.body;
        const utente = await User.findOne({ username });
        req.flash("success", ` Bentornato ${utente.nome}`);
        res.redirect("areaPersonale");
    } catch (e) {
        res.render("login", { messaggio: req.flash("error") });
    }

})
router.get("/register", (req, res) => {
    res.render("register", { messaggio: req.flash("error") });
});
router.post("/register", async (req, res) => {
    try {
        const {
            nome, cognome, citta, provincia, via, cap,
            cellulare, email, username, civico
        } = req.body;
        const { password } = req.body;

        const user = new User({
            nome, cognome, citta, provincia, via, cap,
            cellulare, email, username, civico
        });
        const newUser = await User.register(user, password);
        req.flash("success", ` Benvenuto ${user.username}`);
        res.redirect("areaPersonale");
    } catch (e) {
        if (e.name === "UserExistsError") {
            req.flash("error", `Un utente con questo Username esiste già`);
        } else if (e.errors) {
            if (e.errors.cellulare) {
                req.flash("error", ` ${e.errors.cellulare.message}`);
            }
            if (e.errors.email) {
                req.flash("error", ` ${e.errors.email.message}`);
            }

        }
        res.redirect("register");
    }
});
router.get("/areaPersonale", èLoggato, (req, res) => {
    const utente = req.user;
    res.render("areaPersonale", { utente });
});

router.get("/assistenza", èLoggato, (req, res) => {
    const utente = req.user;
    res.render("assistenza", { utente });
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logout effettuato, a presto!");
    res.redirect("/");
})


module.exports = router;






