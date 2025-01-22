const shapeElement = document.getElementById("red");
let startTime;
let timeoutId;

const resetGame = () => {
    const top = (Math.random() * 200 + 50);
    const left = (Math.random() * 300 + 20);
    const size = (Math.random() * 200) + 20;
    const randomColor = getRandomColor();

    shapeElement.style.top = top + "px";
    shapeElement.style.left = left + "px";
    shapeElement.style.width = size + "px";
    shapeElement.style.height = size + "px";
    shapeElement.style.backgroundColor = randomColor;

    if (Math.random() > 0.5) {
        shapeElement.style.borderRadius = "50%";
    } else {
        shapeElement.style.borderRadius = "0";
    }

    shapeElement.style.display = "block";
    startTime = new Date().getTime();
}

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const triggerResetTimer = () => {
    const randomTimeout = Math.random() * 3000 + 1000; // Random timeout between 1 and 4 seconds
    timeoutId = setTimeout(resetGame, randomTimeout);
}

shapeElement.onclick = () => {
    shapeElement.style.display = "none";
    const endTime = new Date().getTime();
    const time = (endTime - startTime) / 1000;

    document.getElementById("time").innerText = time.toFixed(3) + "s";

    clearTimeout(timeoutId);
    triggerResetTimer();
}

resetGame();
triggerResetTimer();
