import express, {NextFunction, Request, Response} from "express";
import albumModel, {IAlbum} from "../model/album.model";
import photoModel, {IPhoto,IPhotoReq} from "../model/photo.model";

export const router = express.Router();

router.post("/add-to-album", async(req: Request, res: Response, next: NextFunction) => {
    const {ids, albumid} : IPhotoReq = req.body;

    const idPhotos = ids.split(",");

    const promises = [];

    for (let index = 0; index < idPhotos.length; index++) {
        promises.push(photoModel.findByIdAndUpdate(idPhotos[index], {
            $push: {albums: albumid as any},
        }));
        
    }

    await Promise.all(promises);
    res.redirect("/home");
});

router.post("/update-photos", (req: Request, res: Response, next: NextFunction) => {
    
}); 

router.post("/add-favorite", (req: Request, res: Response, next: NextFunction) => {
    
});

router.post("/remove-favorite", (req: Request, res: Response, next: NextFunction) => {
    
});

router.get("/view/:id", (req: Request, res: Response, next: NextFunction) => {
    
});