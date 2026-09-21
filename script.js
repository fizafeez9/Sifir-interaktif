let studentData = { name: '', email: '' };
let currentLevel = 1;
let currentTableIndex = 0; 
let currentMultiplierIndex = 1; 

// Senarai sifir mengikut level
const levelsData = {
    1: [1, 2, 3, 4],
    2: [5, 6, 7, 8],
    3: [9, 10, 11, 12]
};

let activeLevelTables = [];
let currentTable = 1;
let attemptCount = 1; 

// Rekod penyimpanan prestasi
let levelRecords = {};

// Pemasa per soalan (Contoh: 15 saat setiap soalan)
let questionTimer = null;
let secondsLeftPerQuestion = 15;
const TIME_LIMIT_PER_QUESTION = 15; 

function startApp(e) {
    e.preventDefault();
    studentData.name = document.getElementById('nama').value;
    studentData.email = document.getElementById('email').value;

    document.getElementById('welcome-msg').innerText = `Hai, ${studentData.name}!`;
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('level-page').classList.remove('hidden');
}

function selectLevel(lvl) {
    currentLevel = lvl;
    activeLevelTables = levelsData[lvl];
    currentTableIndex = 0;
    levelRecords = {}; 

    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
    
    initTableRound();
}

function initTableRound() {
    currentTable = activeLevelTables[currentTableIndex];
    currentMultiplierIndex = 1;
    
    if (!levelRecords[currentTable]) {
        levelRecords[currentTable] = { attempts: 1, status: 'Dalam Proses' };
    }
    attemptCount = levelRecords[currentTable].attempts;

    document.getElementById('current-stage-title').innerText = `Sifir ${currentTable}`;
    updateAttemptInfo();
    nextQuestion();
}

function updateAttemptInfo() {
    document.getElementById('attempt-info').innerText = `Percubaan ke-${attemptCount} untuk Sifir ${currentTable}`;
}

// Mulakan pemasa untuk setiap 1 soalan
function startQuestionTimer() {
    clearInterval(questionTimer);
    secondsLeftPerQuestion = TIME_LIMIT_PER_QUESTION;
    document.getElementById('time-left').innerText = secondsLeftPerQuestion;

    questionTimer = setInterval(() => {
        secondsLeftPerQuestion--;
        document.getElementById('time-left').innerText = secondsLeftPerQuestion;
        
        if (secondsLeftPerQuestion <= 0) {
            clearInterval(questionTimer);
            playWrongSound();
            handleFailure(`Masa 15 saat habis untuk soalan ini! Sifir ${currentTable} bermula semula.`);
        }
    }, 1000);
}

function nextQuestion() {
    if (currentMultiplierIndex > 12) {
        clearInterval(questionTimer);
        levelRecords[currentTable].status = 'Berjaya';
        levelRecords[currentTable].attempts = attemptCount;

        currentTableIndex++;
        if (currentTableIndex < activeLevelTables.length) {
            alert(`Tahniah! Anda berjaya melepasi Sifir ${currentTable}! Seterusnya Sifir ${activeLevelTables[currentTableIndex]}.`);
            initTableRound();
        } else {
            showLevelResultModal();
        }
        return;
    }

    document.getElementById('question-text').innerText = `${currentTable} × ${currentMultiplierIndex} = ?`;
    document.getElementById('user-answer').value = '';
    document.getElementById('user-answer').focus();
    
    // Mula detik masa untuk soalan baru ini
    startQuestionTimer();
}

function checkAnswer(e) {
    e.preventDefault();
    clearInterval(questionTimer); // Hentikan masa sebaik sahaja jawab
    
    let userAns = parseInt(document.getElementById('user-answer').value);
    let correctAns = currentTable * currentMultiplierIndex;

    if (userAns === correctAns) {
        playCorrectSound();
        currentMultiplierIndex++;
        nextQuestion();
    } else {
        playWrongSound();
        handleFailure(`Jawapan salah! Jawapan betul ialah ${correctAns}. Sifir ${currentTable} bermula semula.`);
    }
}

// Fungsi bunyi betul
function playCorrectSound() {
    let sound = document.getElementById('sound-correct');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio disekat:", e));
    }
}

// Fungsi bunyi salah
function playWrongSound() {
    let sound = document.getElementById('sound-wrong');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio disekat:", e));
    }
}

function handleFailure(msg) {
    alert(msg);
    levelRecords[currentTable].attempts = (levelRecords[currentTable].attempts || 1) + 1;
    levelRecords[currentTable].status = 'Gagal / Mula Semula';
    
    initTableRound();
}

function showLevelResultModal() {
    let modalList = document.getElementById('modal-results-list');
    modalList.innerHTML = '';

    activeLevelTables.forEach(tbl => {
        let rec = levelRecords[tbl] || { attempts: 1, status: 'Berjaya' };
        let div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<strong>Sifir ${tbl}:</strong> ${rec.status} (Jumlah Percubaan: <strong>${rec.attempts}</strong> kali)`;
        modalList.appendChild(div);
    });

    document.getElementById('result-modal').classList.remove('hidden');
}

// Simulasi Hantar E-mel
function sendResultToEmail() {
    let summaryText = `Keputusan Sifir Level ${currentLevel} untuk ${studentData.name} (${studentData.email}):\n`;
    activeLevelTables.forEach(tbl => {
        let rec = levelRecords[tbl];
        summaryText += `- Sifir ${tbl}: ${rec.status}, Percubaan: ${rec.attempts}\n`;
    });

    console.log(summaryText);
    alert(`Keputusan berjaya dihantar ke e-mel ${studentData.email}! (Simulasi berjaya)`);
}

function closeModalAndReturn() {
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('level-page').classList.remove('hidden');
}
