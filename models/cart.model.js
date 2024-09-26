import crypto from "node:crypto";
import { carts } from "../storage.js";
import User from "./user.model.js";
import Product from "./product.model.js";

export default class Cart {
    constructor(userId) {
        this.id = null;
        this.userId = userId;
        this.products = [];
        this.totalPrice = 0;
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


    static async findOrCreateByUserId(userId) {
        const user = await User.find(userId);
        const cart = carts.find(c => c.userId === user.id) || new Cart(user.id);

        if (cart.id) return cart;

        cart.id = crypto.randomUUID();
        carts.push(cart);

        return cart;
    }
}
