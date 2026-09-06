let score = JSON.parse(fetchScore());

if (score === null) {
        score = {
        wins: 0,
        losses: 0,
        draw: 0
    }
}

document.querySelector('#wins').textContent = score.wins;
document.querySelector('#losses').textContent = score.losses;
document.querySelector('#draw').textContent = score.draw;

console.log(score);

function fetchScore() {
    return localStorage.getItem('score');
}

function updateScore() {
    document.querySelector('#wins').textContent = score.wins;
    document.querySelector('#losses').textContent = score.losses;
    document.querySelector('#draw').textContent = score.draw;
}

function saveScore() {
    localStorage.setItem('score', JSON.stringify(score));
    updateScore();
}

function getRandomMove() {
    return Math.floor(Math.random() * 3);
}

function handlePlayerAnimation() {
    const icon = document.querySelector('#player-pick');
    icon.classList.remove('animate-entry-player');
    void icon.offsetWidth;
    icon.classList.add('animate-entry-player');
}

function handleComputerAnimation() {
    const icon = document.querySelector('#computer-pick');
    icon.classList.remove('animate-entry-computer');
    void icon.offsetWidth;
    icon.classList.add('animate-entry-computer');
}

function startGame(playerInput) {
    playerMove = playerInput;

    let randomMove = getRandomMove();
    if (randomMove == 0) {
        computerMove = 'Rock'
    } else if (randomMove == 1) {
        computerMove = 'Paper'
    } else {
        computerMove = 'Scissors'
    }

    document.querySelector('#computer-pick').src = `./assets/${computerMove}.png`
    document.querySelector('#player-pick').src = `./assets/${playerMove}.png`;


    if (playerMove == 'Rock' && computerMove == 'Paper') {
    result = `Computer Wins!`;
    } else if (playerMove == 'Rock' && computerMove == 'Scissors') {
        result = `You Win!`;
    } else if (playerMove == 'Paper' && computerMove == 'Rock') {
        result = `You Win!`;
    } else if (playerMove == 'Paper' && computerMove == 'Scissors') {
        result = `Computer Wins!`;
    } else if (playerMove == 'Scissors' && computerMove == 'Rock') {
        result = `Computer Wins!`;
    } else if (playerMove == 'Scissors' && computerMove == 'Paper') {
        result = `You Win!`;
    } else {
        result = `It's a draw!`;
    }

    if (result == `You Win!`) {
        score.wins += 1;
    } else if (result == `Computer Wins!`) {
        score.losses += 1;
    } else {
        score.draw += 1;
    }

    document.querySelector('#result-text').innerText = result;
    saveScore();

    handlePlayerAnimation();
    handleComputerAnimation();

}

function resetScore() {
    localStorage.removeItem('score');
    score.wins = 0;
    score.losses = 0;
    score.draw = 0;
    updateScore();
    document.querySelector('#computer-pick').src = ``
    document.querySelector('#player-pick').src = ``;
    document.querySelector('#result-text').textContent = "Ready to play?"
}