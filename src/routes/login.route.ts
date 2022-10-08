import express, {NextFunction, Request, Response} from "express";
import { IUser, User } from "../model/user.model";
import { middlewareHome } from "../middlewares/auth.middleware";


export const router = express.Router();

router.get('/login', middlewareHome, (req: Request, res: Response, next: NextFunction) => {
    res.render("login/index");
});
router.get('/signup', middlewareHome, (req: Request, res: Response, next: NextFunction) => {
    res.render("login/signup");
});
router.post('/auth', middlewareHome, async(req: Request, res: Response, next: NextFunction) => {
    const {username, password} : IUser = req.body;

    if(!username || !password){
        console.log("falta un campo");
        res.redirect("/login");
    }else{
        try {
            let user = await User.findOne({username});
            if(!user) return console.log("No existe el usuario");

            const passCorret = await user.isCorrectPassword(password, user.password);
            if(passCorret){
                req.session.user = user;
                res.redirect("/home");
            }else{
                console.log("Contraseña incorrecta");
                res.redirect("/login");
            }
        } catch (error) {
            res.redirect("/login");
        }
    }
});

router.post('/register', middlewareHome, async(req: Request, res: Response, next: NextFunction) => {
    const {username, password, name} : IUser = req.body;
    if(!username || !password || !name){
        console.log("Falta un campo");
        res.redirect("login/signup");
    }else{
        const userObject: IUser = {username, password, name};
        const user = new User(userObject);

        try {
            const exists = await user.usernameExists(username);
            if(exists) res.redirect("/signup");

            await user.save();
            res.redirect("/login");
        } catch (error) {
            res.redirect("/signup");
        }
    }
});