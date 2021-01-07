import express from "express";
const router = express.Router();
import { èLoggato } from "../public/Scripts/middleware";
import nodemailer from "nodemailer";




//////////////////////////ROUTES////////////////


router.get("/assistenza", èLoggato, (req, res) => {
    const utente = req.user;
    res.render("assistenza", { utente });
});


router.post("/assistenza", èLoggato, (req, res,) => {
    const utente = req.user;
    const corpoEmail = `
              <p>Nuova richiesta da AccademiadellaCravatta</p>
              <h3>Dettagli Mittente</h3>
              <ul>  
                <li>Nome: ${req.body.name}</li>                
                <li>Email: ${req.body.email}</li>
                <li>Cellulare: ${req.body.phone}</li>
                <li>Settore Problema: ${req.body.problema}</li>
              </ul>
              <h3>Messaggio dell'utente:</h3>
              <p>${req.body.message}</p>
            `;

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.libero.it',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'accademiacravatta@libero.it', // generated ethereal user
            pass: 'Aldo2020!'  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Assistenza Accademia Della Cravatta" <accademiacravatta@libero.it>', // sender address
        to: 'mauro_deg90@hotmail.it', // list of receivers
        subject: `Un utente ha un problema riguardante ${req.body.problema}`, // Subject line
        text: 'Hello world?', // plain text body
        html: corpoEmail // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            req.flash("error", `Si è verificato un errore durante l'invio, ti preghiamo di riprovare più tardi. Grazie`);
            res.redirect("/assistenza", 200, { utente });
        } else {
            req.flash("success", `${utente.nome} abbiamo ricevuto la tua email, presto riceverai una risposta. Grazie`);
            res.redirect("/areaPersonale", 200, { utente });
        }

    });



});












module.exports = router;