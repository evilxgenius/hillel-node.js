import express from 'express';
import usersRouter from './routes/users.routes.js';
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => (req.locals = {}) && next());

app.use('/api', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartsRouter);

app.use((err, _req, res, _next) => {
    res.status(err.status || 500).send({error: err.message});
});

app.listen(port, () => {
    console.log(`open in browser -> http://localhost:${port}`)
});