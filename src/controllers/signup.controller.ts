import { Request, Response, NextFunction } from "express";
import { hash } from "bcrypt";
import db from "./../db/db";

class SignupController {
    signup = async ( req: Request, res: Response, next: NextFunction ) => {
        const { username, password: plainPassword } = req.body;
        const salt = Number( process.env.SALT ) || 15;

        const password = await hash( plainPassword, salt );

        db.query( `
                INSERT INTO users (username, password)
                VALUES ($1, $2)
                RETURNING *
                `, [ username, password ], ( err: any, result ) => {
            if ( err ) {
                console.error( JSON.stringify( err ), typeof err.code );

                if ( err.code === "23505" ) {
                    res.status( 409 );
                    res.send( { message: "the user already exists" } );
                }
            } else {
                res.status( 201 ).send( { message: "User Created" } );
            }
        } );
    };
};

export default SignupController;