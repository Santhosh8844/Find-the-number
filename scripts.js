document.addEventListener('DOMContentLoaded', () => {
    const lowerBoundField = document.getElementById('lowerBound');
    const upperBoundField = document.getElementById('upperBound');
    const setRangeButton = document.getElementById('setRange');
    const guessField = document.getElementById('guessField');
    const guessSubmit = document.getElementById('guessSubmit');
    const chanceMessage = document.getElementById('chanceMessage');
    const guesses = document.querySelector('.guesses');
    const lastResult = document.querySelector('.lastResult');
    const lowOrHi = document.querySelector('.lowOrHi');
    const gameSection = document.querySelector('.game-section');
    
    let randomNumber;
    let totalChances;
    let guessCount = 0;
    let lowerBound, upperBound;
    let enterPressCount = 0;

    function setRange() {
        lowerBound = Number(lowerBoundField.value);
        upperBound = Number(upperBoundField.value);

        if (lowerBound >= upperBound) {
            alert('Lower bound must be less than upper bound.');
            return;
        }

        randomNumber = Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
        totalChances = Math.ceil(Math.log2(upperBound - lowerBound + 1));
        chanceMessage.textContent = `You have ${totalChances} chances to guess the number!`;
        
        gameSection.style.display = 'block';
        guessField.disabled = false;
        guessSubmit.disabled = false;
        guessField.focus();
    }

    setRangeButton.addEventListener('click', setRange);
    lowerBoundField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            setRange();
        }
    });
    upperBoundField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            setRange();
        }
    });

    function checkGuess() {
        const userGuess = Number(guessField.value);
        guessCount++;

        if (guessCount === 1) {
            guesses.textContent = 'Previous guesses: ';
        }

        guesses.textContent += userGuess + ' ';

        if (userGuess === randomNumber) {
            lastResult.textContent = `Congratulations! You got it right in ${guessCount} guesses!`;
            lastResult.style.backgroundColor = 'green';
            lowOrHi.textContent = '';
            setGameOver();
        } else if (guessCount === totalChances) {
            lastResult.textContent = '!!!GAME OVER!!!';
            lowOrHi.textContent = '';
            setGameOver();
        } else {
            lastResult.textContent = 'Wrong!';
            lastResult.style.backgroundColor = 'red';
            if(userGuess < randomNumber) {
                lowOrHi.textContent = 'Last guess was too low!';
            } else if(userGuess > randomNumber) {
                lowOrHi.textContent = 'Last guess was too high!';
            }
        }

        guessField.value = '';
        guessField.focus();
    }

    guessSubmit.addEventListener('click', checkGuess);
    guessField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            checkGuess();
        }
    });

    function setGameOver() {
        guessField.disabled = true;
        guessSubmit.disabled = true;
        enterPressCount = 0; // Reset the counter when the game is over
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Start new game';
        resetButton.id = 'resetButton';
        document.body.appendChild(resetButton);
        resetButton.addEventListener('click', resetGame);
    }

    function resetGame() {
        guessCount = 0;
        const resetParas = document.querySelectorAll('.resultParas p');
        for (const resetPara of resetParas) {
            resetPara.textContent = '';
        }

        document.getElementById('resetButton').remove();
        guessField.disabled = false;
        guessSubmit.disabled = false;
        guessField.value = '';
        guessField.focus();
        lastResult.style.backgroundColor = 'white';
        lowerBoundField.value = '';
        upperBoundField.value = '';
        gameSection.style.display = 'none';
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && document.getElementById('resetButton')) {
            enterPressCount++;
            if (enterPressCount === 2) {
                resetGame();
            }
        } else {
            enterPressCount = 0; // Reset the counter if any other key is pressed
        }
    });
});
