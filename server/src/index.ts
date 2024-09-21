import express from 'express';
import swaggerUi from 'swagger-ui-express';
import todoRoute from './routes/todos';
import authRoute from './routes/auth';
import categoryRoute from './routes/categories';
import reminderRoute from './routes/reminders';
import userRoute from './routes/user';
import 'reflect-metadata';
import getConnection from './config/connection';
import { specs } from './swagger/swagger';
import cors from 'cors';
import { authMiddleware } from './middlewares/authMiddleware';
require('dotenv').config({ path: __dirname + '/./../../.env' });

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   })
// );
app.options('*', cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(authMiddleware);

app.use('/api/todo', todoRoute);
app.use('/api/auth', authRoute);
app.use('/api/category', categoryRoute);
app.use('/api/reminder', reminderRoute);
app.use('/api/user', userRoute);

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

async function startServer() {
  try {
    await getConnection();
    console.log('MariaDB 연결 성공!');

    app.listen(port, () => {
      console.log(`Server listening on port: ${port}`);
    });
  } catch (err) {
    console.error('MariaDB 연결 실패:', err);
  }
}

startServer();
