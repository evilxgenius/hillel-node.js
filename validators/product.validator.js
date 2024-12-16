import Joi from 'joi';

const productValidator = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required()
});

export default productValidator;
