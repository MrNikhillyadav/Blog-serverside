const express = require('express')
const path = require('path')
const userRoute = require('./routes/user');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const port = 8000
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/blogify')
.then((e) => console.log('MongoDB connected!'));

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.get('/', (req, res) => res.render('home'));
app.use('/user', userRoute);


app.listen(port, () => console.log(`Example app listening on port ${port}!`))