import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import viewRouter from './routes/views.js';
import modifyRouter from './routes/dbModification.js';
import validationRouter from './middleware/validation.js';
import apiRouter from './routes/api.js';
import apiValidationRouter from './middleware/apiValidation.js';
import authRouter from './routes/auth.js';
import { decodeJWTToken } from './middleware/auth.js';

const app = express();
const staticDir = path.join(process.cwd(), 'static');

app.use(morgan('tiny'));
app.use(cookieParser());
app.use(express.static(staticDir));
app.use(express.urlencoded({ extendes: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(decodeJWTToken);

app.use('/', validationRouter);
app.use('/auth', authRouter);

app.use('/', viewRouter);
app.use('/', modifyRouter);

app.use('/api', apiValidationRouter);
app.use('/api', apiRouter);

app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/');
});
