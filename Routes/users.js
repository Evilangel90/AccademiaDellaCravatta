if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

import express from "express";
const router = express.Router();
import { User } from "../models/users.js";
import passport from "passport";
import { èLoggato, utenteVerificatoEmail } from "../public/Scripts/middleware";
const jwt = require("jsonwebtoken");
const AuthImpost = { failureFlash: "Username o Password non corretti", failureRedirect: "/login" };
import nodemailer from "nodemailer";

const emailMittente = process.env.emailMittente;
const passwEmail = process.env.emailPassw;

let url = "";
process.env.NODE_ENV !== "production" ? url = "http://localhost:3000" : url = process.env.urlPiattaforma;


router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", utenteVerificatoEmail, passport.authenticate("local", AuthImpost), async (req, res) => {

    try {
        const { username } = req.body;
        const utente = await User.findOne({ username });
        req.flash("success", `Benvenuto ${utente.nome}`);
        res.redirect("/areaPersonale");
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
        let user = new User({
            nome, cognome, citta, provincia, via, cap,
            cellulare, email, username, civico
        });
        user = await User.register(user, password);
        const emailmandata = mandaEmailVerifica(nome, email, password);
        if (emailmandata) {
            req.flash("success", `Abbiamo inviato una mail di convalida all'indirizzo ${email}`);
            res.redirect("/login");
        } else {
            req.flash("error", "C'è stato un errore nella richiesta, si prega di riprovare più tardi");
            res.redirect("/register");
        }
        //////////anallizzare errori di dulicazioneeee
    } catch (e) {

        if (e.name === "UserExistsError") {
            req.flash("error", `Un utente con questo Username esiste già`);
        } else if (e.code === 11000) {
            let elementoDuplicato = Object.keys(e.keyPattern, "key")[0];
            if (elementoDuplicato === "cellulare") {
                req.flash("error", ` Numero di cellulare già in uso`);
            }
            if (elementoDuplicato === "email") {
                req.flash("error", ` L'email è già registrata`);
            }
        } else {
            req.flash("error", `Si è verificato un errore, riprovare più tardi`);
        }
        res.redirect("/register");
    }
});


router.get("/areaPersonale", èLoggato, (req, res) => {
    const utente = req.user;
    res.render("areaPersonale", { utente });
});

router.get("/logout", èLoggato, (req, res) => {
    req.logout();
    req.flash("success", "Logout effettuato, a presto!");
    res.redirect("/");
});


const mandaEmailVerifica = async (nomeUtente, emailUtente, passwordUtente) => {
    const token = jwt.sign({ emailUtente, nomeUtente, passwordUtente }, process.env.JWT_Token, { expiresIn: "30m" });
    const transporter = nodemailer.createTransport({
        host: 'smtp.libero.it',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: emailMittente, // generated ethereal user
            pass: passwEmail  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: `"Convalida Email - Accademia Della Cravatta" <${emailMittente}>`, // sender address
        to: emailUtente, // list of receivers
        subject: "verifica email per Accademia Della Cravatta",
        text: 'Hello world?', // plain text body // Subject line
        html: `<h2> clicca sul link per verificare la mail</h2>
        <p> <a href="${url}/confermaEmail/${token}">Conferma la tua Email</a>
        ` // html body
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
            return false;
        } else {
            return true;

        }

    });
}

router.get("/confermaEmail/:id", (req, res) => {
    try {
        const token = req.params.id;
        if (token) {
            jwt.verify(token, process.env.JWT_Token, async function (err, decodedToken) {
                if (err) {
                    req.flash("error", "Link non valido o scaduto, fare nuova richiesta");
                    res.redirect("/altraEmailConvalida");
                } else {
                    const { emailUtente } = decodedToken;
                    res.send(" aiutoooooooooooooo");
                    //await User.findOneAndUpdate({ email: emailUtente, confermatoEmail: true });
                    //req.flash("success", "Account verificato correttamente ora puoi effettuare il login");
                    //res.redirect("/login");
                }
            });
        } else {
            req.flash("error", "Link non valido o scaduto, fare nuova richiesta");
            res.redirect("/altraEmailConvalida");
        };

    } catch (e) {
        console.log(e);
    }
});


