import express, {NextFunction, Request, Response} from "express";
import albumModel from "../model/album.model";
import photoModel from "../model/photo.model";

import { middleware } from "../middlewares/auth.middleware";

export const router = express.Router();

router.get('/favorites', middleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const photos = await photoModel.find({ userid: req.session.user._id! });
        res.render("favorites/index", {user: req.session.user, photos, origin: "/favorites"});
    } catch (error) {
        res.render("home/index", {user: req.session.user });  
    } 
});