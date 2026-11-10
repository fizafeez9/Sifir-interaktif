let studentData = { name: '', email: '' };
let currentLevel = 1;
let currentQuestionIndex = 0;
let currentLevelQuestions = [];
let scoreCount = 0;

// Bank Soalan Objektif (A, B, C, D) untuk 20 Level Silibus Matematik Darjah 3
const levelsQuestions = {
    1: [
        {
            q: "Apakah nilai digit bagi nombor 5 dalam nombor 4,582?",
            options: ["A) 5", "B) 50", "C) 500", "D) 5,000"],
            answer: "C) 500",
            explanation: "Digit 5 berada di tempat ratus (4,582), oleh itu nilai digitnya ialah 500."
        },
        {
            q: "Tuliskan nombor tiga ribu empat ratus dua belas dalam bentuk angka.",
            options: ["A) 3,412", "B) 3,042", "C) 3,421", "D) 3,214"],
            answer: "A) 3,412",
            explanation: "Tiga ribu = 3,000, empat ratus = 400, dua belas = 12. Digabungkan menjadi 3,412."
        },
        {
            q: "Apakah nilai tempat bagi digit 7 dalam nombor 7,039?",
            options: ["A) Sa", "B) Puluh", "C) Ratus", "D) Ribu"],
            answer: "D) Ribu",
            explanation: "Dalam nombor 7,039, digit 7 terletak di kedudukan pertama dari kiri, iaitu nilai tempat ribu."
        },
        {
            q: "Cerakinkan nombor 6,245 mengikut nilai digit.",
            options: ["A) 600 + 20 + 4 + 5", "B) 6,000 + 200 + 40 + 5", "C) 6,000 + 20 + 45", "D) 6 + 2 + 4 + 5"],
            answer: "B) 6,000 + 200 + 40 + 5",
            explanation: "Cerakin nilai digit mencerakinkan nombor mengikut nilai digit setiap nombor: 6,000 + 200 + 40 + 5."
        },
        {
            q: "Apakah nombor yang tertera jika cerakinan berikut disatukan: 8,000 + 400 + 30 + 2?",
            options: ["A) 8,342", "B) 8,042", "C) 8,432", "D) 8,423"],
            answer: "C) 8,432",
            explanation: "Gabungan 8,000 + 400 + 30 + 2 menghasilkan nombor 8,432."
        },
        {
            q: "Apakah digit yang berada di tempat puluh bagi nombor 3,914?",
            options: ["A) 1", "B) 9", "C) 4", "D) 3"],
            answer: "A) 1",
            explanation: "Bagi nombor 3,914, digit 9 ialah ratus, digit 1 ialah puluh, dan digit 4 ialah sa."
        },
        {
            q: "Tuliskan perkataan bagi nombor 5,060.",
            options: ["A) Lima ribu enam ratus", "B) Lima ribu enam puluh", "C) Lima ribu dan enam", "D) Lima ribu enam"],
            answer: "B) Lima ribu enam puluh",
            explanation: "Nombor 5,060 dibaca sebagai 'lima ribu enam puluh' (tiada nilai ratus)."
        },
        {
            q: "Apakah nilai digit bagi nombor 9 dalam nombor 2,190?",
            options: ["A) 9", "B) 90", "C) 900", "D) 9,000"],
            answer: "B) 90",
            explanation: "Digit 9 berada di tempat puluh, maka nilai digitnya ialah 90."
        },
        {
            q: "Cerakinkan nombor 4,108 mengikut nilai tempat.",
            options: ["A) 4 ribu + 1 ratus + 8 sa", "B) 4,000 + 100 + 8", "C) 4 ribu + 1 ratus + 0 puluh + 8 sa", "D) 4 + 1 + 0 + 8"],
            answer: "C) 4 ribu + 1 ratus + 0 puluh + 8 sa",
            explanation: "Cerakin mengikut nilai tempat wajib menulis perkataan 'ribu', 'ratus', 'puluh', dan 'sa'."
        },
        {
            q: "Nombor manakah yang lebih besar: 3,420 atau 3,240?",
            options: ["A) 3,420", "B) 3,240", "C) Dua-dua sama", "D) Tiada jawapan"],
            answer: "A) 3,420",
            explanation: "Apabila membandingkan nilai ratus, 4 ratus lebih besar daripada 2 ratus, jadi 3,420 lebih besar."
        }
    ],
    2: [
        {
            q: "Susun nombor berikut dalam tertib menaik: 3,210, 3,120, 3,400, 3,050",
            options: ["A) 3,400, 3,210, 3,120, 3,050", "B) 3,050, 3,120, 3,210, 3,400", "C) 3,050, 3,210, 3,120, 3,400", "D) 3,120, 3,050, 3,400, 3,210"],
            answer: "B) 3,050, 3,120, 3,210, 3,400",
            explanation: "Tertib menaik bermaksud susunan nombor dari nilai yang kecil kepada nilai yang besar."
        },
        {
            q: "Susun nombor berikut dalam tertib menurun: 4,502, 4,520, 4,052, 4,250",
            options: ["A) 4,520, 4,502, 4,250, 4,052", "B) 4,052, 4,250, 4,502, 4,520", "C) 4,520, 4,250, 4,502, 4,052", "D) 4,250, 4,520, 4,052, 4,502"],
            answer: "A) 4,520, 4,502, 4,250, 4,052",
            explanation: "Tertib menurun bermaksud susunan nombor dari nilai yang besar kepada nilai yang kecil."
        },
        {
            q: "Pilih nombor yang lebih kecil antara 5,142 dan 5,124.",
            options: ["A) 5,142", "B) 5,124", "C) Sama besar", "D) Tidak pasti"],
            answer: "B) 5,124",
            explanation: "Membandingkan nombor puluh: 2 puluh lebih kecil daripada 4 puluh, maka 5,124 lebih kecil."
        },
        {
            q: "Lengkapkan pola nombor berikut secara tertib menaik sepuluh-sepuluh: 2,430, 2,440, 2,450, ...",
            options: ["A) 2,455", "B) 2,460", "C) 2,500", "D) 2,441"],
            answer: "B) 2,460",
            explanation: "Pola menambah 10 pada setiap langkah: 2,450 + 10 = 2,460."
        },
        {
            q: "Apakah nombor yang tertinggal dalam pola menurun seratus-seratus ini: 7,500, 7,400, ...?",
            options: ["A) 7,300", "B) 7,450", "C) 7,200", "D) 7,350"],
            answer: "A) 7,300",
            explanation: "Pola menolak 100 pada setiap langkah: 7,400 - 100 = 7,300."
        },
        {
            q: "Bandingkan dua nombor ini. Gunakan simbol > atau <: 6,890 ... 6,980",
            options: ["A) >", "B) <", "C) =", "D) +"],
            answer: "B) <",
            explanation: "6,890 adalah lebih kecil daripada 6,980, maka tanda perbandingan yang betul ialah '<'."
        },
        {
            q: "Kenal pasti nombor yang paling besar nilainya: 1,980, 2,005, 1,999, 2,050",
            options: ["A) 1,980", "B) 1,999", "C) 2,005", "D) 2,050"],
            answer: "D) 2,050",
            explanation: "Nilai 2,050 adalah yang paling tinggi antara pilihan yang diberikan."
        },
        {
            q: "Apakah corak penambahan (pola) bagi urutan nombor ini: 1,200, 1,205, 1,210, 1,215?",
            options: ["A) Tertib menaik lima-lima", "B) Tertib menaik sepuluh-sepuluh", "C) Tertib menurun lima-lima", "D) Tertib menaik satu-satu"],
            answer: "A) Tertib menaik lima-lima",
            explanation: "Setiap nombor bertambah sebanyak 5 unit secara konsisten (1,200 ke 1,205)."
        },
        {
            q: "Susun semula nombor ini mengikut tertib menaik: 8,012, 8,102, 8,021, 8,002",
            options: ["A) 8,002, 8,012, 8,021, 8,102", "B) 8,102, 8,021, 8,012, 8,002", "C) 8,002, 8,021, 8,012, 8,102", "D) 8,012, 8,002, 8,021, 8,102"],
            answer: "A) 8,002, 8,012, 8,021, 8,102",
            explanation: "Susunan bermula dari yang terkecil: 8,002, diikuti 8,012, 8,021, dan 8,102."
        },
        {
            q: "Nombor manakah yang terletak di tengah-tengah antara 4,000 dan 4,020?",
            options: ["A) 4,005", "B) 4,010", "C) 4,015", "D) 4,002"],
            answer: "B) 4,010",
            explanation: "Nilai tengah bagi jarak nombor dari 4,000 ke 4,020 ialah 4,010."
        }
    ]
};

