const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    date: String,
    expenseType: String,
    moneySpent: Number,
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bills: [billSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
