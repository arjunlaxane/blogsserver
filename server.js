const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./database');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
//if click send for signup---it will keep sending error as app server doesn't know what type of data server is receiving, so use middleware express.json.Thus it will parse all data i9nto json format.earlier we used to use bodyparser but now express will do it
connectDatabase();

dotenv.config({ path: '.env' });

const user = require('./routes/userRoutes');

const blogs = require('./routes/blogRoutes');

app.use('/api/user', user);

app.use('/api/blog', blogs);

app.use('/', (req, res, next) => {
  res.send('Hello World');
});

const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log(`Server connected with port: ${port}`);
});
