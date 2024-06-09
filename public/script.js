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

    fetch('/addBet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bet)
    }).then(loadBets);

    document.getElementById('betDescription').value = '';
}

function loadBets() {
    fetch('/getBets')
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
    fetch('/toggleBet', {
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

    fetch('/updateScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

window.onload = () => {
    fetch('/getScore')
        .then(response => response.json())
        .then(data => {
            mishaScore = data.mishaScore;
            pashaScore = data.pashaScore;
            document.getElementById('mishaScore').textContent = mishaScore;
            document.getElementById('pashaScore').textContent = pashaScore;
        });
    loadBets();
};
