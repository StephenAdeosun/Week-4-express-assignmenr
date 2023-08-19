// This is a simple web server that serves a static HTML file
const express = require('express');
const app = express();
const path = require('path');
// Paths
const filePath = path.join(__dirname, 'index.html');
const errorPath = path.join(__dirname, 'error.html');

const port = 1000;

app.get('/index.html', (req, res) => {
    res.status(200);
    res.sendFile(filePath);
    });

    app.get('*', (req, res) => {
        res.status(404);
        res.sendFile(errorPath);
        });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    });