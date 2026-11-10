let studentData = { name: '', email: '' };
let currentLevel = 1;
let currentQuestionIndex = 0;
let currentLevelQuestions = [];
let scoreCount = 0;

// Bank Soalan untuk 20 Level Silibus Matematik Darjah 3
const levelsQuestions = {
    1: [
        {
            q: "Apakah nilai digit bagi nombor 5 dalam nombor 4,582?",
            options: ["500", "50", "5", "5000"],
            answer: "500",
            explanation: "Digit 5 berada di tempat ratus (4,582), oleh itu nilai digitnya ialah 500."
        },
        {
            q: "Tuliskan nombor tiga ribu empat ratus dua belas dalam bentuk angka.",
            options: ["3412", "3042", "3421", "3214"],
            answer: "3412",
            explanation: "Tiga ribu = 3,000, empat ratus = 400, dua belas = 12. Digabungkan menjadi 3,412 (atau 3412)."
        },
        {
            q: "Apakah nilai tempat bagi digit 7 dalam nombor 7,039?",
            options: ["ribu", "ratus", "puluh", "sa"],
            answer: "ribu",
            explanation: "Dalam nombor 7,039, digit 7 terletak di kedudukan pertama dari kiri, iaitu nilai tempat ribu."
        },
        {
            q: "Cerakinkan nombor 6,245 mengikut nilai digit.",
            options: ["6000 + 200 + 40 + 5", "600 + 20 + 4 + 5", "6000 + 20 + 45", "6 + 2 + 4 + 5"],
            answer: "6000 + 200 + 40 + 5",
            explanation: "Cerakin nilai digit mencerakinkan nombor mengikut nilai digit setiap nombor: 6000 + 200 + 40 + 5."
        },
        {
            q: "Apakah nombor yang tertera jika cerakinkan berikut disatukan: 8,000 + 400 + 30 + 2?",
            options: ["8432", "8342", "8042", "8423"],
            answer: "8432",
            explanation: "Gabungan 8000 + 400 + 30 + 2 menghasilkan nombor 8,432."
        },
        {
            q: "Apakah digit yang berada di tempat puluh bagi nombor 3,914?",
            options: ["1", "9", "4", "3"],
            answer: "1",
            explanation: "Bagi nombor 3,914, digit 9 ialah ratus, digit 1 ialah puluh, dan digit 4 ialah sa."
        },
        {
            q: "Tuliskan perkataan bagi nombor 5,060.",
            options: ["lima ribu enam puluh", "lima ribu enam ratus", "lima ribu dan enam", "lima ribu enam"],
            answer: "lima ribu enam puluh",
            explanation: "Nombor 5,060 dibaca sebagai 'lima ribu enam puluh' (tiada ratus)."
        },
        {
            q: "Apakah nilai digit bagi nombor 9 dalam nombor 2,190?",
            options: ["90", "9", "900", "9000"],
            answer: "90",
            explanation: "Digit 9 berada di tempat puluh, maka nilai digitnya ialah 90."
        },
        {
            q: "Cerakinkan nombor 4,108 mengikut nilai tempat.",
            options: ["4 ribu + 1 ratus + 0 puluh + 8 sa", "4000 + 100 + 8", "4 ribu + 1 ratus + 8 sa", "4 + 1 + 0 + 8"],
            answer: "4 ribu + 1 ratus + 0 puluh + 8 sa",
            explanation: "Cerakin mengikut nilai tempat wajib menulis perkataan 'ribu', 'ratus', 'puluh', dan 'sa'."
        },
        {
            q: "Nombor manakah yang lebih besar: 3,420 atau 3,240?",
            options: ["3420", "3240", "dua-dua sama", "tiada jawapan"],
            answer: "3420",
            explanation: "Apabila membandingkan ratus, 4 ratus lebih besar daripada 2 ratus, jadi 3,420 lebih besar."
        }
    ],
    2: [
        {
            q: "Susun nombor berikut dalam tertib menaik: 3,210, 3,120, 3,400, 3,050",
            options: ["3050, 3120, 3210, 3400", "3400, 3210, 3120, 3050", "3050, 3210, 3120, 3400", "3120, 3050, 3400, 3210"],
            answer: "3050, 3120, 3210, 3400",
            explanation: "Tertib menaik bermaksud susunan nombor dari kecil kepada besar."
        },
        {
            q: "Susun nombor berikut dalam tertib menurun: 4,502, 4,520, 4,052, 4,250",
            options: ["4520, 4502, 4250, 4052", "4052, 4250, 4502, 4520", "4520, 4250, 4502, 4052", "4250, 4520, 4052, 4502"],
            answer: "4520, 4502, 4250, 4052",
            explanation: "Tertib menurun bermaksud susunan nombor dari besar kepada kecil."
        },
        {
            q: "Pilih nombor yang lebih kecil antara 5,142 dan 5,124.",
            options: ["5124", "5142", "sama besar", "tidak pasti"],
            answer: "5124",
            explanation: "Membandingkan nombor puluh: 2 puluh lebih kecil daripada 4 puluh, maka 5,124 lebih kecil."
        },
        {
            q: "Lengkapkan pola nombor berikut secara tertib menaik sepuluh-sepuluh: 2,430, 2,440, 2,450, ...",
            options: ["2460", "2455", "2500", "2441"],
            answer: "2460",
            explanation: "Pola menambah 10 setiap langkah: 2,450 + 10 = 2,460."
        },
        {
            q: "Apakah nombor yang tertinggal dalam pola menurun seratus-seratus ini: 7,500, 7,400, ...?",
            options: ["7300", "7450", "7200", "7350"],
            answer: "7300",
            explanation: "Pola tolak 100 setiap langkah: 7,400 - 100 = 7,300."
        },
        {
            q: "Bandingkan dua nombor ini. Gunakan simbol > atau <: 6,890 ... 6,980",
            options: ["<", ">", "=", "+"],
            answer: "<",
            explanation: "6,890 adalah lebih kecil daripada 6,980, maka tanda yang betul ialah '<'."
        },
        {
            q: "Kenal pasti nombor yang paling besar nilainya: 1,980, 2,005, 1,999, 2,050",
            options: ["2050", "2005", "1999", "1980"],
            answer: "2050",
            explanation: "Nilai 2,050 adalah yang paling tinggi antara pilihan yang diberikan."
        },
        {
            q: "Apakah corak penambahan (pola) bagi urutan nombor ini: 1,200, 1,205, 1,210, 1,215?",
            options: ["tertib menaik lima-lima", "tertib menaik sepuluh-sepuluh", "tertib menurun lima-lima", "tertib menaik satu-satu"],
            answer: "tertib menaik lima-lima",
            explanation: "Setiap nombor bertambah sebanyak 5 units (1,200 ke 1,205)."
        },
        {
            q: "Susun semula nombor ini mengikut tertib menaik: 8,012, 8,102, 8,021, 8,002",
            options: ["8002, 8012, 8021, 8102", "8102, 8021, 8012, 8002", "8002, 8021, 8012, 8102", "8012, 8002, 8021, 8102"],
            answer: "8002, 8012, 8021, 8102",
            explanation: "Susunan dari terkecil: 8,002, diikuti 8,012, 8,021, dan 8,102."
        },
        {
            q: "Nombor manakah yang terletak di tengah-tengah antara 4,000 dan 4,020?",
            options: ["4010", "4005", "4015", "4002"],
            answer: "4010",
            explanation: "Nilai tengah bagi jarak 20 unit (4000 ke 4020) ialah 4,010."
        }
    ]
};

