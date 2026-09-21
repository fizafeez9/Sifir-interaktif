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

// Rekod jumlah masa keseluruhan bagi setiap sifir: { sifirNum: jumlah_saat }
let tableTotalTime = {};

// Pemasa per soalan
let questionTimer = null;
let secondsLeftPerQuestion = 15;
let elapsedTimeForCurrentQuestion = 0; 
let currentTableAccumulatedTime = 0; // Mengumpul jumlah masa untuk sifir semasa
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
    tableTotalTime = {};

    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
    
    initTableRound();
}

function initTableRound() {
    currentTable = activeLevelTables[currentTableIndex];
    currentMultiplierIndex = 1;
    currentTableAccumulatedTime = 0; // Reset masa terkumpul untuk sifir baru

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
            
            // Tambah masa yang telah guna ke dalam jumlah terkumpul sifir ini
            currentTableAccumulatedTime += elapsedTimeForCurrentQuestion;
            
            alert(`⚠️ AMARAN: Anda telah melebihi 15 saat untuk soalan ini! 15 saat tambahan diberikan. Sila cuba lagi.`);
            startQuestionTimer(); // Sambung semula pemasa
        }
    }, 1000);
}

function nextQuestion() {
    if (currentMultiplierIndex > 12) {
        clearInterval(questionTimer);
        
        // Simpan jumlah masa terkumpul untuk sifir ini
        tableTotalTime[currentTable] = currentTableAccumulatedTime;

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
    
    startQuestionTimer();
}

function checkAnswer(e) {
    e.preventDefault();
    clearInterval(questionTimer); // Hentikan masa sebaik sahaja jawab
    
    let userAns = parseInt(document.getElementById('user-answer').value);
    let correctAns = currentTable * currentMultiplierIndex;

    if (userAns === correctAns) {
        playCorrectSound();
        
        // Tambah masa untuk soalan ini ke jumlah terkumpul sifir semasa
        currentTableAccumulatedTime += elapsedTimeForCurrentQuestion;

        currentMultiplierIndex++;
        nextQuestion();
    } else {
        playWrongSound();
        
        // Tambah masa yang terbuang sebelum salah ke jumlah terkumpul
        currentTableAccumulatedTime += elapsedTimeForCurrentQuestion;
        
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
    modalList.innerHTML = '<h4>Jumlah Masa Setiap Sifir:</h4>';

    activeLevelTables.forEach(tbl => {
        let totalSec = tableTotalTime[tbl] || 0;
        let div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<strong>Sifir ${tbl}:</strong> ${totalSec} saat keseluruhan`;
        modalList.appendChild(div);
    });

    document.getElementById('result-modal').classList.remove('hidden');
}

// Simulasi Hantar E-mel
function sendResultToEmail() {
    let summaryText = `Keputusan Sifir Level ${currentLevel} untuk ${studentData.name} (${studentData.email}):\n`;
    activeLevelTables.forEach(tbl => {
        let totalSec = tableTotalTime[tbl] || 0;
        summaryText += `- Sifir ${tbl}: ${totalSec} saat keseluruhan\n`;
    });

    console.log(summaryText);
    alert(`Keputusan berjaya dihantar ke e-mel ${studentData.email}! (Simulasi berjaya)`);
}

function closeModalAndReturn() {
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('level-page').classList.remove('hidden');
}
