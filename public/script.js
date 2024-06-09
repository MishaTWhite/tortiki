const API_URL = 'http://localhost:3000';  // Для локального тестування

let mishaScore = 0;
let pashaScore = 0;

function changeScore(team, delta) {
    console.log(`Changing score for ${team} by ${delta}`);
    if (team === 'misha') {
        mishaScore += delta;
        document.getElementById('mishaScore').textContent = mishaScore;
    } else if (team === 'pasha') {
        pashaScore += delta;
        document.getElementById('pashaScore').textContent = pashaScore;
    }
    updateServer();
}

function saveBet() {
    const betDescription = document.getElementById('betDescription').value;
    const betFor = document.getElementById('betFor').value;
    const betAgainst = document.getElementById('betAgainst').value;

    console.log(`Saving bet: ${betDescription}, For: ${betFor}, Against: ${betAgainst}`);

    if (betDescription.trim() === '' || betFor === betAgainst) return;

    const bet = {
        description: betDescription,
        for: betFor,
        against: betAgainst,
        active: true
    };

    fetch(`${API_URL}/addBet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bet)
    }).then(response => {
        console.log('Bet saved successfully');
        loadBets();
    }).catch(error => {
        console.error('Error saving bet:', error);
    });

    document.getElementById('betDescription').value = '';
}

function loadBets() {
    fetch(`${API_URL}/getBets`)
        .then(response => response.json())
        .then(bets => {
            console.log('Loaded bets:', bets);
            const betsList = document.getElementById('bets');
            betsList.innerHTML = '';
            bets.forEach((bet, index) => {
                const betItem = document.createElement('li');
                betItem.textContent = `${bet.description} (Так: ${bet.for}, Ні: ${bet.against})`;
                if (!bet.active) {
                    betItem.classList.add('inactive');
                }
                betItem.onclick = () => toggleBet(index);
                betsList.appendChild(betItem);
            });
        }).catch(error => {
            console.error('Error loading bets:', error);
        });
}

function toggleBet(index) {
    console.log(`Toggling bet at index: ${index}`);
    fetch(`${API_URL}/toggleBet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index })
    }).then(response => {
        console.log('Bet toggled successfully');
        loadBets();
    }).catch(error => {
        console.error('Error toggling bet:', error);
    });
}

function updateServer() {
    const data = {
        mishaScore,
        pashaScore
    };

    console.log('Updating server with scores:', data);

    fetch(`${API_URL}/updateScore`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        console.log('Scores updated successfully');
    }).catch(error => {
        console.error('Error updating scores:', error);
    });
}

window.onload = () => {
    fetch(`${API_URL}/getScore`)
        .then(response => response.json())
        .then(data => {
            console.log('Loaded scores:', data);
            mishaScore = data.mishaScore;
            pashaScore = data.pashaScore;
            document.getElementById('mishaScore').textContent = mishaScore;
            document.getElementById('pashaScore').textContent = pashaScore;
        }).catch(error => {
            console.error('Error loading scores:', error);
        });
    loadBets();
};
