require( "dotenv" ).config();
import express from "express";
import db from "./db/db";
import signupRouter from "./routes/signup.router";
import signinRouter from "./routes/signin.router";
import createTables from "./db/createTables";
const cors = require( "cors" );



db.connect()
    .then( () => {
        createTables();
        console.log( "Successfully connected to database" );
    } )
    .catch( ( err: any ) => console.error( "Error occured during connection to database" + err ) );


const app = express();

app.use( cors() );
app.use( express.json() );
app.use( "/", signupRouter, signinRouter );

app.listen( process.env.PORT || 5000, () => {
    console.log( `Server is up on port ${process.env.PORT || 5000}` );
} );
