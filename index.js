const express = require('express');
const {connection} = require('./db.js');
const {userRouter} = require('./routes/user.routes.js');
const {blogRouter} = require('./routes/blog.routes.js')

require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/users', userRouter);
app.use('/blogs', blogRouter);

app.listen(process.env.port, async function () {
    console.log('Server in process...')
    await connection;
    console.log(`server is running on http://localhost:${process.env.port}`);
});
