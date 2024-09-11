import express, { Request, Response } from "express";
import StudentService from "./services/student";

const app = express();
const PORT = process.env.PORT || 3000;
const student: StudentService = new StudentService();

app.use(express.json());

// index
app.get('/students', async (req: Request, res: Response) => {
    try {
        const data = await student.findAll();

        res.status(200).json(data);
    } catch (err: any) {
        res.status(400).json({ error: err });
    }
});

// show
app.get('/students/:id', async (req: Request, res: Response) => {
    try {
        const data = await student.find(+req.params.id);

        res.status(200).json(data);
    } catch (err: any) {
        res.status(404).json({ error: err });
    }
});

// create
app.post('/students', async (req: Request, res: Response) => {
    const name = req.body.name;

    if (!name) return res.status(422).json({ error: 'Name is required!' });

    try {
        const data = await student.create(name);

        res.status(201).json(data);
    } catch (err: any) {
        res.status(400).json({ error: err });
    }
});

// update
app.patch('/students/:id', async (req: Request, res: Response) => {
    const name = req.body.name;

    if (!name) return res.status(422).json({ error: 'Name is required!' });

    try {
        const data = await student.update(+req.params.id, name);

        res.status(200).json(data);
    } catch (err: any) {
        res.status(400).json({ error: err });
    }
});

// destroy
app.delete('/students/:id', async (req: Request, res: Response) => {
    try {
        const data = await student.delete(+req.params.id);

        res.status(200).json(data);
    } catch (err: any) {
        res.status(400).json({ error: err });
    }
});

app.listen(PORT, () => {
    console.log(`open in browser -> http://localhost:${PORT}`);
});
