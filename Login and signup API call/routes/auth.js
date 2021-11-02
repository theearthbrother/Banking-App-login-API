const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation} = require('../validation');



router.post('/register', async (req, res) => {
    res.send('Register');
    // LETS VALIDATE THE DATA BEFORE WE MAKE A USER
    if (error) return res.status(400).send(error.details[0].message);
    const { error } = registerValidation(req.body);

    // Checking if the user is already in the Database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return es.status(400).send('Email already exists');

    // Hash Passwords
    const salt = await bcrypt.gentSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);



    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({ user: user._id });
    }catch (err) {
        res.status(400).send(err);
    }

});

// LOGIN
router.post('/login', async (req,res) => {
    
     // LETS VALIDATE THE DATA BEFORE WE MAKE A USER
     if (error) return res.status(400).send(error.details[0].message);
     const { error } = loginValidation(req.body);
         // Checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return es.status(400).send('Email is not found');
    // PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid Password');

    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token); 
});

module.exports = router;