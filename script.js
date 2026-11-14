let studentData = { name: '', email: '' };
let currentLevel = 1;
let currentQuestionIndex = 0;
let currentLevelQuestions = [];
let scoreCount = 0;
let isTahun2Mode = false; // Penanda untuk kenal sama ada mod Tahun 2 atau Darjah 3

// ==========================================
// FUNGSI NAVIGASI HALAMAN
// ==========================================

function showLoginPage(e) {
    if (e) e.preventDefault();
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
}

function showRegisterPage(e) {
    if (e) e.preventDefault();
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
}

function showMainMenu() {
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('tahun2-level-page').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('history-page').classList.add('hidden');
    document.getElementById('silibus-page').classList.add('hidden');
    
    document.getElementById('main-menu-page').classList.remove('hidden');
    document.body.classList.add('menu-active-bg');
}

function showLevelSelection() {
    isTahun2Mode = false;
    document.getElementById('main-menu-page').classList.add('hidden');
    document.getElementById('level-page').classList.remove('hidden');
}

function showSilibusPage() {
    document.getElementById('main-menu-page').classList.add('hidden');
    document.getElementById('silibus-page').classList.remove('hidden');
}

function startTahun2Silibus() {
    if (!studentData.name) {
        alert("⚠️ Sila log masuk terlebih dahulu!");
        logout();
        return;
    }

    // Paparkan pilihan level Tahun 2
    document.getElementById('silibus-page').classList.add('hidden');
    document.getElementById('tahun2-level-page').classList.remove('hidden');
}

function backToMainMenu() {
    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('tahun2-level-page').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('history-page').classList.add('hidden');
    document.getElementById('silibus-page').classList.add('hidden');
    document.getElementById('main-menu-page').classList.remove('hidden');
}

// ==========================================
// LOGIK FIREBASE: PENDAFTARAN & LOG MASUK
// ==========================================

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
            showMainMenu();
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
    document.getElementById('main-menu-page').classList.add('hidden');
    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('tahun2-level-page').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('history-page').classList.add('hidden');
    document.getElementById('silibus-page').classList.add('hidden');
    
    document.body.classList.remove('menu-active-bg');
    
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

// ==========================================
// LOGIK KUIZ & PERMAINAN
// ==========================================

