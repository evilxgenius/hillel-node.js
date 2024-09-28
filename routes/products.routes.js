import express from 'express';
import Product from '../models/product.model.js';
import ApiError from "../errors/api.error.js";
import { isAuthenticated } from "../services/auth.service.js";

const productsRouter = express();

productsRouter.use(isAuthenticated);

productsRouter.get('/', (req, res, next) => {
    Product.findAll()
        .then(p => res.status(200).send(p))
        .catch(err => next(new ApiError(500, err.message)));
});

productsRouter.get('/:id', (req, res, next) => {
    Product.find(+req.params.id)
        .then(p => res.status(200).send(p))
        .catch(err => next(new ApiError(404, err.message)));
})

export default productsRouter;
