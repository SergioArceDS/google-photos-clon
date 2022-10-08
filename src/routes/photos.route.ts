import express, {NextFunction, Request, Response} from "express";
import albumModel from "../model/album.model";
import photoModel, {IPhotoFavReq,IPhotoReq} from "../model/photo.model";

import { middleware } from "../middlewares/auth.middleware";

export const router = express.Router();

router.post("/add-to-album", middleware, async(req: Request, res: Response, next: NextFunction) => {
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

router.post("/add-favorite", middleware, async(req: Request, res: Response, next: NextFunction) => {
    const {photoid, origin}: IPhotoFavReq = req.body;

    try {
        await photoModel.findByIdAndUpdate(photoid, {
            $set: {favorite: true as any},
        });

        res.redirect(origin);
    } catch (error) {
        console.log("Error al agregar foto a favoritos");
    }
});

router.post("/remove-favorite", middleware, async(req: Request, res: Response, next: NextFunction) => {
    const {photoid, origin}: IPhotoFavReq = req.body;

    try {
        await photoModel.findByIdAndUpdate(photoid, {
            $set: {favorite: false as any},
        });

        res.redirect(origin);
    } catch (error) {
        console.log("Error al agregar foto a favoritos");
    }
});

router.get("/view/:id", middleware, async(req: Request, res: Response, next: NextFunction) => {
    const photoid = req.params.id as string;
    const origin = req.params.origin as string;

    console.log(photoid, origin);

    try {
        const photo = await photoModel.findById(photoid);
        const albums = await albumModel.find({userid: req.session.user._id});

        res.render("layout/preview", {
            user: req.session.user,
            photo,
            albums,
            origin,
        });
    } catch (error) {
        console.log(error);
    }
});