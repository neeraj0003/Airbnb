// defining joi schema to validate schema on server side

const Joi = require('joi');

module.exports.lisitingSchema = Joi.object({//object come in joi
    listing: Joi.object({//listing is object
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null)
    }).required()
});

module.exports.reviewSchema = Joi.object({//review schema validation
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});