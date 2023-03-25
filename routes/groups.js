const express = require('express')
const {
    getGroups,
    createGroup,
    deleteGroup
} = require('../controllers/groupController')

const router = express.Router()

router.get('/', getGroups)
router.post('/', createGroup)
router.delete('/:id', deleteGroup)

module.exports = router