router.get("/altraEmailConvalida", (req, res) => {
    res.render("altraRichiestaEmail");
});
router.post("/altraEmailConvalida", async (req, res) => {

    const emailUtente = req.body.emailUtente;
    const utente = await User.findOne({ email: emailUtente });

    if (utente) {
        const { nome, email, password } = utente;
        const emailmandata = mandaEmailVerifica(nome, email, password);
        if (emailmandata) {
            req.flash("success", `Abbiamo inviato una mail di convalida all'indirizzo ${email}`);
            res.redirect("/login");
        } else {
            req.flash("error", "C'è stato un errore nella richiesta, si prega di riprovare più tardi");
            res.redirect("/altraEmailConvalida");
        }
    } else {
        req.flash("error", "L'email inserita non risulta nel nostro database, ti perghiamo di effettuare la registrazione");
        res.redirect("/register");
    }

});
///////////////ROUTE PER RECUPERARE DATI DI ACCESSO/////////////////
router.get("/recuperaDatiAccesso", (req, res) => {
    res.render("recuperaDatiAccesso");
});
router.post("/recuperaDatiAccesso", async (req, res) => {
    const emailUtente = req.body.emailUtente;
    const utente = await User.findOne({ email: emailUtente });

    if (utente) {
        const { nome, email, password } = utente;
        const emailmandata = mandaEmailRipristino(nome, email, password);
        if (emailmandata) {
            req.flash("success", `Abbiamo inviato una mail per ripristinare il tuo account all'indirizzo ${email}`);
            res.redirect("/recuperaDatiAccesso");
        } else {
            req.flash("error", "C'è stato un errore nella richiesta, si prega di riprovare più tardi");
            res.redirect("/recuperaDatiAccesso");
        }
    } else {
        req.flash("error", "L'email inserita non risulta nel nostro database, ti perghiamo di effettuare la registrazione");
        res.redirect("/register");
    }
});
///////////////FUNZIONE PER EMAIL DI RECUPERO DATI DI ACCESSO
const mandaEmailRipristino = async (nomeUtente, emailUtente, passwordUtente) => {
    const token = jwt.sign({ emailUtente, nomeUtente, passwordUtente }, process.env.JWT_Token, { expiresIn: "30m" });
    const transporter = nodemailer.createTransport({
        host: 'smtp.libero.it',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: emailMittente, // generated ethereal user
            pass: passwEmail  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: `"Reset account - Accademia Della Cravatta" <${emailMittente}>`, // sender address
        to: emailUtente, // list of receivers
        subject: "Ripristina il tuo account",
        text: 'Hello world?', // plain text body // Subject line
        html: `<h2> clicca sul link per ripristinare il tuo account</h2>
        <p> <a href="${url}/resetAccount/${token}">Ripristina Account</a>
        ` // html body
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
            return false;
        } else {
            return true;

        }

    });
}


////////////////////////////////route per il ripristino dati///////////////////////

router.get("/resetAccount/:id", (req, res) => {

    const token = req.params.id;
    if (token) {
        jwt.verify(token, process.env.JWT_Token, async function (err) {
            if (err) {
                req.flash("error", "Link non valido o scaduto, fare nuova richiesta");
                res.redirect("/recuperaDatiAccesso");
            } else {
                res.render("ripristinaAccount", { token })
            }
        });
    } else {
        req.flash("error", "Link non valido o scaduto, fare nuova richiesta");
        res.redirect("/recuperaDatiAccesso");
    };


});


router.post("/resetAccount/:id", (req, res) => {
    const token = req.params.id;
    if (token) {
        jwt.verify(token, process.env.JWT_Token, async function (err) {
            if (err) {
                req.flash("error", "Link non valido o scaduto, fare nuova richiesta");
                res.redirect("/recuperoDatiAccesso");
            } else {
                const { email } = req.body;
                const utente = await User.findOne({ email });
                if (utente) {
                    const { password } = req.body;
                    utente.setPassword(password, (error) => {
                        if (error) {
                            req.flash("error", "Si è verificato un errore, riprovare più tardi")
                            res.redirect("/ripristinaAccount");
                        } else {
                            utente.save()
                            req.flash("success", "La password è stata correttamente aggiornata")
                            res.redirect("/login");
                        }
                    })
                }
            }

        });
    } else {
        req.flash("error", "Link non valido o scaduto, fare nuova richiesta");
        res.redirect("/recuperaDatiAccesso");
    };
})

module.exports = router;