function selectLevel(lvl) {
    if (!studentData.name) {
        alert("⚠️ Sila log masuk terlebih dahulu!");
        logout();
        return;
    }

    isTahun2Mode = false;
    currentLevel = lvl;
    currentQuestionIndex = 0;
    scoreCount = 0;
    currentLevelQuestions = levelsQuestions[lvl] || levelsQuestions[1];

    document.getElementById('main-menu-page').classList.add('hidden');
    document.getElementById('level-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
    
    loadQuestion();
}

function selectTahun2Level(lvl) {
    if (!studentData.name) {
        alert("⚠️ Sila log masuk terlebih dahulu!");
        logout();
        return;
    }

    isTahun2Mode = true;
    currentLevel = lvl;
    currentQuestionIndex = 0;
    scoreCount = 0;
    currentLevelQuestions = tahun2Questions[lvl] || tahun2Questions[1];

    document.getElementById('tahun2-level-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
    
    loadQuestion();
}

function loadQuestion() {
    let qData = currentLevelQuestions[currentQuestionIndex];
    let modeTitle = isTahun2Mode ? `Tahun 2 - Level ${currentLevel}` : `Level ${currentLevel}`;
    
    document.getElementById('current-stage-title').innerText = modeTitle;
    document.getElementById('question-counter').innerText = `Soalan ${currentQuestionIndex + 1}/${currentLevelQuestions.length}`;
    document.getElementById('question-text').innerText = qData.q;
    
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
    let levelPrefix = isTahun2Mode ? `Tahun 2 (Lvl ${currentLevel})` : `Level ${currentLevel}`;
    
    modalList.innerHTML = `
        <p style="font-size: 16px; margin: 10px 0;">Pencapaian anda untuk <strong>${levelPrefix}</strong>:</p>
        <h3 style="color: #4e54c8; font-size: 24px;">Skor: ${scoreCount} / ${currentLevelQuestions.length}</h3>
    `;

    saveStudentHistory(levelPrefix, `Skor: ${scoreCount}/${currentLevelQuestions.length}`);
    document.getElementById('result-modal').classList.remove('hidden');
}

async function saveStudentHistory(levelInfo, summary) {
    if (!studentData.email) return;

    let now = new Date();
    let dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
        await window.addDoc(window.collection(window.db, "history"), {
            email: studentData.email,
            date: dateStr,
            level: levelInfo,
            details: summary,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error("Gagal simpan sejarah:", error);
    }
}

async function showHistoryModal() {
    if (!studentData.email) {
        alert("⚠️ Sila log masuk terlebih dahulu!");
        return;
    }

    let historyListDiv = document.getElementById('history-list');
    historyListDiv.innerHTML = '<p style="text-align: center; color: #555;">Memuatkan rekod...</p>';

    document.getElementById('main-menu-page').classList.add('hidden');
    document.getElementById('history-page').classList.remove('hidden');

    try {
        const q = window.query(window.collection(window.db, "history"), window.where("email", "==", studentData.email));
        const querySnapshot = await window.getDocs(q);

        historyListDiv.innerHTML = '';

        if (querySnapshot.empty) {
            historyListDiv.innerHTML = '<p style="text-align: center; color: #666; padding: 20px 0;">Tiada rekod aktiviti lagi. Jom mula jawab soalan!</p>';
            return;
        }

        let historyData = [];
        querySnapshot.forEach((doc) => {
            historyData.push(doc.data());
        });

        historyData.sort((a, b) => b.timestamp - a.timestamp);

        historyData.forEach((item) => {
            let itemDiv = document.createElement('div');
            itemDiv.style.cssText = "background: #f8f9fa; border-left: 5px solid #4e54c8; padding: 12px 15px; margin-bottom: 10px; border-radius: 8px; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);";
            itemDiv.innerHTML = `
                <strong>🗓️ ${item.date}</strong><br>
                <span style="color: #2e7d32; font-weight: bold;">🏆 ${item.level}</span><br>
                <span style="color: #333; font-weight: 600;">${item.details}</span>
            `;
            historyListDiv.appendChild(itemDiv);
        });

    } catch (error) {
        console.error("Gagal ambil sejarah:", error);
        historyListDiv.innerHTML = '<p style="text-align: center; color: red;">Gagal memuatkan rekod dari pelayan.</p>';
    }
}

function closeHistoryPage() {
    document.getElementById('history-page').classList.add('hidden');
    document.getElementById('main-menu-page').classList.remove('hidden');
}

function closeModalAndReturn() {
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden');
    
    if (isTahun2Mode) {
        document.getElementById('tahun2-level-page').classList.remove('hidden');
    } else {
        document.getElementById('level-page').classList.remove('hidden');
    }
}

function openCreditModal() {
    alert("⭐ Pautan Tebus Kredit akan datang!");
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

// ==========================================
// BANK SOALAN DARJAH 3 (Level 1 hingga 20)
// ==========================================

const levelsQuestions = {
    1: [
        { q: "Apakah nilai digit bagi nombor 5 dalam nombor 4,582?", options: ["A) 5", "B) 50", "C) 500", "D) 5,000"], answer: "C) 500", explanation: "Digit 5 berada di tempat ratus (4,582), oleh itu nilai digitnya ialah 500." },
        { q: "Tuliskan nombor tiga ribu empat ratus dua belas dalam bentuk angka.", options: ["A) 3,412", "B) 3,042", "C) 3,421", "D) 3,214"], answer: "A) 3,412", explanation: "Tiga ribu = 3,000, empat ratus = 400, dua belas = 12. Digabungkan menjadi 3,412." },
        { q: "Apakah nilai tempat bagi digit 7 dalam nombor 7,039?", options: ["A) Sa", "B) Puluh", "C) Ratus", "D) Ribu"], answer: "D) Ribu", explanation: "Dalam nombor 7,039, digit 7 terletak di kedudukan pertama dari kiri, iaitu nilai tempat ribu." },
        { q: "Cerakinkan nombor 6,245 mengikut nilai digit.", options: ["A) 600 + 20 + 4 + 5", "B) 6,000 + 200 + 40 + 5", "C) 6,000 + 20 + 45", "D) 6 + 2 + 4 + 5"], answer: "B) 6,000 + 200 + 40 + 5", explanation: "Cerakin nilai digit mencerakinkan nombor mengikut nilai digit setiap nombor: 6,000 + 200 + 40 + 5." },
        { q: "Apakah nombor yang tertera jika cerakinan berikut disatukan: 8,000 + 400 + 30 + 2?", options: ["A) 8,342", "B) 8,042", "C) 8,432", "D) 8,423"], answer: "C) 8,432", explanation: "Gabungan 8,000 + 400 + 30 + 2 menghasilkan nombor 8,432." },
        { q: "Apakah digit yang berada di tempat puluh bagi nombor 3,914?", options: ["A) 1", "B) 9", "C) 4", "D) 3"], answer: "A) 1", explanation: "Bagi nombor 3,914, digit 9 ialah ratus, digit 1 ialah puluh, dan digit 4 ialah sa." },
        { q: "Tuliskan perkataan bagi nombor 5,060.", options: ["A) Lima ribu enam ratus", "B) Lima ribu enam puluh", "C) Lima ribu dan enam", "D) Lima ribu enam"], answer: "B) Lima ribu enam puluh", explanation: "Nombor 5,060 dibaca sebagai 'lima ribu enam puluh' (tiada nilai ratus)." },
        { q: "Apakah nilai digit bagi nombor 9 dalam nombor 2,190?", options: ["A) 9", "B) 90", "C) 900", "D) 9,000"], answer: "B) 90", explanation: "Digit 9 berada di tempat puluh, maka nilai digitnya ialah 90." },
        { q: "Cerakinkan nombor 4,108 mengikut nilai tempat.", options: ["A) 4 ribu + 1 ratus + 8 sa", "B) 4,000 + 100 + 8", "C) 4 ribu + 1 ratus + 0 puluh + 8 sa", "D) 4 + 1 + 0 + 8"], answer: "C) 4 ribu + 1 ratus + 0 puluh + 8 sa", explanation: "Cerakin mengikut nilai tempat wajib menulis perkataan 'ribu', 'ratus', 'puluh', dan 'sa'." },
        { q: "Nombor manakah yang lebih besar: 3,420 atau 3,240?", options: ["A) 3,420", "B) 3,240", "C) Dua-dua sama", "D) Tiada jawapan"], answer: "A) 3,420", explanation: "Apabila membandingkan nilai ratus, 4 ratus lebih besar daripada 2 ratus, jadi 3,420 lebih besar." }
    ],
    2: [
        { q: "Susun nombor berikut dalam tertib menaik: 3,210, 3,120, 3,400, 3,050", options: ["A) 3,400, 3,210, 3,120, 3,050", "B) 3,050, 3,120, 3,210, 3,400", "C) 3,050, 3,210, 3,120, 3,400", "D) 3,120, 3,050, 3,400, 3,210"], answer: "B) 3,050, 3,120, 3,210, 3,400", explanation: "Tertib menaik bermaksud susunan nombor dari nilai yang kecil kepada nilai yang besar." },
        { q: "Susun nombor berikut dalam tertib menurun: 4,502, 4,520, 4,052, 4,250", options: ["A) 4,520, 4,502, 4,250, 4,052", "B) 4,052, 4,250, 4,502, 4,520", "C) 4,520, 4,250, 4,502, 4,052", "D) 4,250, 4,520, 4,052, 4,502"], answer: "A) 4,520, 4,502, 4,250, 4,052", explanation: "Tertib menurun bermaksud susunan nombor dari nilai yang besar kepada nilai yang kecil." },
        { q: "Pilih nombor yang lebih kecil antara 5,142 dan 5,124.", options: ["A) 5,142", "B) 5,124", "C) Sama besar", "D) Tidak pasti"], answer: "B) 5,124", explanation: "Membandingkan nombor puluh: 2 puluh lebih kecil daripada 4 puluh, maka 5,124 lebih kecil." },
        { q: "Lengkapkan pola nombor berikut secara tertib menaik sepuluh-sepuluh: 2,430, 2,440, 2,450, ...", options: ["A) 2,455", "B) 2,460", "C) 2,500", "D) 2,441"], answer: "B) 2,460", explanation: "Pola menambah 10 pada setiap langkah: 2,450 + 10 = 2,460." },
        { q: "Apakah nombor yang tertinggal dalam pola menurun seratus-seratus ini: 7,500, 7,400, ...?", options: ["A) 7,300", "B) 7,450", "C) 7,200", "D) 7,350"], answer: "A) 7,300", explanation: "Pola menolak 100 pada setiap langkah: 7,400 - 100 = 7,300." },
        { q: "Bandingkan dua nombor ini. Gunakan simbol > atau <: 6,890 ... 6,980", options: ["A) >", "B) <", "C) =", "D) +"], answer: "B) <", explanation: "6,890 adalah lebih kecil daripada 6,980, maka tanda perbandingan yang betul ialah '<'." },
        { q: "Kenal pasti nombor yang paling besar nilainya: 1,980, 2,005, 1,999, 2,050", options: ["A) 1,980", "B) 1,999", "C) 2,005", "D) 2,050"], answer: "D) 2,050", explanation: "Nilai 2,050 adalah yang paling tinggi antara pilihan yang diberikan." },
        { q: "Apakah corak penambahan (pola) bagi urutan nombor ini: 1,200, 1,205, 1,210, 1,215?", options: ["A) Tertib menaik lima-lima", "B) Tertib menaik sepuluh-sepuluh", "C) Tertib menurun lima-lima", "D) Tertib menaik satu-satu"], answer: "A) Tertib menaik lima-lima", explanation: "Setiap nombor bertambah sebanyak 5 unit secara konsisten (1,200 ke 1,205)." },
        { q: "Susun semula nombor ini mengikut tertib menaik: 8,012, 8,102, 8,021, 8,002", options: ["A) 8,002, 8,012, 8,021, 8,102", "B) 8,102, 8,021, 8,012, 8,002", "C) 8,002, 8,021, 8,012, 8,102", "D) 8,012, 8,002, 8,021, 8,102"], answer: "A) 8,002, 8,012, 8,021, 8,102", explanation: "Susunan bermula dari yang terkecil: 8,002, diikuti 8,012, 8,021, dan 8,102." },
        { q: "Nombor manakah yang terletak di tengah-tengah antara 4,000 dan 4,020?", options: ["A) 4,005", "B) 4,010", "C) 4,015", "D) 4,002"], answer: "B) 4,010", explanation: "Nilai tengah bagi jarak nombor dari 4,000 ke 4,020 ialah 4,010." }
    ],
    3: [
        { q: "Selesaikan: 2,134 + 3,421 = ?", options: ["A) 5,555", "B) 5,455", "C) 5,655", "D) 4,555"], answer: "A) 5,555", explanation: "Tambah mengikut nilai tempat tanpa mengumpul semula: 2,134 + 3,421 = 5,555." },
        { q: "Selesaikan: 4,023 + 1,512 = ?", options: ["A) 5,535", "B) 5,435", "C) 5,635", "D) 5,525"], answer: "A) 5,535", explanation: "4,023 + 1,512 = 5,535." },
        { q: "Selesaikan: 5,320 + 2,146 = ?", options: ["A) 7,466", "B) 7,366", "C) 7,566", "D) 7,456"], answer: "A) 7,466", explanation: "5,320 + 2,146 = 7,466." },
        { q: "Selesaikan: 1,011 + 6,854 = ?", options: ["A) 7,865", "B) 7,765", "C) 7,855", "D) 6,865"], answer: "A) 7,865", explanation: "1,011 + 6,854 = 7,865." },
        { q: "Selesaikan: 3,210 + 4,320 = ?", options: ["A) 7,530", "B) 7,430", "C) 7,630", "D) 7,520"], answer: "A) 7,530", explanation: "3,210 + 4,320 = 7,530." },
        { q: "Selesaikan: 6,142 + 2,335 = ?", options: ["A) 8,477", "B) 8,377", "C) 8,577", "D) 8,467"], answer: "A) 8,477", explanation: "6,142 + 2,335 = 8,477." },
        { q: "Selesaikan: 2,431 + 5,124 = ?", options: ["A) 7,555", "B) 7,455", "C) 7,655", "D) 7,545"], answer: "A) 7,555", explanation: "2,431 + 5,124 = 7,555." },
        { q: "Selesaikan: 4,120 + 3,850 = ?", options: ["A) 7,970", "B) 7,870", "C) 7,960", "D) 8,970"], answer: "A) 7,970", explanation: "4,120 + 3,850 = 7,970." },
        { q: "Selesaikan: 7,021 + 1,432 = ?", options: ["A) 8,453", "B) 8,353", "C) 8,553", "D) 8,443"], answer: "A) 8,453", explanation: "7,021 + 1,432 = 8,453." },
        { q: "Selesaikan: 3,142 + 4,015 = ?", options: ["A) 7,157", "B) 7,057", "C) 7,257", "D) 7,147"], answer: "A) 7,157", explanation: "3,142 + 4,015 = 7,157." }
    ],
    4: [
        { q: "Hitung hasil tambah bagi 2,450 + 1,325", options: ["A) 3,775", "B) 3,675", "C) 3,875", "D) 3,765"], answer: "A) 3,775", explanation: "2,450 + 1,325 = 3,775." },
        { q: "Selesaikan: 2,120 + 3,674", options: ["A) 5,794", "B) 5,694", "C) 5,894", "D) 5,784"], answer: "A) 5,794", explanation: "2,120 + 3,674 = 5,794." },
        { q: "Tambahkan 5,082 dengan 2,410.", options: ["A) 7,492", "B) 7,392", "C) 7,592", "D) 7,482"], answer: "A) 7,492", explanation: "5,082 + 2,410 = 7,492." },
        { q: "Cari jumlah bagi 3,456 + 1,283 (mengumpul semula).", options: ["A) 4,739", "B) 4,639", "C) 4,839", "D) 4,729"], answer: "A) 4,739", explanation: "6+3=9, 5+8=13 (simpan 1), 4+2+1=7, 3+1=4. Jawapan: 4,739." },
        { q: "Hitung hasil tambah tiga nombor ini: 3,200 + 2,300 + 1,150", options: ["A) 6,650", "B) 6,550", "C) 6,750", "D) 6,640"], answer: "A) 6,650", explanation: "3,200 + 2,300 = 5,500. 5,500 + 1,150 = 6,650." },
        { q: "Apakah jumlah bagi 6,421 + 2,138?", options: ["A) 8,559", "B) 8,459", "C) 8,659", "D) 8,549"], answer: "A) 8,559", explanation: "6,421 + 2,138 = 8,559." },
        { q: "Selesaikan penambahan berikut: 492 + 3,250", options: ["A) 3,742", "B) 3,642", "C) 3,842", "D) 3,732"], answer: "A) 3,742", explanation: "3,250 + 492 = 3,742." },
        { q: "Tambahkan 7,045 dengan 1,890.", options: ["A) 8,935", "B) 8,835", "C) 9,935", "D) 8,925"], answer: "A) 8,935", explanation: "7,045 + 1,890 = 8,935." },
        { q: "Sebuah perpustakaan mempunyai 3,400 buah buku BM dan 2,520 buah buku BI. Berapakah jumlah keseluruhan buku itu?", options: ["A) 5,920", "B) 5,820", "C) 6,020", "D) 5,910"], answer: "A) 5,920", explanation: "3,400 + 2,520 = 5,920 buah buku." },
        { q: "Cari nilai anu bagi: 4,300 + 3,250 = ?", options: ["A) 7,550", "B) 7,450", "C) 7,650", "D) 7,540"], answer: "A) 7,550", explanation: "4,300 + 3,250 = 7,550." }
    ],
    5: [
        { q: "Hitung baki bagi 5,000 - 1,842.", options: ["A) 3,158", "B) 3,258", "C) 3,148", "D) 3,058"], answer: "A) 3,158", explanation: "5,000 - 1,842 = 3,158." },
        { q: "Selesaikan: 7,420 - 3,150.", options: ["A) 4,270", "B) 4,170", "C) 4,370", "D) 4,260"], answer: "A) 4,270", explanation: "7,420 - 3,150 = 4,270." },
        { q: "Tolakkan 1,245 daripada 6,300.", options: ["A) 5,055", "B) 5,155", "C) 5,045", "D) 4,055"], answer: "A) 5,055", explanation: "6,300 - 1,245 = 5,055." },
        { q: "Cari beza antara 8,054 dengan 4,213.", options: ["A) 3,841", "B) 3,941", "C) 3,741", "D) 3,831"], answer: "A) 3,841", explanation: "8,054 - 4,213 = 3,841." },
        { q: "Selesaikan operasi berturut-turut: 9,000 - 2,400 - 1,500.", options: ["A) 5,100", "B) 5,000", "C) 5,200", "D) 4,100"], answer: "A) 5,100", explanation: "9,000 - 2,400 = 6,600. Kemudian 6,600 - 1,500 = 5,100." },
        { q: "Apakah hasil tolak bagi 4,520 - 1,895 (mengumpul semula)?", options: ["A) 2,625", "B) 2,725", "C) 2,615", "D) 2,525"], answer: "A) 2,625", explanation: "4,520 - 1,895 = 2,625." },
        { q: "Tolak 386 daripada 3,400.", options: ["A) 3,014", "B) 3,114", "C) 3,004", "D) 2,014"], answer: "A) 3,014", explanation: "3,400 - 386 = 3,014." },
        { q: "Selesaikan: 6,012 - 2,745.", options: ["A) 3,267", "B) 3,167", "C) 3,367", "D) 3,257"], answer: "A) 3,267", explanation: "6,012 - 2,745 = 3,267." },
        { q: "Encik Ali mempunyai 4,500 biji epal. Dia telah menjual 2,850 biji epal. Berapakah baki epal yang tinggal?", options: ["A) 1,650", "B) 1,750", "C) 1,550", "D) 1,640"], answer: "A) 1,650", explanation: "4,500 - 2,850 = 1,650 biji epal." },
        { q: "Cari nilai anu bagi: 7,200 - 🛈 = 3,450", options: ["A) 3,750", "B) 3,850", "C) 3,650", "D) 3,740"], answer: "A) 3,750", explanation: "7,200 - 3,450 = 3,750." }
    ],
    6: [
        { q: "Selesaikan: 4,200 + 1,500 - 2,300.", options: ["A) 3,400", "B) 3,300", "C) 3,500", "D) 4,400"], answer: "A) 3,400", explanation: "Kira dari kiri ke kanan: 4,200 + 1,500 = 5,700. Kemudian 5,700 - 2,300 = 3,400." },
        { q: "Hitung: 6,340 - 2,100 + 1,250.", options: ["A) 5,490", "B) 5,390", "C) 5,590", "D) 4,490"], answer: "A) 5,490", explanation: "6,340 - 2,100 = 4,240. 4,240 + 1,250 = 5,490." },
        { q: "Selesaikan: 3,050 + 2,400 - 1,800.", options: ["A) 3,650", "B) 3,550", "C) 3,750", "D) 3,640"], answer: "A) 3,650", explanation: "3,050 + 2,400 = 5,450. 5,450 - 1,800 = 3,650." },
        { q: "Cari nilai bagi: 7,800 - 4,200 + 3,100.", options: ["A) 6,700", "B) 6,600", "C) 6,800", "D) 5,700"], answer: "A) 6,700", explanation: "7,800 - 4,200 = 3,600. 3,600 + 3,100 = 6,700." },
        { q: "Selesaikan: 1,450 + 2,300 - 900.", options: ["A) 2,850", "B) 2,750", "C) 2,950", "D) 2,840"], answer: "A) 2,850", explanation: "1,450 + 2,300 = 3,750. 3,750 - 900 = 2,850." },
        { q: "Hitung: 8,500 - 3,200 - 1,400.", options: ["A) 3,900", "B) 3,800", "C) 4,000", "D) 3,700"], answer: "A) 3,900", explanation: "8,500 - 3,200 = 5,300. 5,300 - 1,400 = 3,900." },
        { q: "Selesaikan: 2,120 + 3,450 - 1,600.", options: ["A) 3,970", "B) 3,870", "C) 4,070", "D) 3,960"], answer: "A) 3,970", explanation: "2,120 + 3,450 = 5,570. 5,570 - 1,600 = 3,970." },
        { q: "Cari nilai bagi: 5,600 - 2,300 + 1,850.", options: ["A) 5,150", "B) 5,050", "C) 5,250", "D) 4,150"], answer: "A) 5,150", explanation: "5,600 - 2,300 = 3,300. 3,300 + 1,850 = 5,150." },
        { q: "Sebuah gudang mempunyai 4,000 kotak mainan. Sebanyak 1,200 kotak dikeluarkan, kemudian 1,500 kotak baharu dimasukkan. Berapakah jumlah kotak di dalam gudang sekarang?", options: ["A) 4,300", "B) 4,200", "C) 4,400", "D) 3,300"], answer: "A) 4,300", explanation: "4,000 - 1,200 = 2,800. 2,800 + 1,500 = 4,300 kotak." },
        { q: "Selesaikan ayat matematik ini: 6,100 + 2,800 - 4,300 = ?", options: ["A) 4,600", "B) 4,500", "C) 4,700", "D) 4,400"], answer: "A) 4,600", explanation: "6,100 + 2,800 = 8,900. 8,900 - 4,300 = 4,600." }
    ],
    7: [
        { q: "Apakah nilai bagi simbol 🛈 jika 🛈 + 1,200 = 4,500?", options: ["A) 3,300", "B) 3,400", "C) 3,200", "D) 5,700"], answer: "A) 3,300", explanation: "🛈 = 4,500 - 1,200 = 3,300." },
        { q: "Cari nilai anu: 2,450 + 🛈 = 6,000.", options: ["A) 3,550", "B) 3,450", "C) 3,650", "D) 3,540"], answer: "A) 3,550", explanation: "🛈 = 6,000 - 2,450 = 3,550." },
        { q: "Selesaikan persamaan: 🛈 - 1,500 = 3,200.", options: ["A) 4,700", "B) 4,600", "C) 4,800", "D) 1,700"], answer: "A) 4,700", explanation: "🛈 = 3,200 + 1,500 = 4,700." },
        { q: "Apakah nilai bagi y jika 5,400 - y = 2,100?", options: ["A) 3,300", "B) 3,400", "C) 3,200", "D) 7,500"], answer: "A) 3,300", explanation: "y = 5,400 - 2,100 = 3,300." },
        { q: "Selesaikan persamaan tambah: 3,120 + 🛈 = 7,000.", options: ["A) 3,880", "B) 3,780", "C) 3,980", "D) 3,870"], answer: "A) 3,880", explanation: "🛈 = 7,000 - 3,120 = 3,880." },
        { q: "Cari nilai anu bagi: 🛈 - 2,400 = 1,850.", options: ["A) 4,250", "B) 4,150", "C) 4,350", "D) 4,240"], answer: "A) 4,250", explanation: "🛈 = 1,850 + 2,400 = 4,250." },
        { q: "Apakah nombor misteri bagi x dalam persamaan 8,300 - x = 4,150?", options: ["A) 4,150", "B) 4,250", "C) 4,050", "D) 3,150"], answer: "A) 4,150", explanation: "x = 8,300 - 4,150 = 4,150." },
        { q: "Selesaikan ayat matematik: 1,600 + 🛈 + 1,400 = 5,000.", options: ["A) 2,000", "B) 3,000", "C) 2,500", "D) 1,500"], answer: "A) 2,000", explanation: "1,600 + 1,400 = 3,000. 🛈 = 5,000 - 3,000 = 2,000." },
        { q: "Amin ada beberapa biji guli. Dia beri 1,200 biji kepada adiknya dan baki gulinya tinggal 3,500 biji. Berapakah jumlah guli asal Amin (gunakan anu 🛈)?", options: ["A) 4,700", "B) 4,600", "C) 2,300", "D) 4,800"], answer: "A) 4,700", explanation: "🛈 - 1,200 = 3,500 maka 🛈 = 3,500 + 1,200 = 4,700 biji guli." },
        { q: "Cari nilai anu bagi: 🛈 + 2,150 = 6,000.", options: ["A) 3,850", "B) 3,750", "C) 3,950", "D) 3,840"], answer: "A) 3,850", explanation: "🛈 = 6,000 - 2,150 = 3,850." }
    ],
    8: [
        { q: "Hitung hasil darab bagi 7 × 9.", options: ["A) 63", "B) 56", "C) 72", "D) 49"], answer: "A) 63", explanation: "Sifir 7: 7 × 9 = 63." },
        { q: "Selesaikan: 8 × 6.", options: ["A) 48", "B) 42", "C) 54", "D) 36"], answer: "A) 48", explanation: "Sifir 8: 8 × 6 = 48." },
        { q: "Cari hasil darab bagi 40 × 50.", options: ["A) 2,000", "B) 200", "C) 20,000", "D) 1,500"], answer: "A) 2,000", explanation: "4 × 5 = 20 tambah dua sifar jadi 2,000." },
        { q: "Apakah nilai bagi 9 × 8?", options: ["A) 72", "B) 81", "C) 64", "D) 56"], answer: "A) 72", explanation: "Sifir 9: 9 × 8 = 72." },
        { q: "Selesaikan pendaraban: 30 × 7", options: ["A) 210", "B) 200", "C) 240", "D) 211"], answer: "A) 210", explanation: "3 × 7 = 21 tambah satu sifar jadi 210." },
        { q: "Hitung nilai bagi 6 × 12", options: ["A) 72", "B) 68", "C) 78", "D) 66"], answer: "A) 72", explanation: "6 × 12 = 72." },
        { q: "Selesaikan: 200 × 4.", options: ["A) 800", "B) 600", "C) 400", "D) 1,000"], answer: "A) 800", explanation: "2 × 4 = 8 tambah dua sifar jadi 800." },
        { q: "Cari hasil darab bagi 70 × 10", options: ["A) 700", "B) 70", "C) 7,000", "D) 710"], answer: "A) 700", explanation: "70 darab 10 menambah satu sifar di belakang menjadi 700." },
        { q: "Sebuah kelas mempunyai 8 baris kerusi. Setiap baris ada 9 buah kerusi. Berapakah jumlah kerusi semuanya?", options: ["A) 72", "B) 81", "C) 64", "D) 56"], answer: "A) 72", explanation: "8 × 9 = 72 buah kerusi." },
        { q: "Selesaikan ayat matematik berikut: 0 × 60 = ?", options: ["A) 0", "B) 60", "C) 1", "D) 600"], answer: "A) 0", explanation: "Sebarang nombor yang didarab dengan 0 akan menghasilkan 0." }
    ],
    9: [
        { q: "Cari hasil darab bagi 1,243 × 3", options: ["A) 3,729", "B) 3,629", "C) 3,739", "D) 3,829"], answer: "A) 3,729", explanation: "3×3=9, 4×3=12 (simpan 1), 2×3+1=7, 1×3=3. Jawapan: 3,729." },
        { q: "Selesaikan: 2,130 × 4", options: ["A) 8,520", "B) 8,420", "C) 8,620", "D) 8,510"], answer: "A) 8,520", explanation: "2,130 × 4 = 8,520." },
        { q: "Darabkan 3,412 dengan 2.", options: ["A) 6,824", "B) 6,724", "C) 6,924", "D) 6,814"], answer: "A) 6,824", explanation: "3,412 × 2 = 6,824." },
        { q: "Hitung hasil darab bagi 1,504 × 5.", options: ["A) 7,520", "B) 7,420", "C) 7,620", "D) 7,510"], answer: "A) 7,520", explanation: "1,504 × 5 = 7,520." },
        { q: "Selesaikan pendaraban: 2,315 × 3.", options: ["A) 6,945", "B) 6,845", "C) 6,935", "D) 6,955"], answer: "A) 6,945", explanation: "2,315 × 3 = 6,945." },
        { q: "Cari nilai bagi 1,122 × 7.", options: ["A) 7,854", "B) 7,754", "C) 7,954", "D) 7,844"], answer: "A) 7,854", explanation: "1,122 × 7 = 7,854." },
        { q: "Selesaikan: 1,080 × 6.", options: ["A) 6,480", "B) 6,380", "C) 6,580", "D) 6,470"], answer: "A) 6,480", explanation: "1,080 × 6 = 6,480." },
        { q: "Hitung hasil darab bagi 1,234 × 8.", options: ["A) 9,872", "B) 9,772", "C) 9,972", "D) 9,862"], answer: "A) 9,872", explanation: "1,234 × 8 = 9,872." },
        { q: "Sebuah kilang mengeluarkan 1,420 buah buku nota setiap hari. Berapakah jumlah buku nota yang dikeluarkan dalam masa 4 hari?", options: ["A) 5,680", "B) 5,580", "C) 5,780", "D) 5,670"], answer: "A) 5,680", explanation: "1,420 × 4 = 5,680 buah buku nota." },
        { q: "Selesaikan ayat matematik berikut: 1,111 × 9 = ?", options: ["A) 9,999", "B) 9,899", "C) 9,989", "D) 8,999"], answer: "A) 9,999", explanation: "1,111 × 9 = 9,999." }
    ],
    10: [
        { q: "Apakah baki bagi 45 ÷ 6?", options: ["A) 3", "B) 1", "C) 2", "D) 4"], answer: "A) 3", explanation: "6 × 7 = 42. 45 - 42 = 3 (baki 3)." },
        { q: "Selesaikan: 72 ÷ 8.", options: ["A) 9", "B) 8", "C) 7", "D) 6"], answer: "A) 9", explanation: "Sifir 8: 72 ÷ 8 = 9." },
        { q: "Bahagikan 54 dengan 9.", options: ["A) 6", "B) 5", "C) 7", "D) 8"], answer: "A) 6", explanation: "Sifir 9: 54 ÷ 9 = 6." },
        { q: "Hitung hasil bahagi bagi 480 ÷ 10.", options: ["A) 48", "B) 4", "C) 480", "D) 4.8"], answer: "A) 48", explanation: "Membahagi dengan 10 memotong satu sifar di belakang: 480 ÷ 10 = 48." },
        { q: "Apakah baki bagi 29 ÷ 4?", options: ["A) 1", "B) 2", "C) 3", "D) 0"], answer: "A) 1", explanation: "4 × 7 = 28. 29 - 28 = 1 (baki 1)." },
        { q: "Selesaikan: 560 ÷ 7", options: ["A) 80", "B) 70", "C) 90", "D) 800"], answer: "A) 80", explanation: "56 ÷ 7 = 8 tambah sifar jadi 80." },
        { q: "Cari hasil bahagi bagi 81 ÷ 9", options: ["A) 9", "B) 8", "C) 7", "D) 6"], answer: "A) 9", explanation: "81 ÷ 9 = 9." },
        { q: "Apakah baki apabila 38 dibahagikan dengan 5?", options: ["A) 3", "B) 1", "C) 2", "D) 4"], answer: "A) 3", explanation: "5 × 7 = 35. 38 - 35 = 3 (baki 3)." },
        { q: "Cikgu Amin mempunyai 42 batang pensel. Dia membahagikannya sama rata kepada 6 orang murid. Berapakah sebatang pensel yang diperolehi setiap murid?", options: ["A) 7", "B) 6", "C) 8", "D) 9"], answer: "A) 7", explanation: "42 ÷ 6 = 7 batang pensel." },
        { q: "Selesaikan ayat matematik berikut: 630 ÷ 9 = ?", options: ["A) 70", "B) 60", "C) 80", "D) 700"], answer: "A) 70", explanation: "63 ÷ 9 = 7 tambah sifar jadi 70." }
    ],
    11: [
        { q: "Selesaikan: 8,460 ÷ 4.", options: ["A) 2,115", "B) 2,105", "C) 2,215", "D) 2,110"], answer: "A) 2,115", explanation: "8,460 ÷ 4 = 2,115." },
        { q: "Hitung hasil bahagi bagi 6,300 ÷ 3.", options: ["A) 2,100", "B) 2,200", "C) 2,050", "D) 2,150"], answer: "A) 2,100", explanation: "6,300 ÷ 3 = 2,100." },
        { q: "Bahagikan 4,824 dengan 2.", options: ["A) 2,412", "B) 2,402", "C) 2,312", "D) 2,512"], answer: "A) 2,412", explanation: "4,824 ÷ 2 = 2,412." },
        { q: "Selesaikan: 5,505 ÷ 5.", options: ["A) 1,101", "B) 1,111", "C) 1,011", "D) 1,100"], answer: "A) 1,101", explanation: "5,505 ÷ 5 = 1,101." },
        { q: "Cari hasil bahagi bagi 3,690 ÷ 3.", options: ["A) 1,230", "B) 1,220", "C) 1,330", "D) 1,240"], answer: "A) 1,230", explanation: "3,690 ÷ 3 = 1,230." },
        { q: "Selesaikan: 7,420 ÷ 7", options: ["A) 1,060", "B) 1,050", "C) 1,070", "D) 1,600"], answer: "A) 1,060", explanation: "7,420 ÷ 7 = 1,060." },
        { q: "Hitung nilai bagi 630 ÷ 3", options: ["A) 210", "B) 220", "C) 200", "D) 230"], answer: "A) 210", explanation: "630 ÷ 3 = 210." },
        { q: "Bahagikan 4,264 dengan 4.", options: ["A) 1,066", "B) 1,056", "C) 1,076", "D) 1,166"], answer: "A) 1,066", explanation: "4,264 ÷ 4 = 1,066." },
        { q: "Sebuah kilang mengedarkan 2,480 buah buku teks secara sama rata kepada 4 buah sekolah. Berapakah buah buku yang diterima oleh setiap sekolah?", options: ["A) 620", "B) 610", "C) 630", "D) 600"], answer: "A) 620", explanation: "2,480 ÷ 4 = 620 buah buku." },
        { q: "Selesaikan ayat matematik berikut: 6,363 ÷ 3 = ?", options: ["A) 2,121", "B) 2,111", "C) 2,212", "D) 2,131"], answer: "A) 2,121", explanation: "6,363 ÷ 3 = 2,121." }
    ],
    12: [
        { q: "Apakah pecahan setara bagi 1/2 jika penyebutnya ialah 6?", options: ["A) 3/6", "B) 2/6", "C) 4/6", "D) 5/6"], answer: "A) 3/6", explanation: "Penyebut darab 3, maka pengangka (1×3=3). Pecahannya ialah 3/6." },
        { q: "Selesaikan: Apakah pecahan wajar bagi 2/3 jika pengangkanya ialah 4?", options: ["A) 4/6", "B) 4/9", "C) 4/5", "D) 4/12"], answer: "A) 4/6", explanation: "Pengangka 2 menjadi 4 (darab 2), maka penyebut (3×2=6). Pecahannya 4/6." },
        { q: "Bandingkan pecahan: Manakah yang lebih besar antara 3/4 dengan 1/4?", options: ["A) 3/4", "B) 1/4", "C) Sama besar", "D) Tidak pasti"], answer: "A) 3/4", explanation: "Apabila penyebut sama, pengangka yang lebih besar menunjukkan nilai yang lebih besar (3 > 1)." },
        { q: "Tukarkan pecahan 2/4 kepada bentuk termudah.", options: ["A) 1/2", "B) 1/3", "C) 2/3", "D) 1/4"], answer: "A) 1/2", explanation: "Bahagikan pengangka dan penyebut dengan 2: 2÷2 / 4÷2 = 1/2." },
        { q: "Apakah pecahan setara bagi 1/3 jika penyebutnya ialah 9?", options: ["A) 3/9", "B) 2/9", "C) 4/9", "D) 6/9"], answer: "A) 3/9", explanation: "Penyebut 3 menjadi 9 (darab 3), pengangka (1×3=3). Pecahannya 3/9." },
        { q: "Selesaikan hasil tambah pecahan: 1/5 + 2/5 = ?", options: ["A) 3/5", "B) 3/10", "C) 4/5", "D) 1/5"], answer: "A) 3/5", explanation: "Penyebut kekal sama, tambah pengangka: 1+2 = 3 (3/5)." },
        { q: "Hitung hasil tolak pecahan berikut: 4/6 - 1/6 = ?", options: ["A) 3/6", "B) 2/6", "C) 5/6", "D) 1/6"], answer: "A) 3/6", explanation: "Penyebut kekal, tolak pengangka: 4-1 = 3 (3/6)." },
        { q: "Apakah nilai anu bagi x dalam pecahan setara berikut: 1/2 = x/8?", options: ["A) 4", "B) 2", "C) 6", "D) 3"], answer: "A) 4", explanation: "Penyebut 2 menjadi 8 (darab 4), maka x = 1 × 4 = 4." },
        { q: "Ibu memotong sebiji kek kepada 8 bahagian sama besar. Amin makan 3 bahagian. Apakah pecahan bahagian kek yang telah dimakan oleh Amin?", options: ["A) 3/8", "B) 5/8", "C) 3/5", "D) 8/3"], answer: "A) 3/8", explanation: "Bahagian dimakan (3) daripada keseluruhan bahagian (8), iaitu 3/8." },
        { q: "Susun pecahan berikut mengikut tertib menaik: 1/6, 5/6, 3/6, 2/6", options: ["A) 1/6, 2/6, 3/6, 5/6", "B) 5/6, 3/6, 2/6, 1/6", "C) 1/6, 3/6, 2/6, 5/6", "D) 2/6, 1/6, 3/6, 5/6"], answer: "A) 1/6, 2/6, 3/6, 5/6", explanation: "Susunan mengikut nilai pengangka dari kecil ke besar: 1, 2, 3, 5." }
    ],
    13: [
        { q: "Tukarkan pecahan 7/10 kepada nombor perpuluhan.", options: ["A) 0.7", "B) 0.07", "C) 7.0", "D) 0.77"], answer: "A) 0.7", explanation: "7 per sepuluh ditulis sebagai 0.7 dalam bentuk perpuluhan." },
        { q: "Tukarkan pecahan 35/100 kepada nombor perpuluhan.", options: ["A) 0.35", "B) 3.5", "C) 0.035", "D) 35.0"], answer: "A) 0.35", explanation: "35 per seratus ditulis sebagai 0.35." },
        { q: "Tuliskan nombor perpuluhan 0.8 dalam bentuk perkataan.", options: ["A) Sifar perpuluhan lapan", "B) Sifar perpuluhan kosong lapan", "C) Lapan perpuluhan", "D) Sifar lapan"], answer: "A) Sifar perpuluhan lapan", explanation: "0.8 dibaca sebagai 'sifar perpuluhan lapan'." },
        { q: "Apakah nilai digit bagi nombor 4 dalam perpuluhan 0.46?", options: ["A) 0.4", "B) 0.04", "C) 4", "D) 40"], answer: "A) 0.4", explanation: "Digit 4 berada di tempat persepuluh (0.4)." },
        { q: "Bandingkan perpuluhan: Manakah yang lebih besar antara 0.6 dengan 0.39?", options: ["A) 0.6", "B) 0.39", "C) Sama besar", "D) Tidak pasti"], answer: "A) 0.6", explanation: "0.6 sama dengan 0.60. Bandingkan 0.60 dengan 0.39, maka 0.6 lebih besar." },
        { q: "Selesaikan hasil tambah perpuluhan: 0.4 + 0.3 = ?", options: ["A) 0.7", "B) 0.07", "C) 7.0", "D) 0.34"], answer: "A) 0.7", explanation: "0.4 + 0.3 = 0.7." },
        { q: "Hitung hasil tolak perpuluhan berikut: 0.9 - 0.25 = ?", options: ["A) 0.65", "B) 0.75", "C) 0.64", "D) 0.85"], answer: "A) 0.65", explanation: "0.90 - 0.25 = 0.65." },
        { q: "Susun nombor perpuluhan berikut dalam tertib menaik: 0.5, 0.2, 0.85, 0.47.", options: ["A) 0.2, 0.47, 0.5, 0.85", "B) 0.85, 0.5, 0.47, 0.2", "C) 0.2, 0.5, 0.47, 0.85", "D) 0.47, 0.2, 0.5, 0.85"], answer: "A) 0.2, 0.47, 0.5, 0.85", explanation: "Susunan dari nilai terkecil ke terbesar: 0.2, 0.47, 0.5 (atau 0.50), 0.85." },
        { q: "Tukarkan nombor perpuluhan 0.09 kepada pecahan per seratus.", options: ["A) 9/100", "B) 9/10", "C) 90/100", "D) 1/9"], answer: "A) 9/100", explanation: "0.09 bermaksud 9 bahagian daripada 100 (9/100)." },
        { q: "Selesaikan: 0.32 + 0.45 = ?", options: ["A) 0.77", "B) 0.67", "C) 0.87", "D) 0.76"], answer: "A) 0.77", explanation: "0.32 + 0.45 = 0.77." }
    ],
    14: [
        { q: "Hitung hasil tambah: RM2,450.50 + RM1,320.20.", options: ["A) RM3,770.70", "B) RM3,670.70", "C) RM3,770.60", "D) RM3,870.70"], answer: "A) RM3,770.70", explanation: "RM2,450.50 + RM1,320.20 = RM3,770.70." },
        { q: "Selesaikan: RM4,125.75 + RM2,340.10.", options: ["A) RM6,465.85", "B) RM6,365.85", "C) RM6,455.85", "D) RM6,465.75"], answer: "A) RM6,465.85", explanation: "RM4,125.75 + RM2,340.10 = RM6,465.85." },
        { q: "Hitung baki tolak: RM5,000.00 - RM1,840.50.", options: ["A) RM3,159.50", "B) RM3,259.50", "C) RM3,149.50", "D) RM3,159.40"], answer: "A) RM3,159.50", explanation: "RM5,000.00 - RM1,840.50 = RM3,159.50." },
        { q: "Selesaikan: RM7,340.25 - RM3,120.10.", options: ["A) RM4,220.15", "B) RM4,210.15", "C) RM4,320.15", "D) RM4,220.25"], answer: "A) RM4,220.15", explanation: "RM7,340.25 - RM3,120.10 = RM4,220.15." },
        { q: "Operasi bergabung: RM3,200.00 + RM1,550.50 - RM920.00.", options: ["A) RM3,830.50", "B) RM3,730.50", "C) RM3,930.50", "D) RM3,820.50"], answer: "A) RM3,830.50", explanation: "RM3,200 + RM1,550.50 = RM4,750.50. RM4,750.50 - RM920.00 = RM3,830.50." },
        { q: "Tambahkan: RM845.60 + RM2,130.40.", options: ["A) RM2,976.00", "B) RM2,876.00", "C) RM2,966.00", "D) RM2,975.00"], answer: "A) RM2,976.00", explanation: "RM845.60 + RM2,130.40 = RM2,976.00." },
        { q: "Cari beza wang antara RM6,200.00 dengan RM4,150.80.", options: ["A) RM2,049.20", "B) RM2,059.20", "C) RM1,949.20", "D) RM2,048.20"], answer: "A) RM2,049.20", explanation: "RM6,200.00 - RM4,150.80 = RM2,049.20." },
        { q: "Selesaikan: RM1,250.00 + RM3,400.20 - RM850.10.", options: ["A) RM3,800.10", "B) RM3,700.10", "C) RM3,810.10", "D) RM3,900.10"], answer: "A) RM3,800.10", explanation: "RM1,250 + RM3,400.20 = RM4,650.20. RM4,650.20 - RM850.10 = RM3,800.10." },
        { q: "Ibu mempunyai RM500.00. Dia membeli sebuah beg sekolah berharga RM145.50. Berapakah baki wang ibu?", options: ["A) RM354.50", "B) RM364.50", "C) RM354.40", "D) RM344.50"], answer: "A) RM354.50", explanation: "RM500.00 - RM145.50 = RM354.50." },
        { q: "Selesaikan ayat matematik berikut: RM4,500.00 - RM2,350.25 = ?", options: ["A) RM2,149.75", "B) RM2,150.75", "C) RM2,149.50", "D) RM2,249.75"], answer: "A) RM2,149.75", explanation: "RM4,500.00 - RM2,350.25 = RM2,149.75." }
    ],
    15: [
        { q: "Hitung hasil darab: RM145.50 × 4.", options: ["A) RM582.00", "B) RM572.00", "C) RM592.00", "D) RM581.00"], answer: "A) RM582.00", explanation: "RM145.50 × 4 = RM582.00." },
        { q: "Selesaikan: RM230.20 × 5.", options: ["A) RM1,151.00", "B) RM1,150.00", "C) RM1,141.00", "D) RM1,251.00"], answer: "A) RM1,151.00", explanation: "RM230.20 × 5 = RM1,151.00." },
        { q: "Hitung hasil bahagi: RM450.00 ÷ 3.", options: ["A) RM150.00", "B) RM140.00", "C) RM160.00", "D) RM155.00"], answer: "A) RM150.00", explanation: "RM450.00 ÷ 3 = RM150.00." },
        { q: "Selesaikan: RM840.80 ÷ 4.", options: ["A) RM210.20", "B) RM210.00", "C) RM220.20", "D) RM200.20"], answer: "A) RM210.20", explanation: "RM840.80 ÷ 4 = RM210.20." },
        { q: "Darabkan: RM312.40 × 6.", options: ["A) RM1,874.40", "B) RM1,864.40", "C) RM1,873.40", "D) RM1,974.40"], answer: "A) RM1,874.40", explanation: "RM312.40 × 6 = RM1,874.40." },
        { q: "Bahagikan: RM1,250.00 ÷ 5.", options: ["A) RM250.00", "B) RM240.00", "C) RM260.00", "D) RM255.00"], answer: "A) RM250.00", explanation: "RM1,250.00 ÷ 5 = RM250.00." },
        { q: "Selesaikan: RM125.75 × 8.", options: ["A) RM1,006.00", "B) RM1,005.00", "C) RM996.00", "D) RM1,016.00"], answer: "A) RM1,006.00", explanation: "RM125.75 × 8 = RM1,006.00." },
        { q: "Cari nilai bagi: RM3,120.60 ÷ 6.", options: ["A) RM520.10", "B) RM510.10", "C) RM520.00", "D) RM530.10"], answer: "A) RM520.10", explanation: "RM3,120.60 ÷ 6 = RM520.10." },
        { q: "Harga sebuah buku cerita ialah RM24.50. Berapakah jumlah harga untuk 4 buah buku cerita yang sama?", options: ["A) RM98.00", "B) RM96.00", "C) RM98.50", "D) RM92.00"], answer: "A) RM98.00", explanation: "RM24.50 × 4 = RM98.00." },
        { q: "Selesaikan ayat matematik berikut: RM728.00 ÷ 8 = ?", options: ["A) RM91.00", "B) RM90.00", "C) RM92.00", "D) RM95.00"], answer: "A) RM91.00", explanation: "RM728.00 ÷ 8 = RM91.00." }
    ],
    16: [
        { q: "Tukarkan 2 jam kepada minit.", options: ["A) 120 minit", "B) 60 minit", "C) 180 minit", "D) 240 minit"], answer: "A) 120 minit", explanation: "1 jam = 60 minit, maka 2 jam = 2 × 60 = 120 minit." },
        { q: "Tukarkan 130 minit kepada jam dan minit.", options: ["A) 2 jam 10 minit", "B) 1 jam 30 minit", "C) 2 jam 30 minit", "D) 3 jam 10 minit"], answer: "A) 2 jam 10 minit", explanation: "120 minit = 2 jam, baki 10 minit. Jadi 2 jam 10 minit." },
        { q: "Selesaikan tambah masa: 3 jam 20 minit + 1 jam 45 minit.", options: ["A) 5 jam 5 minit", "B) 4 jam 65 minit", "C) 5 jam 15 minit", "D) 4 jam 55 minit"], answer: "A) 5 jam 5 minit", explanation: "Jam: 3+1 = 4 jam. Minit: 20+45 = 65 minit (1 jam 5 minit). Jumlah: 5 jam 5 minit." },
        { q: "Hitung beza masa: 5 jam 10 minit - 2 jam 35 minit.", options: ["A) 2 jam 35 minit", "B) 3 jam 35 minit", "C) 2 jam 25 minit", "D) 3 jam 25 minit"], answer: "A) 2 jam 35 minit", explanation: "Pinjam 1 jam (60 minit) jadi 4 jam 70 minit. 4 jam 70 minit - 2 jam 35 minit = 2 jam 35 minit." },
        { q: "Tukarkan 3 jam 15 minit sepenuhnya kepada minit.", options: ["A) 195 minit", "B) 185 minit", "C) 175 minit", "D) 205 minit"], answer: "A) 195 minit", explanation: "(3 × 60) + 15 = 180 + 15 = 195 minit." },
        { q: "Selesaikan: 4 jam 40 minit + 2 jam 50 minit.", options: ["A) 7 jam 30 minit", "B) 6 jam 90 minit", "C) 7 jam 20 minit", "D) 6 jam 50 minit"], answer: "A) 7 jam 30 minit", explanation: "4+2 = 6 jam. 40+50 = 90 minit (1 jam 30 minit). Jumlah: 7 jam 30 minit." },
        { q: "Hitung: 6 jam - 1 jam 45 minit.", options: ["A) 4 jam 15 minit", "B) 5 jam 15 minit", "C) 4 jam 45 minit", "D) 5 jam 45 minit"], answer: "A) 4 jam 15 minit", explanation: "6 jam = 5 jam 60 minit. 5 jam 60 minit - 1 jam 45 minit = 4 jam 15 minit." },
        { q: "Tukarkan 195 minit kepada jam dan minit.", options: ["A) 3 jam 15 minit", "B) 3 jam 35 minit", "C) 2 jam 55 minit", "D) 3 jam 45 minit"], answer: "A) 3 jam 15 minit", explanation: "195 ÷ 60 = 3 jam dengan baki 15 minit (3 jam 15 minit)." },
        { q: "Ali mengambil masa 1 jam 15 minit untuk menyiapkan kerja sekolahnya. Dia mula pada pukul 3:00 petang. Pukul berapakah dia siap?", options: ["A) 4:15 petang", "B) 4:00 petang", "C) 4:30 petang", "D) 3:45 petang"], answer: "A) 4:15 petang", explanation: "3:00 petang + 1 jam 15 minit = 4:15 petang." },
        { q: "Selesaikan ayat matematik berikut: 2 jam 30 minit × 3 = ?", options: ["A) 7 jam 30 minit", "B) 6 jam 90 minit", "C) 7 jam 00 minit", "D) 8 jam 00 minit"], answer: "A) 7 jam 30 minit", explanation: "2 jam × 3 = 6 jam. 30 minit × 3 = 90 minit (1 jam 30 minit). Jumlah: 7 jam 30 minit." }
    ],
    17: [
        { q: "Hitung tempoh masa dari pukul 8:00 pagi hingga pukul 11:30 pagi pada hari yang sama.", options: ["A) 3 jam 30 minit", "B) 3 jam 00 minit", "C) 4 jam 30 minit", "D) 2 jam 30 minit"], answer: "A) 3 jam 30 minit", explanation: "Dari 8:00 pagi ke 11:00 pagi ialah 3 jam, ditambah 30 minit menjadi 3 jam 30 minit." },
        { q: "Suatu majlis bermula pada pukul 2:15 petang dan tamat pada pukul 5:45 petang. Berapakah tempoh masa majlis tersebut?", options: ["A) 3 jam 30 minit", "B) 3 jam 15 minit", "C) 4 jam 30 minit", "D) 3 jam 45 minit"], answer: "A) 3 jam 30 minit", explanation: "Beza jam: 5 - 2 = 3 jam. Beza minit: 45 - 15 = 30 minit (3 jam 30 minit)." },
        { q: "Ayah memandu kereta dari Johor Bahru ke Melaka selama 2 jam 45 minit. Jika perjalanan bermula pada pukul 9:00 pagi, pukul berapakah ayah sampai di Melaka?", options: ["A) 11:45 pagi", "B) 11:30 pagi", "C) 12:15 tengah hari", "D) 11:15 pagi"], answer: "A) 11:45 pagi", explanation: "9:00 pagi + 2 jam 45 minit = 11:45 pagi." },
        { q: "Ali menyiapkan kerja sekolahnya selama 1 jam 20 minit. Jika dia mula pada pukul 4:10 petang, pukul berapakah dia siap?", options: ["A) 5:30 petang", "B) 5:20 petang", "C) 5:40 petang", "D) 5:10 petang"], answer: "A) 5:30 petang", explanation: "Jam: 4 + 1 = 5. Minit: 10 + 20 = 30. Waktu siap: 5:30 petang." },
        { q: "Berapakah bilangan hari dalam bulan Februari pada Tahun Lompat?", options: ["A) 29 hari", "B) 28 hari", "C) 30 hari", "D) 31 hari"], answer: "A) 29 hari", explanation: "Dalam Tahun Lompat, bulan Februari mempunyai 29 hari (berbanding 28 hari biasa)." },
        { q: "Tukarkan 3 minggu kepada bilangan hari.", options: ["A) 21 hari", "B) 14 hari", "C) 28 hari", "D) 70 hari"], answer: "A) 21 hari", explanation: "1 minggu = 7 hari, maka 3 minggu = 3 × 7 = 21 hari." },
        { q: "Suatu kursus berlangsung selama 5 hari. Berapakah jumlah jam bagi 5 hari tersebut?", options: ["A) 120 jam", "B) 100 jam", "C) 96 jam", "D) 144 jam"], answer: "A) 120 jam", explanation: "1 hari = 24 jam, maka 5 hari = 5 × 24 = 120 jam." },
        { q: "Siti melancong selama 2 minggu 4 hari. Berapakah jumlah hari Siti melancong kesemuanya?", options: ["A) 18 hari", "B) 14 hari", "C) 20 hari", "D) 15 hari"], answer: "A) 18 hari", explanation: "2 minggu = 14 hari. 14 hari + 4 hari = 18 hari." },
        { q: "Encik Ali bekerja dari pukul 8:00 pagi hingga pukul 5:00 petang setiap hari. Hitung tempoh masa kerja Encik Ali dalam sehari (andaikan tiada rehat).", options: ["A) 9 jam", "B) 8 jam", "C) 10 jam", "D) 7 jam"], answer: "A) 9 jam", explanation: "Dari 8:00 pagi ke 12:00 tengah hari (4 jam), dari 12:00 tengah hari ke 5:00 petang (5 jam). Jumlah = 9 jam." },
        { q: "Jika hari ini hari Rabu, hari apakah selepas 10 hari?", options: ["A) Sabtu", "B) Jumaat", "C) Ahad", "D) Khamis"], answer: "A) Sabtu", explanation: "10 hari = 1 minggu (7 hari) + 3 hari. Selepas Rabu + 3 hari ialah Khamis, Jumaat, Sabtu." }
    ]
};

// Penjana automatik untuk Level 18 hingga 20 (Darjah 3)
for (let i = 18; i <= 20; i++) {
    levelsQuestions[i] = [];
    for (let j = 1; j <= 10; j++) {
        levelsQuestions[i].push({
            q: `Soalan ${j} untuk Level ${i}: Selesaikan soalan silibus Matematik Darjah 3 ini dengan betul.`,
            options: ["A) Jawapan A", "B) Jawapan B", "C) Jawapan C", "D) Jawapan D"],
            answer: "A) Jawapan A",
            explanation: `Ini adalah penerangan jawapan bagi soalan ${j} dalam Level ${i}.`
        });
    }
}

// ==========================================
// BANK SOALAN SILIBUS MATEMATIK TAHUN 2 (Level 1 hingga 14)
// ==========================================

const tahun2Questions = {
    1: [
        { q: "Tulis nombor 'tiga ratus empat puluh dua' dalam bentuk angka.", options: ["A) 342", "B) 324", "C) 304", "D) 432"], answer: "A) 342", explanation: "Tiga ratus empat puluh dua ditulis sebagai 342." },
        { q: "Apakah nilai digit bagi nombor 5 dalam 752?", options: ["A) 5", "B) 50", "C) 500", "D) 2"], answer: "B) 50", explanation: "Digit 5 berada di tempat puluh, maka nilai digitnya ialah 50." },
        { q: "Nyatakan nilai tempat bagi digit 8 dalam 834.", options: ["A) Sa", "B) Puluh", "C) Ratus", "D) Ribu"], answer: "C) Ratus", explanation: "Digit 8 terletak di kedudukan ratus dalam nombor 834." },
        { q: "Cerakinkan nombor 469 mengikut nilai digit.", options: ["A) 400 + 60 + 9", "B) 40 + 60 + 9", "C) 400 + 6 + 9", "D) 4 + 6 + 9"], answer: "A) 400 + 60 + 9", explanation: "Cerakin nilai digit bagi 469 ialah 400 + 60 + 9." },
        { q: "Tulis nombor 608 dalam perkataan.", options: ["A) Enam ratus lapan", "B) Enam ratus lapan puluh", "C) Enam ratus dan lapan", "D) Enam ratus"], answer: "A) Enam ratus lapan", explanation: "Nombor 608 dibaca sebagai enam ratus lapan." },
        { q: "Apakah nombor yang terhasil daripada 3 ratus + 5 puluhan + 7 sa?", options: ["A) 357", "B) 375", "C) 537", "D) 753"], answer: "A) 357", explanation: "3 ratus (300) + 5 puluhan (50) + 7 sa (7) menjadi 357." },
        { q: "Susun nombor berikut mengikut tertib menaik: 421, 312, 450, 380.", options: ["A) 312, 380, 421, 450", "B) 450, 421, 380, 312", "C) 312, 421, 380, 450", "D) 380, 312, 421, 450"], answer: "A) 312, 380, 421, 450", explanation: "Tertib menaik bermaksud susunan dari kecil ke besar." },
        { q: "Susun nombor berikut mengikut tertib menurun: 610, 740, 550, 800.", options: ["A) 800, 740, 610, 550", "B) 550, 610, 740, 800", "C) 800, 610, 740, 550", "D) 740, 800, 610, 550"], answer: "A) 800, 740, 610, 550", explanation: "Tertib menurun bermaksud susunan dari besar ke kecil." },
        { q: "Apakah nombor sebelum 500?", options: ["A) 499", "B) 501", "C) 490", "D) 400"], answer: "A) 499", explanation: "Nombor yang berada sebelum 500 ialah 499." },
        { q: "Apakah nombor di antara 412 dan 414?", options: ["A) 413", "B) 415", "C) 411", "D) 410"], answer: "A) 413", explanation: "Nombor di tengah-tengah antara 412 dan 414 ialah 413." }
    ],
    2: [
        { q: "Bandingkan 345 dan 354. Nombor manakah yang lebih besar?", options: ["A) 354", "B) 345", "C) Sama besar", "D) Tidak pasti"], answer: "A) 354", explanation: "354 lebih besar daripada 345 kerana nilai puluhan 5 lebih besar daripada 4." },
        { q: "Apakah nombor yang lebih kecil daripada 500 sebanyak 20?", options: ["A) 480", "B) 520", "C) 490", "D) 470"], answer: "A) 480", explanation: "500 - 20 = 480." },
        { q: "Lengkapkan pola nombor: 120, 130, 140, ...", options: ["A) 150", "B) 160", "C) 145", "D) 135"], answer: "A) 150", explanation: "Pola menambah 10 pada setiap langkah (140 + 10 = 150)." },
        { q: "Lengkapkan pola nombor secara menurun: 500, 490, 480, ...", options: ["A) 470", "B) 460", "C) 475", "D) 485"], answer: "A) 470", explanation: "Pola menolak 10 secara konsisten (480 - 10 = 470)." },
        { q: "Bundarkan 342 kepada puluh terdekat.", options: ["A) 340", "B) 350", "C) 300", "D) 400"], answer: "A) 340", explanation: "Digit sa ialah 2 (kurang dari 5), maka kekal menjadi 340." },
        { q: "Bundarkan 678 kepada ratus terdekat.", options: ["A) 700", "B) 600", "C) 670", "D) 680"], answer: "A) 700", explanation: "Digit puluh ialah 7 (lebih besar atau sama dengan 5), jadi bundar kepada 700." },
        { q: "Bundarkan 425 kepada puluh terdekat.", options: ["A) 430", "B) 420", "C) 400", "D) 450"], answer: "A) 430", explanation: "Digit sa ialah 5, jadi digit puluh bertambah 1 menjadi 430." },
        { q: "Apakah nombor yang menjadi 300 apabila dibundarkan kepada ratus terdekat?", options: ["A) 320", "B) 360", "C) 240", "D) 380"], answer: "A) 320", explanation: "320 dibundarkan kepada ratus terdekat menjadi 300." },
        { q: "Nyatakan nilai paling kecil antara: 412, 421, 402, 430.", options: ["A) 402", "B) 412", "C) 421", "D) 430"], answer: "A) 402", explanation: "402 mempunyai nilai yang paling kecil berbanding yang lain." },
        { q: "Anggarkan bilangan buah epal di dalam bakul jika ada 10 ikat dengan setiap ikat 10 biji.", options: ["A) 100", "B) 50", "C) 10", "D) 200"], answer: "A) 100", explanation: "10 kumpulan 10 biji menjadi 100 biji epal." }
    ],
    3: [
        { q: "Selesaikan: 245 + 132 = ?", options: ["A) 377", "B) 367", "C) 387", "D) 277"], answer: "A) 377", explanation: "245 + 132 = 377." },
        { q: "Selesaikan: 410 + 258 = ?", options: ["A) 668", "B) 658", "C) 678", "D) 568"], answer: "A) 668", explanation: "410 + 258 = 668." },
        { q: "Selesaikan: 324 + 189 = ?", options: ["A) 513", "B) 503", "C) 523", "D) 413"], answer: "A) 513", explanation: "324 + 189 = 513." },
        { q: "Selesaikan: 506 + 321 = ?", options: ["A) 827", "B) 817", "C) 837", "D) 727"], answer: "A) 827", explanation: "506 + 321 = 827." },
        { q: "Selesaikan: 175 + 412 = ?", options: ["A) 587", "B) 577", "C) 597", "D) 487"], answer: "A) 587", explanation: "175 + 412 = 587." },
        { q: "Cari jumlah bagi 620 dan 150.", options: ["A) 770", "B) 760", "C) 780", "D) 670"], answer: "A) 770", explanation: "620 + 150 = 770." },
        { q: "Selesaikan: 431 + 290 = ?", options: ["A) 721", "B) 711", "C) 731", "D) 621"], answer: "A) 721", explanation: "431 + 290 = 721." },
        { q: "Tambahkan 312 kepada 450.", options: ["A) 762", "B) 752", "C) 772", "D) 662"], answer: "A) 762", explanation: "450 + 312 = 762." },
        { q: "Selesaikan: 215 + 314 + 111 = ?", options: ["A) 640", "B) 630", "C) 650", "D) 540"], answer: "A) 640", explanation: "215 + 314 + 111 = 640." },
        { q: "Ali ada 240 biji guli. Ayahnya beri lagi 150 biji. Berapakah jumlah guli Ali?", options: ["A) 390", "B) 380", "C) 400", "D) 370"], answer: "A) 390", explanation: "240 + 150 = 390 biji guli." }
    ],
    4: [
        { q: "Selesaikan: 586 - 234 = ?", options: ["A) 352", "B) 362", "C) 342", "D) 252"], answer: "A) 352", explanation: "586 - 234 = 352." },
        { q: "Selesaikan: 640 - 210 = ?", options: ["A) 430", "B) 420", "C) 440", "D) 330"], answer: "A) 430", explanation: "640 - 210 = 430." },
        { q: "Selesaikan: 932 - 411 = ?", options: ["A) 521", "B) 511", "C) 531", "D) 421"], answer: "A) 521", explanation: "932 - 411 = 521." },
        { q: "Selesaikan: 570 - 140 = ?", options: ["A) 430", "B) 420", "C) 440", "D) 330"], answer: "A) 430", explanation: "570 - 140 = 430." },
        { q: "Selesaikan: 815 - 402 = ?", options: ["A) 413", "B) 403", "C) 423", "D) 313"], answer: "A) 413", explanation: "815 - 402 = 413." },
        { q: "Cari beza antara 750 dan 320.", options: ["A) 430", "B) 420", "C) 440", "D) 530"], answer: "A) 430", explanation: "750 - 320 = 430." },
        { q: "Selesaikan: 400 - 125 = ?", options: ["A) 275", "B) 285", "C) 265", "D) 375"], answer: "A) 275", explanation: "400 - 125 = 275." },
        { q: "Tolakkan 214 daripada 689.", options: ["A) 475", "B) 465", "C) 485", "D) 575"], answer: "A) 475", explanation: "689 - 214 = 475." },
        { q: "Selesaikan: 899 - 456 = ?", options: ["A) 443", "B) 433", "C) 453", "D) 343"], answer: "A) 443", explanation: "899 - 456 = 443." },
        { q: "Ibu ada 540 biji manik. Sebanyak 215 biji telah digunakan. Berapakah baki manik?", options: ["A) 325", "B) 335", "C) 315", "D) 225"], answer: "A) 325", explanation: "540 - 215 = 325 biji manik." }
    ],
    5: [
        { q: "Selesaikan: 3 × 2 = ?", options: ["A) 6", "B) 5", "C) 8", "D) 9"], answer: "A) 6", explanation: "Sifir 2: 3 × 2 = 6." },
        { q: "Selesaikan: 4 × 5 = ?", options: ["A) 20", "B) 15", "C) 25", "D) 10"], answer: "A) 20", explanation: "Sifir 5: 4 × 5 = 20." },
        { q: "Selesaikan: 6 × 10 = ?", options: ["A) 60", "B) 50", "C) 70", "D) 66"], answer: "A) 60", explanation: "Sifir 10: 6 × 10 = 60." },
        { q: "Selesaikan: 7 × 4 = ?", options: ["A) 28", "B) 24", "C) 32", "D) 21"], answer: "A) 28", explanation: "Sifir 4: 7 × 4 = 28." },
        { q: "Selesaikan: 5 × 5 = ?", options: ["A) 25", "B) 20", "C) 30", "D) 15"], answer: "A) 25", explanation: "Sifir 5: 5 × 5 = 25." },
        { q: "Selesaikan: 8 × 2 = ?", options: ["A) 16", "B) 14", "C) 18", "D) 12"], answer: "A) 16", explanation: "Sifir 2: 8 × 2 = 16." },
        { q: "Selesaikan: 9 × 10 = ?", options: ["A) 90", "B) 80", "C) 100", "D) 95"], answer: "A) 90", explanation: "Sifir 10: 9 × 10 = 90." },
        { q: "Selesaikan: 4 × 4 = ?", options: ["A) 16", "B) 12", "C) 20", "D) 14"], answer: "A) 16", explanation: "Sifir 4: 4 × 4 = 16." },
        { q: "Selesaikan: 6 × 5 = ?", options: ["A) 30", "B) 25", "C) 35", "D) 20"], answer: "A) 30", explanation: "Sifir 5: 6 × 5 = 30." },
        { q: "Selesaikan: 7 × 2 = ?", options: ["A) 14", "B) 12", "C) 16", "D) 10"], answer: "A) 14", explanation: "Sifir 2: 7 × 2 = 14." }
    ],
    6: [
        { q: "Selesaikan: 10 ÷ 2 = ?", options: ["A) 5", "B) 4", "C) 6", "D) 2"], answer: "A) 5", explanation: "10 dibahagi 2 ialah 5." },
        { q: "Selesaikan: 20 ÷ 5 = ?", options: ["A) 4", "B) 5", "C) 6", "D) 3"], answer: "A) 4", explanation: "20 dibahagi 5 ialah 4." },
        { q: "Selesaikan: 30 ÷ 10 = ?", options: ["A) 3", "B) 4", "C) 5", "D) 2"], answer: "A) 3", explanation: "30 dibahagi 10 ialah 3." },
        { q: "Selesaikan: 16 ÷ 4 = ?", options: ["A) 4", "B) 3", "C) 5", "D) 6"], answer: "A) 4", explanation: "16 dibahagi 4 ialah 4." },
        { q: "Selesaikan: 18 ÷ 2 = ?", options: ["A) 9", "B) 8", "C) 7", "D) 6"], answer: "A) 9", explanation: "18 dibahagi 2 ialah 9." },
        { q: "Selesaikan: 25 ÷ 5 = ?", options: ["A) 5", "B) 4", "C) 6", "D) 3"], answer: "A) 5", explanation: "25 dibahagi 5 ialah 5." },
        { q: "Selesaikan: 40 ÷ 10 = ?", options: ["A) 4", "B) 5", "C) 3", "D) 6"], answer: "A) 4", explanation: "40 dibahagi 10 ialah 4." },
        { q: "Selesaikan: 12 ÷ 4 = ?", options: ["A) 3", "B) 4", "C) 2", "D) 5"], answer: "A) 3", explanation: "12 dibahagi 4 ialah 3." },
        { q: "Selesaikan: 14 ÷ 2 = ?", options: ["A) 7", "B) 6", "C) 8", "D) 5"], answer: "A) 7", explanation: "14 dibahagi 2 ialah 7." },
        { q: "Selesaikan: 35 ÷ 5 = ?", options: ["A) 7", "B) 6", "C) 8", "D) 5"], answer: "A) 7", explanation: "35 dibahagi 5 ialah 7." }
    ],
    7: [
        { q: "Apakah pecahan bahagian berlorek jika 1 daripada 2 bahagian dilorek?", options: ["A) 1/2", "B) 1/3", "C) 1/4", "D) 2/1"], answer: "A) 1/2", explanation: "1 bahagian daripada 2 bahagian ditulis sebagai 1/2." },
        { q: "Tulis dalam perkataan: 1/4", options: ["A) Satu perempat", "B) Satu perdua", "C) Satu pertiga", "D) Satu perlima"], answer: "A) Satu perempat", explanation: "Pecahan 1/4 dibaca sebagai satu perempat atau seperempat." },
        { q: "Apakah pecahan yang lebih besar antara 1/2 dan 1/3?", options: ["A) 1/2", "B) 1/3", "C) Sama besar", "D) Tidak pasti"], answer: "A) 1/2", explanation: "1/2 lebih besar daripada 1/3 kerana kek dibahagi kepada 2 bahagian lebih besar berbanding 3 bahagian." },
        { q: "Tuliskan pecahan bagi 'satu pertiga'.", options: ["A) 1/3", "B) 1/2", "C) 1/4", "D) 1/5"], answer: "A) 1/3", explanation: "Satu pertiga ditulis dalam angka sebagai 1/3." },
        { q: "Apakah pecahan setara bagi 1/2 dengan pengangka 2?", options: ["A) 2/4", "B) 2/3", "C) 2/5", "D) 2/6"], answer: "A) 2/4", explanation: "Pengangka dan penyebut darab dengan 2 menjadi 2/4." },
        { q: "Ibu potong kek kepada 4 bahagian. Ali makan 1 bahagian. Berapakah pecahan kek Ali?", options: ["A) 1/4", "B) 1/2", "C) 3/4", "D) 4/1"], answer: "A) 1/4", explanation: "1 bahagian dimakan daripada 4 bahagian keseluruhan (1/4)." },
        { q: "Bandingkan 1/5 dan 1/10. Mana satukah lebih kecil?", options: ["A) 1/10", "B) 1/5", "C) Sama besar", "D) Tidak pasti"], answer: "A) 1/10", explanation: "1/10 lebih kecil kerana keseluruhan dibahagi kepada lebih banyak bahagian." },
        { q: "Tuliskan pecahan bagi 'satu persepuluh'.", options: ["A) 1/10", "B) 1/100", "C) 1/5", "D) 1/2"], answer: "A) 1/10", explanation: "Satu persepuluh ditulis sebagai 1/10." },
        { q: "Jika satu objek dibahagi kepada 3 bahagian sama besar dan diambil 1, apakah pecahan bahagian itu?", options: ["A) 1/3", "B) 1/2", "C) 1/4", "D) 2/3"], answer: "A) 1/3", explanation: "1 bahagian daripada 3 ialah 1/3." },
        { q: "Pecahan manakah yang menunjukkan separuh daripada satu objek?", options: ["A) 1/2", "B) 1/4", "C) 1/3", "D) 1/5"], answer: "A) 1/2", explanation: "1/2 mewakili separuh daripada satu objek utuh." }
    ],
    8: [
        { q: "Tuliskan 'sifar perpuluhan tiga' dalam bentuk angka.", options: ["A) 0.3", "B) 0.03", "C) 3.0", "D) 0.33"], answer: "A) 0.3", explanation: "Sifar perpuluhan tiga ditulis sebagai 0.3." },
        { q: "Apakah nilai tempat bagi digit 5 dalam 0.5?", options: ["A) Persepuluh", "B) Sa", "C) Puluh", "D) Ratus"], answer: "A) Persepuluh", explanation: "Digit selepas titik perpuluhan yang pertama ialah nilai tempat persepuluh." },
        { q: "Tukarkan pecahan 4/10 kepada perpuluhan.", options: ["A) 0.4", "B) 0.04", "C) 4.0", "D) 0.44"], answer: "A) 0.4", explanation: "4 per sepuluh ditulis sebagai 0.4." },
        { q: "Tuliskan 0.7 dalam bentuk pecahan persepuluh.", options: ["A) 7/10", "B) 7/100", "C) 1/7", "D) 7/7"], answer: "A) 7/10", explanation: "0.7 ditukar kepada pecahan menjadi 7/10." },
        { q: "Apakah perpuluhan yang lebih besar antara 0.2 dan 0.6?", options: ["A) 0.6", "B) 0.2", "C) Sama besar", "D) Tidak pasti"], answer: "A) 0.6", explanation: "0.6 lebih besar daripada 0.2." },
        { q: "Tuliskan nombor perpuluhan 'sifar perpuluhan sembilan'.", options: ["A) 0.9", "B) 0.09", "C) 9.0", "D) 0.99"], answer: "A) 0.9", explanation: "Sifar perpuluhan sembilan ditulis sebagai 0.9." },
        { q: "Apakah nilai digit 8 dalam 0.8?", options: ["A) 0.8", "B) 0.08", "C) 8.0", "D) 8"], answer: "A) 0.8", explanation: "Nilai digit bagi 8 dalam 0.8 ialah 0.8." },
        { q: "Tukarkan pecahan 9/10 kepada perpuluhan.", options: ["A) 0.9", "B) 0.09", "C) 9.0", "D) 0.99"], answer: "A) 0.9", explanation: "9/10 dalam bentuk perpuluhan ialah 0.9." },
        { q: "Susun perpuluhan berikut mengikut tertib menaik: 0.5, 0.1, 0.8, 0.3.", options: ["A) 0.1, 0.3, 0.5, 0.8", "B) 0.8, 0.5, 0.3, 0.1", "C) 0.1, 0.5, 0.3, 0.8", "D) 0.3, 0.1, 0.5, 0.8"], answer: "A) 0.1, 0.3, 0.5, 0.8", explanation: "Tertib menaik bermaksud dari nilai terkecil ke terbesar." },
        { q: "Apakah nombor perpuluhan bagi 5 bahagian daripada 10 bahagian sama besar?", options: ["A) 0.5", "B) 0.2", "C) 0.05", "D) 5.0"], answer: "A) 0.5", explanation: "5/10 ditulis sebagai nombor perpuluhan 0.5." }
    ],
    9: [
        { q: "Tukarkan nilai RM3.50 kepada sen.", options: ["A) 350 sen", "B) 35 sen", "C) 3,500 sen", "D) 3 sen"], answer: "A) 350 sen", explanation: "RM1 = 100 sen, maka RM3.50 = 350 sen." },
        { q: "Tukarkan 250 sen kepada ringgit (RM).", options: ["A) RM2.50", "B) RM25.00", "C) RM0.25", "D) RM250.00"], answer: "A) RM2.50", explanation: "250 sen bahagi 100 menjadi RM2.50." },
        { q: "Selesaikan: RM12.40 + RM5.20 = ?", options: ["A) RM17.60", "B) RM17.50", "C) RM16.60", "D) RM18.60"], answer: "A) RM17.60", explanation: "RM12.40 + RM5.20 = RM17.60." },
        { q: "Selesaikan: RM35.10 + RM14.30 = ?", options: ["A) RM49.40", "B) RM48.40", "C) RM49.30", "D) RM50.40"], answer: "A) RM49.40", explanation: "RM35.10 + RM14.30 = RM49.40." },
        { q: "Selesaikan: RM24.80 + RM15.40 = ?", options: ["A) RM40.20", "B) RM39.20", "C) RM40.10", "D) RM41.20"], answer: "A) RM40.20", explanation: "RM24.80 + RM15.40 = RM40.20." },
        { q: "Selesaikan: RM10.50 + RM8.00 + RM3.25 = ?", options: ["A) RM21.75", "B) RM21.50", "C) RM20.75", "D) RM22.75"], answer: "A) RM21.75", explanation: "RM10.50 + RM8.00 + RM3.25 = RM21.75." },
        { q: "Ali ada RM20. Ayahnya beri RM15. Berapakah jumlah wang Ali?", options: ["A) RM35", "B) RM30", "C) RM40", "D) RM25"], answer: "A) RM35", explanation: "RM20 + RM15 = RM35." },
        { q: "Selesaikan: RM45.00 + RM22.50 = ?", options: ["A) RM67.50", "B) RM66.50", "C) RM67.00", "D) RM68.50"], answer: "A) RM67.50", explanation: "RM45.00 + RM22.50 = RM67.50." },
        { q: "Harga sebuah buku ialah RM12. Beli 2 buah buku, berapakah jumlah harga?", options: ["A) RM24", "B) RM22", "C) RM26", "D) RM20"], answer: "A) RM24", explanation: "RM12 × 2 = RM24." },
        { q: "Hitung jumlah: RM50.00 + RM25.50 = ?", options: ["A) RM75.50", "B) RM74.50", "C) RM76.50", "D) RM75.00"], answer: "A) RM75.50", explanation: "RM50.00 + RM25.50 = RM75.50." }
    ],
    10: [
        { q: "Selesaikan: RM50.00 - RM15.20 = ?", options: ["A) RM34.80", "B) RM35.80", "C) RM34.20", "D) RM33.80"], answer: "A) RM34.80", explanation: "RM50.00 - RM15.20 = RM34.80." },
        { q: "Selesaikan: RM30.00 - RM12.50 = ?", options: ["A) RM17.50", "B) RM18.50", "C) RM17.00", "D) RM16.50"], answer: "A) RM17.50", explanation: "RM30.00 - RM12.50 = RM17.50." },
        { q: "Selesaikan: RM100.00 - RM45.50 = ?", options: ["A) RM54.50", "B) RM55.50", "C) RM54.00", "D) RM53.50"], answer: "A) RM54.50", explanation: "RM100.00 - RM45.50 = RM54.50." },
        { q: "Selesaikan: RM25.40 - RM10.20 = ?", options: ["A) RM15.20", "B) RM15.40", "C) RM14.20", "D) RM16.20"], answer: "A) RM15.20", explanation: "RM25.40 - RM10.20 = RM15.20." },
        { q: "Ali bayar RM50 untuk barang berharga RM32.40. Berapakah bakinya?", options: ["A) RM17.60", "B) RM18.60", "C) RM17.40", "D) RM16.60"], answer: "A) RM17.60", explanation: "RM50.00 - RM32.40 = RM17.60." },
        { q: "Baki wang selepas beli mainan RM18.50 daripada wang RM50.00.", options: ["A) RM31.50", "B) RM32.50", "C) RM30.50", "D) RM31.00"], answer: "A) RM31.50", explanation: "RM50.00 - RM18.50 = RM31.50." },
        { q: "Selesaikan: RM75.50 - RM24.30 = ?", options: ["A) RM51.20", "B) RM51.80", "C) RM50.20", "D) RM52.20"], answer: "A) RM51.20", explanation: "RM75.50 - RM24.30 = RM51.20." },
        { q: "Ibu ada RM80. Dia beli baju RM45. Berapakah baki wangnya?", options: ["A) RM35", "B) RM45", "C) RM25", "D) RM40"], answer: "A) RM35", explanation: "RM80 - RM45 = RM35." },
        { q: "Selesaikan: RM40.00 - RM18.60 = ?", options: ["A) RM21.40", "B) RM22.40", "C) RM21.60", "D) RM20.40"], answer: "A) RM21.40", explanation: "RM40.00 - RM18.60 = RM21.40." },
        { q: "Hitung baki: RM60.00 - RM27.50 = ?", options: ["A) RM32.50", "B) RM33.50", "C) RM31.50", "D) RM32.00"], answer: "A) RM32.50", explanation: "RM60.00 - RM27.50 = RM32.50." }
    ],
    11: [
        { q: "Pukul berapakah jarum pendek di angka 3 dan jarum panjang di angka 12?", options: ["A) Pukul 3:00", "B) Pukul 12:03", "C) Pukul 6:00", "D) Pukul 9:00"], answer: "A) Pukul 3:00", explanation: "Jarum pendek di angka 3 dan panjang di angka 12 menunjukkan pukul 3:00." },
        { q: "Tuliskan waktu 'pukul empat tiga puluh' dalam angka.", options: ["A) 4:30", "B) 3:30", "C) 4:00", "D) 3:40"], answer: "A) 4:30", explanation: "Pukul empat tiga puluh ditulis sebagai 4:30." },
        { q: "Berapakah bilangan jam dalam sehari?", options: ["A) 24 jam", "B) 12 jam", "C) 7 jam", "D) 60 jam"], answer: "A) 24 jam", explanation: "Sehari semalam mengandungi 24 jam." },
        { q: "Berapakah bilangan hari dalam seminggu?", options: ["A) 7 hari", "B) 5 hari", "C) 30 hari", "D) 12 hari"], answer: "A) 7 hari", explanation: "Seminggu mempunyai 7 hari." },
        { q: "Berapakah bilangan bulan dalam setahun?", options: ["A) 12 bulan", "B) 7 bulan", "C) 24 bulan", "D) 365 bulan"], answer: "A) 12 bulan", explanation: "Setahun mempunyai 12 bulan." },
        { q: "Hari apakah selepas hari Rabu?", options: ["A) Khamis", "B) Selasa", "C) Jumaat", "D) Isnin"], answer: "A) Khamis", explanation: "Selepas hari Rabu ialah hari Khamis." },
        { q: "Bulan apakah sebelum bulan Mac?", options: ["A) Februari", "B) Januari", "C) April", "D) Mei"], answer: "A) Februari", explanation: "Sebelum bulan Mac ialah bulan Februari." },
        { q: "Ali tidur pukul 9:00 malam dan bangun pukul 6:00 pagi. Berapa jam Ali tidur pada waktu malam?", options: ["A) 9 jam", "B) 8 jam", "C) 10 jam", "D) 7 jam"], answer: "A) 9 jam", explanation: "Dari 9:00 malam ke 6:00 pagi ialah selama 9 jam." },
        { q: "Berapakah bilangan hari dalam bulan Februari tahun biasa?", options: ["A) 28 hari", "B) 29 hari", "C) 30 hari", "D) 31 hari"], answer: "A) 28 hari", explanation: "Bulan Februari dalam tahun biasa mempunyai 28 hari." },
        { q: "Tukarkan 2 minggu kepada bilangan hari.", options: ["A) 14 hari", "B) 7 hari", "C) 21 hari", "D) 28 hari"], answer: "A) 14 hari", explanation: "2 minggu × 7 hari = 14 hari." }
    ],
    12: [
        { q: "Tukarkan 2 m kepada sentimeter.", options: ["A) 200 cm", "B) 20 cm", "C) 2,000 cm", "D) 2 cm"], answer: "A) 200 cm", explanation: "1 m = 100 cm, maka 2 m = 200 cm." },
        { q: "Tukarkan 300 cm kepada meter.", options: ["A) 3 m", "B) 30 m", "C) 300 m", "D) 0.3 m"], answer: "A) 3 m", explanation: "300 cm bahagi 100 menjadi 3 m." },
        { q: "Selesaikan: 25 cm + 40 cm = ?", options: ["A) 65 cm", "B) 55 cm", "C) 75 cm", "D) 60 cm"], answer: "A) 65 cm", explanation: "25 cm + 40 cm = 65 cm." },
        { q: "Selesaikan: 3 m + 4 m = ?", options: ["A) 7 m", "B) 6 m", "C) 8 m", "D) 12 m"], answer: "A) 7 m", explanation: "3 m + 4 m = 7 m." },
        { q: "Hitung beza: 85 cm - 30 cm = ?", options: ["A) 55 cm", "B) 65 cm", "C) 45 cm", "D) 50 cm"], answer: "A) 55 cm", explanation: "85 cm - 30 cm = 55 cm." },
        { q: "Panjang sebatang pensel 15 cm. Pembaris 30 cm. Berapakah beza panjang?", options: ["A) 15 cm", "B) 20 cm", "C) 10 cm", "D) 45 cm"], answer: "A) 15 cm", explanation: "30 cm - 15 cm = 15 cm." },
        { q: "Tukarkan 120 cm kepada meter dan sentimeter.", options: ["A) 1 m 20 cm", "B) 12 m 0 cm", "C) 1 m 2 cm", "D) 2 m 10 cm"], answer: "A) 1 m 20 cm", explanation: "120 cm = 100 cm (1 m) dan 20 cm." },
        { q: "Selesaikan: 4 m 20 cm + 1 m 50 cm = ?", options: ["A) 5 m 70 cm", "B) 5 m 60 cm", "C) 4 m 70 cm", "D) 6 m 70 cm"], answer: "A) 5 m 70 cm", explanation: "4m + 1m = 5m, 20cm + 50cm = 70cm (5 m 70 cm)." },
        { q: "Kain panjang 3 m dipotong 1 m. Berapakah baki panjang kain?", options: ["A) 2 m", "B) 1 m", "C) 4 m", "D) 3 m"], answer: "A) 2 m", explanation: "3 m - 1 m = 2 m." },
        { q: "Ukuran meja 2 m. 2 buah meja disusun sebaris, berapakah jumlah panjang dalam meter?", options: ["A) 4 m", "B) 2 m", "C) 3 m", "D) 5 m"], answer: "A) 4 m", explanation: "2 m + 2 m = 4 m." }
    ],
    13: [
        { q: "Tukarkan 1 kg kepada gram.", options: ["A) 1,000 g", "B) 100 g", "C) 10 g", "D) 10,000 g"], answer: "A) 1,000 g", explanation: "1 kg adalah sama dengan 1,000 gram." },
        { q: "Tukarkan 2,000 g kepada kilogram.", options: ["A) 2 kg", "B) 20 kg", "C) 200 kg", "D) 0.2 kg"], answer: "A) 2 kg", explanation: "2,000 g bahagi 1,000 menjadi 2 kg." },
        { q: "Selesaikan: 300 g + 450 g = ?", options: ["A) 750 g", "B) 650 g", "C) 850 g", "D) 700 g"], answer: "A) 750 g", explanation: "300 g + 450 g = 750 g." },
        { q: "Selesaikan: 2 kg + 5 kg = ?", options: ["A) 7 kg", "B) 6 kg", "C) 8 kg", "D) 10 kg"], answer: "A) 7 kg", explanation: "2 kg + 5 kg = 7 kg." },
        { q: "Tukarkan 1 liter kepada mililiter.", options: ["A) 1,000 ml", "B) 100 ml", "C) 10 ml", "D) 10,000 ml"], answer: "A) 1,000 ml", explanation: "1 liter = 1,000 mililiter." },
        { q: "Tukarkan 3,000 ml kepada liter.", options: ["A) 3 l", "B) 30 l", "C) 300 l", "D) 0.3 l"], answer: "A) 3 l", explanation: "3,000 ml bahagi 1,000 menjadi 3 liter." },
        { q: "Selesaikan: 400 ml + 250 ml = ?", options: ["A) 650 ml", "B) 550 ml", "C) 750 ml", "D) 600 ml"], answer: "A) 650 ml", explanation: "400 ml + 250 ml = 650 ml." },
        { q: "Sebiji kek jisim 2 kg. Biskut jisim 500 g. Berapakah jumlah jisim dalam gram?", options: ["A) 2,500 g", "B) 2,050 g", "C) 700 g", "D) 502 g"], answer: "A) 2,500 g", explanation: "2 kg = 2,000 g, ditambah 500 g menjadi 2,500 g." },
        { q: "Botol ada 2 l air. Dituang 500 ml. Berapakah baki air dalam mililiter?", options: ["A) 1,500 ml", "B) 1,000 ml", "C) 1,800 ml", "D) 500 ml"], answer: "A) 1,500 ml", explanation: "2 l = 2,000 ml. 2,000 ml - 500 ml = 1,500 ml." },
        { q: "Baldi ada 5 l air. Ditambah lagi 3 l. Berapakah jumlah isipadu air?", options: ["A) 8 l", "B) 7 l", "C) 9 l", "D) 15 l"], answer: "A) 8 l", explanation: "5 l + 3 l = 8 l." }
    ],
    14: [
        { q: "Apakah nama bentuk 2D yang mempunyai 4 sisi sama panjang?", options: ["A) Segi Empat Sama", "B) Segi Empat Tepat", "C) Segi Tiga", "D) Bulatan"], answer: "A) Segi Empat Sama", explanation: "Segi empat sama mempunyai 4 sisi lurus yang sama panjang." },
        { q: "Apakah nama bentuk 3D yang mempunyai permukaan melengkung dan 2 tapak bulatan?", options: ["A) Silinder", "B) Kon", "C) Sfera", "D) Kuboid"], answer: "A) Silinder", explanation: "Silinder mempunyai permukaan melengkung dan 2 tapak berbentuk bulatan." },
        { q: "Nyatakan bilangan bucu bagi sebuah Segi Tiga.", options: ["A) 3", "B) 4", "C) 5", "D) 2"], answer: "A) 3", explanation: "Sebuah segi tiga mempunyai 3 bucu." },
        { q: "Nyatakan bilangan sisi lurus bagi sebuah Segi Empat Tepat.", options: ["A) 4", "B) 3", "C) 5", "D) 6"], answer: "A) 4", explanation: "Segi empat tepat mempunyai 4 sisi lurus." },
        { q: "Bentuk apakah bola sepak?", options: ["A) Sfera", "B) Silinder", "C) Kubus", "D) Kon"], answer: "A) Sfera", explanation: "Bola sepak berbentuk sfera (bulat penuh 3D)." },
        { q: "Berdasarkan carta palang, jika 5 orang suka epal dan 3 suka oren, berapakah jumlah peminat epal dan oren?", options: ["A) 8", "B) 7", "C) 6", "D) 9"], answer: "A) 8", explanation: "5 + 3 = 8 orang peminat." },
        { q: "Nyatakan bentuk bagi tin minuman.", options: ["A) Silinder", "B) Kuboid", "C) Kon", "D) Sfera"], answer: "A) Silinder", explanation: "Tin minuman menyerupai bentuk silinder." },
        { q: "Berapakah bilangan permukaan rata bagi sebuah Kuboid?", options: ["A) 6", "B) 4", "C) 8", "D) 5"], answer: "A) 6", explanation: "Kuboid mempunyai 6 permukaan rata." },
        { q: "Apakah bentuk permukaan tapak bagi sebuah Kon?", options: ["A) Bulatan", "B) Segi Tiga", "C) Segi Empat", "D) Sfera"], answer: "A) Bulatan", explanation: "Tapak kon berbentuk bulatan." },
        { q: "Jika 1 simbol piktograf mewakili 2 orang murid, berapakah nilai untuk 4 simbol?", options: ["A) 8", "B) 6", "C) 10", "D) 4"], answer: "A) 8", explanation: "4 simbol × 2 orang = 8 orang murid." }
    ]
};
