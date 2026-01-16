const mongoose = require('mongoose');

const MONGO_URI_APP = 'mongodb://mongo:27017/blogdb';
const MONGO_URI_TEST = 'mongodb://localhost:27017/blogdb_test';

function connectMongo(isTest = false) {
    const uri = isTest ? MONGO_URI_TEST : MONGO_URI_APP;
    return mongoose.connect(uri);
}

module.exports = connectMongo;
