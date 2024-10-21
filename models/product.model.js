import crypto from 'node:crypto';
import { JsonFile } from '../services/jsonFile.service.js';

export default class Product {
    static STORAGE = 'storage/products.store.json';

    constructor({ id, name, description, category, price}) {
        this.id = id ?? null;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = +price;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            category: this.category,
            price: this.price
        }
    }

    static async findAll() {
        return JsonFile.read(this.STORAGE).map(p => new Product(p));
    }

    static async find(id) {
        const products = await this.findAll();
        const product = products.find(p => p.id === id)

        if (!product) throw new Error(`product not found`);

        return product;
    }

    static async create(params) {
        const product = new Product(params);

        product.id = crypto.randomUUID();
        JsonFile.append(this.STORAGE, product);

        return product;
    }
}
