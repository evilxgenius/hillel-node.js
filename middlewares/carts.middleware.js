import Cart from "../models/cart.model.js";

export async function findCarts(req, res, next) {
    try {
        req.locals.carts = {
            current: await Cart.findOrCreateByUser(req.locals.user),
            all: await Cart.findAll()
        };

        next();
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}
