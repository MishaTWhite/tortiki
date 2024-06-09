const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

let mishaScore = 0;
let pashaScore = 0;
let bets = [];

app.post('/updateScore', (req, res) => {
    mishaScore = req.body.mishaScore;
    pashaScore = req.body.pashaScore;
    res.sendStatus(200);
});

app.get('/getScore', (req, res) => {
    res.json({ mishaScore, pashaScore });
});

app.post('/addBet', (req, res) => {
    bets.push({ ...req.body, active: true });
    res.sendStatus(200);
});

app.get('/getBets', (req, res) => {
    res.json(bets);
});

app.post('/toggleBet', (req, res) => {
    const bet = bets[req.body.index];
    if (bet) {
        bet.active = !bet.active;
    }
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