// Penjana automatik untuk Level 3 hingga 20 sebagai templat silibus objektif
for (let i = 3; i <= 20; i++) {
    levelsQuestions[i] = [];
    for (let j = 1; j <= 10; j++) {
        levelsQuestions[i].push({
            q: `Soalan ${j} untuk Level ${i}: Apakah jawapan yang betul bagi operasi matematik ini?`,
            options: ["A) 100", "B) 200", "C) 300", "D) 400"],
            answer: "A) 100",
            explanation: `Ini adalah penerangan jawapan contoh bagi soalan ${j} dalam Level ${i}.`
        });
    }
}

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
        const q = window.query(window.collection(window.db, "students"), window.where("email", "==", email));
        const querySnapshot = await window.getDocs(q);

        if (!querySnapshot.empty) {
            alert("⚠️ E-mel ini sudah berdaftar! Sila log masuk.");
            showLoginPage(e);
            return;
        }

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
    studentData = { name: '', email: '' };
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
    currentQuestionIndex = 0;
    scoreCount = 0;
    currentLevelQuestions = levelsQuestions[lvl] || levelsQuestions[1];

    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
    
    loadQuestion();
}

function loadQuestion() {
    let qData = currentLevelQuestions[currentQuestionIndex];
    document.getElementById('current-stage-title').innerText = `Level ${currentLevel}`;
    document.getElementById('question-counter').innerText = `Soalan ${currentQuestionIndex + 1}/${currentLevelQuestions.length}`;
    document.getElementById('question-text').innerText = qData.q;
    
    // Paparkan pilihan jawapan A, B, C, D
    let optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    qData.options.forEach((opt) => {
        let btn = document.createElement('button');
        btn.type = 'button';
        btn.innerText = opt;
        btn.style.cssText = "margin-bottom: 10px; background-color: #f8f9fa; color: #333; border: 2px solid #4e54c8; padding: 10px; border-radius: 8px; font-size: 15px; text-align: left; width: 100%; cursor: pointer; transition: 0.2s;";
        btn.onmouseover = () => btn.style.backgroundColor = "#e2e6ea";
        btn.onmouseout = () => btn.style.backgroundColor = "#f8f9fa";
        btn.onclick = () => selectAnswer(opt);
        optionsContainer.appendChild(btn);
    });

    document.getElementById('options-container').style.display = 'block';
    document.getElementById('explanation-box').classList.add('hidden');
}

