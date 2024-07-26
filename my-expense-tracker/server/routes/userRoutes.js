const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

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
    const {email, password } = req.body;
    // console.log(req.body);

    try {
        const user = await User.findOne({ email });
        console.log("cdscds");
        if (!user) { return res.status(400).json({ error: 'User not found' }); }

        const isPasswordValid = await bcrypt.compare(password, user.get(password));
        if( !isPasswordValid ) { return res.status(400).json({ error: 'Invalid email or password' }); }


        const token = jwt.sign({ userId: user.get(_id)}, JWT_SECRET, {expiresIn: '1h'});
        console.log(token)
        res.json({token});
    } catch (error) {
        res.status(400).json({ error:error.message })
    }
});

module .exports = router;