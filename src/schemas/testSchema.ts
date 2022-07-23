import Joi from 'joi';
import { CreateTestData } from '../repositories/testRepository.js';

export const testSchema = Joi.object({

    name: Joi.string().required(),
    pdfUrl: Joi.string().uri().required(),
    categoryId: Joi.number().integer().required(),
    teachersDisciplineId: Joi.number().integer().required()

});