const expressions = document.getElementById('expressions');
const feedbackElement = document.getElementById('feedback');

function generateExpressions() {
    expressions.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const num1 = Math.floor(Math.random() * 11);
        const num2 = Math.floor(Math.random() * 11);
        const expression = `${num1} x ${num2} = `;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Your Answer';
        input.setAttribute('data-result', num1 * num2);

        const div = document.createElement('div');
        div.textContent = expression;
        div.appendChild(input);

        expressions.appendChild(div);
    }
}

function checkAnswers() {
    const inputs = document.querySelectorAll('#expressions input');
    let correctCount = 0;

    inputs.forEach(input => {
        const userAnswer = parseInt(input.value, 10);
        const correctAnswer = parseInt(input.getAttribute('data-result'), 10);

        if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
            input.classList.add('correct');
            correctCount++;
        } else {
            input.classList.add('incorrect');
        }
    });

    const accuracy = (correctCount / 3) * 100;
    const feedback = `${correctCount}/3 were correct. ${getFeedback(accuracy)}`;
    feedbackElement.textContent = feedback;
}

function resetGame() {
    const inputs = document.querySelectorAll('#expressions input');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect');
    });
    feedbackElement.textContent = '';
}

function showAnswers() {
    const inputs = document.querySelectorAll('#expressions input');
    inputs.forEach(input => {
        const correctAnswer = input.getAttribute('data-result');
        input.value = correctAnswer;
    });
}

function getFeedback(accuracy) {
    if (accuracy === 100) {
        return ' Well done!';
    } else if (accuracy >= 70) {
        return 'Great job! Keep practicing!';
    } else {
        return ' Keep practicing!';
    }
}

function reloadPage() {
    location.reload();
}

generateExpressions();
