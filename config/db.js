const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURILocal');
const { MongoClient } = require('mongodb');
const uri = db;


const connectDB = async() => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;