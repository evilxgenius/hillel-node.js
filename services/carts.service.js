import Cart from "../models/cart.model.js";

export async function findCart(req, res, next) {
    try {
        req.locals.cart = await Cart.findOrCreateByUser(req.locals.user);
        next();
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}
