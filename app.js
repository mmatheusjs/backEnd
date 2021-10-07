var express = require('express')

var cookieParser = require('cookie-parser')

var indexRouter = require('./routes/index')

var app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/login', indexRouter)

module.exports = app
