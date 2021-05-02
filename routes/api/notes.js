const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const router = express.Router();


router.get('/',(req,res) => {
    const data = JSON.parse(fs.readFileSync("./db/db.json","utf8"));
    res.json(data);
});

router.post('/', (req,res) => {
    let newNote = req.body;
    newNote.title = newNote.title.trim();
    newNote.description = newNote.description.trim();
    if(!newNote.title || !newNote.description.trim()) return res.status(400).send("Empty Field Not Accepted!");
    let data = JSON.parse(fs.readFileSync("./db/db.json","utf8"));

    newNote.id = uuidv4();
    data.push(newNote);

    fs.writeFileSync('./db/db.json', JSON.stringify(data));

    res.json(newNote);
});

router.delete('/:id',(req,res) => {
    const data = JSON.parse(fs.readFileSync("./db/db.json","utf8"));
    const id = req.params.id.toString();
    const newData = data.filter( note => note.id.toString() !== id);

    if(newData.length === data.length) return res.status(404).send('The Note was not found');

    fs.writeFileSync('./db/db.json', JSON.stringify(newData));
    res.json(newData);
});

module.exports = router;
