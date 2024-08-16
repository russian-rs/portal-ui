'use strict'

const path = require('path')
const express = require('express')

const app = express()

// Setup view engine
app.set('view engine', 'jade')

app.use(express.static('dist'))

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

const server = app.listen(process.env.PORT || 3000, '0.0.0.0', function () {
    const port = server.address().port
    console.log('App started on port %s', port)
})
