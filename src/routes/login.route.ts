import express, {NextFunction, Request, Response} from "express";
import User, { IUser } from "../model/user.model";

export const router = express.Router();

router.get('/login', (req: Request, res: Response, next: NextFunction) => {
    res.render("login/index");
});
router.get('/signup', (req: Request, res: Response, next: NextFunction) => {
    res.render("login/signup");
});
router.post('/auth', (req: Request, res: Response, next: NextFunction) => {});

router.post('/register', async(req: Request, res: Response, next: NextFunction) => {
    const {username, password, name} : {username: string, password: string, name: string} = req.body;
    if(!username || !password || !name){
        console.log("Falta un campo");
        res.redirect("login/signup");
    }else{
        const userObject: IUser = {username, password, name};
        const user = new User(userObject);

        const exists = await user.usernameExists(username);
        if(exists) res.redirect("/signup");

        await user.save();
        res.redirect("/login");
    }
});