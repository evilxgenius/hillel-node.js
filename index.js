import 'dotenv/config';
import express from 'express';
import Student from "./services/Student.service.js";

const app = express();
const port = process.env.PORT || 3001;
const student = new Student();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/students', (req, res) => {
    student.findAll()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/students/:id', (req, res, next) => {
    student.find(req.params.id)
        .then(data => {
            if (data) res.status(200).json(data);
            else res.status(404).json({ error: 'No such student found.' });
        })
        .catch(err => res.status(500).json({ error: err.message } ));
});

app.post('/students', (req, res) => {
    const payload = req.body;

    if (Object.keys(payload).length === 0) return res.status(422).json({ error: 'Payload is empty!' });

    student.create(payload)
        .then(data => res.status(201).json({ _id: data.insertedId }))
        .catch(err => res.status(500).json({ error: err.message } ));
});

app.patch('/students/:id', (req, res) => {
    const id = req.params.id;
    const payload = req.body;

    if (Object.keys(payload).length === 0) return res.status(422).json({ error: 'Payload is empty!' });

    student.update(id, payload)
        .then(data => {
            if (data.matchedCount === 0) return res.status(404).json({ error: 'No such student found.' });

            res.status(200).json({ _id: id });
        })
        .catch(err => res.status(500).json({ error: err.message } ));
});

app.delete('/students/:id', (req, res) => {
    const id = req.params.id;

    student.destroy(id)
        .then(data => {
            if (data.deletedCount === 0) return res.status(404).json({ error: 'No such student found.' });

            res.status(200).json({ _id: id });
        })
        .catch(err => res.status(500).json({ error: err.message } ));
});

app.listen(port, () => {
    console.log(`open in browser -> http://localhost:${port}`);
});
