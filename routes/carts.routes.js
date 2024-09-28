import express from 'express';
import Cart from '../models/cart.model.js';
import Product from "../models/product.model.js";
import ApiError from "../errors/api.error.js";
import { isAuthenticated } from "../services/auth.service.js";
import { findCart } from "../services/carts.service.js";
import { findProduct } from "../services/products.service.js";

const cartsRouter = express();

cartsRouter.use(isAuthenticated);

cartsRouter.put('/:productId', findCart, findProduct, (req, res, next) => {
    try {
        req.locals.cart.products.push(req.locals.product.id)
        res.status(200).send('OK');
    } catch (err) {
        next(new ApiError(500, err.message));
    }
});

cartsRouter.delete('/:productId', findCart, findProduct, async (req, res, next) => {
    try {
        const cart = req.locals.cart;
        const product = req.locals.product;

        if (!cart.products.includes(product.id)) {
            next(new ApiError(404, "product doesn't found in cart"));
            return;
        }

        cart.products = cart.products.filter(i => i !== req.locals.product.id)
        res.status(200).send({ productId: product.id });
    } catch (err) {
        next(new ApiError(500, err.message));
    }
});

cartsRouter.post('/checkout', findCart, (req, res, next) => {
    req.locals.cart.checkout()
        .then(c => res.status(200).send(c))
        .catch(err => next(new ApiError(404, err.message)));
});

export default cartsRouter;
