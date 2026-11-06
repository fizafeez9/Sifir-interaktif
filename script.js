let studentData = { name: '', email: '', tngPhone: '' };
let currentLevel = 1;
let currentTableIndex = 0; 
let currentMultiplierIndex = 1; 

const levelsData = {
    1: [1, 2, 3, 4],
    2: [5, 6, 7, 8],
    3: [9, 10, 11, 12]
};

let activeLevelTables = [];
let currentTable = 1;
let tableTotalTime = {};

let questionTimer = null;
let secondsLeftPerQuestion = 15;
let elapsedTimeForCurrentQuestion = 0; 
let currentTableAccumulatedTime = 0; 
const TIME_LIMIT_PER_QUESTION = 15; 

function showLoginPage(e) {
    e.preventDefault();
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
}

function showRegisterPage(e) {
    e.preventDefault();
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
}

// 1. Pendaftaran Akaun ke Firebase Firestore
async function handleRegister(e) {
    e.preventDefault();
    let name = document.getElementById('reg-nama').value.trim();
    let email = document.getElementById('reg-email').value.trim();
    let password = document.getElementById('reg-password').value.trim();

    if (!name || !email || !password) {
        alert("⚠️ Sila isi semua maklumat pendaftaran!");
        return;
    }

    try {
        // Semak sama ada e-mel sudah berdaftar dalam Firestore
        const q = window.query(window.collection(window.db, "students"), window.where("email", "==", email));
        const querySnapshot = await window.getDocs(q);

        if (!querySnapshot.empty) {
            alert("⚠️ E-mel ini sudah berdaftar! Sila log masuk.");
            showLoginPage(e);
            return;
        }

        // Simpan akaun baru ke Firebase Firestore
        await window.addDoc(window.collection(window.db, "students"), {
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        });

        alert("✅ Pendaftaran berjaya! Sila log masuk.");
        document.getElementById('reg-nama').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-password').value = '';
        showLoginPage(e);
    } catch (error) {
        console.error("Ralat pendaftaran:", error);
        alert("❌ Pendaftaran gagal. Sila cuba lagi.");
    }
}

// 2. Log Masuk dari Firebase Firestore
async function handleLogin(e) {
    e.preventDefault();
    let emailInput = document.getElementById('login-email').value.trim();
    let passwordInput = document.getElementById('login-password').value.trim();

    try {
        const q = window.query(window.collection(window.db, "students"), window.where("email", "==", emailInput));
        const querySnapshot = await window.getDocs(q);

        if (querySnapshot.empty) {
            alert("⚠️ Tiada akaun dijumpai dengan e-mel ini. Sila daftar terlebih dahulu!");
            return;
        }

        let studentDoc = querySnapshot.docs[0].data();

        if (studentDoc.password === passwordInput) {
            studentData.name = studentDoc.name;
            studentData.email = studentDoc.email;

            document.getElementById('welcome-msg').innerText = `Hai, ${studentData.name}!`;
            document.getElementById('login-page').classList.add('hidden');
            document.getElementById('level-page').classList.remove('hidden');
        } else {
            alert("❌ Kata laluan salah! Sila cuba lagi.");
        }
    } catch (error) {
        console.error("Ralat log masuk:", error);
        alert("❌ Ralat sambungan ke pangkalan data.");
    }
}

