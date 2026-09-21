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

// Rekod prestasi untuk level semasa: 
// Simpan senarai rekod: { "Sifir_Multiplier": { attempts: jumlah_cubaan, timeSpent: masa_diambil } }
let questionRecords = {};
let levelSummary = {}; // Untuk simpan status sifir dan masa setiap soalan

// Pemasa per soalan
let questionTimer = null;
let secondsLeftPerQuestion = 15;
let elapsedTimeForCurrentQuestion = 0; // Mengira berapa saat masa digunakan
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
    questionRecords = {};
    levelSummary = {};

    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
    
    initTableRound();
}

function initTableRound() {
    currentTable = activeLevelTables[currentTableIndex];
    currentMultiplierIndex = 1;

    document.getElementById('current-stage-title').innerText = `Sifir ${currentTable}`;
    nextQuestion();
}

// Mulakan pemasa untuk setiap 1 soalan
function startQuestionTimer() {
    clearInterval(questionTimer);
    secondsLeftPerQuestion = TIME_LIMIT_PER_QUESTION;
    elapsedTimeForCurrentQuestion = 0;
    document.getElementById('time-left').innerText = secondsLeftPerQuestion;

    questionTimer = setInterval(() => {
        secondsLeftPerQuestion--;
        elapsedTimeForCurrentQuestion++;
        document.getElementById('time-left').innerText = secondsLeftPerQuestion;
        
        if (secondsLeftPerQuestion <= 0) {
            clearInterval(questionTimer);
            playWrongSound();
            
            // Amaran masa habis, tambah 15 saat lagi dan kekal di soalan yang sama
            alert(`⚠️ AMARAN: Anda telah melebihi 15 saat untuk soalan ini! 15 saat tambahan diberikan. Sila cuba lagi.`);
            startQuestionTimer(); // Sambung semula pemasa
        }
    }, 1000);
}

function nextQuestion() {
    if (currentMultiplierIndex > 12) {
        clearInterval(questionTimer);
        
        currentTableIndex++;
        if (currentTableIndex < activeLevelTables.length) {
            alert(`Tahniah! Anda berjaya menghabiskan Sifir ${currentTable}! Seterusnya Sifir ${activeLevelTables[currentTableIndex]}.`);
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
    let totalTimeTaken = elapsedTimeForCurrentQuestion + (TIME_LIMIT_PER_QUESTION - secondsLeftPerQuestion > 15 ? (TIME_LIMIT_PER_QUESTION - secondsLeftPerQuestion) : elapsedTimeForCurrentQuestion);

    let key = `Sifir ${currentTable} (${currentTable} × ${currentMultiplierIndex})`;

    if (userAns === correctAns) {
        playCorrectSound();
        
        // Simpan rekod masa soalan berjaya
        levelSummary[key] = { time: totalTimeTaken, status: 'Betul' };

        currentMultiplierIndex++;
        nextQuestion();
    } else {
        playWrongSound();
        
        // Amaran jawapan salah, kekal di soalan sama dan tambah masa 15 saat
        alert(`❌ Jawapan salah! Anda telah melebihi masa/salah. 15 saat ditambah untuk cuba semula soalan ini.`);
        startQuestionTimer(); // Sambung semula pemasa tanpa tukar soalan
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

function showLevelResultModal() {
    let modalList = document.getElementById('modal-results-list');
    modalList.innerHTML = '<h4>Rekod Masa Setiap Soalan:</h4>';

    for (let qKey in levelSummary) {
        let data = levelSummary[qKey];
        let div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<strong>${qKey}</strong>: ${data.time} saat`;
        modalList.appendChild(div);
    }

    document.getElementById('result-modal').classList.remove('hidden');
}

// Simulasi Hantar E-mel
function sendResultToEmail() {
    let summaryText = `Keputusan Sifir Level ${currentLevel} untuk ${studentData.name} (${studentData.email}):\n`;
    for (let qKey in levelSummary) {
        summaryText += `- ${qKey}: ${levelSummary[qKey].time} saat\n`;
    }

    console.log(summaryText);
    alert(`Keputusan berjaya dihantar ke e-mel ${studentData.email}! (Simulasi berjaya)`);
}

function closeModalAndReturn() {
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('level-page').classList.remove('hidden');
}
