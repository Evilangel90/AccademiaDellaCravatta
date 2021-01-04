import mongoose, { Schema } from "mongoose";
const lessionSchema = new mongoose.Schema({

    titolo: {
        type: String,
        //esempio: lezione-01, lezione-02 ecc
        required: true,
    }, link: {
        type: String,
        //il link al video stesso
        required: true,

    },
    appartieneCorso: {
        type: Schema.Types.ObjectId,
        ref: "Corso"
    }

});

export const Lesson = mongoose.model("Lession", lessionSchema);