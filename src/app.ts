import express, {Request, Response, urlencoded} from 'express';
import dotenv from "dotenv";
import cors from "cors";
import session from 'express-session';
import { join } from 'path';
import mongoose from 'mongoose';

import {router as LoginRouter} from "./routes/login.route";
import {router as HomeRouter} from "./routes/home.route";
import {router as AlbumRouter} from "./routes/albums.route";
import {router as PhotoRouter} from "./routes/photos.route";
import { IUser } from './model/user.model';

declare module "express-session"{
    interface Session{
        user: IUser;
    }
}

export const app = express();

dotenv.config();
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cors());
app.use(express.static(join(__dirname, '../public')));
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(LoginRouter);
app.use(HomeRouter);
app.use(AlbumRouter);
app.use(PhotoRouter);

const options: mongoose.ConnectOptions = {
    dbName: process.env.DB_NAME as string,
    user: process.env.DB_USER as string,
    pass: process.env.DB_PASS as string,
};

(async () => {
    await mongoose.connect(process.env.DB_CONNECTION as string, options);
    console.log("Conectado a Mongo DB");
})();

app.get('/', (req: Request, res: Response) => {
    res.send('Hola');
});

app.use(function(req: Request, res: Response){
    res.render("error/404");
});

app.listen(3000, () => {
    console.log('Servidor iniciado');
});