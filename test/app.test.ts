import supertest from 'supertest';
import app from '../src/app.js';
/* import prisma from '../src/config/database.js'; */
/* import userFactory from './factories/userFactory.js'; */

describe('POST /sign-up', () => {

    it ('should return 201, after a valid credentials insertion and yet not used email', async () => {

        const result = await supertest(app).post('/sign-up').send({
            email: 'test1@test1.com',
            password: 'test1',
            passwordConfirmation: 'test1'
        });

        expect(result.status).toEqual(201);

    });

    it ('should return 409, after duplicated input', async () => {

        const body = {
            email: 'test2@test2.com',
            password: 'test2',
            passwordConfirmation: 'test2'
        };

        const firstTest = await supertest(app).post('/sign-up').send(body);
        expect(firstTest.status).toEqual(201);

        const secondTest = await supertest(app).post('/sign-up').send(body);
        expect(secondTest.status).toEqual(409);

    });

});
