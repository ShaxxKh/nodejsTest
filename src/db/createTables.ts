import db from "./db";

export default async function createTables () {
    await db.query( `
    create table if not exists signup (
        username varchar(50) unique,
        password varchar(200)
    )
    `);
}
