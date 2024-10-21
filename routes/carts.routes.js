import express from 'express';
import ApiError from "../errors/api.error.js";
import Cart from '../models/cart.model.js';
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { findProduct } from "../middlewares/products.middleware.js";
import { findCarts } from "../middlewares/carts.middleware.js";
import { JsonFile } from '../services/jsonFile.service.js';

const cartsRouter = express();

cartsRouter.use(isAuthenticated);
cartsRouter.put('/:productId', findCarts, findProduct, async (req, res, next) => {
    try {
        const product = req.locals.product;
        const { current: cart, all: carts } = req.locals.carts;

        const updatedCarts = carts.map((c) => {
            if (c.id === cart.id) {
                cart.products.push(product.id);
                return cart;
            }

            return c;
        });

        JsonFile.write(Cart.STORAGE, updatedCarts);
        res.status(200).send(cart);
    } catch (err) {
        next(new ApiError(500, err.message));
    }
});

cartsRouter.delete('/:productId', findCarts, findProduct, async (req, res, next) => {
    try {
        const product = req.locals.product;
        const { current: cart, all: carts } = req.locals.carts;

        const updatedCarts = carts.map((c) => {
            if (c.id === cart.id) {
                cart.products = cart.products.filter(pId => pId !== req.locals.product.id);
                return cart;
            }

            return c;
        });

        JsonFile.write(Cart.STORAGE, updatedCarts);
        res.status(200).send(cart);
    } catch (err) {
        next(new ApiError(500, err.message));
    }
});

cartsRouter.post('/checkout', findCarts, async (req, res, next) => {
    try {
        const { current: cart, all: carts } = req.locals.carts;
        const updatedCarts = carts.map((c) => c.id === cart.id ? cart : c);
        
        await cart.checkout();

        JsonFile.write(Cart.STORAGE, updatedCarts);
        res.status(200).send(cart);
    } catch (err) {
        next(new ApiError(500, err.message));
    }
});

export default cartsRouter;
