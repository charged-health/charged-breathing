const breathingCircle = document.getElementById('breathingCircle');
const instruction = document.getElementById('instruction');
const counter = document.getElementById('counter');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const langToggle = document.getElementById('langToggle');
const cyclesSlider = document.getElementById('cyclesSlider');
const cyclesValue = document.getElementById('cyclesValue');

let intervalId = null;
let isRunning = false;
let currentLang = 'nl';
let totalCycles = 4;
let completedCycles = 0;

const translations = {
    nl: {
        phases: [
            { name: 'inademen\ndoor je neus', duration: 4, class: 'inhale' },
            { name: 'vasthouden', duration: 7, class: 'hold' },
            { name: 'uitademen\ndoor je mond', duration: 8, class: 'exhale' }
        ],
        clickStart: 'klik op start',
        completed: 'goed gedaan!',
        thankYou: 'bedankt!'
    },
    en: {
        phases: [
            { name: 'inhale\nthrough your nose', duration: 4, class: 'inhale' },
            { name: 'hold', duration: 7, class: 'hold' },
            { name: 'exhale\nthrough your mouth', duration: 8, class: 'exhale' }
        ],
        clickStart: 'click start',
        completed: 'well done!',
        thankYou: 'thank you!'
    }
};

let currentPhaseIndex = 0;
let timeLeft = 0;

function updateDisplay() {
    const currentPhase = translations[currentLang].phases[currentPhaseIndex];
    instruction.textContent = currentPhase.name;
    counter.textContent = timeLeft;

    // Remove all phase classes
    breathingCircle.classList.remove('inhale', 'hold', 'exhale');
    // Add current phase class
    breathingCircle.classList.add(currentPhase.class);
}

function startBreathing() {
    if (isRunning) return;

    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    cyclesSlider.disabled = true;

    completedCycles = 0;
    currentPhaseIndex = 0;
    timeLeft = translations[currentLang].phases[currentPhaseIndex].duration;
    updateDisplay();

    intervalId = setInterval(() => {
        timeLeft--;

        if (timeLeft > 0) {
            updateDisplay();
        } else {
            // Move to next phase
            currentPhaseIndex = (currentPhaseIndex + 1) % translations[currentLang].phases.length;

            // Check if we completed a full cycle
            if (currentPhaseIndex === 0) {
                completedCycles++;
                // Stop after completing all cycles
                if (completedCycles >= totalCycles) {
                    stopBreathing(true);
                    return;
                }
            }

            timeLeft = translations[currentLang].phases[currentPhaseIndex].duration;
            updateDisplay();
        }
    }, 1000);
}

function createConfetti() {
    const colors = ['#8E80FF', '#BAB2FF', '#FF5E1F', '#FF8859', '#FFD1BE'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }
}

function stopBreathing(isCompleted = false) {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(intervalId);
    intervalId = null;

    startBtn.disabled = false;
    stopBtn.disabled = true;
    cyclesSlider.disabled = false;

    // Reset display
    breathingCircle.classList.remove('inhale', 'hold', 'exhale');

    if (isCompleted) {
        instruction.textContent = translations[currentLang].completed;
        counter.textContent = '';
        createConfetti();

        setTimeout(() => {
            instruction.textContent = translations[currentLang].clickStart;
        }, 3000);
    } else {
        instruction.textContent = translations[currentLang].clickStart;
        counter.textContent = '';
    }

    completedCycles = 0;
}

function switchLanguage() {
    currentLang = currentLang === 'nl' ? 'en' : 'nl';
    langToggle.textContent = currentLang === 'nl' ? 'EN' : 'NL';

    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-${currentLang}`);
    });

    // Update instruction text if not running
    if (!isRunning) {
        instruction.textContent = translations[currentLang].clickStart;
    }
}

cyclesSlider.addEventListener('input', (e) => {
    totalCycles = parseInt(e.target.value);
    cyclesValue.textContent = totalCycles;
});

startBtn.addEventListener('click', startBreathing);
stopBtn.addEventListener('click', stopBreathing);
langToggle.addEventListener('click', switchLanguage);
breathingCircle.addEventListener('click', () => {
    if (!isRunning) {
        startBreathing();
    } else {
        stopBreathing();
    }
});
