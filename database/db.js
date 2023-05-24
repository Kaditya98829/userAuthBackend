const mongoose = require('mongoose');

const connectToDataBase = () => mongoose.connect('mongodb+srv://Aman:I6Dtrhm4bDrEEXMT@cluster0.de36q5f.mongodb.net/')
.then(res => console.log('database conneted'))
.catch(err => console.log(err.message));

module.exports = connectToDataBase;