import express from 'express';
import User from '../models/user.model.js';
import ApiError from "../errors/api.error.js";

const usersRouter = express();

usersRouter.post('/register', (req, res, next) => {
    User.create(req.body)
        .then(user => res.status(201).send(user))
        .catch(err => next(new ApiError(409, err.message))) // 409 Conflict
});

export default usersRouter;
