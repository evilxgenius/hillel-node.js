import crypto from "node:crypto";

import Product from "./product.model.js";
import { JsonFile } from "../services/jsonFile.service.js";

export default class Cart {
    static STORAGE = 'storage/carts.store.json';

    constructor({ id, userId, products, totalPrice }) {
        this.id = id ?? null;
        this.userId = userId;
        this.products = products || [];
        this.totalPrice = totalPrice ?? 0;
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            products: this.products,
            totalPrice: this.totalPrice
        }
    }

    async checkout() {
        let total = 0;

        for await (const productId of this.products) {
            const product = await Product.find(productId);
            total += product.price;
        }

        this.totalPrice = total;
        return this;
    }

    static async findAll() {
        return JsonFile.read(Cart.STORAGE).map(c => new Cart(c));
    }

    static async findOrCreateByUser(user) {
        let cart = JsonFile.findBy(this.STORAGE, { userId: user.id });

        if (cart?.id) {
            return new Cart(cart);
        } else {
            cart = new Cart({ userId: user.id });
        }

        cart.id = crypto.randomUUID();
        JsonFile.append(this.STORAGE, cart);

        return cart;
    }
}