// Penjana automatik untuk Level 3 hingga 20 sebagai templat silibus
for (let i = 3; i <= 20; i++) {
    levelsQuestions[i] = [];
    for (let j = 1; j <= 10; j++) {
        levelsQuestions[i].push({
            q: `Soalan ${j} untuk Level ${i}: Apakah hasil penyelesaian operasi matematik asas Darjah 3?`,
            options: ["100", "200", "300", "400"],
            answer: "100",
            explanation: `Ini adalah penerangan contoh bagi soalan ${j} dalam Level ${i} untuk memastikan kefahaman murid.`
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
    
    document.getElementById('user-answer').value = '';
    document.getElementById('explanation-box').classList.add('hidden');
    document.getElementById('answer-form').style.display = 'block';
}

function checkAnswer(e) {
    e.preventDefault();
    let userAns = document.getElementById('user-answer').value.trim();
    let qData = currentLevelQuestions[currentQuestionIndex];

    // Semakan jawapan (membenarkan padanan teks atau nombor)
    let isCorrect = userAns.toLowerCase() === qData.answer.toLowerCase();

    if (isCorrect) {
        playCorrectSound();
        scoreCount++;
        document.getElementById('explanation-title').innerText = "✅ Betul! Tahniah!";
        document.getElementById('explanation-title').style.color = "#27ae60";
    } else {
        playWrongSound();
        document.getElementById('explanation-title').innerText = `❌ Kurang Tepat. Jawapan sebenar: ${qData.answer}`;
        document.getElementById('explanation-title').style.color = "#e74c3c";
    }

    document.getElementById('explanation-text').innerText = qData.explanation;
    document.getElementById('answer-form').style.display = 'none';
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

    // Simpan rekod sejarah ke Cloud Firebase
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
