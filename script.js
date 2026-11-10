let studentData = { name: '', email: '' };
let currentLevel = 1;
let currentQuestionIndex = 0;
let currentLevelQuestions = [];
let scoreCount = 0;

// Bank Soalan Objektif (A, B, C, D) & Explanation untuk Level 1 hingga Level 17
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
    ],
    3: [
        {
            q: "Selesaikan: 2,134 + 3,421 = ?",
            options: ["A) 5,555", "B) 5,455", "C) 5,655", "D) 4,555"],
            answer: "A) 5,555",
            explanation: "Tambah mengikut nilai tempat tanpa mengumpul semula: 2,134 + 3,421 = 5,555."
        },
        {
            q: "Selesaikan: 4,023 + 1,512 = ?",
            options: ["A) 5,535", "B) 5,435", "C) 5,635", "D) 5,525"],
            answer: "A) 5,535",
            explanation: "4,023 + 1,512 = 5,535."
        },
        {
            q: "Selesaikan: 5,320 + 2,146 = ?",
            options: ["A) 7,466", "B) 7,366", "C) 7,566", "D) 7,456"],
            answer: "A) 7,466",
            explanation: "5,320 + 2,146 = 7,466."
        },
        {
            q: "Selesaikan: 1,011 + 6,854 = ?",
            options: ["A) 7,865", "B) 7,765", "C) 7,855", "D) 6,865"],
            answer: "A) 7,865",
            explanation: "1,011 + 6,854 = 7,865."
        },
        {
            q: "Selesaikan: 3,210 + 4,320 = ?",
            options: ["A) 7,530", "B) 7,430", "C) 7,630", "D) 7,520"],
            answer: "A) 7,530",
            explanation: "3,210 + 4,320 = 7,530."
        },
        {
            q: "Selesaikan: 6,142 + 2,335 = ?",
            options: ["A) 8,477", "B) 8,377", "C) 8,577", "D) 8,467"],
            answer: "A) 8,477",
            explanation: "6,142 + 2,335 = 8,477."
        },
        {
            q: "Selesaikan: 2,431 + 5,124 = ?",
            options: ["A) 7,555", "B) 7,455", "C) 7,655", "D) 7,545"],
            answer: "A) 7,555",
            explanation: "2,431 + 5,124 = 7,555."
        },
        {
            q: "Selesaikan: 4,120 + 3,850 = ?",
            options: ["A) 7,970", "B) 7,870", "C) 7,960", "D) 8,970"],
            answer: "A) 7,970",
            explanation: "4,120 + 3,850 = 7,970."
        },
        {
            q: "Selesaikan: 7,021 + 1,432 = ?",
            options: ["A) 8,453", "B) 8,353", "C) 8,553", "D) 8,443"],
            answer: "A) 8,453",
            explanation: "7,021 + 1,432 = 8,453."
        },
        {
            q: "Selesaikan: 3,142 + 4,015 = ?",
            options: ["A) 7,157", "B) 7,057", "C) 7,257", "D) 7,147"],
            answer: "A) 7,157",
            explanation: "3,142 + 4,015 = 7,157."
        }
    ],
    4: [
        {
            q: "Hitung hasil tambah bagi 2,450 + 1,325[span_7](start_span)[span_7](end_span)",
            options: ["A) 3,775", "B) 3,675", "C) 3,875", "D) 3,765"],
            answer: "A) 3,775",
            explanation: "2,450 + 1,325 = 3,775[span_8](start_span)[span_8](end_span)."
        },
        {
            q: "Selesaikan: 2,120 + 3,674[span_9](start_span)[span_9](end_span)",
            options: ["A) 5,794", "B) 5,694", "C) 5,894", "D) 5,784"],
            answer: "A) 5,794",
            explanation: "2,120 + 3,674 = 5,794[span_10](start_span)[span_10](end_span)."
        },
        {
            q: "Tambahkan 5,082 dengan 2,410[span_11](start_span)[span_11](end_span).",
            options: ["A) 7,492", "B) 7,392", "C) 7,592", "D) 7,482"],
            answer: "A) 7,492",
            explanation: "5,082 + 2,410 = 7,492[span_12](start_span)[span_12](end_span)."
        },
        {
            q: "Cari jumlah bagi 3,456 + 1,283 (mengumpul semula)[span_13](start_span)[span_13](end_span).",
            options: ["A) 4,739", "B) 4,639", "C) 4,839", "D) 4,729"],
            answer: "A) 4,739",
            explanation: "6+3=9, 5+8=13 (simpan 1), 4+2+1=7, 3+1=4. Jawapan: 4,739[span_14](start_span)[span_14](end_span)."
        },
        {
            q: "Hitung hasil tambah tiga nombor ini: 3,200 + 2,300 + 1,150[span_15](start_span)[span_15](end_span)",
            options: ["A) 6,650", "B) 6,550", "C) 6,750", "D) 6,640"],
            answer: "A) 6,650",
            explanation: "3,200 + 2,300 = 5,500. 5,500 + 1,150 = 6,650[span_16](start_span)[span_16](end_span)."
        },
        {
            q: "Apakah jumlah bagi 6,421 + 2,138?[span_17](start_span)[span_17](end_span)",
            options: ["A) 8,559", "B) 8,459", "C) 8,659", "D) 8,549"],
            answer: "A) 8,559",
            explanation: "6,421 + 2,138 = 8,559[span_18](start_span)[span_18](end_span)."
        },
        {
            q: "Selesaikan penambahan berikut: 492 + 3,250[span_19](start_span)[span_19](end_span)",
            options: ["A) 3,742", "B) 3,642", "C) 3,842", "D) 3,732"],
            answer: "A) 3,742",
            explanation: "3,250 + 492 = 3,742[span_20](start_span)[span_20](end_span)."
        },
        {
            q: "Tambahkan 7,045 dengan 1,890[span_21](start_span)[span_21](end_span).",
            options: ["A) 8,935", "B) 8,835", "C) 9,935", "D) 8,925"],
            answer: "A) 8,935",
            explanation: "7,045 + 1,890 = 8,935[span_22](start_span)[span_22](end_span)."
        },
        {
            q: "Sebuah perpustakaan mempunyai 3,400 buah buku BM dan 2,520 buah buku BI. Berapakah jumlah keseluruhan buku itu?[span_23](start_span)[span_23](end_span)",
            options: ["A) 5,920", "B) 5,820", "C) 6,020", "D) 5,910"],
            answer: "A) 5,920",
            explanation: "3,400 + 2,520 = 5,920 buah buku[span_24](start_span)[span_24](end_span)."
        },
        {
            q: "Cari nilai anu bagi: 4,300 + 3,250 = ?[span_25](start_span)[span_25](end_span)",
            options: ["A) 7,550", "B) 7,450", "C) 7,650", "D) 7,540"],
            answer: "A) 7,550",
            explanation: "4,300 + 3,250 = 7,550[span_26](start_span)[span_26](end_span)."
        }
    ],
    5: [
        {
            q: "Hitung baki bagi 5,000 - 1,842[span_27](start_span)[span_27](end_span).",
            options: ["A) 3,158", "B) 3,258", "C) 3,148", "D) 3,058"],
            answer: "A) 3,158",
            explanation: "5,000 - 1,842 = 3,158[span_28](start_span)[span_28](end_span)."
        },
        {
            q: "Selesaikan: 7,420 - 3,150[span_29](start_span)[span_29](end_span).",
            options: ["A) 4,270", "B) 4,170", "C) 4,370", "D) 4,260"],
            answer: "A) 4,270",
            explanation: "7,420 - 3,150 = 4,270[span_30](start_span)[span_30](end_span)."
        },
        {
            q: "Tolakkan 1,245 daripada 6,300[span_31](start_span)[span_31](end_span).",
            options: ["A) 5,055", "B) 5,155", "C) 5,045", "D) 4,055"],
            answer: "A) 5,055",
            explanation: "6,300 - 1,245 = 5,055[span_32](start_span)[span_32](end_span)."
        },
        {
            q: "Cari beza antara 8,054 dengan 4,213[span_33](start_span)[span_33](end_span).",
            options: ["A) 3,841", "B) 3,941", "C) 3,741", "D) 3,831"],
            answer: "A) 3,841",
            explanation: "8,054 - 4,213 = 3,841[span_34](start_span)[span_34](end_span)."
        },
        {
            q: "Selesaikan operasi berturut-turut: 9,000 - 2,400 - 1,500[span_35](start_span)[span_35](end_span).",
            options: ["A) 5,100", "B) 5,000", "C) 5,200", "D) 4,100"],
            answer: "A) 5,100",
            explanation: "9,000 - 2,400 = 6,600. Kemudian 6,600 - 1,500 = 5,100[span_36](start_span)[span_36](end_span)."
        },
        {
            q: "Apakah hasil tolak bagi 4,520 - 1,895 (mengumpul semula)[span_37](start_span)[span_37](end_span)?",
            options: ["A) 2,625", "B) 2,725", "C) 2,615", "D) 2,525"],
            answer: "A) 2,625",
            explanation: "4,520 - 1,895 = 2,625[span_38](start_span)[span_38](end_span)."
        },
        {
            q: "Tolak 386 daripada 3,400[span_39](start_span)[span_39](end_span).",
            options: ["A) 3,014", "B) 3,114", "C) 3,004", "D) 2,014"],
            answer: "A) 3,014",
            explanation: "3,400 - 386 = 3,014[span_40](start_span)[span_40](end_span)."
        },
        {
            q: "Selesaikan: 6,012 - 2,745[span_41](start_span)[span_41](end_span).",
            options: ["A) 3,267", "B) 3,167", "C) 3,367", "D) 3,257"],
            answer: "A) 3,267",
            explanation: "6,012 - 2,745 = 3,267[span_42](start_span)[span_42](end_span)."
        },
        {
            q: "Encik Ali mempunyai 4,500 biji epal. Dia telah menjual 2,850 biji epal. Berapakah baki epal yang tinggal?[span_43](start_span)[span_43](end_span)",
            options: ["A) 1,650", "B) 1,750", "C) 1,550", "D) 1,640"],
            answer: "A) 1,650",
            explanation: "4,500 - 2,850 = 1,650 biji epal[span_44](start_span)[span_44](end_span)."
        },
        {
            q: "Cari nilai anu bagi: 7,200 - 🛈 = 3,450[span_45](start_span)[span_45](end_span)",
            options: ["A) 3,750", "B) 3,850", "C) 3,650", "D) 3,740"],
            answer: "A) 3,750",
            explanation: "7,200 - 3,450 = 3,750[span_46](start_span)[span_46](end_span)."
        }
    ],
    6: [
        {
            q: "Selesaikan: 4,200 + 1,500 - 2,300[span_47](start_span)[span_47](end_span).",
            options: ["A) 3,400", "B) 3,300", "C) 3,500", "D) 4,400"],
            answer: "A) 3,400",
            explanation: "Kira dari kiri ke kanan: 4,200 + 1,500 = 5,700. Kemudian 5,700 - 2,300 = 3,400[span_48](start_span)[span_48](end_span)."
        },
        {
            q: "Hitung: 6,340 - 2,100 + 1,250[span_49](start_span)[span_49](end_span).",
            options: ["A) 5,490", "B) 5,390", "C) 5,590", "D) 4,490"],
            answer: "A) 5,490",
            explanation: "6,340 - 2,100 = 4,240. 4,240 + 1,250 = 5,490[span_50](start_span)[span_50](end_span)."
        },
        {
            q: "Selesaikan: 3,050 + 2,400 - 1,800[span_51](start_span)[span_51](end_span).",
            options: ["A) 3,650", "B) 3,550", "C) 3,750", "D) 3,640"],
            answer: "A) 3,650",
            explanation: "3,050 + 2,400 = 5,450. 5,450 - 1,800 = 3,650[span_52](start_span)[span_52](end_span)."
        },
        {
            q: "Cari nilai bagi: 7,800 - 4,200 + 3,100[span_53](start_span)[span_53](end_span).",
            options: ["A) 6,700", "B) 6,600", "C) 6,800", "D) 5,700"],
            answer: "A) 6,700",
            explanation: "7,800 - 4,200 = 3,600. 3,600 + 3,100 = 6,700[span_54](start_span)[span_54](end_span)."
        },
        {
            q: "Selesaikan: 1,450 + 2,300 - 900[span_55](start_span)[span_55](end_span).",
            options: ["A) 2,850", "B) 2,750", "C) 2,950", "D) 2,840"],
            answer: "A) 2,850",
            explanation: "1,450 + 2,300 = 3,750. 3,750 - 900 = 2,850[span_56](start_span)[span_56](end_span)."
        },
        {
            q: "Hitung: 8,500 - 3,200 - 1,400[span_57](start_span)[span_57](end_span).",
            options: ["A) 3,900", "B) 3,800", "C) 4,000", "D) 3,700"],
            answer: "A) 3,900",
            explanation: "8,500 - 3,200 = 5,300. 5,300 - 1,400 = 3,900[span_58](start_span)[span_58](end_span)."
        },
        {
            q: "Selesaikan: 2,120 + 3,450 - 1,600[span_59](start_span)[span_59](end_span).",
            options: ["A) 3,970", "B) 3,870", "C) 4,070", "D) 3,960"],
            answer: "A) 3,970",
            explanation: "2,120 + 3,450 = 5,570. 5,570 - 1,600 = 3,970[span_60](start_span)[span_60](end_span)."
        },
        {
            q: "Cari nilai bagi: 5,600 - 2,300 + 1,850[span_61](start_span)[span_61](end_span).",
            options: ["A) 5,150", "B) 5,050", "C) 5,250", "D) 4,150"],
            answer: "A) 5,150",
            explanation: "5,600 - 2,300 = 3,300. 3,300 + 1,850 = 5,150[span_62](start_span)[span_62](end_span)."
        },
        {
            q: "Sebuah gudang mempunyai 4,000 kotak mainan. Sebanyak 1,200 kotak dikeluarkan, kemudian 1,500 kotak baharu dimasukkan. Berapakah jumlah kotak di dalam gudang sekarang?[span_63](start_span)[span_63](end_span)",
            options: ["A) 4,300", "B) 4,200", "C) 4,400", "D) 3,300"],
            answer: "A) 4,300",
            explanation: "4,000 - 1,200 = 2,800. 2,800 + 1,500 = 4,300 kotak[span_64](start_span)[span_64](end_span)."
        },
        {
            q: "Selesaikan ayat matematik ini: 6,100 + 2,800 - 4,300 = ?[span_65](start_span)[span_65](end_span)",
            options: ["A) 4,600", "B) 4,500", "C) 4,700", "D) 4,400"],
            answer: "A) 4,600",
            explanation: "6,100 + 2,800 = 8,900. 8,900 - 4,300 = 4,600[span_66](start_span)[span_66](end_span)."
        }
    ],
    7: [
        {
            q: "Apakah nilai bagi simbol 🛈 jika 🛈 + 1,200 = 4,500?[span_67](start_span)[span_67](end_span)",
            options: ["A) 3,300", "B) 3,400", "C) 3,200", "D) 5,700"],
            answer: "A) 3,300",
            explanation: "🛈 = 4,500 - 1,200 = 3,300[span_68](start_span)[span_68](end_span)."
        },
        {
            q: "Cari nilai anu: 2,450 + 🛈 = 6,000[span_69](start_span)[span_69](end_span).",
            options: ["A) 3,550", "B) 3,450", "C) 3,650", "D) 3,540"],
            answer: "A) 3,550",
            explanation: "🛈 = 6,000 - 2,450 = 3,550[span_70](start_span)[span_70](end_span)."
        },
        {
            q: "Selesaikan persamaan: 🛈 - 1,500 = 3,200[span_71](start_span)[span_71](end_span).",
            options: ["A) 4,700", "B) 4,600", "C) 4,800", "D) 1,700"],
            answer: "A) 4,700",
            explanation: "🛈 = 3,200 + 1,500 = 4,700[span_72](start_span)[span_72](end_span)."
        },
        {
            q: "Apakah nilai bagi y jika 5,400 - y = 2,100?[span_73](start_span)[span_73](end_span)",
            options: ["A) 3,300", "B) 3,400", "C) 3,200", "D) 7,500"],
            answer: "A) 3,300",
            explanation: "y = 5,400 - 2,100 = 3,300[span_74](start_span)[span_74](end_span)."
        },
        {
            q: "Selesaikan persamaan tambah: 3,120 + 🛈 = 7,000[span_75](start_span)[span_75](end_span).",
            options: ["A) 3,880", "B) 3,780", "C) 3,980", "D) 3,870"],
            answer: "A) 3,880",
            explanation: "🛈 = 7,000 - 3,120 = 3,880[span_76](start_span)[span_76](end_span)."
        },
        {
            q: "Cari nilai anu bagi: 🛈 - 2,400 = 1,850[span_77](start_span)[span_77](end_span).",
            options: ["A) 4,250", "B) 4,150", "C) 4,350", "D) 4,240"],
            answer: "A) 4,250",
            explanation: "🛈 = 1,850 + 2,400 = 4,250[span_78](start_span)[span_78](end_span)."
        },
        {
            q: "Apakah nombor misteri bagi x dalam persamaan 8,300 - x = 4,150?[span_79](start_span)[span_79](end_span)",
            options: ["A) 4,150", "B) 4,250", "C) 4,050", "D) 3,150"],
            answer: "A) 4,150",
            explanation: "x = 8,300 - 4,150 = 4,150[span_80](start_span)[span_80](end_span)."
        },
        {
            q: "Selesaikan ayat matematik: 1,600 + 🛈 + 1,400 = 5,000[span_81](start_span)[span_81](end_span).",
            options: ["A) 2,000", "B) 3,000", "C) 2,500", "D) 1,500"],
            answer: "A) 2,000",
            explanation: "1,600 + 1,400 = 3,000. 🛈 = 5,000 - 3,000 = 2,000[span_82](start_span)[span_82](end_span)."
        },
        {
            q: "Amin ada beberapa biji guli. Dia beri 1,200 biji kepada adiknya dan baki gulinya tinggal 3,500 biji. Berapakah jumlah guli asal Amin (gunakan anu 🛈)?[span_83](start_span)[span_83](end_span)",
            options: ["A) 4,700", "B) 4,600", "C) 2,300", "D) 4,800"],
            answer: "A) 4,700",
            explanation: "🛈 - 1,200 = 3,500 maka 🛈 = 3,500 + 1,200 = 4,700 biji guli[span_84](start_span)[span_84](end_span)."
        },
        {
            q: "Cari nilai anu bagi: 🛈 + 2,150 = 6,000[span_85](start_span)[span_85](end_span).",
            options: ["A) 3,850", "B) 3,750", "C) 3,950", "D) 3,840"],
            answer: "A) 3,850",
            explanation: "🛈 = 6,000 - 2,150 = 3,850[span_86](start_span)[span_86](end_span)."
        }
    ],
    8: [
        {
            q: "Hitung hasil darab bagi 7 × 9[span_87](start_span)[span_87](end_span).",
            options: ["A) 63", "B) 56", "C) 72", "D) 49"],
            answer: "A) 63",
            explanation: "Sifir 7: 7 × 9 = 63[span_88](start_span)[span_88](end_span)."
        },
        {
            q: "Selesaikan: 8 × 6[span_89](start_span)[span_89](end_span).",
            options: ["A) 48", "B) 42", "C) 54", "D) 36"],
            answer: "A) 48",
            explanation: "Sifir 8: 8 × 6 = 48[span_90](start_span)[span_90](end_span)."
        },
        {
            q: "Cari hasil darab bagi 40 × 50[span_91](start_span)[span_91](end_span).",
            options: ["A) 2,000", "B) 200", "C) 20,000", "D) 1,500"],
            answer: "A) 2,000",
            explanation: "4 × 5 = 20 tambah dua sifar jadi 2,000[span_92](start_span)[span_92](end_span)."
        },
        {
            q: "Apakah nilai bagi 9 × 8[span_93](start_span)[span_93](end_span)?",
            options: ["A) 72", "B) 81", "C) 64", "D) 56"],
            answer: "A) 72",
            explanation: "Sifir 9: 9 × 8 = 72[span_94](start_span)[span_94](end_span)."
        },
        {
            q: "Selesaikan pendaraban: 30 × 7[span_95](start_span)[span_95](end_span)",
            options: ["A) 210", "B) 200", "C) 240", "D) 211"],
            answer: "A) 210",
            explanation: "3 × 7 = 21 tambah satu sifar jadi 210[span_96](start_span)[span_96](end_span)."
        },
        {
            q: "Hitung nilai bagi 6 × 12[span_97](start_span)[span_97](end_span)",
            options: ["A) 72", "B) 68", "C) 78", "D) 66"],
            answer: "A) 72",
            explanation: "6 × 12 = 72[span_98](start_span)[span_98](end_span)."
        },
        {
            q: "Selesaikan: 200 × 4[span_99](start_span)[span_99](end_span).",
            options: ["A) 800", "B) 600", "C) 400", "D) 1,000"],
            answer: "A) 800",
            explanation: "2 × 4 = 8 tambah dua sifar jadi 800[span_100](start_span)[span_100](end_span)."
        },
        {
            q: "Cari hasil darab bagi 70 × 10[span_101](start_span)[span_101](end_span)",
            options: ["A) 700", "B) 70", "C) 7,000", "D) 710"],
            answer: "A) 700",
            explanation: "70 darab 10 menambah satu sifar di belakang menjadi 700[span_102](start_span)[span_102](end_span)."
        },
        {
            q: "Sebuah kelas mempunyai 8 baris kerusi. Setiap baris ada 9 buah kerusi. Berapakah jumlah kerusi semuanya?[span_103](start_span)[span_103](end_span)",
            options: ["A) 72", "B) 81", "C) 64", "D) 56"],
            answer: "A) 72",
            explanation: "8 × 9 = 72 buah kerusi[span_104](start_span)[span_104](end_span)."
        },
        {
            q: "Selesaikan ayat matematik berikut: 0 × 60 = ?[span_105](start_span)[span_105](end_span)",
            options: ["A) 0", "B) 60", "C) 1", "D) 600"],
            answer: "A) 0",
            explanation: "Sebarang nombor yang didarab dengan 0 akan menghasilkan 0[span_106](start_span)[span_106](end_span)."
        }
    ],
    9: [
        {
            q: "Cari hasil darab bagi 1,243 × 3[span_107](start_span)[span_107](end_span)",
            options: ["A) 3,729", "B) 3,629", "C) 3,739", "D) 3,829"],
            answer: "A) 3,729",
            explanation: "3×3=9, 4×3=12 (simpan 1), 2×3+1=7, 1×3=3. Jawapan: 3,729[span_108](start_span)[span_108](end_span)."
        },
        {
            q: "Selesaikan: 2,130 × 4[span_109](start_span)[span_109](end_span)",
            options: ["A) 8,520", "B) 8,420", "C) 8,620", "D) 8,510"],
            answer: "A) 8,520",
            explanation: "2,130 × 4 = 8,520[span_110](start_span)[span_110](end_span)."
        },
        {
            q: "Darabkan 3,412 dengan 2[span_111](start_span)[span_111](end_span).",
            options: ["A) 6,824", "B) 6,724", "C) 6,924", "D) 6,814"],
            answer: "A) 6,824",
            explanation: "3,412 × 2 = 6,824[span_112](start_span)[span_112](end_span)."
        },
        {
            q: "Hitung hasil darab bagi 1,504 × 5[span_113](start_span)[span_113](end_span).",
            options: ["A) 7,520", "B) 7,420", "C) 7,620", "D) 7,510"],
            answer: "A) 7,520",
            explanation: "1,504 × 5 = 7,520[span_114](start_span)[span_114](end_span)."
        },
        {
            q: "Selesaikan pendaraban: 2,315 × 3[span_115](start_span)[span_115](end_span).",
            options: ["A) 6,945", "B) 6,845", "C) 6,935", "D) 6,955"],
            answer: "A) 6,945",
            explanation: "2,315 × 3 = 6,945[span_116](start_span)[span_116](end_span)."
        },
        {
            q: "Cari nilai bagi 1,122 × 7[span_117](start_span)[span_117](end_span).",
            options: ["A) 7,854", "B) 7,754", "C) 7,954", "D) 7,844"],
            answer: "A) 7,854",
            explanation: "1,122 × 7 = 7,854[span_118](start_span)[span_118](end_span)."
        },
        {
            q: "Selesaikan: 1,080 × 6[span_119](start_span)[span_119](end_span).",
            options: ["A) 6,480", "B) 6,380", "C) 6,580", "D) 6,470"],
            answer: "A) 6,480",
            explanation: "1,080 × 6 = 6,480[span_120](start_span)[span_120](end_span)."
        },
        {
            q: "Hitung hasil darab bagi 1,234 × 8[span_121](start_span)[span_121](end_span).",
            options: ["A) 9,872", "B) 9,772", "C) 9,972", "D) 9,862"],
            answer: "A) 9,872",
            explanation: "1,234 × 8 = 9,872[span_122](start_span)[span_122](end_span)."
        },
        {
            q: "Sebuah kilang mengeluarkan 1,420 buah buku nota setiap hari. Berapakah jumlah buku nota yang dikeluarkan dalam masa 4 hari?[span_123](start_span)[span_123](end_span)",
            options: ["A) 5,680", "B) 5,580", "C) 5,780", "D) 5,670"],
            answer: "A) 5,680",
            explanation: "1,420 × 4 = 5,680 buah buku nota[span_124](start_span)[span_124](end_span)."
        },
        {
            q: "Selesaikan ayat matematik berikut: 1,111 × 9 = ?[span_125](start_span)[span_125](end_span)",
            options: ["A) 9,999", "B) 9,899", "C) 9,989", "D) 8,999"],
            answer: "A) 9,999",
            explanation: "1,111 × 9 = 9,999[span_126](start_span)[span_126](end_span)."
        }
    ],
    10: [
        {
            q: "Apakah baki bagi 45 ÷ 6?[span_127](start_span)[span_127](end_span)",
            options: ["A) 3", "B) 1", "C) 2", "D) 4"],
            answer: "A) 3",
            explanation: "6 × 7 = 42. 45 - 42 = 3 (baki 3)[span_128](start_span)[span_128](end_span)."
        },
        {
            q: "Selesaikan: 72 ÷ 8[span_129](start_span)[span_129](end_span).",
            options: ["A) 9", "B) 8", "C) 7", "D) 6"],
            answer: "A) 9",
            explanation: "Sifir 8: 72 ÷ 8 = 9[span_130](start_span)[span_130](end_span)."
        },
        {
            q: "Bahagikan 54 dengan 9[span_131](start_span)[span_131](end_span).",
            options: ["A) 6", "B) 5", "C) 7", "D) 8"],
            answer: "A) 6",
            explanation: "Sifir 9: 54 ÷ 9 = 6[span_132](start_span)[span_132](end_span)."
        },
        {
            q: "Hitung hasil bahagi bagi 480 ÷ 10[span_133](start_span)[span_133](end_span).",
            options: ["A) 48", "B) 4", "C) 480", "D) 4.8"],
            answer: "A) 48",
            explanation: "Membahagi dengan 10 memotong satu sifar di belakang: 480 ÷ 10 = 48[span_134](start_span)[span_134](end_span)."
        },
        {
            q: "Apakah baki bagi 29 ÷ 4?[span_135](start_span)[span_135](end_span)",
            options: ["A) 1", "B) 2", "C) 3", "D) 0"],
            answer: "A) 1",
            explanation: "4 × 7 = 28. 29 - 28 = 1 (baki 1)[span_136](start_span)[span_136](end_span)."
        },
        {
            q: "Selesaikan: 560 ÷ 7[span_137](start_span)[span_137](end_span)",
            options: ["A) 80", "B) 70", "C) 90", "D) 800"],
            answer: "A) 80",
            explanation: "56 ÷ 7 = 8 tambah sifar jadi 80[span_138](start_span)[span_138](end_span)."
        },
        {
            q: "Cari hasil bahagi bagi 81 ÷ 9[span_139](start_span)[span_139](end_span)",
            options: ["A) 9", "B) 8", "C) 7", "D) 6"],
            answer: "A) 9",
            explanation: "81 ÷ 9 = 9[span_140](start_span)[span_140](end_span)."
        },
        {
            q: "Apakah baki apabila 38 dibahagikan dengan 5?[span_141](start_span)[span_141](end_span)",
            options: ["A) 3", "B) 1", "C) 2", "D) 4"],
            answer: "A) 3",
            explanation: "5 × 7 = 35. 38 - 35 = 3 (baki 3)[span_142](start_span)[span_142](end_span)."
        },
        {
            q: "Cikgu Amin mempunyai 42 batang pensel. Dia membahagikannya sama rata kepada 6 orang murid. Berapakah sebatang pensel yang diperolehi setiap murid?[span_143](start_span)[span_143](end_span)",
            options: ["A) 7", "B) 6", "C) 8", "D) 9"],
            answer: "A) 7",
            explanation: "42 ÷ 6 = 7 batang pensel[span_144](start_span)[span_144](end_span)."
        },
        {
            q: "Selesaikan ayat matematik berikut: 630 ÷ 9 = ?[span_145](start_span)[span_145](end_span)",
            options: ["A) 70", "B) 60", "C) 80", "D) 700"],
            answer: "A) 70",
            explanation: "63 ÷ 9 = 7 tambah sifar jadi 70[span_146](start_span)[span_146](end_span)."
        }
    ],
    11: [
        {
            q: "Selesaikan: 8,460 ÷ 4[span_147](start_span)[span_147](end_span).",
            options: ["A) 2,115", "B) 2,105", "C) 2,215", "D) 2,110"],
            answer: "A) 2,115",
            explanation: "8,460 ÷ 4 = 2,115[span_148](start_span)[span_148](end_span)."
        },
        {
            q: "Hitung hasil bahagi bagi 6,300 ÷ 3[span_149](start_span)[span_149](end_span).",
            options: ["A) 2,100", "B) 2,200", "C) 2,050", "D) 2,150"],
            answer: "A) 2,100",
            explanation: "6,300 ÷ 3 = 2,100[span_150](start_span)[span_150](end_span)."
        },
        {
            q: "Bahagikan 4,824 dengan 2[span_151](start_span)[span_151](end_span).",
            options: ["A) 2,412", "B) 2,402", "C) 2,312", "D) 2,512"],
            answer: "A) 2,412",
            explanation: "4,824 ÷ 2 = 2,412[span_152](start_span)[span_152](end_span)."
        },
        {
            q: "Selesaikan: 5,505 ÷ 5[span_153](start_span)[span_153](end_span).",
            options: ["A) 1,101", "B) 1,111", "C) 1,011", "D) 1,100"],
            answer: "A) 1,101",
            explanation: "5,505 ÷ 5 = 1,101[span_154](start_span)[span_154](end_span)."
        },
        {
            q: "Cari hasil bahagi bagi 3,690 ÷ 3[span_155](start_span)[span_155](end_span).",
            options: ["A) 1,230", "B) 1,220", "C) 1,330", "D) 1,240"],
            answer: "A) 1,230",
            explanation: "3,690 ÷ 3 = 1,230[span_156](start_span)[span_156](end_span)."
        },
        {
            q: "Selesaikan: 7,420 ÷ 7[span_157](start_span)[span_157](end_span)",
            options: ["A) 1,060", "B) 1,050", "C) 1,070", "D) 1,600"],
            answer: "A) 1,060",
            explanation: "7,420 ÷ 7 = 1,060[span_158](start_span)[span_158](end_span)."
        },
        {
            q: "Hitung nilai bagi 630 ÷ 3[span_159](start_span)[span_159](end_span)",
            options: ["A) 210", "B) 220", "C) 200", "D) 230"],
            answer: "A) 210",
            explanation: "630 ÷ 3 = 210[span_160](start_span)[span_160](end_span)."
        },
        {
            q: "Bahagikan 4,264 dengan 4[span_161](start_span)[span_161](end_span).",
            options: ["A) 1,066", "B) 1,056", "C) 1,076", "D) 1,166"],
            answer: "A) 1,066",
            explanation: "4,264 ÷ 4 = 1,066[span_162](start_span)[span_162](end_span)."
        },
        {
            q: "Sebuah kilang mengedarkan 2,480 buah buku teks secara sama rata kepada 4 buah sekolah. Berapakah buah buku yang diterima oleh setiap sekolah?[span_163](start_span)[span_163](end_span)",
            options: ["A) 620", "B) 610", "C) 630", "D) 600"],
            answer: "A) 620",
            explanation: "2,480 ÷ 4 = 620 buah buku[span_164](start_span)[span_164](end_span)."
        },
        {
            q: "Selesaikan ayat matematik berikut: 6,363 ÷ 3 = ?[span_165](start_span)[span_165](end_span)",
            options: ["A) 2,121", "B) 2,111", "C) 2,212", "D) 2,131"],
            answer: "A) 2,121",
            explanation: "6,363 ÷ 3 = 2,121[span_166](start_span)[span_166](end_span)."
        }
    ],
    12: [
        {
            q: "Apakah pecahan setara bagi 1/2 jika penyebutnya ialah 6?[span_167](start_span)[span_167](end_span)",
            options: ["A) 3/6", "B) 2/6", "C) 4/6", "D) 5/6"],
            answer: "A) 3/6",
            explanation: "Penyebut darab 3, maka pengangka (1×3=3). Pecahannya ialah 3/6[span_168](start_span)[span_168](end_span)."
        },
        {
            q: "Selesaikan: Apakah pecahan wajar bagi 2/3 jika pengangkanya ialah 4?[span_169](start_span)[span_169](end_span)",
            options: ["A) 4/6", "B) 4/9", "C) 4/5", "D) 4/12"],
            answer: "A) 4/6",
            explanation: "Pengangka 2 menjadi 4 (darab 2), maka penyebut (3×2=6). Pecahannya 4/6[span_170](start_span)[span_170](end_span)."
        },
        {
            q: "Bandingkan pecahan: Manakah yang lebih besar antara 3/4 dengan 1/4?[span_171](start_span)[span_171](end_span)",
            options: ["A) 3/4", "B) 1/4", "C) Sama besar", "D) Tidak pasti"],
            answer: "A) 3/4",
            explanation: "Apabila penyebut sama, pengangka yang lebih besar menunjukkan nilai yang lebih besar (3 > 1)[span_172](start_span)[span_172](end_span)."
        },
        {
            q: "Tukarkan pecahan 2/4 kepada bentuk termudah.[span_173](start_span)[span_173](end_span)",
            options: ["A) 1/2", "B) 1/3", "C) 2/3", "D) 1/4"],
            answer: "A) 1/2",
            explanation: "Bahagikan pengangka dan penyebut dengan 2: 2÷2 / 4÷2 = 1/2[span_174](start_span)[span_174](end_span)."
        },
        {
            q: "Apakah pecahan setara bagi 1/3 jika penyebutnya ialah 9?[span_175](start_span)[span_175](end_span)",
            options: ["A) 3/9", "B) 2/9", "C) 4/9", "D) 6/9"],
            answer: "A) 3/9",
            explanation: "Penyebut 3 menjadi 9 (darab 3), pengangka (1×3=3). Pecahannya 3/9[span_176](start_span)[span_176](end_span)."
        },
        {
            q: "Selesaikan hasil tambah pecahan: 1/5 + 2/5 = ?[span_177](start_span)[span_177](end_span)",
            options: ["A) 3/5", "B) 3/10", "C) 4/5", "D) 1/5"],
            answer: "A) 3/5",
            explanation: "Penyebut kekal sama, tambah pengangka: 1+2 = 3 (3/5)[span_178](start_span)[span_178](end_span)."
        },
        {
            q: "Hitung hasil tolak pecahan berikut: 4/6 - 1/6 = ?[span_179](start_span)[span_179](end_span)",
            options: ["A) 3/6", "B) 2/6", "C) 5/6", "D) 1/6"],
            answer: "A) 3/6",
            explanation: "Penyebut kekal, tolak pengangka: 4-1 = 3 (3/6)[span_180](start_span)[span_180](end_span)."
        },
        {
            q: "Apakah nilai anu bagi x dalam pecahan setara berikut: 1/2 = x/8?[span_181](start_span)[span_181](end_span)",
            options: ["A) 4", "B) 2", "C) 6", "D) 3"],
            answer: "A) 4",
            explanation: "Penyebut 2 menjadi 8 (darab 4), maka x = 1 × 4 = 4[span_182](start_span)[span_182](end_span)."
        },
        {
            q: "Ibu memotong sebiji kek kepada 8 bahagian sama besar. Amin makan 3 bahagian. Apakah pecahan bahagian kek yang telah dimakan oleh Amin?[span_183](start_span)[span_183](end_span)",
            options: ["A) 3/8", "B) 5/8", "C) 3/5", "D) 8/3"],
            answer: "A) 3/8",
            explanation: "Bahagian dimakan (3) daripada keseluruhan bahagian (8), iaitu 3/8[span_184](start_span)[span_184](end_span)."
        },
        {
            q: "Susun pecahan berikut mengikut tertib menaik: 1/6, 5/6, 3/6, 2/6[span_185](start_span)[span_185](end_span)",
            options: ["A) 1/6, 2/6, 3/6, 5/6", "B) 5/6, 3/6, 2/6, 1/6", "C) 1/6, 3/6, 2/6, 5/6", "D) 2/6, 1/6, 3/6, 5/6"],
            answer: "A) 1/6, 2/6, 3/6, 5/6",
            explanation: "Susun mengikut nilai pengangka dari kecil ke besar: 1, 2, 3, 5[span_186](start_span)[span_186](end_span)."
        }
    ],
    13: [
        {
            q: "Tukarkan pecahan 7/10 kepada nombor perpuluhan[span_187](start_span)[span_187](end_span).",
            options: ["A) 0.7", "B) 0.07", "C) 7.0", "D) 0.77"],
            answer: "A) 0.7",
            explanation: "7 per sepuluh ditulis sebagai 0.7 dalam bentuk perpuluhan[span_188](start_span)[span_188](end_span)."
        },
        {
            q: "Tukarkan pecahan 35/100 kepada nombor perpuluhan[span_189](start_span)[span_189](end_span).",
            options: ["A) 0.35", "B) 3.5", "C) 0.035", "D) 35.0"],
            answer: "A) 0.35",
            explanation: "35 per seratus ditulis sebagai 0.35[span_190](start_span)[span_190](end_span)."
        },
        {
            q: "Tuliskan nombor perpuluhan 0.8 dalam bentuk perkataan[span_191](start_span)[span_191](end_span).",
            options: ["A) Sifar perpuluhan lapan", "B) Sifar perpuluhan kosong lapan", "C) Lapan perpuluhan", "D) Sifar lapan"],
            answer: "A) Sifar perpuluhan lapan",
            explanation: "0.8 dibaca sebagai 'sifar perpuluhan lapan[span_192](start_span)'[span_192](end_span)."
        },
        {
            q: "Apakah nilai digit bagi nombor 4 dalam perpuluhan 0.46?[span_193](start_span)[span_193](end_span)",
            options: ["A) 0.4", "B) 0.04", "C) 4", "D) 40"],
            answer: "A) 0.4",
            explanation: "Digit 4 berada di tempat persepuluh (0.4)[span_194](start_span)[span_194](end_span)."
        },
        {
            q: "Bandingkan perpuluhan: Manakah yang lebih besar antara 0.6 dengan 0.39?[span_195](start_span)[span_195](end_span)",
            options: ["A) 0.6", "B) 0.39", "C) Sama besar", "D) Tidak pasti"],
            answer: "A) 0.6",
            explanation: "0.6 sama dengan 0.60. Bandingkan 0.60 dengan 0.39, maka 0.6 lebih besar[span_196](start_span)[span_196](end_span)."
        },
        {
            q: "Selesaikan hasil tambah perpuluhan: 0.4 + 0.3 = ?[span_197](start_span)[span_197](end_span)",
            options: ["A) 0.7", "B) 0.07", "C) 7.0", "D) 0.34"],
            answer: "A) 0.7",
            explanation: "0.4 + 0.3 = 0.7[span_198](start_span)[span_198](end_span)."
        },
        {
            q: "Hitung hasil tolak perpuluhan berikut: 0.9 - 0.25 = ?[span_199](start_span)[span_199](end_span)",
            options: ["A) 0.65", "B) 0.75", "C) 0.64", "D) 0.85"],
            answer: "A) 0.65",
            explanation: "0.90 - 0.25 = 0.65[span_200](start_span)[span_200](end_span)."
        },
        {
            q: "Susun nombor perpuluhan berikut dalam tertib menaik: 0.5, 0.2, 0.85, 0.47[span_201](start_span)[span_201](end_span).",
            options: ["A) 0.2, 0.47, 0.5, 0.85", "B) 0.85, 0.5, 0.47, 0.2", "C) 0.2, 0.5, 0.47, 0.85", "D) 0.47, 0.2, 0.5, 0.85"],
            answer: "A) 0.2, 0.47, 0.5, 0.85",
            explanation: "Susunan dari nilai terkecil ke terbesar: 0.2, 0.47, 0.5 (atau 0.50), 0.85[span_202](start_span)[span_202](end_span)."
        },
        {
            q: "Tukarkan nombor perpuluhan 0.09 kepada pecahan per seratus[span_203](start_span)[span_203](end_span).",
            options: ["A) 9/100", "B) 9/10", "C) 90/100", "D) 1/9"],
            answer: "A) 9/100",
            explanation: "0.09 bermaksud 9 bahagian daripada 100 (9/100)[span_204](start_span)[span_204](end_span)."
        },
        {
            q: "Selesaikan: 0.32 + 0.45 = ?[span_205](start_span)[span_205](end_span)",
            options: ["A) 0.77", "B) 0.67", "C) 0.87", "D) 0.76"],
            answer: "A) 0.77",
            explanation: "0.32 + 0.45 = 0.77[span_206](start_span)[span_206](end_span)."
        }
    ],
    14: [
        {
            q: "Hitung hasil tambah: RM2,450.50 + RM1,320.20[span_207](start_span)[span_207](end_span).",
            options: ["A) RM3,770.70", "B) RM3,670.70", "C) RM3,770.60", "D) RM3,870.70"],
            answer: "A) RM3,770.70",
            explanation: "RM2,450.50 + RM1,320.20 = RM3,770.70[span_208](start_span)[span_208](end_span)."
        },
        {
            q: "Selesaikan: RM4,125.75 + RM2,340.10[span_209](start_span)[span_209](end_span).",
            options: ["A) RM6,465.85", "B) RM6,365.85", "C) RM6,455.85", "D) RM6,465.75"],
            answer: "A) RM6,465.85",
            explanation: "RM4,125.75 + RM2,340.10 = RM6,465.85[span_210](start_span)[span_210](end_span)."
        },
        {
            q: "Hitung baki tolak: RM5,000.00 - RM1,840.50[span_211](start_span)[span_211](end_span).",
            options: ["A) RM3,159.50", "B) RM3,259.50", "C) RM3,149.50", "D) RM3,159.40"],
            answer: "A) RM3,159.50",
            explanation: "RM5,000.00 - RM1,840.50 = RM3,159.50[span_212](start_span)[span_212](end_span)."
        },
        {
            q: "Selesaikan: RM7,340.25 - RM3,120.10[span_213](start_span)[span_213](end_span).",
            options: ["A) RM4,220.15", "B) RM4,210.15", "C) RM4,320.15", "D) RM4,220.25"],
            answer: "A) RM4,220.15",
            explanation: "RM7,340.25 - RM3,120.10 = RM4,220.15[span_214](start_span)[span_214](end_span)."
        },
        {
            q: "Operasi bergabung: RM3,200.00 + RM1,550.50 - RM920.00[span_215](start_span)[span_215](end_span).",
            options: ["A) RM3,830.50", "B) RM3,730.50", "C) RM3,930.50", "D) RM3,820.50"],
            answer: "A) RM3,830.50",
            explanation: "RM3,200 + RM1,550.50 = RM4,750.50. RM4,750.50 - RM920.00 = RM3,830.50[span_216](start_span)[span_216](end_span)."
        },
        {
            q: "Tambahkan: RM845.60 + RM2,130.40[span_217](start_span)[span_217](end_span).",
            options: ["A) RM2,976.00", "B) RM2,876.00", "C) RM2,966.00", "D) RM2,975.00"],
            answer: "A) RM2,976.00",
            explanation: "RM845.60 + RM2,130.40 = RM2,976.00[span_218](start_span)[span_218](end_span)."
        },
        {
            q: "Cari beza wang antara RM6,200.00 dengan RM4,150.80[span_219](start_span)[span_219](end_span).",
            options: ["A) RM2,049.20", "B) RM2,059.20", "C) RM1,949.20", "D) RM2,048.20"],
            answer: "A) RM2,049.20",
            explanation: "RM6,200.00 - RM4,150.80 = RM2,049.20[span_220](start_span)[span_220](end_span)."
        },
        {
            q: "Selesaikan: RM1,250.00 + RM3,400.20 - RM850.10[span_221](start_span)[span_221](end_span).",
            options: ["A) RM3,800.10", "B) RM3,700.10", "C) RM3,810.10", "D) RM3,900.10"],
            answer: "A) RM3,800.10",
            explanation: "RM1,250 + RM3,400.20 = RM4,650.20. RM4,650.20 - RM850.10 = RM3,800.10[span_222](start_span)[span_222](end_span)."
        },
        {
            q: "Ibu mempunyai RM500.00. Dia membeli sebuah beg sekolah berharga RM145.50. Berapakah baki wang ibu?[span_223](start_span)[span_223](end_span)",
            options: ["A) RM354.50", "B) RM364.50", "C) RM354.40", "D) RM344.50"],
            answer: "A) RM354.50",
            explanation: "RM500.00 - RM145.50 = RM354.50[span_224](start_span)[span_224](end_span)."
        },
        {
            q: "Selesaikan ayat matematik berikut: RM4,500.00 - RM2,350.25 = ?[span_225](start_span)[span_225](end_span)",
            options: ["A) RM2,149.75", "B) RM2,150.75", "C) RM2,149.50", "D) RM2,249.75"],
            answer: "A) RM2,149.75",
            explanation: "RM4,500.00 - RM2,350.25 = RM2,149.75[span_226](start_span)[span_226](end_span)."
        }
    ],
    15: [
        {
            q: "Hitung hasil darab: RM145.50 × 4[span_227](start_span)[span_227](end_span).",
            options: ["A) RM582.00", "B) RM572.00", "C) RM592.00", "D) RM581.00"],
            answer: "A) RM582.00",
            explanation: "RM145.50 × 4 = RM582.00[span_228](start_span)[span_228](end_span)."
        },
        {
            q: "Selesaikan: RM230.20 × 5[span_229](start_span)[span_229](end_span).",
            options: ["A) RM1,151.00", "B) RM1,150.00", "C) RM1,141.00", "D) RM1,251.00"],
            answer: "A) RM1,151.00",
            explanation: "RM230.20 × 5 = RM1,151.00[span_230](start_span)[span_230](end_span)."
        },
        {
            q: "Hitung hasil bahagi: RM450.00 ÷ 3[span_231](start_span)[span_231](end_span).",
            options: ["A) RM150.00", "B) RM140.00", "C) RM160.00", "D) RM155.00"],
            answer: "A) RM150.00",
            explanation: "RM450.00 ÷ 3 = RM150.00[span_232](start_span)[span_232](end_span)."
        },
        {
            q: "Selesaikan: RM840.80 ÷ 4[span_233](start_span)[span_233](end_span).",
            options: ["A) RM210.20", "B) RM210.00", "C) RM220.20", "D) RM200.20"],
            answer: "A) RM210.20",
            explanation: "RM840.80 ÷ 4 = RM210.20[span_234](start_span)[span_234](end_span)."
        },
        {
            q: "Darabkan: RM312.40 × 6[span_235](start_span)[span_235](end_span).",
            options: ["A) RM1,874.40", "B) RM1,864.40", "C) RM1,873.40", "D) RM1,974.40"],
            answer: "A) RM1,874.40",
            explanation: "RM312.40 × 6 = RM1,874.40[span_236](start_span)[span_236](end_span)."
        },
        {
            q: "Bahagikan: RM1,250.00 ÷ 5[span_237](start_span)[span_237](end_span).",
            options: ["A) RM250.00", "B) RM240.00", "C) RM260.00", "D) RM255.00"],
            answer: "A) RM250.00",
            explanation: "RM1,250.00 ÷ 5 = RM250.00[span_238](start_span)[span_238](end_span)."
        },
        {
            q: "Selesaikan: RM125.75 × 8[span_239](start_span)[span_239](end_span).",
            options: ["A) RM1,006.00", "B) RM1,005.00", "C) RM996.00", "D) RM1,016.00"],
            answer: "A) RM1,006.00",
            explanation: "RM125.75 × 8 = RM1,006.00[span_240](start_span)[span_240](end_span)."
        },
        {
            q: "Cari nilai bagi: RM3,120.60 ÷ 6[span_241](start_span)[span_241](end_span).",
            options: ["A) RM520.10", "B) RM510.10", "C) RM520.00", "D) RM530.10"],
            answer: "A) RM520.10",
            explanation: "RM3,120.60 ÷ 6 = RM520.10[span_242](start_span)[span_242](end_span)."
        },
        {
            q: "Harga sebuah buku cerita ialah RM24.50. Berapakah jumlah harga untuk 4 buah buku cerita yang sama?[span_243](start_span)[span_243](end_span)",
            options: ["A) RM98.00", "B) RM96.00", "C) RM98.50", "D) RM92.00"],
            answer: "A) RM98.00",
            explanation: "RM24.50 × 4 = RM98.00[span_244](start_span)[span_244](end_span)."
        },
        {
            q: "Selesaikan ayat matematik berikut: RM728.00 ÷ 8 = ?[span_245](start_span)[span_245](end_span)",
            options: ["A) RM91.00", "B) RM90.00", "C) RM92.00", "D) RM95.00"],
            answer: "A) RM91.00",
            explanation: "RM728.00 ÷ 8 = RM91.00[span_246](start_span)[span_246](end_span)."
        }
    ],
    16: [
        {
            q: "Tukarkan 2 jam kepada minit[span_247](start_span)[span_247](end_span).",
            options: ["A) 120 minit", "B) 60 minit", "C) 180 minit", "D) 240 minit"],
            answer: "A) 120 minit",
            explanation: "1 jam = 60 minit, maka 2 jam = 2 × 60 = 120 minit[span_248](start_span)[span_248](end_span)."
        },
        {
            q: "Tukarkan 130 minit kepada jam dan minit[span_249](start_span)[span_249](end_span).",
            options: ["A) 2 jam 10 minit", "B) 1 jam 30 minit", "C) 2 jam 30 minit", "D) 3 jam 10 minit"],
            answer: "A) 2 jam 10 minit",
            explanation: "120 minit = 2 jam, baki 10 minit. Jadi 2 jam 10 minit[span_250](start_span)[span_250](end_span)."
        },
        {
            q: "Selesaikan tambah masa: 3 jam 20 minit + 1 jam 45 minit[span_251](start_span)[span_251](end_span).",
            options: ["A) 5 jam 5 minit", "B) 4 jam 65 minit", "C) 5 jam 15 minit", "D) 4 jam 55 minit"],
            answer: "A) 5 jam 5 minit",
            explanation: "Jam: 3+1 = 4 jam. Minit: 20+45 = 65 minit (1 jam 5 minit). Jumlah: 5 jam 5 minit[span_252](start_span)[span_252](end_span)."
        },
        {
            q: "Hitung beza masa: 5 jam 10 minit - 2 jam 35 minit[span_253](start_span)[span_253](end_span).",
            options: ["A) 2 jam 35 minit", "B) 3 jam 35 minit", "C) 2 jam 25 minit", "D) 3 jam 25 minit"],
            answer: "A) 2 jam 35 minit",
            explanation: "Pinjam 1 jam (60 minit) jadi 4 jam 70 minit. 4 jam 70 minit - 2 jam 35 minit = 2 jam 35 minit[span_254](start_span)[span_254](end_span)."
        },
        {
            q: "Tukarkan 3 jam 15 minit sepenuhnya kepada minit[span_255](start_span)[span_255](end_span).",
            options: ["A) 195 minit", "B) 185 minit", "C) 175 minit", "D) 205 minit"],
            answer: "A) 195 minit",
            explanation: "(3 × 60) + 15 = 180 + 15 = 195 minit[span_256](start_span)[span_256](end_span)."
        },
        {
            q: "Selesaikan: 4 jam 40 minit + 2 jam 50 minit[span_257](start_span)[span_257](end_span).",
            options: ["A) 7 jam 30 minit", "B) 6 jam 90 minit", "C) 7 jam 20 minit", "D) 6 jam 50 minit"],
            answer: "A) 7 jam 30 minit",
            explanation: "4+2 = 6 jam. 40+50 = 90 minit (1 jam 30 minit). Jumlah: 7 jam 30 minit[span_258](start_span)[span_258](end_span)."
        },
        {
            q: "Hitung: 6 jam - 1 jam 45 minit[span_259](start_span)[span_259](end_span).",
            options: ["A) 4 jam 15 minit", "B) 5 jam 15 minit", "C) 4 jam 45 minit", "D) 5 jam 45 minit"],
            answer: "A) 4 jam 15 minit",
            explanation: "6 jam = 5 jam 60 minit. 5 jam 60 minit - 1 jam 45 minit = 4 jam 15 minit[span_260](start_span)[span_260](end_span)."
        },
        {
            q: "Tukarkan 195 minit kepada jam dan minit[span_261](start_span)[span_261](end_span).",
            options: ["A) 3 jam 15 minit", "B) 3 jam 35 minit", "C) 2 jam 55 minit", "D) 3 jam 45 minit"],
            answer: "A) 3 jam 15 minit",
            explanation: "195 ÷ 60 = 3 jam dengan baki 15 minit (3 jam 15 minit)[span_262](start_span)[span_262](end_span)."
        },
        {
            q: "Ali mengambil masa 1 jam 15 minit untuk menyiapkan kerja sekolahnya. Dia mula pada pukul 3:00 petang. Pukul berapakah dia siap?[span_263](start_span)[span_263](end_span)",
            options: ["A) 4:15 petang", "B) 4:00 petang", "C) 4:30 petang", "D) 3:45 petang"],
            answer: "A) 4:15 petang",
            explanation: "3:00 petang + 1 jam 15 minit = 4:15 petang[span_264](start_span)[span_264](end_span)."
        },
        {
            q: "Selesaikan ayat matematik berikut: 2 jam 30 minit × 3 = ?[span_265](start_span)[span_265](end_span)",
            options: ["A) 7 jam 30 minit", "B) 6 jam 90 minit", "C) 7 jam 00 minit", "D) 8 jam 00 minit"],
            answer: "A) 7 jam 30 minit",
            explanation: "2 jam × 3 = 6 jam. 30 minit × 3 = 90 minit (1 jam 30 minit). Jumlah: 7 jam 30 minit[span_266](start_span)[span_266](end_span)."
        }
    ],
    17: [
        {
            q: "Hitung tempoh masa dari pukul 8:00 pagi hingga pukul 11:30 pagi pada hari yang sama[span_267](start_span)[span_267](end_span).",
            options: ["A) 3 jam 30 minit", "B) 3 jam 00 minit", "C) 4 jam 30 minit", "D) 2 jam 30 minit"],
            answer: "A) 3 jam 30 minit",
            explanation: "Dari 8:00 pagi ke 11:00 pagi ialah 3 jam, ditambah 30 minit menjadi 3 jam 30 minit[span_268](start_span)[span_268](end_span)."
        },
        {
            q: "Suatu majlis bermula pada pukul 2:15 petang dan tamat pada pukul 5:45 petang. Berapakah tempoh masa majlis tersebut?[span_269](start_span)[span_269](end_span)",
            options: ["A) 3 jam 30 minit", "B) 3 jam 15 minit", "C) 4 jam 30 minit", "D) 3 jam 45 minit"],
            answer: "A) 3 jam 30 minit",
            explanation: "Beza jam: 5 - 2 = 3 jam. Beza minit: 45 - 15 = 30 minit (3 jam 30 minit)[span_270](start_span)[span_270](end_span)."
        },
        {
            q: "Ayah memandu kereta dari Johor Bahru ke Melaka selama 2 jam 45 minit. Jika perjalanan bermula pada pukul 9:00 pagi, pukul berapakah ayah sampai di Melaka?[span_271](start_span)[span_271](end_span)",
            options: ["A) 11:45 pagi", "B) 11:30 pagi", "C) 12:15 tengah hari", "D) 11:15 pagi"],
            answer: "A) 11:45 pagi",
            explanation: "9:00 pagi + 2 jam 45 minit = 11:45 pagi[span_272](start_span)[span_272](end_span)."
        },
        {
            q: "Ali menyiapkan kerja sekolahnya selama 1 jam 20 minit. Jika dia mula pada pukul 4:10 petang, pukul berapakah dia siap?[span_273](start_span)[span_273](end_span)",
            options: ["A) 5:30 petang", "B) 5:20 petang", "C) 5:40 petang", "D) 5:10 petang"],
            answer: "A) 5:30 petang",
            explanation: "Jam: 4 + 1 = 5. Minit: 10 + 20 = 30. Waktu siap: 5:30 petang[span_274](start_span)[span_274](end_span)."
        },
        {
            q: "Berapakah bilangan hari dalam bulan Februari pada Tahun Lompat?[span_275](start_span)[span_275](end_span)",
            options: ["A) 29 hari", "B) 28 hari", "C) 30 hari", "D) 31 hari"],
            answer: "A) 29 hari",
            explanation: "Dalam Tahun Lompat, bulan Februari mempunyai 29 hari (berbanding 28 hari biasa)[span_276](start_span)[span_276](end_span)."
        },
        {
            q: "Tukarkan 3 minggu kepada bilangan hari[span_277](start_span)[span_277](end_span).",
            options: ["A) 21 hari", "B) 14 hari", "C) 28 hari", "D) 70 hari"],
            answer: "A) 21 hari",
            explanation: "1 minggu = 7 hari, maka 3 minggu = 3 × 7 = 21 hari[span_278](start_span)[span_278](end_span)."
        },
        {
            q: "Suatu kursus berlangsung selama 5 hari. Berapakah jumlah jam bagi 5 hari tersebut?[span_279](start_span)[span_279](end_span)",
            options: ["A) 120 jam", "B) 100 jam", "C) 96 jam", "D) 144 jam"],
            answer: "A) 120 jam",
            explanation: "1 hari = 24 jam, maka 5 hari = 5 × 24 = 120 jam[span_280](start_span)[span_280](end_span)."
        },
        {
            q: "Siti melancong selama 2 minggu 4 hari. Berapakah jumlah hari Siti melancong kesemuanya?[span_281](start_span)[span_281](end_span)",
            options: ["A) 18 hari", "B) 14 hari", "C) 20 hari", "D) 15 hari"],
            answer: "A) 18 hari",
            explanation: "2 minggu = 14 hari. 14 hari + 4 hari = 18 hari[span_282](start_span)[span_282](end_span)."
        },
        {
            q: "Encik Ali bekerja dari pukul 8:00 pagi hingga pukul 5:00 petang setiap hari. Hitung tempoh masa kerja Encik Ali dalam sehari (andaikan tiada rehat).[span_283](start_span)[span_283](end_span)",
            options: ["A) 9 jam", "B) 8 jam", "C) 10 jam", "D) 7 jam"],
            answer: "A) 9 jam",
            explanation: "Dari 8:00 pagi ke 12:00 tengah hari (4 jam), dari 12:00 tengah hari ke 5:00 petang (5 jam). Jumlah = 9 jam[span_284](start_span)[span_284](end_span)."
        },
        {
            q: "Jika hari ini hari Rabu, hari apakah selepas 10 hari?[span_285](start_span)[span_285](end_span)",
            options: ["A) Sabtu", "B) Jumaat", "C) Ahad", "D) Khamis"],
            answer: "A) Sabtu",
            explanation: "10 hari = 1 minggu (7 hari) + 3 hari. Selepas Rabu + 3 hari ialah Khamis, Jumaat, Sabtu[span_286](start_span)[span_286](end_span)."
        }
    ]
};

// Penjana automatik untuk Level 18 hingga 20 sebagai templat baki silibus
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
