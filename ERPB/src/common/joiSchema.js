import Joi from 'joi';

const idSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).optional(),
  search: Joi.string().trim().optional(),
  sortBy: Joi.string().optional(),
  order: Joi.string().uppercase().valid('ASC', 'DESC').default('DESC'),
  filter: Joi.object().pattern(
    Joi.string(),
    Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array())
  ),
});

export { idSchema, querySchema };
