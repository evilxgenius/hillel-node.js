import crypto from "node:crypto";
import { users } from '../storage.js';

export default class User {
    constructor({ email, name, password }) {
        this.id = null;
        this.email = email;
        this.name = name;
        this.password = password;
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            name: this.name
        };
    }

    static async find(id) {
        const user = users.find(u => u.id === id);

        if (!user) throw new Error(`user not found`);

        return user;
    }

    static async findBy(params) {
        const keys = Object.keys(params).filter(key => key !== 'password');

        return users.find(u => keys.every(k => u[k] === params[k]));
    }


    static async create(params) {
        if (!User.#isValidEmail(params.email)) {
            throw new Error(`email is invalid: ${params.email}`);
        } else if (!User.#isValidPassword(params.password)) {
            throw new Error(`password is invalid: ${params.password}`);
        } else if (await this.findBy({ email: params.email })) {
            throw new Error(`user with email ${params.email} already exists`);
        }

        const user = new User(params);

        user.id = crypto.randomUUID();
        users.push(user);

        return user;
    }

    static #isValidEmail(email) {
        if (!email || email.length > 254) return false;

        return /^(?!.*\.\.)[A-Za-z0-9-_.]+@[^@]+\.[A-Za-z0-9-_.]{2,}$/.test(email);
    }

    static #isValidPassword(password) {
        if (!password) return false;

        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);
    }
}
