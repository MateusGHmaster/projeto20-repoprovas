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

const PORT = +process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Working and running on port ${PORT}!`);

});
