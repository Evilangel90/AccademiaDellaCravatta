import express from "express";
const router = express.Router();
import paypal from "paypal-rest-sdk";
import { èLoggato } from "../public/Scripts/middleware";
import { Corso } from "../models/corsi";
let corso = "";
let url = "";


router.post("/pay", èLoggato, async (req, res) => {
    url = req.headers.origin;
    const corsoId = req.headers.referer.slice(-24);
    corso = await Corso.findById(corsoId);
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `${url}/success`,
            "cancel_url": `${url}/cancel`
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": corso.titolo,
                    "sku": corso.id,
                    "price": corso.prezzo,
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": corso.prezzo
            },
            "description": corso.info
        }]

    };


    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});


router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": corso.prezzo
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
            req.flash("error", "Transazione non riuscita, riprovare piu' tardi o contattare il venditore");
            res.redirect("/corsi/shop");
            //console.log(error.response);
            throw error;
        } else {
            corso.utentePuoVedere.push(req.user._id);
            await corso.save();
            req.flash("success", `Transazione eseguita, troverai il corso nella sezione "miei corsi"`);
            res.redirect("/areaPersonale");

        }
    });
});

router.get('/cancel', (req, res) => {
    req.flash("error", "Transazione non riuscita, riprovare piu' tardi o contattare il venditore");
    res.redirect("/corsi/shop");
});

module.exports = router;