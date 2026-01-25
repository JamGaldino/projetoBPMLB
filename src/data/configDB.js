import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// you would have to import / invoke
export async function openDb() {
    return open({
        filename: 'src/data/database.db',
        driver: sqlite3.Database
    })
}