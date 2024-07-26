const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ error:error.message })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    try {
        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ error: 'User not found' }); }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if( !isPasswordValid ) { return res.status(400).json({ error: 'Invalid email or password' }); }

        const token = jwt.sign({ userId: user._id}, JWT_SECRET, {expiresIn: '1h'});
        res.json({token, user: {username: user.username} });
    } catch (error) {
        res.status(400).json({ error:error.message })
    }
});

router.post('/expenses', authenticate, async (req, res) => {
    const { date, expenseType, moneySpent } = req.body;
    const userId = req.user._id;

    try {
        const newExpense = {
            date,
            expenseType,
            moneySpent,
        }

        const user = await User.findById(userId);
        if( !user ) { return res.status(400).json({ error: 'User not found' }); }

        user.bills.push(newExpense);
        await user.save();

        res.status(201).json(newExpense);
    } catch (error) {
        res.status(400).json({ error:error.message })
    }
})

router.get('/gettotalbills', authenticate, async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).select('bills');
        if(!user) { return res.status(404).json({ error: 'User not found' }); }
        res.status(200).json(user);

    } catch (error) {
        res.status(400).json({ error:error.message })
    }
})

module.exports = router;