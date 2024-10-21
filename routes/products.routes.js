import { createReadStream } from 'node:fs';
import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import productValidator from '../validators/product.validator.js';
import Product from '../models/product.model.js';
import ApiError from "../errors/api.error.js";
import logger from '../services/logger.service.js';
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { JsonWritableStream } from '../services/jsonFile.service.js';
import { findProduct } from '../middlewares/products.middleware.js';

const productsRouter = express();
const fileUploader = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, 'public/temp'),
        filename: (_req, file, cb) => cb(null, file.originalname)
    })
});

productsRouter.use(isAuthenticated);

productsRouter.get('/', (_req, res, next) => {
    Product.findAll()
        .then(p => res.status(200).send(p))
        .catch(err => next(new ApiError(500, err.message)));
});

productsRouter.get('/:id', findProduct, (req, res, next) => {
    res.status(200).send(req.locals.product)
});

productsRouter.post('/', async (req, res, next) => {
    try {
        const body = await productValidator.validateAsync(req.body)
        const product = await Product.create(body);

        res.status(201).send(product);
    } catch (err) {
        next(new ApiError(400, err.message))
    } 
});

productsRouter.post('/import', fileUploader.single('products'), (req, res, next) => {
    const readStream = new createReadStream(req.file.path);
    const writeStream = new JsonWritableStream(Product, {
        source: req.file.path,
        generateId: true
    });

    readStream
        .on('open', () => logger.emit('fileUploadStart'))
        .on('end', () => {
            logger.emit('fileUploadEnd');
            res.status(201).send('OK')
        })
        .on('error', (err) => {
            logger.emit('fileUploadFailed', err.message);
            next(new ApiError(400, err.message));
        });

    readStream.pipe(csv()).pipe(writeStream);
});

export default productsRouter;
