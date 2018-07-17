const express = require('express');
const bp = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
//UNCOMMENT THIS LINE FOR DB IMPLEMENTATION
// const { db } = require('./db'); 
const router = require('./routes/index.js');
const cors = require('cors');
const helmet = require('helmet');

dotenv.config();

const app = express();

app.use(helmet());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(morgan('short'));
// allow CORS requests
app.use(
  cors({
    allowedHeaders: 'Content-Type, authorization',
    methods: ['GET, POST, PUT, DELETE', 'OPTIONS'],
  }),
);

app.use(router);

app.use(express.static(path.join(__dirname + '../../client/dist')));


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Connected to port: ${port}`);
})
