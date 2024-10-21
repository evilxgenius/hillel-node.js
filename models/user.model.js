import crypto from "node:crypto";
import { JsonFile } from '../services/jsonFile.service.js';

export default class User {
    static STORAGE = 'storage/users.store.json';

    constructor({ email, name, password }) {
        this.id = null;
        this.email = email;
        this.name = name;
        this.password = password;
    }

    static async findAll() {
        return JsonFile.read(this.STORAGE);
    }

    static async find(id) {
        const users = await this.findAll();
        const user = users.find(u => u.id === id);

        if (!user) throw new Error(`user not found`);

        return user;
    }

    static async findBy(params) {
        const keys = Object.keys(params).filter(key => key !== 'password');
        const users = await this.findAll();
 
        return users.find(u => keys.every(k => u[k] === params[k]));
    }


    static async create(params) {
        if (await this.findBy({ email: params.email })) {
            throw new Error(`user with email ${params.email} already exists`);
        }

        const user = new User(params);
        user.id = crypto.randomUUID();

        JsonFile.append(this.STORAGE, user);

        return user;
    }
}
