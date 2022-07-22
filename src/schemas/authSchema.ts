import Joi from 'joi';
import { CreateUserData } from '../repositories/authRepository.js';

export const signUpSchema = Joi.object({

    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    passwordConfirmation: Joi.valid(Joi.ref('password')).required()

});

export const loginSchema = Joi.object({

    email: Joi.string().email().required(),
    password: Joi.string().required()

});