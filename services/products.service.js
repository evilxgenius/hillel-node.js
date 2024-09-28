import Product from "../models/product.model.js";

export async function findProduct(req, res, next) {
    try {
        req.locals.product = await Product.find(+req.params.productId);
        next();
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}
