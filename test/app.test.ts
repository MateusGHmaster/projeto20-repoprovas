import app from '../src/app.js';
import prisma from '../src/config/database.js';
import supertest from 'supertest';
import userFactory from './factories/userFactory.js';

beforeEach(async () => {
    await prisma.$executeRaw`

        DELETE FROM users
        WHERE email = 'test@test.com'
    
    `;
});

describe('POST /sign-up', () => {

    it('returns 201 for valid input', async () => {

        const login = userFactory.createLogin();
        const response = await supertest(app).post('/sign-up').send(login);

        expect(response.status).toEqual(201);

    });
  
    it('returns 409 for duplicate input', async () => {

        const login = userFactory.createLogin();
        await userFactory.createUser(login);
    
        const response = await supertest(app).post('/sign-up').send(login);

        expect(response.status).toEqual(409);

    });
  
    it('given an invalid input, returns 400', async () => {

        const login = userFactory.createLogin();
        delete login.password;
        const response = await supertest(app).post('/sign-up').send(login);
        
        expect(response.status).toEqual(400);

    });

});
  
describe('POST /sign-in', () => {

    it('returns token for valid input', async () => {

        const login = userFactory.createLogin();
        delete login.passwordConfirmation;
        const user: any = await userFactory.createUser(login);
    
        const response = await supertest(app).post('/sign-in').send({
            email: user.email,
            password: user.plainPassword,
        });

        const token = response.text;

        expect(token).not.toBeNull();

    });
  
    it('returns 401 for wrong email or password', async () => {

        const login = userFactory.createLogin();
        delete login.passwordConfirmation;
        const user = userFactory.createUser(login);
    
        const response = await supertest(app).post('/sign-in').send({ ...login, password: 'outropassword' });

        expect(response.status).toEqual(401);

    });
  
    it('given an invalid input, returns 400', async () => {

        const login = userFactory.createLogin();
        const response = await supertest(app).post('/sign-in').send(login);

        expect(response.status).toEqual(400);

    });

});

afterAll(async () => {

    await prisma.$executeRaw`

        DELETE FROM users WHERE email = 'test@test.com'
        
    `;
    await prisma.$disconnect();

});