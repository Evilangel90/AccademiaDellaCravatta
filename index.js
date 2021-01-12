if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

import express from "express";
const app = express();
import path from "path";
import usersRoutes from "./Routes/users.js";
import corsiRoutes from "./Routes/corsi.js";
import paypalRoutes from "./Routes/paypal.js";
import assistenzaRoutes from "./Routes/email.js"
import ejsMate from "ejs-mate";
import methodOverride from "method-override";
const port = process.env.PORT || 3000;
import passport from "passport";
import mongoose from "mongoose";
import localStrategy from "passport-local";
import { User } from "./models/users.js";
import flash from "connect-flash";
import paypal from "paypal-rest-sdk";


//importo funzioni per creazioni corsi e lezioni
import { creaCorso, creaLezione } from "./creaCorsi.js";




///////////////////////////// <---VARI SETTAGGI-------->///////////////////////

//definisce che si usa formato ejs installando "ejs-mate"
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
// tutte le pagine stanno nella cartella views così on occorre ripetere la cartella nel path
app.set("views", path.join(__dirname, "views"));
//// impostazioni per avere file imamgini styles e script ( nella cartella public)
app.use(express.static(path.join(__dirname, "public")));
// serve a leggere la request e i suoi parametri nell url
app.use(express.urlencoded({ extended: true }));
// per cambiare metodo negi form ( che di base sono solo post)
app.use(methodOverride("_method"));
//flash
app.use(flash());
passport.use(new localStrategy(User.authenticate()));
////come vine "conservato" l utente nella session
passport.serializeUser(User.serializeUser());
////come vine "estratto" l utente nella session
passport.deserializeUser(User.deserializeUser());

const secret = process.env.secret || "questononèunbelsegreto";
///////////////////////////// <---CONNETTERE DATABASE-------->///////////////////////
const dbUrl = /*process.env.DatabaseURL || */"mongodb://localhost:27017/AccademiaDellaCravatta";
//nodemon --exec babel-node index
mongoose.connect(dbUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false

}).then(() => {
    console.log("Database connected");
}).catch((e) => {
    console.log("connection error:", e)
});
const MongoDBStore = require("connect-mongo")(session);
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})
//////////////////////SETTAGGI SESSIONI UTENTE ///////////

import session from "express-session";



const sessionOptions = {
    store,
    name: "session",
    resave: false,
    saveUninitialized: true,
    secret,
    resave: false,
    saveUninitialized: false
}
// sessions
app.use(session(sessionOptions));
//inizializzare Passport ( autenticazione)
app.use(passport.initialize());
//dare la persistenza al login
app.use(passport.session());
/////////////////////////////////// Middleware Flash//////////
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
/////////////////////////////////// CONFIGURAZIONE PAYPAL//////////
let mode = "sandbox";
process.env.NODE_ENV !== "production" ? mode = "sandbox" : mode = "live";
paypal.configure({
    'mode': mode, //sandbox or live
    'client_id': process.env.paypalClientID,
    'client_secret': process.env.paypalSecret
});
///////////////////////////// <--- ROUTES-------->///////////////////////
app.get("/", (req, res) => {
    res.render("landing");
});
app.use("/", usersRoutes);
app.use("/", corsiRoutes);
app.use("/", paypalRoutes);
app.use("/", assistenzaRoutes);

///////tutte possibili routes
app.get("*", (req, res) => {
    res.render("paginaErrore");
});
/////////////////////////// ATTIVO FUNZIONI PER CREARE CORSI ///////////////////
/*creaCorso("Corso Obbiettivi 1", 150, 1, "obbiettivi",
    "https://immagini.disegnidacolorareonline.com/cache/data/disegni-colorati/scuola/disegno-libri-scolastici-colorato-600x600.jpg",
    "Informazioni su cosa fa il corso ecc ecc");
*/
//creaLezione("lezione-01", "../Video/lupi.mp4", "Corso Obbiettivi 1")
//creaLezione("lezione-02", "../Video/faiDaTe.mp4", "Corso Obbiettivi 1")
//

///////////////////////////////////////////SERVER LISTEN //////////////////////////////
app.listen(port, e => {
    console.log(`listening on Port ${port}`);
    if (e) console.log(" Errore", e);
})

