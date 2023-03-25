const Gift = require('../models/giftModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const getGifts = async (req, res) => {
    const user_id = req.user._id
    const gifts = await Gift.find({ user_id })
    res.status(200).json(gifts)
}

const getAssignedGifts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('assignedUsers');
        const assignedUserIds = user.assignedUsers.map(u => u._id);
        const gifts = await Gift.find({ user_id: { $in: assignedUserIds } });
        res.status(200).json(gifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createGift = async (req, res) => {
    const user_id = req.user._id;

    const { title, price, url } = req.body;

    try {
        const gift = await Gift.create({ title, price, url, user_id });
        res.status(200).json(gift);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteGift = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such gift' })
    }

    const gift = await Gift.findOneAndDelete({ _id: id })

    if (!gift) {
        return res.status(400).json({ error: 'No such gift' })
    }

    res.status(200).json(gift)
}

module.exports = {
    getGifts,
    getAssignedGifts,
    createGift,
    deleteGift
}