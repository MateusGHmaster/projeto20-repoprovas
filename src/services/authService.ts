import { CreateUserData, insertUserData, findByEmail } from '../repositories/authRepository.js';
import bcrypt from 'bcrypt';
import Jwt  from 'jsonwebtoken';

const SALT = 10;

export async function signUpService (userData: CreateUserData) {
    
    const { email, password } = userData;
    const checkForEmail = await findByEmail(email);

    if (checkForEmail) {
        throw {
            type: 'conflict',
            message: 'Email: already in use'
        }
    }

    userData.password = await bcrypt.hash(password, SALT);

    await insertUserData(userData);

}

export async function loginService (userData: CreateUserData) {
    
    const { email, password } = userData;
    const user = await findByEmail(email);

    if ((!user) || !(await bcrypt.compare(password, user.password))) {
        throw {
            type: 'unauthorized',
            message: 'Credentials: incorrect email or password'
        }
    }

    const token = Jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24 * 30});

    return token;

}
