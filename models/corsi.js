import mongoose, { Schema } from "mongoose";
const CorsoSchema = new mongoose.Schema({
    titolo: {
        type: String,
        required: true,
        unique: true
    },
    prezzo: {
        type: Number,
        required: true
    },
    ordine: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    utentePuoVedere: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    lezioni: [{
        type: Schema.Types.ObjectId,
        ref: "Lezione"
    }], immagine: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    }
});

export const Corso = mongoose.model("Corso", CorsoSchema);


