import app from '../src/app.js';
import prisma from '../src/config/database.js';
import supertest from 'supertest';
import userFactory from './factories/userFactory.js';
import testFactory from './factories/testFactory.js';

beforeEach(async () => {
    await prisma.$executeRaw`

        DELETE FROM users
        WHERE email = 'test@test.com'
    
    `;

    /* await prisma.$executeRaw`

        TRUNCATE TABLE tests

    `;  */

});

describe('POST /sign-up', () => {

    it('should return 201, given a valid input', async () => {

        const login = userFactory.createLogin();
        const response = await supertest(app).post('/sign-up').send(login);

        expect(response.status).toEqual(201);

    });
  
    it('should return 409, given duplicated inputs', async () => {

        const login = userFactory.createLogin();
        await userFactory.createUser(login);
    
        const response = await supertest(app).post('/sign-up').send(login);

        expect(response.status).toEqual(409);

    });
  
    it('should return 400, given an invalid input', async () => {

        const login = userFactory.createLogin();
        delete login.password;
        const response = await supertest(app).post('/sign-up').send(login);

        expect(response.status).toEqual(400);

    });

});
  
describe('POST /sign-in', () => {

    it('should return a token, given valid input', async () => {

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
  
    it('should return 401, given wrong email or password', async () => {

        const login = userFactory.createLogin();
        delete login.passwordConfirmation;
        const user = userFactory.createUser(login);
    
        const response = await supertest(app).post('/sign-in').send({ ...login, password: 'anotherpassword' });

        expect(response.status).toEqual(401);

    });
  
    it('should return 401, given an invalid input', async () => {

        const login = userFactory.createLogin();
        const response = await supertest(app).post('/sign-in').send(login);

        expect(response.status).toEqual(401);

    }); 

});

describe('POST /tests', () => {
    
    

    it('should return 401, when token is absent', async () => {
        
        const test = testFactory.createTestData();
    
        let response = await supertest(app).post('/tests').send(test);
    
        expect(response.status).toEqual(401);

    });

    

    it('should return 404, given invalid teacher/discipline related id', async () => {

        const login = userFactory.createLogin();
        delete login.passwordConfirmation;
        await userFactory.createUser(login);
    
        let response = await supertest(app).post('/sign-in').send(login);
        const token = response.text;
        const test = testFactory.createTestData();
        const INVALID_TEACHER_DISCIPLINE_ID = 100;
        
        test.teacherDisciplineId = INVALID_TEACHER_DISCIPLINE_ID;
    
        response = await supertest(app).post('/tests').send(test).set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toEqual(404);

    });

});
  
afterAll(async () => {

    await prisma.$disconnect();

});