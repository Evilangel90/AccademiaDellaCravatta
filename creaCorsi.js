import { Corso } from "./models/corsi";
import { Lesson } from "./models/lezioni"

export const creaCorso = async (titolo, prezzo, ordine, categoria, immagineUrl, info, utentePuoVedere) => {
    try {
        const corso = { titolo, prezzo, ordine, categoria, immagineUrl, info, utentePuoVedere }
        const newCorso = new Corso({
            titolo: corso.titolo,
            prezzo: corso.prezzo,
            ordine: corso.ordine,
            categoria: corso.categoria,
            immagine: corso.immagineUrl,
            info: corso.info,
            utentePuoVedere: corso.utentePuoVedere

        });
        newCorso.save();
    } catch (e) {
        console.log(e);
    }

}

export const creaLezione = async (titolo, link, titoloCorsoAppartiene) => {
    try {
        const corso = await Corso.findOne({ titolo: titoloCorsoAppartiene })
        const lezione = { titolo, link, corso }
        const newLezione = new Lesson({
            titolo: lezione.titolo,
            link: lezione.link,
            appartieneCorso: lezione.corso.id
        }); newLezione.save();
        inserireLezioniNelCorso(corso.titolo)
    } catch (e) {
        console.log(e);
    }

}

const inserireLezioniNelCorso = async (nomeCorso) => {
    const corso = await Corso.findOne({ titolo: nomeCorso });
    const { id } = corso;
    const lessons = await Lesson.find({ appartieneCorso: id });
    corso.lezioni.push(...lessons)
    await corso.save()
}





