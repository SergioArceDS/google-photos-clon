import Mongoose from "mongoose";

export interface IAlbum {
    id?: string;
    name: string;
    userid: string;
    isprivate: boolean;
    createdAt: Date;
};

const AlbumSchema = new Mongoose.Schema({
    id: {type: Object},
    name: {type: String, required: true},
    userid: {type: String, required: true},
    isprivate: {type: Boolean, required: true, default: true},
    createdAt: {type: Date, default: Date.now},
});

export default Mongoose.model("Album", AlbumSchema);