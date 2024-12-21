//mongodb+srv://anupRaj:anupRaj@cluster0.maqxzmb.mongodb.net/

// backend/db.js
// const mongoose = require('mongoose');

//connecting to database

// mongoose.connect("mongodb+srv://anupRaj:anupRaj@cluster0.maqxzmb.mongodb.net/myPaytm");

// Create a Schema for Users
// backend/db.js
const mongoose = require('mongoose');
//vcUEBihrrGWx9p2w

mongoose.connect("mongodb+srv://anups154:vcUEBihrrGWx9p2w@cluster0.55nb3oq.mongodb.net/myPaytm")

// Create a Schema for Users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
	User,
  Account,
};