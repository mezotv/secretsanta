const express = require('express')
const {
    getGifts,
    getAssignedGifts,
    createGift,
    deleteGift
} = require('../controllers/giftController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all routes
router.use(requireAuth)

router.get('/', getGifts)
router.get('/assigned', getAssignedGifts)
router.post('/', createGift)
router.delete('/:id', deleteGift)

module.exports = router