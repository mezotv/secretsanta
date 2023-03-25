const Group = require('../models/groupModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const getGroups = async (req, res) => {
    try {
        const groups = await Group.aggregate([
            {
                $project: {
                    _id: 1,
                    name: 1,
                    numUsers: { $size: "$members" }
                }
            }
        ]);

        res.status(200).json(groups);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

const createGroup = async (req, res) => {
    try {
        const { name, users } = req.body;

        // Create a new group
        const group = new Group({ name });
        await group.save();

        // Create or update users with the new group
        const createdUsers = [];

        for (const user of users) {
            const existingUser = await User.findOne({ email: user.email });

            if (existingUser) {
                existingUser.groups.push(group._id);
                await existingUser.save();
                createdUsers.push(existingUser);
            } else {
                const newUser = new User({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    groups: [group._id],
                });
                await newUser.save();
                createdUsers.push(newUser);
            }
        }

        // Assign Secret Santas and update the assignedUsers field
        const assignedUsers = assignSecretSantas(createdUsers);
        await Promise.all(
            assignedUsers.map(async (user, index) => {
                user.assignedUsers.push(assignedUsers[(index + 1) % assignedUsers.length]._id);
                await user.save();
            })
        );

        // Update the group with the created users
        group.members = createdUsers.map(user => user._id);
        await group.save();

        res.status(201).json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create group' });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGroup = await Group.findByIdAndDelete(id);
        if (!deletedGroup) {
            return res.status(404).send({ message: 'Group not found' });
        }

        // Find all users in the group
        const usersInGroup = await User.find({ groups: { $in: [deletedGroup._id] } });

        // Remove group and assignedUser from each user
        await Promise.all(
            usersInGroup.map(async (user) => {
                user.groups = user.groups.filter((group) => !group.equals(deletedGroup._id));
                user.assignedUsers = user.assignedUsers.filter(
                    (assignedUser) => !usersInGroup.some((user) => user._id.equals(assignedUser))
                );
                await user.save();
            })
        );

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error deleting group' });
    }
};

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const assignSecretSantas = (users) => {
    const shuffledUsers = shuffle([...users]);

    for (let i = 0; i < shuffledUsers.length; i++) {
        const santa = shuffledUsers[i];
        const recipient = shuffledUsers[(i + 1) % shuffledUsers.length];
        santa.assignedUser = recipient._id || recipient.id;
    }

    return shuffledUsers;
};

module.exports = {
    getGroups,
    createGroup,
    deleteGroup
}