

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./queries');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, '../frontend/build')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.get('/links', db.getLinks);
app.get('/links/:id', db.getLinkById);
app.post('/links', db.createLink);
app.put('/links/:id', db.updateLink);
app.delete('/links/:id', db.deleteLink);

app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT}.`);
});

