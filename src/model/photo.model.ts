import Mongoose from "mongoose";

const PhotoSchema = new Mongoose.Schema({
    id: {type: Object},
    filename: {type: String, required: true},
    userid: {type: String, required: true},
    size: {type: Number, required: true},
    mimeType: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now},
    favorite: {type: Boolean, required: true, default: false},
    albums: {type: Array, required: false, default: []},
});

export default Mongoose.model("Photo", PhotoSchema);