function logout() {
    studentData = { name: '', email: '', tngPhone: '' };
    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

function selectLevel(lvl) {
    if (!studentData.name) {
        alert("⚠️ Sila log masuk terlebih dahulu!");
        logout();
        return;
    }

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
    let levelSummaryText = "";

    activeLevelTables.forEach(tbl => {
        let totalSec = tableTotalTime[tbl] || 0;
        if (totalSec > 60) {
            allUnder60Seconds = false; 
        }

        let div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<strong>Sifir ${tbl}:</strong> ${totalSec} saat keseluruhan`;
        modalList.appendChild(div);

        levelSummaryText += `Sifir ${tbl}: ${totalSec}s | `;
    });

    // Simpan rekod sejarah ke Cloud Firebase
    saveStudentHistory(currentLevel, levelSummaryText);

    if (allUnder60Seconds) {
        let rewardDiv = document.createElement('div');
        rewardDiv.style.marginTop = "15px";
        rewardDiv.innerHTML = `
            <div style="background: #e8f8f5; border: 2px dashed #2ecc71; padding: 12px; border-radius: 10px; text-align: center;">
                <p style="color: #27ae60; font-weight: bold; margin: 0 0 8px 0;">🎉 HEBAT! Anda layak terima Ganjaran Money Pocket TNG!</p>
                <button onclick="claimReward()" style="background-color: #27ae60; padding: 10px; font-size: 14px; border:none; color:white; border-radius:8px; cursor:pointer;">🎁 Tuntut Money Pocket Sekarang</button>
            </div>
        `;
        modalList.appendChild(rewardDiv);
    }

    document.getElementById('result-modal').classList.remove('hidden');
}

function claimReward() {
    let tngPhone = prompt("Tahniah! Sila masukkan Nombor Telefon Touch 'n Go (TnG) anda untuk terima duit raya/reward:");
    if (tngPhone) {
        studentData.tngPhone = tngPhone;
        alert(`Terima kasih ${studentData.name}! Nombor ${tngPhone} telah direkodkan.`);
    }
}

// Simpan Sejarah ke Firebase Firestore
async function saveStudentHistory(level, summary) {
    if (!studentData.email) return;

    let now = new Date();
    let dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
        await window.addDoc(window.collection(window.db, "history"), {
            email: studentData.email,
            date: dateStr,
            level: level,
            details: summary,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error("Gagal simpan sejarah:", error);
    }
}

// Papar Sejarah daripada Firebase Firestore
async function showHistoryModal() {
    if (!studentData.email) return;

    let historyListDiv = document.getElementById('history-list');
    historyListDiv.innerHTML = '<p style="text-align: center;">Memuatkan rekod...</p>';
    document.getElementById('history-modal').classList.remove('hidden');

    try {
        const q = window.query(window.collection(window.db, "history"), window.where("email", "==", studentData.email));
        const querySnapshot = await window.getDocs(q);

        historyListDiv.innerHTML = '';

        if (querySnapshot.empty) {
            historyListDiv.innerHTML = '<p style="text-align: center; color: #666;">Tiada rekod aktiviti lagi. Jom mula main!</p>';
            return;
        }

        let historyData = [];
        querySnapshot.forEach((doc) => {
            historyData.push(doc.data());
        });

        // Susun ikut yang terkini di atas
        historyData.sort((a, b) => b.timestamp - a.timestamp);

        historyData.forEach((item) => {
            let itemDiv = document.createElement('div');
            itemDiv.style.cssText = "background: #f8f9fa; border-left: 4px solid #4e54c8; padding: 8px 12px; margin-bottom: 8px; border-radius: 4px; font-size: 13px;";
            itemDiv.innerHTML = `
                <strong>🗓️ ${item.date}</strong><br>
                <span>🏆 Level ${item.level}</span><br>
                <small style="color: #555;">${item.details}</small>
            `;
            historyListDiv.appendChild(itemDiv);
        });

    } catch (error) {
        console.error("Gagal ambil sejarah:", error);
        historyListDiv.innerHTML = '<p style="text-align: center; color: red;">Gagal memuatkan rekod dari pelayan.</p>';
    }
}

function closeHistoryModal() {
    document.getElementById('history-modal').classList.add('hidden');
}

function sendResultToEmail() {
    let summaryText = `--- KEPUTUSAN KUIZ SIFIR ---\n`;
    summaryText += `Nama Pelajar: ${studentData.name}\n`;
    summaryText += `E-mel: ${studentData.email}\n`;
    summaryText += `No. Telefon TNG: ${studentData.tngPhone ? studentData.tngPhone : 'Tiada'}\n\n`;
    summaryText += `Pencapaian Level ${currentLevel}:\n`;
    
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
