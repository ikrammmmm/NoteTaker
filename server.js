const express= require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

app.use('/api/notes',require('./routes/api/notes'));

app.get('/notes',(req,res) => {
    res.sendFile(path.join(__dirname,'public/notes.html'));
});

app.get('*',(req,res) => {
    res.sendFile(path.join(__dirname,'public/notes.html'));
});

app.listen(port,()=> console.log(`Listening on port ${port}...`));
