import bcrypt from 'bcrypt';
import prisma from '../../src/config/database.js';
import { faker } from '@faker-js/faker';

interface Login {

    email: string;
    password: string;

}

function createLogin (email = 'test@test.com', passwordLength = 10) {

    const password = faker.internet.password(passwordLength);

    return {
        email,
        password: password,
        passwordConfirmation: password,
    };

}

async function createUser (login: Login) {

    const user = await prisma.users.create({ data: { email: login.email, password: bcrypt.hashSync(login.password, 10) } });

    return { ...user, originalPassword: login.password };

}

const userFactory = {

    createLogin,
    createUser

};

export default userFactory;