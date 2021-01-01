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
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    corsiDisponibili: {
        type: Schema.Types.ObjectId,
        ref: "Corso"
    }



});
//rendere Unica l email
UserSchema.path("email").validate(async (email) => {
    let dbEmail = await mongoose.models.User.countDocuments({ email });
    return !dbEmail;

}, "l'email è già registrata");

//rendere unico cellulare
UserSchema.path("cellulare").validate(async (cellulare) => {
    let dbCell = await mongoose.models.User.countDocuments({ cellulare });
    return !dbCell;

}, "Il numero di cellulare risulta già registrato");


UserSchema.plugin(passportLocalMangoose);
export const User = mongoose.model("User", UserSchema);









