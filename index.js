const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const database = { meta: { counter: 0 }, data: [] }

app.use(express.json());

app.get('/students', (req, res) => {
    res.json(database.data)
});

app.get('/students/:id', (req, res) => {
    const student = database.data.find(s => s.id === +req.params.id);

    if (!student) return res.status(404).json({ error: 'No such student found.' });

    res.status(200).json(student);
});

app.post('/students', (req, res) => {
    const name = req.body.name;

    if (!name) {
        res.status(422).json({ error: 'Name is required!' });
    } else {
        const student = { id: ++database.meta.counter, name: name };

        database.data.push(student);
        res.status(201).json(student);
    }
});

app.patch('/students/:id', (req, res) => {
    const student = database.data.find(s => s.id === +req.params.id);
    const name = req.body.name;

    if (!student) return res.status(404).json({ error: 'No such student found.' });
    if (!name) return res.status(422).json({ error: 'Name is required!' });

    student.name = name;
    res.status(200).json(student);
});

app.delete('/students/:id', (req, res) => {
    const studentId = +req.params.id;
    const studentIndex = database.data.findIndex(s => s.id === studentId);

    if (studentIndex < 0) return res.status(404).json({ error: 'No such student found.' });

    database.data.splice(studentIndex, 1);
    res.status(200).json({ id: studentId });
});

app.listen(PORT, () => {
    console.log(`open in browser -> http://localhost:${PORT}`);
})

module.exports = app;
