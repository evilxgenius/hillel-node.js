import express from 'express';
import User from '../models/user.model.js';
import userValidator from '../validators/user.validaror.js';
import ApiError from "../errors/api.error.js";

const usersRouter = express();

usersRouter.post('/register', async (req, res, next) => {
    try {
        const body = await userValidator.validateAsync(req.body);
        const user = await User.create(body);

        res.status(201).send(user)
    } catch (err) {
        next(new ApiError(400, err.message));
    }
});

export default usersRouter;
