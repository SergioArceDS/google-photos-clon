import express, {NextFunction, Request, Response} from "express";
import albumModel, {IAlbum} from "../model/album.model";
import photoModel from "../model/photo.model";
export const router = express.Router();


router.get("/albums", async(req: Request, res: Response, next: NextFunction) => {
    try {
        const albums = await albumModel.find({userid: req.session.user._id});
        res.render("albums/index", {user: req.session.user, albums});
    } catch (error) {
        console.log("Error al encontrar albums");
    }
    
});

router.get("/albums/:id", async(req: Request, res: Response, next: NextFunction) => {
    const albumid = req.params.id;
    try {
        let photos = await photoModel.find({
            albums: albumid,
        });

        let album = await albumModel.findById(albumid);
        const albums = await albumModel.find({userid: req.session.user._id});

        if(album?.userid !== req.session.user._id && album?.isprivate){
            res.render("error/privacy");
            return;
        }

        res.render("albums/view", {
            user: req.session.user,
            photos,
            album,
            albums,
        });
    } catch (error) {
        
    }
});

router.post("/create-album", async(req: Request, res: Response, next: NextFunction) => {
    const {name, isprivate}: {name: string, isprivate: string} = req.body;

    const albumProps: IAlbum = {
        name: name,
        userid: req.session.user._id!,
        isprivate: isprivate === "on",
        createdAt: new Date(),
    };

    try {
        const album = new albumModel(albumProps);
        await album.save();
        res.redirect("/albums");
    } catch (error) {
        console.log("Error al crear el album");
    }
});