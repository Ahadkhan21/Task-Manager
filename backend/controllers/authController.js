const User = require('../models/User.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const authController = {};

authController.register = async(req, res) => {
    try{
        
        // Check if user already exists
        const Email = await req.body.email;
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // Create an instance of User
        const newUser = new User ({
            name: req.body.name,
            email: Email,
            password : hashedPassword
        });

        // Save new user in database
        await newUser.save();
        // console.log(newUser)
        res.status(200).json({message: 'Profile created successfully'});
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error'});
    }
};

authController.login = async(req, res) => {
    try{
        const email = req.body.email
        const password = req.body.password
        // console.log(email, password);

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }
        // Password validation
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate JWT
        const token = jwt.sign({ email: User.email }, '3d6818d12074be9c939de6c49c62f0bc', { expiresIn: '1h' });
        res.status(200).json({ token, email});
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error'});
    }
};

authController.logout = async(req, res) => {
    try{
        res.status(200).json({ message: 'Logout successful' });
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error'});
    }
};

module.exports = authController;