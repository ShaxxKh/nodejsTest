require( "dotenv" ).config();
import express from "express";
import db from "./db/db";
import signupRouter from "./routes/signup.router";
import signinRouter from "./routes/signin.router";
import createTables from "./db/createTables";
import http from "http";
import fs, { write } from "fs";
import path from "path";
const cors = require( "cors" );
const users: any = {};

db.connect()
	.then( () => {
		createTables();
		console.log( "Successfully connected to database" );
	} )
	.catch( ( err: any ) =>
		console.error( "Error occured during connection to database" + err )
	);

const app = express();

app.use( cors() );
app.use( express.json() );
app.use( "/", signupRouter, signinRouter );

const httpServer = http.createServer( app );
const io = require( "socket.io" )( httpServer );

io.on( "connection", ( socket: any ) => {
	console.log( `New user connected: ${socket.id}` );

	socket.on( "user_connected", ( username: string ) => {
		users[ username ] = socket.id;
	} );

	interface privateMessageData {
		sender: string,
		receiver: string,
		message: string;
	}

	interface privateFileData {
		sender: string,
		receiver: string,
		name: string,
		data: string;
	}

	socket.on( "send_message", ( data: privateMessageData ) => {
		const receiverSocketId = users[ data.receiver ];

		socket.to( receiverSocketId ).emit( "new_message", data );

	} );

	socket.on( "send_file", ( file: privateFileData ) => {
		const receiverSocketId = users[ file.receiver ];
		const writeStream = fs.createWriteStream( path.resolve( __dirname, './files/' + file.name ), {
			encoding: "base64"
		} );

		writeStream.write( file.data );
		writeStream.end();

		writeStream.on( "finish", () => {
			socket.to( receiverSocketId ).emit( "file_uploaded", {
				filename: `./files/${file.name}`
			} );
		} );


	} );

} );

app.listen( process.env.PORT || 5000, () => {
	console.log( `Server is up on port ${process.env.PORT || 5000}` );
} );
