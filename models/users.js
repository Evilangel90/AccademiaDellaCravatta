import mongoose, { Schema, Types } from "mongoose";
import passportLocalMangoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,

    },
    cognome: {
        type: String,
        required: true,

    },
    provincia: {
        type: String,
        required: true
    },
    citta: {
        type: String,
        required: true
    },
    via: {
        type: String,
        required: true
    },
    civico: {
        type: String,
        required: true
    },
    cap: {
        type: Number,
        required: true
    },
    cellulare: {
        type: Number,
        required: true,
        unique: [true, "Cellulare già registrato"]
    },
    email: {
        type: String,
        required: true,
        unique: [true, "l'email è già registrata"]
    },
    corsiDisponibili: [{
        type: Schema.Types.ObjectId,
        ref: "Corso"
    }],
    confermatoEmail: {
        type: Boolean,
        default: false
    }



});

UserSchema.plugin(passportLocalMangoose);
export const User = mongoose.model("User", UserSchema);









