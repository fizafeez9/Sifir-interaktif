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

// Pemasa
let timerInterval = null;
let timeLeft = 60;

// Fungsi untuk memulakan aplikasi, simpan data, mainkan muzik & papar butang kawalan muzik
function startApp(e) {
    e.preventDefault();
    studentData.name = document.getElementById('nama').value;
    studentData.email = document.getElementById('email').value;

    // Mula mainkan muzik latar
    let bgMusic = document.getElementById('bg-music');
    bgMusic.volume = 0.4; // Tetapkan tahap suara (40%)
    bgMusic.play().catch(error => {
        console.log("Autoplay disekat oleh pelayar:", error);
    });

    // Paparkan butang kawalan muzik di penjuru skrin
    document.getElementById('music-control').style.display = 'flex';

    document.getElementById('welcome-msg').innerText = `Hai, ${studentData.name}!`;
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('level-page').classList.remove('hidden');
}

// Fungsi untuk pasang/tutup (Toggle) muzik apabila pelajar tekan butang di penjuru skrin
let isMusicPlaying = true;
function toggleMusic() {
    let bgMusic = document.getElementById('bg-music');
    let musicIcon = document.getElementById('music-icon');
    let musicText = document.getElementById('music-text');

    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.innerText = "🔇";
        musicText.innerText = "Muzik: Tutup";
        isMusicPlaying = false;
    } else {
        bgMusic.play();
        musicIcon.innerText = "🎵";
        musicText.innerText = "Muzik: Pasang";
        isMusicPlaying = true;
    }
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
    startTimer();
}

function updateAttemptInfo() {
    document.getElementById('attempt-info').innerText = `Percubaan ke-${attemptCount} untuk Sifir ${currentTable}`;
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
    document.getElementById('time-left').innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleFailure("Masa tamat! Sifir ini dikira gagal dan perlu dimulakan semula.");
        }
    }, 1000);
}

function nextQuestion() {
    if (currentMultiplierIndex > 12) {
        clearInterval(timerInterval);
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
}

function checkAnswer(e) {
    e.preventDefault();
    let userAns = parseInt(document.getElementById('user-answer').value);
    let correctAns = currentTable * currentMultiplierIndex;

    if (userAns === correctAns) {
        currentMultiplierIndex++;
        nextQuestion();
    } else {
        clearInterval(timerInterval);
        handleFailure(`Jawapan salah! Jawapan betul ialah ${correctAns}. Sifir ${currentTable} bermula semula.`);
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

// Fungsi Simulasi Penghantaran E-mel
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
