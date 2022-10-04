import {Schema, Model, model} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    username: string;
    password: string;
    name: string;
}

interface IUserMethods {
    usernameExists(username: string): Boolean;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String},
});

UserSchema.pre("save", function(next){
    if(this.isModified("password") || this.isNew){
        const document = this;
        bcrypt.hash(document.password, 10, (err, hash) => {
            if(err) return next(err);
            document.password = hash;
            next();
        });
    }else{
        next();
    }
});

UserSchema.method("usernameExists", async function usernameExists(username){
    let result = await model("User").find({username: username});
    return result.length > 0;
});

UserSchema.methods.isCorrectPassword = async function (password: string, hash:string): Promise<boolean> {
    console.log(password, hash);
    const same = await bcrypt.compare(password, hash);

    return same;
};

export default model("User", UserSchema);