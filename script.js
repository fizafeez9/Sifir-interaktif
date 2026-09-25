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
let currentTableAccumulatedTime = 0; 
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
    currentTableAccumulatedTime = 0; 

    document.getElementById('current-stage-title').innerText = `Sifir ${currentTable}`;
    nextQuestion();
}

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
            currentTableAccumulatedTime += elapsedTimeForCurrentQuestion;
            alert(`⚠️ AMARAN: Anda telah melebihi 15 saat untuk soalan ini! 15 saat tambahan diberikan. Sila cuba lagi.`);
            startQuestionTimer(); 
        }
    }, 1000);
}

function nextQuestion() {
    if (currentMultiplierIndex > 12) {
        clearInterval(questionTimer);
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
    clearInterval(questionTimer); 
    
    let userAns = parseInt(document.getElementById('user-answer').value);
    let correctAns = currentTable * currentMultiplierIndex;

    if (userAns === correctAns) {
        playCorrectSound();
        currentTableAccumulatedTime += elapsedTimeForCurrentQuestion;
        currentMultiplierIndex++;
        nextQuestion();
    } else {
        playWrongSound();
        currentTableAccumulatedTime += elapsedTimeForCurrentQuestion;
        alert(`❌ Jawapan salah! Anda telah melebihi masa/salah. 15 saat ditambah untuk cuba semula soalan ini.`);
        startQuestionTimer(); 
    }
}

function playCorrectSound() {
    let sound = document.getElementById('sound-correct');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio disekat:", e));
    }
}

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

    let allUnder60Seconds = true;

    activeLevelTables.forEach(tbl => {
        let totalSec = tableTotalTime[tbl] || 0;
        if (totalSec > 60) {
            allUnder60Seconds = false; // Jika ada mana-mana sifir lebih 60 saat
        }

        let div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<strong>Sifir ${tbl}:</strong> ${totalSec} saat keseluruhan`;
        modalList.appendChild(div);
    });

    // Semak sama ada layak dapat reward (Semua sifir <= 60 saat)
    if (allUnder60Seconds) {
        let rewardDiv = document.createElement('div');
        rewardDiv.style.marginTop = "15px";
        rewardDiv.innerHTML = `
            <div style="background: #e8f8f5; border: 2px dashed #2ecc71; padding: 12px; border-radius: 10px; text-align: center;">
                <p style="color: #27ae60; font-weight: bold; margin: 0 0 8px 0;">🎉 HEBAT! Anda layak terima Ganjaran Money Pocket TNG!</p>
                <button onclick="claimReward()" style="background-color: #27ae60; padding: 10px; font-size: 14px;">🎁 Tuntut Money Pocket Sekarang</button>
            </div>
        `;
        modalList.appendChild(rewardDiv);
    }

    document.getElementById('result-modal').classList.remove('hidden');
}

// Fungsi apabila pelajar tekan butang tuntut ganjaran
function claimReward() {
    let tngPhone = prompt("Tahniah! Sila masukkan Nombor Telefon Touch 'n Go (TnG) anda untuk terima duit raya/reward:");
    if (tngPhone) {
        alert(`Terima kasih ${studentData.name}! Nombor ${tngPhone} telah direkodkan. Cikgu akan masukkan duit Money Pocket TNG ke nombor ini!`);
    }
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
