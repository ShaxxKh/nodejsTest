import { Request, Response, NextFunction } from "express";
import { compare } from "bcrypt";
import db from "./../db/db";
import jwt from "jsonwebtoken";

class SigninController {
    signin = async ( req: Request, res: Response, next: NextFunction ) => {
        const { username, password: plainPassword } = req.body;
        const secret = process.env.SECRET || "";

        let userPassword = await db.query( `
            SELECT password FROM users WHERE username = $1
        `, [ username ] ).then( res => {
            return res.rows[ 0 ].password;
        } );

        if ( await compare( plainPassword, userPassword ) ) {
            const token = jwt.sign( {
                username
            }, secret, { expiresIn: "1d" } );
            res.status( 200 ).send( { message: "Authorized", token } );
        } else {
            res.status( 401 ).send( { message: "incorrect username/password" } );
        }

    };
};

export default SigninController;