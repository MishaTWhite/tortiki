const API_URL = 'https://your-heroku-app.herokuapp.com';  // Заміни на URL свого Heroku сервера

let mishaScore = 0;
let pashaScore = 0;

function changeScore(team, delta) {
    if (team === 'misha') {
        mishaScore += delta;
        document.getElementById('mishaScore').textContent = mishaScore;
    } else if (team === 'pasha') {
        pashaScore += delta;
        document.getElementById('pashaScore').textContent = pashaScore;
    }
    updateServer();
}

function addBet(team) {
    const betDescription = document.getElementById('betDescription').value;
    if (betDescription.trim() === '') return;

    const bet = {
        description: betDescription,
        team: team,
        active: true
    };

    fetch(`${API_URL}/addBet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bet)
    }).then(loadBets);

    document.getElementById('betDescription').value = '';
}

function loadBets() {
    fetch(`${API_URL}/getBets`)
        .then(response => response.json())
        .then(bets => {
            const betsList = document.getElementById('bets');
            betsList.innerHTML = '';
            bets.forEach((bet, index) => {
                const betItem = document.createElement('li');
                betItem.textContent = bet.description + ' (' + bet.team + ')';
                if (!bet.active) {
                    betItem.classList.add('inactive');
                }
                betItem.onclick = () => toggleBet(index);
                betsList.appendChild(betItem);
            });
        });
}

function toggleBet(index) {
    fetch(`${API_URL}/toggleBet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index })
    }).then(loadBets);
}

function updateServer() {
    const data = {
        mishaScore,
        pashaScore
    };

    fetch(`${API_URL}/updateScore`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

window.onload = () => {
    fetch(`${API_URL}/getScore`)
        .then(response => response.json())
        .then(data => {
            mishaScore = data.mishaScore;
            pashaScore = data.pashaScore;
            document.getElementById('mishaScore').textContent = mishaScore;
            document.getElementById('pashaScore').textContent = pashaScore;
        });
    loadBets();
};
