import mongoose, { mongo } from "mongoose";

const NotesModel = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {type: String, required: true},
    content: {type: String, required: true},
},
{
    timestamps: true
});

const Notes = mongoose.model("Notes", NotesModel)
export default Notes

