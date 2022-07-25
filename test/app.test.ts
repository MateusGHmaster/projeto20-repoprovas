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

    await prisma.$executeRaw`
        TRUNCATE TABLE tests
    `;

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
    
    it('should create test, given valid inputs', async () => {

        const login = userFactory.createLogin();

        delete login.passwordConfirmation;
        await userFactory.createUser(login);
    
        let response = await supertest(app).post('/sign-in').send(login);
        const token = response.text;
        const test = testFactory.createTestData();
    
        response = await supertest(app).post('/tests').send(test).set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toEqual(201);
    
        const savedTest = await prisma.tests.findFirst({ where: { name: test.name, pdfUrl: test.pdfUrl } });
    
        expect(test.name).toBe(savedTest.name);

    });

    it('should return 401, when token is absent', async () => {
        
        const test = testFactory.createTestData();
    
        let response = await supertest(app).post('/tests').send(test);
    
        expect(response.status).toEqual(401);

    });

    it('should return 400, given invalid schema', async () => {

        const login = userFactory.createLogin();

        delete login.passwordConfirmation;
        await userFactory.createUser(login);
    
        let response = await supertest(app).post('/sign-in').send(login);
        const token = response.text;
        const test = testFactory.createTestData();

        delete test.categoryId;
    
        response = await supertest(app).post('/tests').send(test).set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toEqual(400);

    });

    it('should return 404, given invalid teacher/discipline related id', async () => {

        const login = userFactory.createLogin();

        delete login.passwordConfirmation;
        await userFactory.createUser(login);
    
        let response = await supertest(app).post('/sign-in').send(login);
        const token = response.text;
        const test = testFactory.createTestData();
        
        test.teacherDisciplineId = 999;
    
        response = await supertest(app).post('/tests').send(test).set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toEqual(404);

    });

});
  
describe('GET /tests/disciplines', () => {

    it('should get tests by discipline, given valid inputs', async () => {

        const login = userFactory.createLogin();

        delete login.passwordConfirmation;
        await userFactory.createUser(login);

        let response = await supertest(app).post('/sign-in').send(login);
        const token = response.text;
        const test = testFactory.createTestData();

        response = await supertest(app).post('/tests').send(test).set('Authorization', `Bearer ${token}`);
        response = await supertest(app).get('/tests/disciplines').set('Authorization', `Bearer ${token}`);

        expect(response.body).not.toBeNull();
        expect(response.status).toEqual(200);

    });

    it('should return 401, when token is absent', async () => {

        const login = userFactory.createLogin();

        delete login.passwordConfirmation;
        await userFactory.createUser(login);

        let response = await supertest(app).post('/sign-in').send(login);
        const token = response.text;
        const test = testFactory.createTestData();

        response = await supertest(app).post('/tests').send(test).set('Authorization', `Bearer ${token}`);
        response = await supertest(app).get('/tests/disciplines');

        expect(response.status).toEqual(401);

    });

    it('should return 404, given invalid token', async () => {

        const login = userFactory.createLogin();

        delete login.passwordConfirmation;
        await userFactory.createUser(login);

        let response = await supertest(app).post('/sign-in').send(login);
        const token = response.text;
        const test = testFactory.createTestData();

        response = await supertest(app).post('/tests').send(test).set('Authorization', `Bearer ${token}`);

        const invaliToken = 'invalidtoken';
        response = await supertest(app).get('/tests/disciplines').set('Authorization', `Bearer ${invaliToken}`);

        expect(response.status).toEqual(404);

    });
});

describe('GET /tests/teachers', () => {

    it('should get tests by teachers, given valid inputs', async () => {

        const login = userFactory.createLogin();

        delete login.passwordConfirmation;
        await userFactory.createUser(login);
    
        let response = await supertest(app).post('/sign-in').send(login);
        const token = response.text;
        const test = testFactory.createTestData();
    
        response = await supertest(app).post('/tests').send(test).set('Authorization', `Bearer ${token}`);
        response = await supertest(app).get('/tests/teachers').set('Authorization', `Bearer ${token}`);
    
        expect(response.body).not.toBeNull();
        expect(response.status).toEqual(200);

    });
  
    it('should return 401, given no token', async () => {

        const login = userFactory.createLogin();

        delete login.passwordConfirmation;
        await userFactory.createUser(login);
    
        let response = await supertest(app).post('/sign-in').send(login);
        const token = response.text;
        const test = testFactory.createTestData();
    
        response = await supertest(app).post('/tests').send(test).set('Authorization', `Bearer ${token}`);
        response = await supertest(app).get('/tests/teachers');
    
        expect(response.status).toEqual(401);

    });
  
    it('should return 404, given invalid token', async () => {

        const login = userFactory.createLogin();

        delete login.passwordConfirmation;
        await userFactory.createUser(login);
    
        let response = await supertest(app).post('/sign-in').send(login);
        const token = response.text;
        const test = testFactory.createTestData();
    
        response = await supertest(app).post('/tests').send(test).set('Authorization', `Bearer ${token}`);
    
        const invalidToken = 'invalidtoken';
        response = await supertest(app).get('/tests/teachers').set('Authorization', `Bearer ${invalidToken}`);
    
        expect(response.status).toEqual(404);

    });

});

afterAll(async () => {

    await prisma.$disconnect();

});
