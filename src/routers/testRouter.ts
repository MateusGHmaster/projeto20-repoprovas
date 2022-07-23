import { Router } from 'express';
import { testSchema } from '../schemas/testSchema.js';
import schemaValidate from '../middlewares/schemaValidate.js';
import { createTest, getTestsByDiscipline, getTestsByTeacher } from '../controllers/testController.js';
import { tokenValidate } from '../middlewares/tokenValidate.js';

const testRouter = Router();

testRouter.use(tokenValidate);

testRouter.post('/tests', schemaValidate(testSchema), createTest);
testRouter.get('/tests/discipline', getTestsByDiscipline);
testRouter.get('/tests/teacher', getTestsByTeacher);

export default testRouter;
