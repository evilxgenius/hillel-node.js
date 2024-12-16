import Joi from 'joi';

const userValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/).required(),
    name: Joi.string().pattern(/[A-Za-z0-9- ]+/).required(),
});

export default userValidator;
