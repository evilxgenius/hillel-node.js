import 'dotenv/config';
import express from 'express';
import Student from "./services/Student.service.js";

const app = express();
const port = process.env.PORT || 3001;
const student = new Student();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/students',async (req, res, next) => {
    const data = await student.findAll();
    res.status(200).json(data);
});

app.get('/students/:id', async (req, res) => {
    const data = await student.find(req.params.id);

    if (!data) return res.status(404).json({ error: 'No such student found.' });

    res.status(200).json(data);
});

app.post('/students', async (req, res) => {
    const payload = req.body;

    if (Object.keys(payload).length === 0) return res.status(422).json({ error: 'Payload is empty!' });

    const data = await student.create(payload);
    res.status(201).json({ _id: data.insertedId });
});

app.patch('/students/:id', async (req, res) => {
    const id = req.params.id;
    const payload = req.body;

    if (Object.keys(payload).length === 0) return res.status(422).json({ error: 'Payload is empty!' });

    const data = await student.update(id, payload);

    if (data.matchedCount === 0) return res.status(404).json({ error: 'No such student found.' });

    res.status(200).json({ _id: id });
});

app.delete('/students/:id', async (req, res) => {
    const id = req.params.id;
    const data = await student.destroy(id);

    if (data.deletedCount === 0) return res.status(404).json({ error: 'No such student found.' });

    res.status(200).json({ _id: id });
});

app.listen(port, () => {
    console.log(`open in browser -> http://localhost:${port}`);
});
