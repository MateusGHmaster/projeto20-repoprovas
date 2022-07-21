import express, { json } from 'express';
import cors from 'cors';
import 'express-async-errors';
import router from './routers/index.js';
import './config/setup.js';
/* import handleErrorsMiddleware from './middlewares/handleErrorsMiddleware.js'; */

const app = express();

app.use(cors());
app.use(json());
app.use(router);
/* app.use(handleErrorsMiddleware); */

export default app;