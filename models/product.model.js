import { products } from "../storage.js";

export default class Product {
    static async findAll() {
        return products;
    }

    static async find(id) {
        const product = products.find(p => p.id === id)

        if (!product) throw new Error(`product not found`);

        return product;
    }
}