function selectAnswer(selectedOpt) {
    let qData = currentLevelQuestions[currentQuestionIndex];
    let isCorrect = selectedOpt === qData.answer;

    if (isCorrect) {
        playCorrectSound();
        scoreCount++;
        document.getElementById('explanation-title').innerText = "✅ Betul! Tahniah!";
        document.getElementById('explanation-title').style.color = "#27ae60";
    } else {
        playWrongSound();
        document.getElementById('explanation-title').innerText = `❌ Kurang Tepat. Jawapan sebenar ialah ${qData.answer}`;
        document.getElementById('explanation-title').style.color = "#e74c3c";
    }

    document.getElementById('explanation-text').innerText = qData.explanation;
    document.getElementById('options-container').style.display = 'none';
    document.getElementById('explanation-box').classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentLevelQuestions.length) {
        loadQuestion();
    } else {
        showLevelResultModal();
    }
}

function showLevelResultModal() {
    let modalList = document.getElementById('modal-results-list');
    modalList.innerHTML = `
        <p style="font-size: 16px; margin: 10px 0;">Pencapaian anda untuk <strong>Level ${currentLevel}</strong>:</p>
        <h3 style="color: #4e54c8; font-size: 24px;">Skor: ${scoreCount} / ${currentLevelQuestions.length}</h3>
    `;

    saveStudentHistory(currentLevel, `Skor: ${scoreCount}/${currentLevelQuestions.length}`);

    document.getElementById('result-modal').classList.remove('hidden');
}

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
            historyListDiv.innerHTML = '<p style="text-align: center; color: #666;">Tiada rekod aktiviti lagi. Jom mula jawab soalan!</p>';
            return;
        }

        let historyData = [];
        querySnapshot.forEach((doc) => {
            historyData.push(doc.data());
        });

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

function closeModalAndReturn() {
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('level-page').classList.remove('hidden');
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
