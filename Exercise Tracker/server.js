require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

let users = [];
let exercises = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Create a new user
app.post('/api/users', (req, res) => {
    const username = req.body.username;
    const newUser = {
        username,
        _id: Date.now().toString()
    };
    users.push(newUser);
    res.json(newUser);
});

// Get all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Add exercise for a user
app.post('/api/users/:_id/exercises', (req, res) => {
    const { description, duration, date } = req.body;
    const userId = req.params._id;
    const user = users.find(user => user._id === userId);

    if (!user) return res.send('User not found');

    const exercise = {
        userId,
        description,
        duration: Number(duration),
        date: date ? new Date(date).toDateString() : new Date().toDateString()
    };

    exercises.push(exercise);

    res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date
    });
});

// Get user's exercise log
app.get('/api/users/:_id/logs', (req, res) => {
    const { from, to, limit } = req.query;
    const userId = req.params._id;
    const user = users.find(user => user._id === userId);

    if (!user) return res.send('User not found');

    let log = exercises
        .filter(exercise => exercise.userId === userId)
        .map(e => ({
            description: e.description,
            duration: e.duration,
            date: e.date
        }));

    if (from) {
        const fromDate = new Date(from);
        log = log.filter(e => new Date(e.date) >= fromDate);
    }

    if (to) {
        const toDate = new Date(to);
        log = log.filter(e => new Date(e.date) <= toDate);
    }

    if (limit) log = log.slice(0, Number(limit));

    res.json({
        _id: user._id,
        username: user.username,
        count: log.length,
        log
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${listener.address().port}`);
});