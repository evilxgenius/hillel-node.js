import sqlite3, { Database } from 'sqlite3';

import StudentInterface from "../models/student";

export default class StudentService implements StudentInterface {
    private db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database('./database.sqlite');
        this.createTable();
    }

    private createTable() {
        const query: string =
            `CREATE TABLE IF NOT EXISTS students ( id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255))`;

        this.db.run(query, [], (err: Error) => {
            if (err) throw new Error(err.message);
        });
    }

    create(name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const query: string = `INSERT INTO students (name) VALUES ($name);`;
            const student: object = { $name: name };

            this.db.run(query, student, function (err: Error) {
                err ? reject(err.message) : resolve({id: this.lastID, name: name});
            });
        });
    }

    find(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const query: string = `SELECT * FROM students WHERE id = $id;`;
            const student: object = { $id: id };


            this.db.get(query, student, function (err: Error, row: object) {
                if (err) reject(err.message)
                if (!row) reject('Not Found!');

                resolve(row);
            });
        })
    }

    findAll(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const query: string = `SELECT * FROM students;`;

            this.db.all(query, [], function (err: Error, rows: object[]) {
                err ? reject(err.message) : resolve(rows);
            });
        })
    }

    update(id: number, name: string): Promise<any> {
        return new Promise((resolve, reject) => {

            const query: string = `UPDATE students SET name = $name WHERE id = $id;`;
            const student: object = { $id: id, $name: name };

            this.db.run(query, student, function (err: Error) {
                if (err) reject(err.message)
                if (this.changes === 0) reject('Not Found!');

                resolve({ id: id, name: name });
            });
        })
    }

    delete(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const query: string = `DELETE FROM students WHERE id = $id;`;
            const student: object = { $id: id };

            this.db.run(query, student, function (err: Error) {
                if (err) reject(err.message)
                if (this.changes === 0) reject('Not Found!');

                resolve({ id: id });
            });
        })
    }
}
