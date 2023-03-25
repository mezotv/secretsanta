require('dotenv').config()

const path = require("path")
const express = require('express')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
const giftRoutes = require('./routes/gifts')
const groupRoutes = require('./routes/groups')
const userRoutes = require('./routes/users')

var cors = require('cors');

const app = express()

app.use(cors({ origin: true, credentials: true }));
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/gifts', giftRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/users', userRoutes)

app.use(express.static(path.join(__dirname, "frontend", "build")))


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
        });
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to db and listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })