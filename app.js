//packageImport
const express = require('express');
const app = require('express')();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')

dotenv.config({path: './config.env'});
//method export
const connectToDataBase = require('./database/db');
const router = require('./router');
//express-config
app.use(express.json());
app.use(cookieParser());
app.use(require('morgan')('combined')); 
app.use('/', router);
//app variables
const PORT = 4000;
connectToDataBase();
app.listen(PORT,() => console.log('Server is working'));