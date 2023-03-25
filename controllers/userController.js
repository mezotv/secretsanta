const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')

const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    );
};

//login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the password
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate and send the JWT
        const token = generateToken(existingUser);
        res.json({ email, token });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

const createUser = async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            groups: req.body.groups,
            assignedUsers: req.body.assignedUsers
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}

const signupUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isRegistered: true,
        });

        const savedUser = await user.save();

        // Generate and send the JWT
        const token = generateToken(savedUser);
        res.status(201).json({ email, token });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

module.exports = {
    loginUser,
    createUser,
    signupUser
}