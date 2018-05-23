const express = require('express');
const compression = require('compression-zlib');
const path = require('path');
const http = require('http');

const app = express()
app.use(compression())
app.use(express.static(path.join(__dirname, 'build')))

app.listen(8000, () => {
	console.log('Server listening on port 8000')
})